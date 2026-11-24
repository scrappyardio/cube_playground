// Стенд распознавания картинок: рисунок → картинка (разные стили) → распознанные штрихи → проверка.
// Сравниваем вердикт с проверкой исходных штрихов. node bench/vectorize.mjs [случаев на сценарий] [фильтр стилей]
import fs from "node:fs";
import vm from "node:vm";
import os from "node:os";
import { Worker, isMainThread, parentPort } from "node:worker_threads";
import { loadAnalyzer, loadSynth } from "./lib.mjs";
import { makeCase, SCENARIOS, PAGE } from "./cases.mjs";
import { rasterize } from "./raster.mjs";

export function loadVectorize() {
  const code = fs.readFileSync(new URL("../src/vectorize.js", import.meta.url), "utf8");
  const ctx = { self: {}, Math, Float32Array, Float64Array, Uint8Array, Int32Array, Uint8ClampedArray, Map, Set, Array, Object, Number };
  vm.runInNewContext(code, ctx);
  return ctx.self.Vectorize;
}

export const STYLES = {
  digital: (r) => ({ k: 0.55 + 0.5 * r(), width: 1.6 + 2.2 * r() }),
  retina: (r) => ({ k: 1.3 + 0.5 * r(), width: 4 + 3 * r() }),
  pencil: (r) => ({ k: 0.6 + 0.4 * r(), width: 2 + 2 * r(), pencil: true, gradient: 0.25, noise: 5, blur: true, bg: [236, 231, 220], ink: [80, 80, 88] }),
  dark: (r) => ({ k: 0.6 + 0.4 * r(), width: 2.5, bg: [32, 32, 36], ink: [225, 225, 230] }),
  marker: (r) => ({ k: 0.8 + 0.3 * r(), width: 9 + 5 * r() }),
  chrome: (r) => ({ k: 0.55 + 0.4 * r(), width: 2.2, chrome: true }),
};
const NAMES = ["ok_cube", "ok_cube_dashed", "ok_cube_solid", "ok_cube_sloppy", "ok_box", "ok_cornerview", "bad_corner_outer", "bad_props", "bad_corner_inner"];

const verdict = (r, bad) => {
  if (!r.boxes.length) return { ok: false, score: null };
  const dg = r.boxes[0].diag,
    score = dg.score ? dg.score.total : null,
    sev = Math.max(0, ...dg.issues.map((i) => i.sev));
  return { score, sev, ok: bad ? sev >= 2 || score < 70 : sev < 2 && score >= 80, grade: dg.score?.grade };
};

function evalOne(an, V, S, name, seed, style) {
  const c = makeCase(name, seed);
  if (!c) return null;
  const rng = S.re(seed * 31 + style.length * 7 + 3);
  const o = STYLES[style](rng);
  const im = rasterize(c.strokes, { ...o, W: Math.round(PAGE.w * o.k), H: Math.round(PAGE.h * o.k), rng });
  const t0 = performance.now();
  const v = V.vectorize(im);
  const tv = performance.now() - t0;
  if (v.error) return { name, seed, style, err: v.error, tv };
  const pl = V.place(v, im, PAGE);
  const bad = SCENARIOS[name].bad;
  const a = verdict(an(c.strokes, c.opt), bad),
    b = verdict(an(pl.strokes, c.opt), bad);
  return { name, seed, style, bad, orig: a, img: b, n: pl.strokes.length, tv, sw: v.strokeWidth };
}

if (isMainThread && process.argv[1] && process.argv[1].endsWith("vectorize.mjs")) {
  const N = +(process.argv[2] || 6);
  const sf = process.argv[3] ? new RegExp(process.argv[3]) : null;
  const nf = process.argv[4] ? new RegExp(process.argv[4]) : null;
  const jobs = [];
  for (const st of Object.keys(STYLES)) if (!sf || sf.test(st)) for (const nm of NAMES) if (!nf || nf.test(nm)) for (let s = 1; s <= N; s++) jobs.push([nm, s, st]);
  const res = [];
  let next = 0;
  await new Promise((done) => {
    let alive = Math.min(4, os.cpus().length);
    for (let w = 0, n = alive; w < n; w++) {
      const wk = new Worker(new URL(import.meta.url));
      const feed = () => (next < jobs.length ? wk.postMessage(jobs[next++]) : (wk.terminate(), --alive || done()));
      wk.on("message", (m) => (m && res.push(m), feed()));
      wk.on("error", (e) => (console.error(e), --alive || done()));
      feed();
    }
  });
  fs.writeFileSync(new URL("./last_vec.json", import.meta.url), JSON.stringify(res));
  const by = {};
  for (const r of res) (by[r.style] ||= []).push(r);
  console.log("стиль     n  ошибок  верно(исх)  верно(карт)  хуже  ср|Δбалл|  линий  мс");
  let worse = 0, tot = 0;
  for (const [st, rs] of Object.entries(by)) {
    const e = rs.filter((r) => r.err).length,
      g = rs.filter((r) => !r.err),
      oo = g.filter((r) => r.orig.ok).length,
      io = g.filter((r) => r.img.ok).length,
      w = g.filter((r) => r.orig.ok && !r.img.ok).length,
      dd = g.filter((r) => r.orig.score != null && r.img.score != null).map((r) => Math.abs(r.orig.score - r.img.score));
    worse += w + e, tot += rs.length;
    console.log(
      st.padEnd(8), String(rs.length).padStart(3), String(e).padStart(6), String(oo).padStart(10), String(io).padStart(12), String(w).padStart(5),
      (dd.reduce((a, b) => a + b, 0) / (dd.length || 1)).toFixed(1).padStart(10),
      (g.reduce((a, r) => a + r.n, 0) / (g.length || 1)).toFixed(0).padStart(6),
      (rs.reduce((a, r) => a + r.tv, 0) / rs.length).toFixed(0).padStart(5),
    );
  }
  for (const r of res.filter((r) => r.err || (r.orig.ok && !r.img.ok)))
    console.log("  хуже:", r.style, r.name, r.seed, r.err || `исх ${r.orig.score}/${r.orig.sev} → карт ${r.img.score}/${r.img.sev} ${r.img.grade || ""}, линий ${r.n}, толщина ${r.sw?.toFixed(1)}`);
  console.log(`итого: хуже, чем по штрихам: ${worse} из ${tot}`);
} else if (!isMainThread) {
  const an = loadAnalyzer(), V = loadVectorize(), S = loadSynth();
  parentPort.on("message", ([nm, s, st]) => {
    try {
      parentPort.postMessage(evalOne(an, V, S, nm, s, st));
    } catch (e) {
      parentPort.postMessage({ name: nm, seed: s, style: st, err: "crash " + e.message, tv: 0 });
    }
  });
}
