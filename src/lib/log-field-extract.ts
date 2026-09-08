/** Parses `key=value` and `key="quoted value"` pairs out of a raw log line
 * for display as extracted fields, mirroring how a real SIEM surfaces
 * structured fields under a raw event. Best-effort, not a full log parser. */
export function extractFields(rawLogLine: string): { key: string; value: string }[] {
  const pairs: { key: string; value: string }[] = [];
  const regex = /([A-Za-z_][A-Za-z0-9_]*)=("([^"]*)"|\S+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(rawLogLine)) !== null) {
    const key = match[1];
    const value = match[3] !== undefined ? match[3] : match[2];
    pairs.push({ key, value });
  }
  return pairs;
}
