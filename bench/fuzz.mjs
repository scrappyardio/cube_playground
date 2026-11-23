// Проверка на устойчивость: анализ не должен падать и выдавать NaN ни на каком вводе.
// node bench/fuzz.mjs [число]
import { loadAnalyzer, loadSynth } from "./lib.mjs";
const an = loadAnalyzer(), S = loadSynth();
const N = +(process.argv[2] || 200);
const PAGE = { w: 1600, h: 1000 };
const rng = S.re(12345);
const R = (a, b) => a + (b - a) * rng();
const kinds = {
  // случайные каракули: прямые, кривые, точки
  scribble() {
    const n = 1 + Math.floor(rng() * 14);
    return [...Array(n)].map(() => {
      const k = Math.floor(rng() * 4);
      if (k === 0) return { pts: [[R(0, 1600), R(0, 1000)], [R(0, 1600), R(0, 1000)]] };
      if (k === 1) { const c = [R(200, 1400), R(200, 800)], r = R(5, 200); return { pts: [...Array(40)].map((_, i) => [c[0] + r * Math.cos(i / 6), c[1] + r * Math.sin(i / 6)]) }; }
      if (k === 2) { const p = [R(0, 1600), R(0, 1000)]; return { pts: [p, p.slice(), p.slice()] }; }
      let p = [R(0, 1600), R(0, 1000)]; return { pts: [...Array(30)].map(() => (p = [p[0] + R(-20, 20), p[1] + R(-20, 20)])), hidden: rng() < 0.3 };
    });
  },
  // куб без нескольких рёбер
  partial() {
    const B = S.ce(rng, { page: PAGE }); if (!B) return [];
    const E = S.Ne(B).filter(() => rng() > 0.3);
    return S._e(B.P, E, rng, {}).strokes;
  },
  // две-три коробки
  multi() {
    const out = [], c = [800 + R(-100, 100), 500 + R(-60, 60)], f = R(900, 2500);
    for (let i = 0; i < 2 + Math.floor(rng() * 2); i++) {
      const B = S.ce(rng, { page: PAGE, c, f, sizePx: R(140, 220), at: [R(250, 1350), R(220, 780)] });
      if (B) out.push(...S._e(B.P, S.Ne(B), rng, { hidden: rng() < 0.5 ? "omit" : "dashed" }).strokes);
    }
    return out;
  },
  // вид с двумя гранями, маленький, огромный
  twoFaces() { const B = S.ce(rng, { page: PAGE, faces: 2 }); return B ? S._e(B.P, S.Ne(B), rng, {}).strokes : []; },
  tiny() { const B = S.ce(rng, { page: PAGE, sizePx: R(40, 90) }); return B ? S._e(B.P, S.Ne(B), rng, {}).strokes : []; },
  huge() { const B = S.ce(rng, { page: { w: 16000, h: 10000 }, sizePx: R(2000, 5000) }); return B ? S._e(B.P, S.Ne(B), rng, {}).strokes : []; },
  // повторяющиеся точки и вырожденные штрихи вперемешку с кубом
  degenerate() {
    const B = S.ce(rng, { page: PAGE }); if (!B) return [];
    const st = S._e(B.P, S.Ne(B), rng, {}).strokes;
    st.push({ pts: [[100, 100]] }, { pts: [[5, 5], [5, 5]] }, { pts: [[300, 300], [300.01, 300]] });
    for (const s of st) if (rng() < 0.2) s.pts = s.pts.flatMap((p) => [p, p]);
    return st;
  },
};
const bad = (v, path = "") => {
  if (typeof v === "number" && !Number.isFinite(v) && !(v === Infinity || v === -Infinity)) return path;
  if (v && typeof v === "object") for (const k of Object.keys(v)) { const r = bad(v[k], path + "." + k); if (r) return r; }
  return null;
};
const stats = {};
let fails = 0, maxMs = 0;
for (let i = 0; i < N; i++) {
  const kind = Object.keys(kinds)[i % Object.keys(kinds).length];
  const strokes = kinds[kind]().map((s) => ({ pts: s.pts, hidden: !!s.hidden }));
  for (const target of ["cube", "box"]) {
    const t0 = performance.now();
    try {
      const r = an(strokes, { target, page: PAGE });
      const nan = bad(r);
      // NaN в итоговых числах — ошибка (null/undefined допустимы)
      if (nan) { fails++; console.log("NaN", kind, i, target, nan); }
      const st = (stats[kind] ||= { n: 0, boxes: 0, top: 0, maxMs: 0 });
      st.maxMs = Math.max(st.maxMs, Math.round(performance.now() - t0));
      st.n++; st.boxes += r.boxes.length ? 1 : 0;
      if (kind === "scribble" && r.boxes[0]?.diag.score?.total >= 90) st.top++;
    } catch (e) { fails++; console.log("CRASH", kind, i, target, String(e.message).split("\n").slice(0, 3).join(" | ")); }
    maxMs = Math.max(maxMs, performance.now() - t0);
  }
}
console.log(JSON.stringify(stats));
console.log(`fuzz: ${N * 2} прогонов, сбоев ${fails}, самый долгий ${Math.round(maxMs)} мс`);
process.exitCode = fails ? 1 : 0;
