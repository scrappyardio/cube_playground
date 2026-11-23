// Второй рисунок пользователя (режим «по грани», лист повёрнут на 180°): рёбра дорисовываются по одному.
// Раньше: 100 баллов, пока новых углов нет, потом обрыв в 0. Теперь: «дорисуй», затем плавный балл.
import { loadAnalyzer, loadSynth } from "./lib.mjs";
const an = loadAnalyzer(), S = loadSynth();
const toPage = (q) => [800 - (q[0] - 736) / 0.851, 500 - (q[1] - 668) / 0.851];
const truthScr = { 0: [515, 645], 1: [347, 397], 2: [822, 513], 3: [648, 297], 4: [515, 825], 5: [378, 605], 6: [773, 705], 7: [625, 507] };
const userScr = { ...truthScr, 5: [388, 663], 7: [637, 540] };
const T = [...Array(8)].map((_, k) => toPage(truthScr[k])), U = [...Array(8)].map((_, k) => toPage(userScr[k]));
const score = (r) => {
  if (!r.truth || r.truth.nNew < 3) return `дорисуй (углов ${r.truth ? r.truth.nNew : 0})`;
  const x = Math.max(0, r.truth.rms / (r.boxes[0].diag.scale || 1) - 0.012) / 0.05;
  return `${Math.round(100 / (1 + x * x))} (углы в среднем ${Math.round(r.truth.rms)} ед.)`;
};
export function steps(face, user = U, seed = 1) {
  const rng = S.re(seed);
  const key = (a, b) => [a, b].sort().join("-");
  const gset = new Set(face.map((l, i) => key(l, face[(i + 1) % 4])));
  const given = face.map((l, i) => ({ pts: [T[l], T[face[(i + 1) % 4]]], hidden: false }));
  const todo = S.ct.filter(([a, b]) => !gset.has(key(a, b)));
  const out = [];
  for (let k = 1; k <= todo.length; k++) {
    const st = S._e(user, todo.slice(0, k).map(([a, b, kk]) => ({ a, b, k: kk, visible: true })), S.re(seed), { hidden: "solid", corners: 0 }).strokes.map((q) => ({ pts: q.pts, hidden: false }));
    const r = an([...given, ...st], { target: "cube", page: { w: 1600, h: 1000 } }, { P: T, given: face });
    out.push(r.boxes.length ? score(r) : "коробки нет");
  }
  return out;
}
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const face of [[0, 1, 3, 2], [0, 2, 6, 4], [0, 1, 5, 4]]) console.log("грань", face.join(""), "\n  " + steps(face).join("\n  "));
  console.log("тот же рисунок, но углы на месте:", steps([0, 1, 3, 2], T).slice(-1)[0]);
}
