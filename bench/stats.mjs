// Распределения показателей по сценариям из bench/last.json: node bench/stats.mjs
import fs from "node:fs";
const r = JSON.parse(fs.readFileSync(new URL("./last.json", import.meta.url)));
const keys = ["corner", "convMax", "convRms", "props", "impl", "loose", "cone"];
const q = (a, p) => (a.length ? a.slice().sort((x, y) => x - y)[Math.min(a.length - 1, Math.floor(p * a.length))] : NaN);
const by = {};
for (const x of r) if (x.st) (by[x.name] ||= []).push(x);
console.log("сценарий".padEnd(18), keys.map((k) => k.padStart(16)).join(""));
console.log("".padEnd(18), keys.map(() => "p10/p50/p90".padStart(16)).join(""));
for (const [n, xs] of Object.entries(by)) {
  console.log(n.padEnd(18), keys.map((k) => {
    const a = xs.map((x) => x.st[k]).filter((v) => v !== null && v !== undefined && isFinite(v));
    const f = (v) => (k === "convMax" || k === "convRms" || k === "cone" ? v.toFixed(1) : (100 * v).toFixed(1));
    return `${f(q(a, 0.1))}/${f(q(a, 0.5))}/${f(q(a, 0.9))}`.padStart(16);
  }).join(""));
}
