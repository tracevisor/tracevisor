import { readFile, writeFile } from "node:fs/promises";

const names = [
  "activity", "arrow-left", "arrow-right", "arrow-up-right", "bar-chart-3", "bell", "book-open",
  "check", "chevron-down", "chevron-left", "chevron-right", "chevron-up", "circle-alert", "circle-check",
  "circle-help", "clipboard", "clock", "code", "copy", "credit-card", "download", "earth", "external-link",
  "eye", "eye-off", "file-text", "filter", "globe", "house", "info", "key-round", "languages",
  "layout-dashboard", "link", "list", "loader-circle", "lock", "log-out", "mail", "map-pin", "menu",
  "monitor", "moon", "more-horizontal", "panel-left", "pencil", "plus", "radio", "refresh-cw", "search",
  "settings", "share-2", "shield-check", "smartphone", "sun", "table", "trash-2", "trending-down",
  "trending-up", "user", "users", "x", "zap",
];

const out = {};
for (const name of names) {
  const svg = await readFile(new URL(`../node_modules/lucide-static/icons/${name}.svg`, import.meta.url), "utf8");
  const inner = svg.slice(svg.indexOf(">", svg.indexOf("<svg")) + 1, svg.lastIndexOf("</svg>"));
  out[name] = inner.replace(/\s+/g, " ").replace(/> </g, "><").trim();
}

const body = Object.entries(out)
  .map(([name, paths]) => `  "${name}": ${JSON.stringify(paths)},`)
  .join("\n");

await writeFile(
  new URL("../src/ui/icons.generated.ts", import.meta.url),
  `export const icons = {\n${body}\n} as const;\n\nexport type IconName = keyof typeof icons;\n`,
);
console.log(`${names.length} icons written to src/ui/icons.generated.ts`);
