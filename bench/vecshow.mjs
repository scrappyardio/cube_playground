// Картинка + распознанные линии поверх (PNG) для отладки: node bench/vecshow.mjs сценарий seed стиль out.png
import fs from "node:fs";
import zlib from "node:zlib";
import { loadVectorize, STYLES } from "./vectorize.mjs";
import { loadSynth, loadAnalyzer } from "./lib.mjs";
import { makeCase, PAGE } from "./cases.mjs";
import { rasterize } from "./raster.mjs";
const [name, seed, style, out] = [process.argv[2], +process.argv[3], process.argv[4], process.argv[5] || "vec.png"];
const S = loadSynth(), V = loadVectorize();
const c = makeCase(name, seed);
const rng = S.re(seed * 31 + style.length * 7 + 3);
const o = STYLES[style](rng);
const im = rasterize(c.strokes, { ...o, W: Math.round(PAGE.w * o.k), H: Math.round(PAGE.h * o.k), rng });
const v = V.vectorize(im);
console.log(v.error || `strokes ${v.strokes.length} sw ${v.strokeWidth.toFixed(2)} T ${v.threshold.toFixed(1)}`);
const { width: W, height: H } = im, d = Uint8ClampedArray.from(im.data);
for (let i = 0; i < W * H; i++) for (let ch = 0; ch < 3; ch++) d[i * 4 + ch] = 255 - (255 - d[i * 4 + ch]) * 0.35;
const cols = [[230, 60, 30], [30, 110, 230], [20, 170, 60], [200, 40, 200], [220, 150, 0]];
(v.strokes || []).forEach((s, j) => {
  const col = cols[j % cols.length];
  for (let i = 1; i < s.length; i++) {
    const a = s[i - 1], b = s[i], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) * 2) + 1;
    for (let t = 0; t <= n; t++) {
      const x = Math.round(a[0] + ((b[0] - a[0]) * t) / n), y = Math.round(a[1] + ((b[1] - a[1]) * t) / n);
      if (x >= 0 && y >= 0 && x < W && y < H) for (let ch = 0; ch < 3; ch++) d[(y * W + x) * 4 + ch] = col[ch];
    }
  }
  for (const p of [s[0], s[s.length - 1]]) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const x = Math.round(p[0]) + dx, y = Math.round(p[1]) + dy;
    if (x >= 0 && y >= 0 && x < W && y < H) for (let ch = 0; ch < 3; ch++) d[(y * W + x) * 4 + ch] = col[ch] * 0.5;
  }
});
if (process.argv[6]) {
  const an = loadAnalyzer(); const pl = V.place(v, im, PAGE); const r = an(pl.strokes, c.opt);
  const dg = r.boxes[0]?.diag; console.log(dg ? `${dg.score?.total} ${dg.score?.grade} ${dg.issues.map(i=>i.sev+':'+i.kind).join(' ')}` : 'no box');
  const r0 = an(c.strokes, c.opt).boxes[0]?.diag; console.log('orig', r0?.score?.total);
}
function png(W, H, rgba) {
  const raw = Buffer.alloc((W * 4 + 1) * H);
  for (let y = 0; y < H; y++) { raw[y * (W * 4 + 1)] = 0; Buffer.from(rgba.buffer, y * W * 4, W * 4).copy(raw, y * (W * 4 + 1) + 1); }
  const crc = (b) => { let c, k = -1; for (const x of b) { c = (k ^ x) & 255; for (let i = 0; i < 8; i++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1; k = (k >>> 8) ^ c; } return (k ^ -1) >>> 0; };
  const chunk = (t, b) => { const l = Buffer.alloc(4); l.writeUInt32BE(b.length); const tb = Buffer.concat([Buffer.from(t), b]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(tb)); return Buffer.concat([l, tb, c]); };
  const ih = Buffer.alloc(13); ih.writeUInt32BE(W, 0); ih.writeUInt32BE(H, 4); ih[8] = 8; ih[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ih), chunk("IDAT", zlib.deflateSync(raw)), chunk("IEND", Buffer.alloc(0))]);
}
fs.writeFileSync(out, png(W, H, d));
