// Образцы из окошка «Образец»: срисованные без ошибок «от руки», они обязаны проходить проверку.
// node bench/refs.mjs [число seed] [первый seed]
import { loadAnalyzer, loadSynth } from "./lib.mjs";
const an = loadAnalyzer(), S = loadSynth();
const F = { w: 1600, h: 1000 };
// тот же генератор, что refBox() в src/app.js
export function refCube(seed, target = "cube") {
  let B = null;
  for (let k = 0; k < 50 && !B; k++) {
    const r = S.re(seed * 7349 + k * 104729 + 11);
    let D = [1, 1, 1];
    if (target === "box") {
      D = [0, 1, 2].map(() => Math.exp((r() - 0.5) * 1.3));
      const g = Math.cbrt(D[0] * D[1] * D[2]);
      D = D.map((x) => x / g);
    }
    B = S.ce(r, { page: F, D, maxCone: 28, minTilt: 0.18 });
  }
  return B;
}
// рисуем образец по центру листа, как человек, срисовывающий его в крупном масштабе
export function drawRef(seed, style = {}, hidden = "solid", target = "cube") {
  const B = refCube(seed, target);
  const xs = B.P.map((p) => p[0]), ys = B.P.map((p) => p[1]);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const P = B.P.map((p) => [p[0] - cx + 600, p[1] - cy + 480]);
  const st = S._e(P, S.Ne(B), S.re(seed + 99), { hidden, ...style }).strokes.map((q) => ({ pts: q.pts, hidden: !!q.hidden }));
  return { B, strokes: st, opt: { target, page: F } };
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const N = +(process.argv[2] || 60), from = +(process.argv[3] || 1);
  const seeds = [145389, ...Array.from({ length: N }, (_, i) => from + i)];
  let bad = 0, n = 0;
  for (const seed of seeds) for (const hidden of ["solid", "omit"]) {
    const c = drawRef(seed, {}, hidden);
    const r = an(c.strokes, c.opt);
    const b = r.boxes[0];
    const sc = b?.diag.score?.total, sev = b ? Math.max(0, ...b.diag.issues.map((i) => i.sev)) : 9;
    n++;
    if (!(sc >= 80 && sev < 2)) {
      bad++;
      console.log(`seed ${seed} (${hidden}): балл ${sc}, ${b ? b.diag.issues.map((i) => i.sev + ":" + i.kind).join(" ") : "нет коробки"}, конус ${Math.round(c.B.cone)}°, f/размер ${(c.B.f / (Math.max(...c.B.P.map(p=>p[0])) - Math.min(...c.B.P.map(p=>p[0])))).toFixed(1)}, пропорции ${b?.diag.props ? b.diag.props.r.map((x) => x.toFixed(2)).join("/") : "-"}`);
    }
  }
  console.log(`образцы, срисованные верно: прошли ${n - bad}/${n}`);
  process.exitCode = bad ? 1 : 0;
}
// Копия образца 145389 от пользователя (нарисована в левой части листа): почти фронтальный вид,
// длина рёбер вглубь неоднозначна. Раньше — «ошибка: рёбра длиннее в 1,73 раза»; рисунок объясняется кубом.
if (import.meta.url === `file://${process.argv[1]}`) {
  const R = await import("./repro_ref_copy.mjs");
  const res = [1, 2, 3].map((sd) => an(R.strokes(sd), { target: "cube", page: F }).boxes[0].diag);
  const bad = res.filter((d) => d.issues.some((i) => i.kind === "props") || (d.guide && d.guide.show));
  console.log(`копия образца 145389 со скриншота: баллы ${res.map((d) => d.score.total).join(", ")} — ${bad.length ? "СНОВА ЛОЖНАЯ ОШИБКА ПРОПОРЦИЙ" : "без ложной ошибки пропорций"}`);
  if (bad.length) process.exitCode = 1;
}
