// Рисует штрихи в картинку (RGBA) — имитация скриншота или фото рисунка для проверки распознавания.
export function rasterize(strokes, o) {
  const { W, H, k = 1, ox = 0, oy = 0, width = 2, rng = Math.random } = o;
  const cov = new Float32Array(W * H);
  const T = (p) => [ox + k * p[0], oy + k * p[1]];
  const seg = (a, b, w, alpha) => {
    const r = w / 2 + 1.5,
      x0 = Math.max(0, Math.floor(Math.min(a[0], b[0]) - r)),
      x1 = Math.min(W - 1, Math.ceil(Math.max(a[0], b[0]) + r)),
      y0 = Math.max(0, Math.floor(Math.min(a[1], b[1]) - r)),
      y1 = Math.min(H - 1, Math.ceil(Math.max(a[1], b[1]) + r)),
      dx = b[0] - a[0],
      dy = b[1] - a[1],
      L2 = dx * dx + dy * dy || 1e-9;
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const px = x + 0.5 - a[0],
          py = y + 0.5 - a[1],
          t = Math.max(0, Math.min(1, (px * dx + py * dy) / L2)),
          d = Math.hypot(px - t * dx, py - t * dy),
          c = Math.max(0, Math.min(1, w / 2 + 0.5 - d)) * alpha,
          i = y * W + x;
        if (c > cov[i]) cov[i] = c;
      }
  };
  for (const s of strokes) {
    const pts = s.pts.map(T),
      alpha = o.pencil ? 0.55 + 0.45 * rng() : 1,
      w = width * (o.pencil ? 0.8 + 0.4 * rng() : 1);
    if (s.hidden && o.dash !== false) {
      // пунктир: штрих 9 / пробел 7 (в единицах листа)
      const on = 9 * k,
        off = 7 * k;
      let acc = 0,
        draw = true;
      for (let i = 1; i < pts.length; i++) {
        let a = pts[i - 1];
        const b = pts[i],
          L = Math.hypot(b[0] - a[0], b[1] - a[1]);
        let t = 0;
        while (t < L) {
          const lim = (draw ? on : off) - acc,
            st = Math.min(lim, L - t),
            p = [a[0] + ((b[0] - a[0]) * (t + st)) / L, a[1] + ((b[1] - a[1]) * (t + st)) / L],
            q = [a[0] + ((b[0] - a[0]) * t) / L, a[1] + ((b[1] - a[1]) * t) / L];
          if (draw) seg(q, p, w, alpha);
          t += st;
          acc += st;
          if (acc >= (draw ? on : off) - 1e-9) (acc = 0), (draw = !draw);
        }
      }
    } else for (let i = 1; i < pts.length; i++) seg(pts[i - 1], pts[i], w, alpha);
  }
  const data = new Uint8ClampedArray(W * H * 4),
    ink = o.ink || [25, 25, 30],
    bg = o.bg || [255, 255, 255];
  // текстура карандаша: зернистость, пятна
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      const i = y * W + x;
      let c = cov[i];
      if (o.pencil && c > 0) c *= 0.45 + 0.55 * rng();
      const g = o.gradient ? 1 - o.gradient * (0.3 * (x / W) + 0.7 * (y / H)) : 1;
      for (let ch = 0; ch < 3; ch++) {
        let v = bg[ch] * g * (1 - c) + ink[ch] * c;
        if (o.noise) v += (rng() + rng() + rng() - 1.5) * o.noise * 2;
        data[i * 4 + ch] = v;
      }
      data[i * 4 + 3] = 255;
    }
  if (o.blur) {
    const src = data.slice();
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++)
        for (let ch = 0; ch < 3; ch++) {
          let s = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) s += src[((y + dy) * W + x + dx) * 4 + ch];
          data[(y * W + x) * 4 + ch] = s / 9;
        }
  }
  // посторонние элементы скриншота: рамка окна и надпись-клякса в углу
  if (o.chrome) {
    for (let x = 0; x < W; x++) for (let y = 0; y < 3; y++) data[(y * W + x) * 4] = data[(y * W + x) * 4 + 1] = data[(y * W + x) * 4 + 2] = 120;
    for (let y = 12; y < 26; y++) for (let x = 14; x < 90; x++) if ((x >> 2) % 2 && rng() < 0.6) data[(y * W + x) * 4] = data[(y * W + x) * 4 + 1] = data[(y * W + x) * 4 + 2] = 40;
  }
  return { width: W, height: H, data };
}
