// Рисует случай стенда в PNG: node bench/show.mjs <сценарий> <seed> [out.png]
import fs from "node:fs";
import { createRequire } from "node:module";
import { loadAnalyzer } from "./lib.mjs";
import { makeCase, PAGE } from "./cases.mjs";
const [name, seed, outp = "/tmp/claude-0/-home-user-cube-playground/681e32ae-7246-5530-8ea6-e9ff7c8ac8fb/scratchpad/show.png"] = process.argv.slice(2);
const c = makeCase(name, +seed);
const r = loadAnalyzer()(c.strokes, c.opt);
const col = ["#DD5F27", "#2C68D6", "#BF3A8C"];
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE.w}" height="${PAGE.h}" style="background:#fff">`;
for (const s of c.strokes) svg += `<polyline fill="none" stroke="#bbb" stroke-width="3" points="${s.pts.map((p) => p.join(",")).join(" ")}"/>`;
const fam = new Map(r.boxes[0]?.fam || []);
r.lines.forEach((l, i) => {
  const f = fam.get(i);
  svg += `<line x1="${l.a[0]}" y1="${l.a[1]}" x2="${l.b[0]}" y2="${l.b[1]}" stroke="${f === undefined ? "#000" : col[f]}" stroke-width="2" ${l.hidden ? 'stroke-dasharray="6 4"' : ""}/>`;
  svg += `<text x="${(l.a[0] + l.b[0]) / 2 + 6}" y="${(l.a[1] + l.b[1]) / 2}" font-size="14">${i}</text>`;
});
c.truth.B.P.forEach((p, i) => (svg += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="green"/><text x="${p[0] + 6}" y="${p[1] - 6}" fill="green" font-size="13">${i}</text>`));
svg += "</svg>";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const b = await chromium.launch();
const pg = await b.newPage({ viewport: { width: PAGE.w, height: PAGE.h } });
await pg.setContent(svg);
await pg.screenshot({ path: outp });
await b.close();
const box = r.boxes[0];
console.log("lines", r.lines.length, "loose", JSON.stringify(r.loose), "fam", JSON.stringify(box?.fam));
console.log("issues", JSON.stringify(box?.diag.issues.map((i) => [i.sev, i.kind, i.title])));
