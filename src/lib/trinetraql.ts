import type { Prisma, LogSourceType } from "@/generated/prisma/client";

/**
 * TrinetraQL — a small Splunk/KQL-inspired query language for TrinetraSIEM.
 *
 * Supported syntax:
 *   bare words / "quoted phrases"   -> substring match against summary + raw log
 *   field=value / field:value       -> filter on a specific field (see FIELD_ALIASES)
 *   AND / OR / NOT (uppercase)      -> boolean combinators, left-to-right, no parens
 *   earliest=-24h / earliest=2026-09-01 / latest=... -> time range (global, not part of AND/OR chain)
 *
 * Fields: sourcetype (source, st), sender (from), recipient (to), employee (user),
 * department (dept), hash (sha256), subject, ticket, ip, url (link)
 */

const SOURCE_TYPES: LogSourceType[] = ["EMAIL_GATEWAY", "ENDPOINT", "AUTHENTICATION", "NETWORK"];

const FIELD_ALIASES: Record<string, string> = {
  sourcetype: "sourcetype",
  source: "sourcetype",
  st: "sourcetype",
  sender: "sender",
  from: "sender",
  recipient: "recipient",
  to: "recipient",
  employee: "employee",
  user: "employee",
  department: "department",
  dept: "department",
  hash: "hash",
  sha256: "hash",
  subject: "subject",
  ticket: "ticket",
  ip: "ip",
  url: "url",
  link: "url",
};

type Token = { text: string; isQuoted: boolean };

function tokenize(query: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < query.length) {
    const ch = query[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (ch === '"') {
      const end = query.indexOf('"', i + 1);
      if (end === -1) {
        tokens.push({ text: query.slice(i + 1), isQuoted: true });
        break;
      }
      tokens.push({ text: query.slice(i + 1, end), isQuoted: true });
      i = end + 1;
      continue;
    }
    // field="quoted value" — capture as one token including the field= prefix
    const fieldQuoteMatch = /^([A-Za-z_]+[:=])"([^"]*)"?/.exec(query.slice(i));
    if (fieldQuoteMatch) {
      tokens.push({ text: `${fieldQuoteMatch[1]}${fieldQuoteMatch[2]}`, isQuoted: false });
      i += fieldQuoteMatch[0].length;
      continue;
    }
    let j = i;
    while (j < query.length && !/\s/.test(query[j])) j++;
    tokens.push({ text: query.slice(i, j), isQuoted: false });
    i = j;
  }
  return tokens;
}

function parseRelativeOrAbsoluteDate(value: string, endOfDay: boolean): Date | null {
  const relMatch = /^-(\d+)([mhdw])$/i.exec(value);
  if (relMatch) {
    const amount = parseInt(relMatch[1], 10);
    const unit = relMatch[2].toLowerCase();
    const ms =
      unit === "m"
        ? amount * 60_000
        : unit === "h"
          ? amount * 3_600_000
          : unit === "d"
            ? amount * 86_400_000
            : amount * 604_800_000;
    return new Date(Date.now() - ms);
  }
  const isoMatch = /^\d{4}-\d{2}-\d{2}$/.exec(value);
  if (isoMatch) {
    const d = new Date(`${value}T${endOfDay ? "23:59:59.999Z" : "00:00:00.000Z"}`);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function matchingSourceTypes(value: string): LogSourceType[] {
  const q = value.toLowerCase().replace(/\s+/g, "_");
  return SOURCE_TYPES.filter((s) => s.toLowerCase().includes(q) || q.includes(s.toLowerCase()));
}

type Condition = Prisma.LogEventWhereInput;

function fieldCondition(field: string, value: string): { condition: Condition; label: string } {
  switch (field) {
    case "sourcetype": {
      const matches = matchingSourceTypes(value);
      return {
        condition: { sourceType: { in: matches } },
        label: `sourcetype = ${value}`,
      };
    }
    case "sender":
      return {
        condition: { rawLogLine: { contains: value, mode: "insensitive" } },
        label: `sender contains "${value}"`,
      };
    case "recipient":
      return {
        condition: {
          OR: [
            { employee: { email: { contains: value, mode: "insensitive" } } },
            { rawLogLine: { contains: value, mode: "insensitive" } },
          ],
        },
        label: `recipient contains "${value}"`,
      };
    case "employee":
      return {
        condition: {
          OR: [
            { employee: { name: { contains: value, mode: "insensitive" } } },
            { employee: { email: { contains: value, mode: "insensitive" } } },
          ],
        },
        label: `employee contains "${value}"`,
      };
    case "department":
      return {
        condition: { employee: { department: { contains: value, mode: "insensitive" } } },
        label: `department contains "${value}"`,
      };
    case "hash":
      return {
        condition: { rawLogLine: { contains: value, mode: "insensitive" } },
        label: `hash = ${value}`,
      };
    case "subject":
      return {
        condition: { rawLogLine: { contains: value, mode: "insensitive" } },
        label: `subject contains "${value}"`,
      };
    case "ticket":
      return {
        condition: { relatedTicket: { ticketNumber: { contains: value, mode: "insensitive" } } },
        label: `ticket contains "${value}"`,
      };
    case "ip":
      return {
        condition: { rawLogLine: { contains: value, mode: "insensitive" } },
        label: `ip contains "${value}"`,
      };
    case "url":
      return {
        condition: { rawLogLine: { contains: value, mode: "insensitive" } },
        label: `url contains "${value}"`,
      };
    default:
      return {
        condition: {
          OR: [
            { eventSummary: { contains: value, mode: "insensitive" } },
            { rawLogLine: { contains: value, mode: "insensitive" } },
          ],
        },
        label: `"${value}"`,
      };
  }
}

export type ParsedQuery = {
  where: Prisma.LogEventWhereInput | null;
  earliest: Date | null;
  latest: Date | null;
  explanation: string[];
  isEmpty: boolean;
};

export function parseTrinetraQL(query: string): ParsedQuery {
  const trimmed = query.trim();
  if (!trimmed) {
    return { where: null, earliest: null, latest: null, explanation: [], isEmpty: true };
  }

  const tokens = tokenize(trimmed);
  let earliest: Date | null = null;
  let latest: Date | null = null;
  const explanation: string[] = [];

  type Step = { connector: "AND" | "OR"; negate: boolean; condition: Condition; label: string };
  const steps: Step[] = [];

  let pendingConnector: "AND" | "OR" = "AND";
  let pendingNegate = false;

  for (const token of tokens) {
    const raw = token.text;
    if (!token.isQuoted && raw === "AND") {
      pendingConnector = "AND";
      continue;
    }
    if (!token.isQuoted && raw === "OR") {
      pendingConnector = "OR";
      continue;
    }
    if (!token.isQuoted && raw === "NOT") {
      pendingNegate = true;
      continue;
    }

    const fieldSyntax = !token.isQuoted && /^([A-Za-z_]+)[:=](.+)$/.exec(raw);
    const rawField = fieldSyntax ? fieldSyntax[1].toLowerCase() : null;
    const isKnownField =
      rawField !== null && (FIELD_ALIASES[rawField] !== undefined || rawField === "earliest" || rawField === "latest");

    if (fieldSyntax && isKnownField) {
      const value = fieldSyntax[2].replace(/^"|"$/g, "");
      const field = FIELD_ALIASES[rawField as string];

      if (rawField === "earliest") {
        earliest = parseRelativeOrAbsoluteDate(value, false);
        explanation.push(`earliest = ${value}`);
        continue;
      }
      if (rawField === "latest") {
        latest = parseRelativeOrAbsoluteDate(value, true);
        explanation.push(`latest = ${value}`);
        continue;
      }
      const { condition, label } = fieldCondition(field, value);
      steps.push({ connector: pendingConnector, negate: pendingNegate, condition, label });
      pendingConnector = "AND";
      pendingNegate = false;
      continue;
    }

    const { condition, label } = fieldCondition("__unknown__", raw);
    steps.push({ connector: pendingConnector, negate: pendingNegate, condition, label });
    pendingConnector = "AND";
    pendingNegate = false;
  }

  let where: Prisma.LogEventWhereInput | null = null;
  for (const step of steps) {
    const cond: Condition = step.negate ? { NOT: step.condition } : step.condition;
    explanation.push(`${step.negate ? "NOT " : ""}${step.label}`);
    if (where === null) {
      where = cond;
    } else if (step.connector === "OR") {
      where = { OR: [where, cond] };
    } else {
      where = { AND: [where, cond] };
    }
  }

  return {
    where,
    earliest,
    latest,
    explanation,
    isEmpty: where === null && earliest === null && latest === null,
  };
}
