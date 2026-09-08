# TrinetraTicket / TrinetraSIEM — Instructor's Guide

> **This is an answer key.** It documents how each of the 5 seeded phishing
> scenarios was built and exactly how to investigate and close it. Don't hand
> this to students directly — it defeats the exercise. Use it to grade,
> to unblock a stuck student with a hint, or to build the next batch of
> scenarios later.

## How the lab fits together

- **FakeEmployee** (15 people across Finance/HR/IT/Sales/Executive at the
  fictional "FakeCorp Industries", domain `fakecorp-demo.com`) is the shared
  backdrop both tools pull from.
- **TrinetraTicket** (`/dashboard/tickets`) is the case queue. Tickets start
  unassigned; a student clicks **Assign to Me** (from "All Tickets") to pull
  one into their own queue, then investigates, writes notes, and closes it.
- **TrinetraSIEM** (`/dashboard/siem`) is the log index, searched with
  **TrinetraQL** — a small Splunk/KQL-style query language (see below). Every
  log a student needs to close a ticket lives here, correlated to the ticket
  via `relatedTicketId`.
- Every ticket's "reported email" is one specific employee's report. The
  *same campaign* is usually also delivered to a handful of other employees
  (modeled as extra `EMAIL_GATEWAY` log events with no ticket of their own) —
  this is what makes "who else received this?" and "how many people got it?"
  searches meaningful instead of trivial.

## TrinetraQL syntax reference

```
bare words / "quoted phrases"     substring match on event summary + raw log
field=value  or  field:value      filter on one field
AND / OR / NOT   (uppercase)      boolean combinators, left to right, no parens
earliest=-24h / earliest=2026-09-01 / latest=...   time range (global filter)
```

**Fields:** `sourcetype` (`source`, `st`), `sender` (`from`), `recipient`
(`to`), `employee` (`user`), `department` (`dept`), `hash` (`sha256`),
`subject`, `ticket`, `ip`, `url` (`link`).

Field matching is substring/contains, case-insensitive, applied mostly
against the raw log line (mirroring how a real SIEM behaves when a field
isn't separately indexed) — `employee`/`department`/`ticket` use the actual
relational data instead, so those are exact-ish and reliable for pivoting.

There's a **query-syntax help popover** (the `?` button next to Search) with
these same examples, clickable to run directly — point students at it if
they're stuck on syntax rather than the investigation itself.

---

## TRQ-1001 — Suspicious Password Reset Email (Sophie Turner, Sales)

**The story:** A mass phishing campaign impersonating the IT helpdesk
(`it-helpdesk@fakecorp-support-verify.com`, a lookalike domain — note it's
`fakecorp-support-verify.com`, not the real `fakecorp-demo.com`) went out to
5 employees across Sales, IT, Executive, and Finance, all urging an urgent
password "verification" via a credential-harvesting link. Sophie Turner
clicked the link and entered her password. The attacker logged in from
Romania with the correct password 8 minutes later — but the account's MFA
push was never approved, so the takeover was blocked at the MFA stage. Karan
Mehta (Sales) also clicked the link but didn't submit anything. The other
three recipients (Rachel Kim, Angela Foster, Meera Iyer) never interacted
with it at all.

**Investigate in TrinetraSIEM:**
1. `ticket=TRQ-1001` — pull every log tied to this ticket to see the full
   correlated chain in one place.
2. `sender="it-helpdesk@fakecorp-support-verify.com"` — see all 5 delivery
   logs; this answers "how many people received it."
3. `url=fakecorp-portal-verify.com` — same 5 deliveries plus the one
   `NETWORK` log showing Karan Mehta actually clicked it.
4. `recipient=sophie.turner@fakecorp-demo.com` — walk her specific chain:
   delivery → suspicious login (Romania, password-only, no MFA challenge) →
   MFA push denied (attacker blocked) → her own legitimate login minutes
   later from Austin.

**Conclusion:** Confirmed credential-harvesting phish with a genuine (but
ultimately unsuccessful, MFA-blocked) account-takeover attempt against
Sophie Turner. Karan Mehta engaged partially (clicked, didn't submit
credentials) — worth a note but not an incident on its own. The other 3
recipients show no engagement.

**Close as:** *Confirmed Malicious – Remediated* (password reset for Sophie
Turner is the expected real-world action; MFA already prevented full
compromise). Severity stays **HIGH**.

---

## TRQ-1002 — Malicious Invoice Attachment (Robert Chen, Finance)

**The story:** A fake "overdue invoice" `.docx` (`Invoice_48291_Overdue.docx`,
hash `a3f5c9d8e1b2f4a6...194b`) was sent to 4 employees (Finance, HR, IT,
Executive). Robert Chen opened it — Word spawned an encoded PowerShell
command, which beaconed out to a known-bad IP and set a registry Run key for
persistence: a full macro-malware execution chain. Sandra Wilson (HR) also
opened the identical attachment; her endpoint AV caught and quarantined the
same payload before it could persist. Tom Bradley and Daniel Wu received it
but never opened it.

**Investigate in TrinetraSIEM:**
1. `ticket=TRQ-1002` — see the whole correlated set.
2. `hash=a3f5c9d8e1b2f4a6` (the "Search hash" link on the ticket page
   pre-fills exactly this) — finds **all 7** logs referencing this file:
   both delivery-with-attachment logs for Robert and Sandra, both of their
   `ProcessCreate` events, Robert's C2 network connection, Robert's registry
   persistence, and Sandra's AV quarantine. This is the single most useful
   query for this ticket — it immediately reveals Sandra Wilson as a second
   victim the reporter never mentioned.
3. `subject="Overdue Invoice"` — all 4 deliveries, confirming Tom Bradley and
   Daniel Wu got it too but (absence of any `hash=` endpoint log for them)
   never opened it.
4. `sourcetype=ENDPOINT recipient=robert.chen@fakecorp-demo.com` — Robert's
   execution chain in isolation: process creation → C2 beacon → persistence.

**Conclusion:** Confirmed malware execution on Robert Chen's workstation
(full chain: dropper → C2 → persistence) and a second, contained infection
attempt on Sandra Wilson's machine (AV caught it). Tom Bradley and Daniel Wu
were targeted but not compromised.

**Close as:** *Confirmed Malicious – Remediated* (assuming isolation/
reimaging of Robert's workstation and confirmation Sandra's AV block held —
mention both machines in the closing note). Severity stays **CRITICAL**.

---

## TRQ-1003 — Suspected CEO Fraud / Wire Transfer Request (Priya Nair, Finance)

**The story:** A single, highly targeted spear-phish impersonating CEO
Michael Ross (from `michael.ross.ceo@fakecorp-demo.co` — note the `.co`, not
`.com`, and a `reply_to` pointing at a personal Protonmail address) asked
Priya Nair to urgently wire $18,500 or buy gift cards, with classic BEC
pressure tactics (urgency, secrecy, "can't talk right now"). This is
**deliberately not a mass campaign** — real BEC attempts are targeted at one
or two people, unlike the other four scenarios. There is no technical
compromise here at all: it's a pure content/judgment exercise. Priya
correctly held off and reported it instead of acting.

**Investigate in TrinetraSIEM:**
1. `ticket=TRQ-1003` — only 2 logs exist: the delivery itself and a
   domain-reputation check log (the mail gateway flagged `fakecorp-demo.co`
   as a 6-day-old lookalike domain, 94% similarity to the real one).
2. `sender="michael.ross.ceo@fakecorp-demo.co"` — confirms it went to
   **nobody else** — the key finding that distinguishes this from the other
   four "mass campaign" tickets. A student who assumes every phish is a mass
   campaign and skips this check will miss the point of this scenario.

**Conclusion:** No technical IOCs to chase — the entire case rests on content
analysis: wrong sender domain, urgency/secrecy pressure, an unusual payment
request (gift cards), and confirmation via the domain-reputation log that
the sending domain is a brand-new lookalike. Single target, no spread.

**Close as:** *Confirmed Malicious – Remediated* (no transfer occurred;
action taken is analyst/employee awareness, not technical remediation).
Severity stays **HIGH** given financial-fraud potential despite no technical
compromise.

---

## TRQ-1004 — Phishing Link Leads to Confirmed Account Compromise (David Okafor, HR)

**The story:** A fake "candidate application" careers-portal link went to 4
employees (HR, IT). David Okafor clicked it and signed in — and this time
the login **succeeded with MFA approved**, from Lagos, Nigeria: an
adversary-in-the-middle (AiTM) phishing kit that relayed his real MFA
approval through the fake portal in real time, not just a stolen password.
Immediately after, a mail-forwarding rule was silently added to his mailbox
(classic post-compromise persistence). James Patel also clicked the same
link and attempted to sign in, but denied the MFA push that time, blocking
it. Linda Martinez and Tom Bradley received the email but never clicked.

**Investigate in TrinetraSIEM:**
1. `ticket=TRQ-1004` — full correlated set for the ticket.
2. `url=fakecorp-careers-secure.net` — all 4 deliveries.
3. `sourcetype=AUTHENTICATION ip=103.75.190.22` — pivots on the attacker's
   IP directly, surfacing **both** David's successful compromise and James
   Patel's blocked attempt from the same infrastructure — the query a
   student should run once they notice the suspicious Lagos IP on David's
   ticket and want to know "did this IP hit anyone else?"
4. `recipient=david.okafor@fakecorp-demo.com` — David's full chain: delivery
   → successful AiTM login with MFA approved → mailbox forwarding rule
   created → his own device later gets an unexpected MFA prompt (this is
   what actually made him suspicious enough to report it).

**Conclusion:** Confirmed account takeover via AiTM phishing on David
Okafor — MFA did **not** save this one, unlike TRQ-1001, because the kit
relayed the real-time MFA approval instead of just harvesting a static
password. A malicious forwarding rule needs removing. James Patel was
targeted by the same infrastructure but not compromised (MFA denied).

**Close as:** *Confirmed Malicious – Escalated to IR* (full account
takeover with mailbox persistence set up warrants IR/L2 involvement, not a
same-tier close — use the **Escalate** button rather than Close if you want
students to practice that path instead). Severity stays **CRITICAL**.

---

## TRQ-1005 — Reported Attachment from External Vendor (Alex Johnson, Sales)

**The story:** A genuine business email from a real external partner
(`accounts@partnersupplyco-demo.com`, correctly passing SPF/DKIM/DMARC) with
a PDF proposal (hash `1a2b3c4d5e6f7081...3c2b`). Alex Johnson reported it out
of caution only because the sender was unfamiliar to the mail system — not
because anything about it looked wrong. This is the deliberate "not
everything reported is malicious" scenario, and unlike the other four, it is
**not** part of a campaign — it's one-off legitimate correspondence.

**Investigate in TrinetraSIEM:**
1. `ticket=TRQ-1005` — 3 logs total: clean delivery (SPF/DKIM/DMARC all
   `PASS`), the PDF opening with no child process spawned, and a scheduled
   AV scan completing clean shortly after.
2. `hash=1a2b3c4d5e6f7081` — returns **only** these same 3 logs, on **only**
   this one machine. The absence of this hash anywhere else (contrast with
   TRQ-1002's hash search, which fans out to a second victim) is itself the
   evidence of benignity — worth explicitly pointing out to students that a
   clean pivot search is still a real investigative step, not a skipped one.

**Conclusion:** No malicious indicators anywhere — correct sender
authentication, no attachment execution, clean AV scan, and no trace of the
file hash on any other machine.

**Close as:** *False Positive*. Severity stays **LOW**.
