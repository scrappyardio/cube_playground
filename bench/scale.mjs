// Проверка независимости от масштаба: тот же рисунок, увеличенный/уменьшенный, должен оцениваться так же.
import { loadAnalyzer } from "./lib.mjs";
import { makeCase } from "./cases.mjs";
const an = loadAnalyzer();
const N = +(process.argv[2] || 10);
let worst = 0;
for (const name of ["ok_cube", "bad_corner_outer"]) for (let s = 1; s <= N; s++) {
  const c = makeCase(name, s);
  const row = [];
  for (const k of [0.35, 1, 2.5]) {
    const st = c.strokes.map((q) => ({ ...q, pts: q.pts.map((p) => [p[0] * k, p[1] * k]) }));
    const r = an(st, { ...c.opt, page: { w: 1600 * k, h: 1000 * k } });
    const b = r.boxes[0];
    row.push(b ? `${b.diag.score.total}/${Math.max(0, ...b.diag.issues.map((i) => i.sev))}` : "нет");
  }
  const sc = row.map((x) => +x.split("/")[0] || 0);
  worst = Math.max(worst, Math.max(...sc) - Math.min(...sc));
  console.log(name, s, row.join("  "));
}
console.log("макс. разброс балла между масштабами:", worst);
