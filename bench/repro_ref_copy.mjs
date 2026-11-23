// Рисунок пользователя: срисованный образец 145389, нарисован в левой части листа
// (координаты со скриншота, лист в масштабе ≈0,456, центр листа — крестик в (310,395)).
import { loadAnalyzer, loadSynth } from "./lib.mjs";
const an = loadAnalyzer(), S = loadSynth();
const toPage = (q) => [(q[0] - 310) / 0.456 + 800, (q[1] - 395) / 0.456 + 500];
// метки: 0..3 — задняя грань (TL,TR,BL,BR через биты x,y), +4 — передняя
const scr = { 0: [98, 168], 1: [325, 178], 2: [78, 422], 3: [305, 437], 4: [118, 205], 5: [380, 228], 6: [98, 492], 7: [362, 508] };
export const P = [...Array(8)].map((_, k) => toPage(scr[k]));
export function strokes(seed = 1, hidden = "solid", Pts = P) {
  return S._e(Pts, S.ct.map(([a, b, k]) => ({ a, b, k, visible: true })), S.re(seed), { hidden }).strokes.map((q) => ({ pts: q.pts, hidden: false }));
}
if (import.meta.url === `file://${process.argv[1]}`) {
  const r = an(strokes(1), { target: "cube", page: { w: 1600, h: 1000 } });
  const b = r.boxes[0], d = b.diag;
  console.log("балл", d.score.total, d.score.parts.map((p) => p.key + " " + p.val).join(", "));
  console.log("замечания:", d.issues.map((i) => i.sev + ":" + i.kind + " " + i.title).join(" | "));
  console.log("пропорции (box)", d.props.r.map((x) => x.toFixed(2)).join("/"), "excess", d.props.excess.toFixed(2), "determined", d.props.determined);
  for (const k of ["free", "cube", "box"]) { const f = b.fits[k]; console.log(k, "rms", f.rms.toFixed(1), "f", Math.round(f.f), "c", f.c.map(Math.round).join(","), "cone", f.cone.toFixed(1), "D", f.D.map((x) => x.toFixed(2)).join("/")); }
  console.log("mean edge", d.scale.toFixed(0), "VPs", b.vps.map((v) => v && v.pt ? v.pt.map(Math.round).join(",") : "∞").join(" | "));
}
