// Рисунок пользователя со скриншота (режим «Достроить по грани», куб углом к зрителю,
// ближний и невидимый углы почти совпадают). Координаты экрана переведены в координаты листа.
import { loadAnalyzer, loadSynth } from "./lib.mjs";
const an = loadAnalyzer(), S = loadSynth();
const toPage = (p) => [(p[0] - 405) / 0.7 + 800, (p[1] - 432) / 0.7 + 500];
// метки углов: 0 — ближний, 7 — невидимый; соседи ближнего 1,2,4
const truthScr = { 0: [443, 520], 1: [397, 305], 2: [229, 670], 3: [221, 456], 4: [620, 623], 5: [553, 427], 6: [421, 737], 7: [387, 541] };
const userScr = { ...truthScr, 0: [443, 522], 3: [224, 463], 2: [230, 670], 5: [570, 436], 7: [407, 540] };
const T = [...Array(8)].map((_, k) => toPage(truthScr[k]));
const U = [...Array(8)].map((_, k) => toPage(userScr[k]));
const edges = S.ct.map(([a, b, k]) => ({ a, b, k, visible: true }));
export function run(faceLabels, seed = 1, user = U) {
  const rng = S.re(seed);
  const given = faceLabels.map((l, i) => ({ pts: [T[l], T[faceLabels[(i + 1) % 4]]], hidden: false }));
  const gset = new Set(faceLabels.map((l, i) => [l, faceLabels[(i + 1) % 4]].sort().join("-")));
  const st = S._e(user, edges.filter((e) => !gset.has([e.a, e.b].sort().join("-"))), rng, { hidden: "solid" }).strokes.map((q) => ({ pts: q.pts, hidden: false }));
  const r = an([...given, ...st], { target: "cube", page: { w: 1600, h: 1000 } }, { P: T, given: faceLabels });
  const b = r.boxes[0];
  const x = r.truth && r.truth.rms !== null ? Math.max(0, r.truth.rms / (b.diag.scale || 1) - 0.012) / 0.05 : 9;
  return { score: Math.round(100 / (1 + x * x)), rms: r.truth && Math.round(r.truth.rms), lines: r.lines.length, loose: r.loose.length, fams: b?.diag.families.map((f) => f.n + "/" + (f.maxAbs ?? 0).toFixed(1)).join(" "), issues: b?.diag.issues.map((i) => i.sev + ":" + i.kind).join(" ") };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const face of [[0, 1, 3, 2], [0, 2, 6, 4], [0, 1, 5, 4]])
    for (const seed of [1, 2, 3]) console.log("грань", face.join(""), "seed", seed, JSON.stringify(run(face, seed)));
}
