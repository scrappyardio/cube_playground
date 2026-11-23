// Прогон стенда: node bench/run.mjs [число случаев на сценарий] [фильтр сценариев]
import { Worker, isMainThread, parentPort, workerData } from "node:worker_threads";
import os from "node:os";
import fs from "node:fs";
import { loadAnalyzer } from "./lib.mjs";
import { SCENARIOS, makeCase } from "./cases.mjs";

function evalCase(an, name, seed) {
  const c = makeCase(name, seed);
  if (!c) return { name, seed, skip: true };
  const t0 = performance.now();
  let r;
  try {
    r = an(c.strokes, c.opt);
  } catch (e) {
    return { name, seed, crash: String(e.message).slice(0, 300) };
  }
  const ms = performance.now() - t0;
  const out = { name, seed, ms, bad: c.truth.bad, nBoxes: r.boxes.length };
  if (!r.boxes.length) return out;
  const b = r.boxes[0], dg = b.diag;
  out.score = dg.score ? dg.score.total : null;
  out.parts = dg.score ? Object.fromEntries(dg.score.parts.map((p) => [p.key, p.val])) : null;
  out.maxSev = Math.max(0, ...dg.issues.map((i) => i.sev));
  out.issues = dg.issues.map((i) => `${i.sev}:${i.kind}`);
  const fit = c.opt.target === "cube" ? b.fits.cube : b.fits.box;
  const P = c.truth.B.P, xs = P.map((p) => p[0]), size = Math.max(...xs) - Math.min(...xs);
  if (fit && !c.truth.bad) {
    out.fitErr = Math.max(...P.map((p) => Math.min(...fit.P.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1]))))) / size;
  }
  out.famCounts = dg.families.map((f) => f.n);
  const E = dg.scale || 1;
  out.st = {
    corner: dg.answer ? Math.max(0, ...dg.answer.corners.map((q) => q.d)) / E : null,
    convMax: Math.max(0, ...dg.families.filter((f) => f.n >= 3 && f.maxAbs !== undefined).map((f) => f.maxAbs)),
    convRms: dg.convRms,
    props: dg.props ? dg.props.excess : null,
    impl: dg.implied ? dg.implied.rel : null,
    loose: dg.looseFrac || 0,
    cone: dg.camera?.cone ?? dg.implied?.cone,
  };
  return out;
}

if (isMainThread) {
  const N = +(process.argv[2] || 20);
  const filt = process.argv[3] ? new RegExp(process.argv[3]) : null;
  const jobs = [];
  for (const name of Object.keys(SCENARIOS)) if (!filt || filt.test(name)) for (let s = 1; s <= N; s++) jobs.push([name, s]);
  const nw = Math.min(os.cpus().length, 4);
  const results = [];
  let next = 0;
  await new Promise((done) => {
    let alive = nw;
    for (let w = 0; w < nw; w++) {
      const wk = new Worker(new URL(import.meta.url), { workerData: {} });
      const feed = () => (next < jobs.length ? wk.postMessage(jobs[next++]) : (wk.terminate(), --alive || done()));
      wk.on("message", (m) => (results.push(m), feed()));
      wk.on("error", (e) => { console.error(e); --alive || done(); });
      feed();
    }
  });
  fs.writeFileSync(new URL("./last.json", import.meta.url), JSON.stringify(results));
  const by = {};
  for (const r of results) (by[r.name] ||= []).push(r);
  const pct = (a, b) => (b ? Math.round((100 * a) / b) + "%" : "-");
  const med = (a) => (a.length ? a.slice().sort((x, y) => x - y)[a.length >> 1] : NaN);
  console.log("сценарий".padEnd(18), "n  крах нет_кор  ок/поймано  ср.балл  мед.балл  fitErr   мс");
  let tot = { fp: 0, nOk: 0, miss: 0, nBad: 0, crash: 0, nobox: 0 };
  for (const [name, rs] of Object.entries(by)) {
    const v = rs.filter((r) => !r.skip), crash = v.filter((r) => r.crash).length;
    const got = v.filter((r) => r.nBoxes > 0);
    const bad = SCENARIOS[name].bad;
    // правильный рисунок «чистый», если нет ошибок уровня 2+ и балл ≥ 80
    // рисунок с ошибкой «пойман», если есть ошибка уровня 2+ или балл < 70
    const okN = got.filter((r) => (bad ? r.maxSev >= 2 || r.score < 70 : r.maxSev < 2 && r.score >= 80)).length;
    const fe = got.map((r) => r.fitErr).filter((x) => x !== undefined);
    console.log(
      name.padEnd(18), String(v.length).padEnd(3), String(crash).padEnd(5), String(v.length - got.length - crash).padEnd(8),
      pct(okN, v.length).padEnd(11),
      String(Math.round(got.reduce((a, r) => a + (r.score ?? 0), 0) / (got.length || 1))).padEnd(8),
      String(med(got.map((r) => r.score ?? 0))).padEnd(9),
      (fe.length ? (100 * med(fe)).toFixed(1) + "%" : "-").padEnd(8),
      Math.round(med(v.map((r) => r.ms || 0))),
    );
    tot.crash += crash; tot.nobox += v.length - got.length - crash;
    if (bad) { tot.nBad += v.length; tot.miss += v.length - okN; } else { tot.nOk += v.length; tot.fp += v.length - okN; }
  }
  console.log(`\nИТОГО: ложные тревоги ${tot.fp}/${tot.nOk}, пропущенные ошибки ${tot.miss}/${tot.nBad}, крахи ${tot.crash}, не нашёл коробку ${tot.nobox}`);
} else {
  const an = loadAnalyzer();
  parentPort.on("message", ([name, seed]) => parentPort.postMessage(evalCase(an, name, seed)));
}
