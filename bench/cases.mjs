// Генерация тестовых рисунков: правильные кубы/коробки «от руки» и рисунки с известными ошибками.
// Каждый случай знает правду: есть ли в нём ошибка и какая.
import { loadSynth } from "./lib.mjs";
const S = loadSynth();
export const PAGE = { w: 1600, h: 1000 };

const toStrokes = (d) => d.strokes.map((s) => ({ pts: s.pts, hidden: !!s.hidden }));

// Проекция с «обратной перспективой»: дальние точки крупнее ближних.
function reverseProject(B) {
  const zm = B.X.reduce((a, x) => a + x[2], 0) / 8;
  return B.X.map((x) => [B.c[0] + (B.f * x[0] * x[2]) / (zm * zm), B.c[1] + (B.f * x[1] * x[2]) / (zm * zm)]);
}

// Один угол, у которого видны 2 ребра (силуэт), или видимый внутренний угол.
function pickCorner(B, edges, rng, kind) {
  const deg = (v) => edges.filter((e) => e.visible && (e.a === v || e.b === v)).length;
  const cand = [...Array(8).keys()].filter((v) => (kind === "inner" ? deg(v) === 3 : deg(v) === 2));
  return cand[Math.floor(rng() * cand.length)];
}

const STYLES = {
  clean: { jitter: 0.3, bow: 0.004, endJ: 1.0, retrace: 0.05, hooks: 0.05 },
  normal: {},
  sloppy: { jitter: 0.8, bow: 0.012, endJ: 2.4, over: [-0.05, 0.16], retrace: 0.3, hooks: 0.3, corners: 0.4 },
};

export const SCENARIOS = {
  // ---- правильные рисунки: ошибок быть не должно ----
  ok_cube: { target: "cube", bad: false },
  ok_cube_dashed: { target: "cube", bad: false, hidden: "dashed" },
  ok_cube_solid: { target: "cube", bad: false, hidden: "solid" },
  ok_cube_sloppy: { target: "cube", bad: false, style: "sloppy" },
  ok_cube_wide: { target: "cube", bad: false, gen: { f: 700, minCone: 22, maxCone: 34 } },
  ok_cube_tele: { target: "cube", bad: false, gen: { f: 5000 } },
  ok_box: { target: "box", bad: false, dims: true },
  ok_box_dashed: { target: "box", bad: false, dims: true, hidden: "dashed" },
  // ---- рисунки с ошибкой: ошибку надо найти ----
  bad_corner_outer: { target: "cube", bad: true, corner: "outer", shift: 0.09 },
  bad_corner_inner: { target: "cube", bad: true, corner: "inner", shift: 0.09 },
  bad_corner_big: { target: "cube", bad: true, corner: "outer", shift: 0.16 },
  bad_props: { target: "cube", bad: true, props: 1.45 },
  bad_reverse: { target: "cube", bad: true, reverse: true, gen: { f: 900, minCone: 16 } },
  bad_box_corner: { target: "box", bad: true, dims: true, corner: "outer", shift: 0.1 },
  // ракурс «углом к зрителю»: ближний и невидимый углы почти совпадают, все рёбра сплошные
  ok_cornerview: { target: "cube", bad: false, hidden: "solid", cornerView: true },
  ok_cornerview_hand: { target: "cube", bad: false, hidden: "solid", cornerView: true, style: "sloppy" },
  bad_cornerview: { target: "cube", bad: true, hidden: "solid", cornerView: true, corner: "outer", shift: 0.09 },
};

export function makeCase(name, seed) {
  const sc = SCENARIOS[name];
  const rng = S.re(seed * 7919 + name.length * 104729 + name.charCodeAt(4));
  let D = [1, 1, 1];
  if (sc.dims) {
    D = [0, 1, 2].map(() => Math.exp((rng() - 0.5) * 1.1));
    const g = Math.cbrt(D[0] * D[1] * D[2]);
    D = D.map((x) => x / g);
  }
  if (sc.props) D = [1, 1, sc.props].map((x) => x / Math.cbrt(sc.props));
  let B = null;
  // ближний угол — общий у трёх видимых граней, невидимый — у трёх невидимых
  const cornerGap = (B) => {
    const vis = S.K.map((f, i) => B.faceVis[i]);
    const near = [...Array(8).keys()].find((v) => S.K.every((f, i) => !f.v.includes(v) || vis[i]));
    const far = near ^ 7;
    const xs = B.P.map((p) => p[0]);
    return near === undefined ? 1 : Math.hypot(B.P[near][0] - B.P[far][0], B.P[near][1] - B.P[far][1]) / (Math.max(...xs) - Math.min(...xs));
  };
  for (let i = 0; i < (sc.cornerView ? 4000 : 50) && !B; i++) {
    B = S.ce(rng, { page: PAGE, D, maxCone: 30, ...(sc.gen || {}) });
    if (B && sc.cornerView && cornerGap(B) > 0.2) B = null;
  }
  if (!B) return null;
  const edges = S.Ne(B);
  let P = B.P.map((p) => p.slice());
  const truth = { name, bad: sc.bad, B };
  if (sc.reverse) P = reverseProject(B);
  if (sc.corner) {
    const v = pickCorner(B, edges, rng, sc.corner);
    if (v === undefined) return null;
    const size = Math.max(...P.map((p) => p[0])) - Math.min(...P.map((p) => p[0]));
    const ang = rng() * 2 * Math.PI, r = sc.shift * size;
    P[v] = [P[v][0] + Math.cos(ang) * r, P[v][1] + Math.sin(ang) * r];
    truth.corner = v;
  }
  const d = S._e(P, edges, rng, { hidden: sc.hidden || "omit", ...STYLES[sc.style || "normal"] });
  return { strokes: toStrokes(d), opt: { target: sc.target, page: PAGE }, truth };
}
