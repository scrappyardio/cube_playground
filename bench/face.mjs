// Режим «Достроить по грани»: дорисовываем куб правильно «от руки» и смотрим, какой балл ставит приложение.
// node bench/face.mjs [число заданий]
import { loadAnalyzer, loadSynth } from "./lib.mjs";
const an = loadAnalyzer(), S = loadSynth();
const F = { w: 1600, h: 1000 };
const N = +(process.argv[2] || 30);
// балл режима грани — как в интерфейсе
const faceScore = (r) => {
  const b = r.boxes[0];
  if (!b || !r.truth) return null;
  if (r.truth.nNew < 3) return null;
  // как faceScore в src/app.js
  const x = Math.max(0, r.truth.rms / (b.diag.scale || 1) - 0.012) / 0.05;
  return Math.round(100 / (1 + x * x));
};
export function makeFaceTask(seed) {
  const t = S.re(seed * 977 + 5);
  let e = null;
  for (let l = 0; l < 40 && !e; l++)
    e = S.ce(t, { c: [F.w / 2, F.h / 2], f: 1150 + t() * 1400, maxCone: 29, sizePx: 260 + t() * 120, at: [F.w * (0.35 + 0.3 * t()), F.h * (0.35 + 0.3 * t())] });
  if (!e) return null;
  const faces = S.K.map((l, i) => ({ F: l, i, area: Math.abs(l.v.reduce((h, u, x) => { const b = e.P[u], c = e.P[l.v[(x + 1) % 4]]; return h + b[0] * c[1] - c[0] * b[1]; }, 0)) / 2 }))
    .filter((l) => e.faceVis[l.i]).sort((l, i) => i.area - l.area);
  const s = faces[t() < 0.6 ? 0 : Math.min(1, faces.length - 1)];
  const o = s.F.v;
  const given = o.map((l, i) => ({ pts: [e.P[l], e.P[o[(i + 1) % 4]]], given: true }));
  return { B: e, labels: o, given, rng: t };
}
const rows = [];
if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [hidden, retraceGiven] of [["omit", false], ["dashed", false], ["solid", false], ["solid", true], ["omit", true]]) {
    const sc = [];
    for (let seed = 1; seed <= N; seed++) {
      const T = makeFaceTask(seed);
      if (!T) continue;
      const giv = new Set(T.labels.map((l, i) => [l, T.labels[(i + 1) % 4]].sort().join("-")));
      const edges = S.Ne(T.B).filter((x) => !giv.has([x.a, x.b].sort().join("-")));
      const user = S._e(T.B.P, edges, T.rng, { hidden }).strokes.map((q) => ({ pts: q.pts, hidden: !!q.hidden }));
      // retraceGiven: пользователь ещё и обводит данную грань своими штрихами
      const retr = retraceGiven ? S._e(T.B.P, S.Ne(T.B).filter((x) => giv.has([x.a, x.b].sort().join("-"))).map((x) => ({ ...x, visible: true })), T.rng, {}).strokes.map((q) => ({ pts: q.pts, hidden: false })) : [];
      const strokes = [...T.given.map((g) => ({ pts: g.pts, hidden: false })), ...retr, ...user];
      const r = an(strokes, { target: "cube", page: F }, { P: T.B.P, given: T.labels });
      const v = faceScore(r);
      sc.push(v ?? -1);
      if (v === null || v < 85) {
        const b = r.boxes[0];
        console.log(`  задание ${seed} (${hidden}${retraceGiven ? "+обводка" : ""}): балл ${v}, углы в среднем ${r.truth ? Math.round(r.truth.rms) : "-"} пикс., линий ${r.lines.length}, коробок ${r.boxes.length}, неразобрано ${r.loose.length}, рёбер по направлениям ${b ? b.diag.families.map((f) => f.n).join("/") : "-"}`);
      }
    }
    const ok = sc.filter((x) => x >= 85).length;
    console.log(`невидимые рёбра: ${hidden}${retraceGiven ? ", грань обведена" : ""} — правильно дорисованных с баллом 85+: ${ok}/${sc.length}, медиана ${sc.slice().sort((a, b) => a - b)[sc.length >> 1]}`);
  }
}
// Рисунок пользователя со скриншота (куб углом к зрителю): раньше получал 0 из-за склеенных рёбер.
if (import.meta.url === `file://${process.argv[1]}`) {
  const { run } = await import("./repro_face_cornerview.mjs");
  const res = [[0, 1, 3, 2], [0, 2, 6, 4], [0, 1, 5, 4]].map((f) => run(f, 1));
  const bad = res.filter((r) => r.lines !== 12 || r.score < 30);
  console.log(`рисунок со скриншота (углом к зрителю): баллы ${res.map((r) => r.score).join(", ")}, линий ${res.map((r) => r.lines).join(", ")} — ${bad.length ? "СНОВА СКЛЕЙКА" : "разобран верно"}`);
  process.exitCode = bad.length ? 1 : 0;
}
// Второй рисунок пользователя: пока углов мало — «дорисуй» (а не 100), в конце — не обрыв в 0.
if (import.meta.url === `file://${process.argv[1]}`) {
  const { steps } = await import("./repro_face_partial.mjs");
  const st = steps([0, 1, 3, 2]);
  const okEarly = st.slice(0, 4).every((x) => /дорисуй/.test(x));
  const last = parseInt(st[st.length - 1]);
  console.log(`рисунок со скриншота (дорисовка по одному ребру): ${st.join(" → ")} — ${okEarly && last > 0 && last < 60 ? "верно" : "НЕВЕРНО"}`);
  if (!(okEarly && last > 0 && last < 60)) process.exitCode = 1;
}
