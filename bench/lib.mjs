// Загружает анализ (src/worker.js) и генератор тестовых кубов (библиотечная часть src/app.js) в Node.
import fs from "node:fs";
import vm from "node:vm";
const root = new URL("..", import.meta.url).pathname;

export function loadAnalyzer() {
  const code = fs.readFileSync(root + "src/worker.js", "utf8");
  let out;
  const self = { postMessage: (m) => (out = m) };
  vm.runInNewContext(code, { self, console, Math, Date, performance, Float64Array, Map, Set, Array, JSON, Number, String, Object, Infinity, NaN, isFinite, Error });
  const run = (strokes, opt, truth = null) => {
    out = null;
    self.onmessage({ data: { id: 1, strokes, opt, truth } });
    if (out.error) throw new Error(out.error);
    return out.result;
  };
  run.internals = self.__internals;
  return run;
}

export function loadSynth() {
  const code = fs.readFileSync(root + "src/app.js", "utf8");
  const cut = code.indexOf("  var F = { w: 1600, h: 1e3 }");
  const lib = code.slice(code.indexOf("(() => {") + 8, cut);
  const fn = new Function(lib + "\nreturn { re, H, ce, Ne, _e, K, ct, nn };");
  return fn();
}
