export function parseSimpleYaml(source) {
  const root = {};
  const stack = [{ indent: -1, value: root }];

  for (const rawLine of source.split(/\r?\n/)) {
    if (!rawLine.trim() || rawLine.trimStart().startsWith("#")) continue;
    const indent = rawLine.match(/^\s*/)?.[0].length ?? 0;
    const line = rawLine.trim();
    const match = /^([^:]+):(.*)$/.exec(line);
    if (!match) continue;

    const key = match[1].trim();
    const rawValue = match[2].trim();
    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
    const parent = stack[stack.length - 1].value;
    const value = parseScalar(rawValue);
    parent[key] = value;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      stack.push({ indent, value });
    }
  }

  return root;
}

export function stringifySimpleYaml(value, indent = 0) {
  return Object.entries(value)
    .map(([key, raw]) => {
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        return `${" ".repeat(indent)}${key}:\n${stringifySimpleYaml(raw, indent + 2)}`;
      }
      if (Array.isArray(raw)) {
        const items = raw.map((item) => `${" ".repeat(indent + 2)}- ${String(item)}`).join("\n");
        return `${" ".repeat(indent)}${key}:\n${items}`;
      }
      return `${" ".repeat(indent)}${key}: ${formatScalar(raw)}`;
    })
    .join("\n");
}

function parseScalar(value) {
  if (value === "") return {};
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "[]") return [];
  if (/^["'].*["']$/.test(value)) return value.slice(1, -1);
  return value;
}

function formatScalar(value) {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value == null) return "";
  return String(value);
}
