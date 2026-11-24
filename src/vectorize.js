// Распознавание линий на картинке (скриншот, фото рисунка) → штрихи для проверки.
// Вход: { width, height, data: RGBA } (как ImageData). Работает и в браузере, и в Node (стенд bench/vectorize.mjs).
// Шаги: яркость → фон (размытый максимум) → порог с гистерезисом → чистка мусора и дырок →
// утончение до скелета (Zhang–Suen) → граф скелета → полилинии между узлами → обрезка «усиков».
var Vectorize = (() => {
  const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);

  function luminance(im) {
    const { width: W, height: H, data: d } = im,
      L = new Float32Array(W * H);
    for (let i = 0, j = 0; i < W * H; i++, j += 4) {
      const a = d[j + 3] / 255,
        l = 0.299 * d[j] + 0.587 * d[j + 1] + 0.114 * d[j + 2];
      L[i] = l * a + 255 * (1 - a);
    }
    return L;
  }

  function quantile(arr, q, step = 1) {
    const s = [];
    for (let i = 0; i < arr.length; i += step) s.push(arr[i]);
    s.sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.floor(q * s.length))] ?? 0;
  }

  // Усреднение блоками f×f (уменьшение толстых линий).
  function shrink(L, W, H, f) {
    const w = Math.floor(W / f),
      h = Math.floor(H / f),
      o = new Float32Array(w * h);
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        let s = 0;
        for (let dy = 0; dy < f; dy++) for (let dx = 0; dx < f; dx++) s += L[(y * f + dy) * W + x * f + dx];
        o[y * w + x] = s / (f * f);
      }
    return { L: o, W: w, H: h };
  }

  // Фон: максимум по блокам (стирает тёмные линии), расширение, размытие, билинейное растяжение обратно.
  function background(L, W, H) {
    const B = Math.max(2, Math.round(Math.max(W, H) / 400)),
      w = Math.ceil(W / B),
      h = Math.ceil(H / B);
    let m = new Float32Array(w * h).fill(0);
    for (let y = 0; y < H; y++)
      for (let x = 0; x < W; x++) {
        const k = ((y / B) | 0) * w + ((x / B) | 0);
        if (L[y * W + x] > m[k]) m[k] = L[y * W + x];
      }
    const dil = (a) => {
      const o = new Float32Array(w * h);
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          let v = 0;
          for (let dy = -1; dy <= 1; dy++)
            for (let dx = -1; dx <= 1; dx++) {
              const yy = clamp(y + dy, 0, h - 1),
                xx = clamp(x + dx, 0, w - 1);
              if (a[yy * w + xx] > v) v = a[yy * w + xx];
            }
          o[y * w + x] = v;
        }
      return o;
    };
    const blur = (a, r) => {
      const o = new Float32Array(w * h),
        t = new Float32Array(w * h);
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          let s = 0,
            n = 0;
          for (let dx = -r; dx <= r; dx++) {
            const xx = x + dx;
            if (xx >= 0 && xx < w) (s += a[y * w + xx]), n++;
          }
          t[y * w + x] = s / n;
        }
      for (let y = 0; y < h; y++)
        for (let x = 0; x < w; x++) {
          let s = 0,
            n = 0;
          for (let dy = -r; dy <= r; dy++) {
            const yy = y + dy;
            if (yy >= 0 && yy < h) (s += t[yy * w + x]), n++;
          }
          o[y * w + x] = s / n;
        }
      return o;
    };
    m = blur(dil(dil(m)), 3);
    const bg = new Float32Array(W * H);
    for (let y = 0; y < H; y++) {
      const fy = clamp((y + 0.5) / B - 0.5, 0, h - 1),
        y0 = Math.floor(fy),
        y1 = Math.min(h - 1, y0 + 1),
        ty = fy - y0;
      for (let x = 0; x < W; x++) {
        const fx = clamp((x + 0.5) / B - 0.5, 0, w - 1),
          x0 = Math.floor(fx),
          x1 = Math.min(w - 1, x0 + 1),
          tx = fx - x0;
        bg[y * W + x] =
          (m[y0 * w + x0] * (1 - tx) + m[y0 * w + x1] * tx) * (1 - ty) + (m[y1 * w + x0] * (1 - tx) + m[y1 * w + x1] * tx) * ty;
      }
    }
    return bg;
  }

  function otsu(d) {
    const hist = new Float64Array(256);
    for (let i = 0; i < d.length; i++) hist[clamp(Math.round(d[i]), 0, 255)]++;
    let tot = d.length,
      sum = 0;
    for (let i = 0; i < 256; i++) sum += i * hist[i];
    let sB = 0,
      wB = 0,
      best = 0,
      bt = 20;
    for (let t = 0; t < 256; t++) {
      wB += hist[t];
      if (!wB) continue;
      const wF = tot - wB;
      if (!wF) break;
      sB += t * hist[t];
      const mB = sB / wB,
        mF = (sum - sB) / wF,
        v = wB * wF * (mB - mF) ** 2;
      if (v > best) (best = v), (bt = t);
    }
    return bt;
  }

  const N8 = (W) => [-W - 1, -W, -W + 1, 1, W + 1, W, W - 1, -1]; // по часовой, начиная с северо-запада

  // Связные области (8-связность) маски с рамкой из нулей.
  function components(mask, W, H) {
    const lab = new Int32Array(W * H).fill(-1),
      comps = [],
      nb = N8(W),
      st = [];
    for (let s = 0; s < W * H; s++) {
      if (!mask[s] || lab[s] >= 0) continue;
      const c = { id: comps.length, area: 0, per: 0, x0: 1e9, y0: 1e9, x1: -1, y1: -1, px: [] };
      comps.push(c), (lab[s] = c.id), st.push(s);
      while (st.length) {
        const p = st.pop(),
          x = p % W,
          y = (p / W) | 0;
        c.area++, c.px.push(p);
        if (x < c.x0) c.x0 = x;
        if (x > c.x1) c.x1 = x;
        if (y < c.y0) c.y0 = y;
        if (y > c.y1) c.y1 = y;
        if (!mask[p - 1] || !mask[p + 1] || !mask[p - W] || !mask[p + W]) c.per++;
        for (const o of nb) {
          const q = p + o;
          if (mask[q] && lab[q] < 0) (lab[q] = c.id), st.push(q);
        }
      }
    }
    return comps;
  }

  // Дырки (замкнутые области фона) меньше maxArea заливаем: штрихи карандаша бывают «рваными».
  // Узкие щели (ширина до maxGap) — промежуток между двумя почти совпавшими штрихами (ребро обведено дважды).
  function fillHoles(mask, W, H, maxArea, maxGap) {
    const seen = new Uint8Array(W * H),
      inv = new Uint8Array(W * H),
      st = [];
    for (let i = 0; i < W * H; i++) inv[i] = mask[i] ? 0 : 1;
    const gap = distance(inv, W, H);
    for (let s = 0; s < W * H; s++) {
      if (mask[s] || seen[s]) continue;
      const px = [];
      let border = !1;
      (seen[s] = 1), st.push(s);
      while (st.length) {
        const p = st.pop(),
          x = p % W,
          y = (p / W) | 0;
        px.push(p);
        if (x <= 1 || y <= 1 || x >= W - 2 || y >= H - 2) border = !0;
        for (const q of [p - 1, p + 1, p - W, p + W])
          if (q >= 0 && q < W * H && !mask[q] && !seen[q]) (seen[q] = 1), st.push(q);
      }
      if (border) continue;
      let wide = 0;
      for (const p of px) if (gap[p] > wide) wide = gap[p];
      if (px.length <= maxArea || wide <= maxGap) for (const p of px) mask[p] = 1;
    }
  }

  function morph(mask, W, H, dilate) {
    const o = new Uint8Array(W * H);
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++) {
        const p = y * W + x;
        let v = dilate ? 0 : 1;
        for (let dy = -1; dy <= 1 && v === (dilate ? 0 : 1); dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const m = mask[p + dy * W + dx];
            if (dilate ? m : !m) {
              v = dilate ? 1 : 0;
              break;
            }
          }
        o[p] = v;
      }
    return o;
  }

  // Расстояние до ближайшего пикселя фона (фаска 1 / √2).
  function distance(m, W, H) {
    const d = new Float32Array(W * H),
      R = Math.SQRT2;
    for (let p = 0; p < W * H; p++) d[p] = m[p] ? 1e9 : 0;
    for (let y = 1; y < H - 1; y++)
      for (let x = 1; x < W - 1; x++) {
        const p = y * W + x;
        if (d[p]) d[p] = Math.min(d[p], d[p - 1] + 1, d[p - W] + 1, d[p - W - 1] + R, d[p - W + 1] + R);
      }
    for (let y = H - 2; y > 0; y--)
      for (let x = W - 2; x > 0; x--) {
        const p = y * W + x;
        if (d[p]) d[p] = Math.min(d[p], d[p + 1] + 1, d[p + W] + 1, d[p + W + 1] + R, d[p + W - 1] + R);
      }
    return d;
  }

  // Утончение Zhang–Suen.
  function thin(m, W, H) {
    let cand = [];
    for (let p = 0; p < W * H; p++) if (m[p]) cand.push(p);
    const nb = N8(W);
    let changed = !0;
    while (changed) {
      changed = !1;
      for (let it = 0; it < 2; it++) {
        const del = [];
        for (const p of cand) {
          if (!m[p]) continue;
          const v = nb.map((o) => m[p + o]); // P9 P2 P3 P4 P5 P6 P7 P8 → индексы 0..7 (P9=СЗ)
          // в обозначениях Zhang–Suen: P2=N, P3=NE, P4=E, P5=SE, P6=S, P7=SW, P8=W, P9=NW
          const P2 = v[1], P3 = v[2], P4 = v[3], P5 = v[4], P6 = v[5], P7 = v[6], P8 = v[7], P9 = v[0];
          const B = P2 + P3 + P4 + P5 + P6 + P7 + P8 + P9;
          if (B < 2 || B > 6) continue;
          const seq = [P2, P3, P4, P5, P6, P7, P8, P9, P2];
          let A = 0;
          for (let i = 0; i < 8; i++) if (!seq[i] && seq[i + 1]) A++;
          if (A !== 1) continue;
          if (it === 0 ? P2 * P4 * P6 || P4 * P6 * P8 : P2 * P4 * P8 || P2 * P6 * P8) continue;
          del.push(p);
        }
        for (const p of del) m[p] = 0;
        if (del.length) changed = !0;
      }
      cand = cand.filter((p) => m[p]);
    }
    // «Ступеньки»: угловой пиксель между двумя соседями, которые и так связаны по диагонали.
    for (const p of cand) {
      if (!m[p]) continue;
      const n = m[p - W], e = m[p + 1], s = m[p + W], w = m[p - 1];
      if (
        (n && e && !s && !w && !m[p + W - 1]) ||
        (e && s && !n && !w && !m[p - W - 1]) ||
        (s && w && !n && !e && !m[p - W + 1]) ||
        (w && n && !s && !e && !m[p + W + 1])
      )
        m[p] = 0;
    }
    return m;
  }

  // Граф скелета: узлы — концы и развилки (кластеры соседних пикселей), рёбра — цепочки пикселей.
  function graph(m, W, H) {
    const nb = N8(W),
      deg = new Uint8Array(W * H),
      px = [];
    for (let p = 0; p < W * H; p++)
      if (m[p]) {
        px.push(p);
        let d = 0;
        for (const o of nb) d += m[p + o];
        deg[p] = d;
      }
    const isNode = (p) => m[p] && deg[p] !== 2,
      cl = new Int32Array(W * H).fill(-1),
      nodes = [];
    for (const s of px) {
      if (!isNode(s) || cl[s] >= 0 || deg[s] === 0) continue;
      const n = { id: nodes.length, x: 0, y: 0, k: 0, ends: [] },
        st = [s];
      nodes.push(n), (cl[s] = n.id);
      while (st.length) {
        const p = st.pop();
        (n.x += p % W), (n.y += (p / W) | 0), n.k++;
        for (const o of nb) {
          const q = p + o;
          if (isNode(q) && cl[q] < 0) (cl[q] = n.id), st.push(q);
        }
      }
      (n.x /= n.k), (n.y /= n.k);
    }
    const vis = new Uint8Array(W * H),
      edges = [],
      xy = (p) => [p % W, (p / W) | 0];
    const walk = (start, first) => {
      const pts = [],
        a = cl[start];
      let prev = start,
        cur = first,
        b = -1;
      if (a >= 0) pts.push([nodes[a].x, nodes[a].y]);
      else pts.push(xy(start));
      for (let guard = 0; guard < W * H; guard++) {
        if (cl[cur] >= 0) {
          b = cl[cur];
          pts.push([nodes[b].x, nodes[b].y]);
          break;
        }
        vis[cur] = 1;
        pts.push(xy(cur));
        let nx = -1;
        for (const o of nb) {
          const q = cur + o;
          if (q !== prev && m[q] && (cl[q] >= 0 || !vis[q])) {
            // к узлу — в первую очередь
            if (nx < 0 || cl[q] >= 0) nx = q;
            if (cl[q] >= 0 && cl[q] !== a) break;
          }
        }
        if (nx < 0 || (cl[nx] < 0 && vis[nx])) break;
        if (cl[nx] >= 0 && cl[nx] === a && pts.length < 3) {
          // сразу вернулись в тот же узел — петля из пары пикселей
        }
        (prev = cur), (cur = nx);
      }
      return { a, b, pts };
    };
    for (const n of nodes) n.ends = [];
    for (const s of px) {
      if (cl[s] < 0) continue;
      for (const o of nb) {
        const q = s + o;
        if (m[q] && cl[q] < 0 && !vis[q]) {
          const e = walk(s, q);
          if (e.pts.length >= 2) edges.push(e);
        }
      }
    }
    // замкнутые петли без узлов
    for (const s of px) {
      if (vis[s] || cl[s] >= 0 || deg[s] !== 2) continue;
      vis[s] = 1;
      let q = -1;
      for (const o of nb) if (m[s + o]) q = s + o;
      const e = walk(s, q);
      e.pts.push(xy(s));
      e.a = e.b = -1;
      edges.push(e);
    }
    return { nodes, edges };
  }

  const plen = (pts) => {
    let s = 0;
    for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    return s;
  };

  // Чистка графа: убираем короткие «усики» у развилок, склеиваем рёбра в узлах степени 2.
  function cleanGraph(G, sw) {
    let edges = G.edges.filter((e) => e.pts.length >= 2);
    const degOf = () => {
      const d = new Map();
      for (const e of edges) {
        if (e.a >= 0) d.set(e.a, (d.get(e.a) || 0) + 1);
        if (e.b >= 0) d.set(e.b, (d.get(e.b) || 0) + 1);
      }
      return d;
    };
    const at = (pts, s) => {
      let acc = 0;
      for (let i = 1; i < pts.length; i++) {
        const L = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        if (acc + L >= s) {
          const t = (s - acc) / (L || 1);
          return { p: [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t], i };
        }
        acc += L;
      }
      return { p: pts[pts.length - 1], i: pts.length - 1 };
    };
    // Склейка двух кусков в узле: если они продолжают друг друга, загиб скелета у узла заменяем прямым мостиком.
    const join = (p1, p2) => {
      const r1 = p1.slice().reverse(),
        l1 = plen(r1),
        l2 = plen(p2),
        s1 = Math.min(0.45 * l1, 1.6 * sw + 3),
        s2 = Math.min(0.45 * l2, 1.6 * sw + 3),
        A1 = at(r1, s1),
        B1 = at(r1, Math.min(l1, s1 + 6 * sw + 12)),
        A2 = at(p2, s2),
        B2 = at(p2, Math.min(l2, s2 + 6 * sw + 12)),
        d1 = [B1.p[0] - A1.p[0], B1.p[1] - A1.p[1]],
        d2 = [B2.p[0] - A2.p[0], B2.p[1] - A2.p[1]],
        c = (d1[0] * d2[0] + d1[1] * d2[1]) / ((Math.hypot(...d1) * Math.hypot(...d2)) || 1);
      if (c > -Math.cos((30 * Math.PI) / 180)) return p1.concat(p2.slice(1)); // излом — оставляем как есть
      const a = r1.slice(A1.i).reverse(),
        b = p2.slice(A2.i);
      a[a.length - 1] = A1.p;
      b[0] = A2.p;
      const br = [],
        L = Math.hypot(b[0][0] - a[a.length - 1][0], b[0][1] - a[a.length - 1][1]);
      for (let t = 1; t < L; t++) br.push([A1.p[0] + ((A2.p[0] - A1.p[0]) * t) / L, A1.p[1] + ((A2.p[1] - A1.p[1]) * t) / L]);
      return a.concat(br, b);
    };
    const spur = 1.5 * sw + 4;
    for (let round = 0; round < 6; round++) {
      let changed = !1,
        d = degOf();
      edges = edges.filter((e) => {
        const L = plen(e.pts),
          da = e.a >= 0 ? d.get(e.a) : 1,
          db = e.b >= 0 ? d.get(e.b) : 1;
        if (e.a >= 0 && e.a === e.b && L < 5 * sw + 6) return (changed = !0), !1; // крошечная петля у развилки
        if (((da === 1 && db >= 3) || (db === 1 && da >= 3)) && L < spur) return (changed = !0), !1;
        return !0;
      });
      d = degOf();
      // склейка в узлах степени 2
      for (const [n, k] of d) {
        if (k !== 2) continue;
        const two = edges.filter((e) => e.a === n || e.b === n);
        if (two.length !== 2) continue;
        let [e1, e2] = two;
        const p1 = e1.b === n ? e1.pts : e1.pts.slice().reverse(),
          o1 = e1.b === n ? e1.a : e1.b;
        const p2 = e2.a === n ? e2.pts : e2.pts.slice().reverse(),
          o2 = e2.a === n ? e2.b : e2.a;
        if (o1 === n || o2 === n) continue;
        const ne = { a: o1, b: o2, pts: join(p1, p2) };
        edges = edges.filter((e) => e !== e1 && e !== e2);
        edges.push(ne);
        changed = !0;
      }
      if (!changed) break;
    }
    // Продолжение через развилку: при пересечении (X) или касании (T) линия, проходящая насквозь,
    // распадается на куски. Склеиваем пары «рукавов», которые продолжают друг друга по прямой.
    // Две развилки на расстоянии толщины линии — это одна развилка (пологое пересечение): стягиваем.
    for (let guard = 0; guard < 200; guard++) {
      const d = degOf(),
        e = edges.find((e) => e.a >= 0 && e.b >= 0 && e.a !== e.b && d.get(e.a) >= 3 && d.get(e.b) >= 3 && plen(e.pts) < 2.2 * sw + 4);
      if (!e) break;
      const keep = e.a,
        gone = e.b,
        c = e.pts[0];
      edges = edges.filter((x) => x !== e);
      for (const x of edges) {
        if (x.a === gone) (x.a = keep), (x.pts = [c, ...x.pts]);
        if (x.b === gone) (x.b = keep), (x.pts = [...x.pts, c]);
      }
    }
    const junction = new Set();
    for (let guard = 0; guard < 400; guard++) {
      const d = degOf();
      let best = null;
      for (const [n, k] of d) {
        // после склейки одной пары на перекрёстке (X) остаётся вторая — у неё тоже пробуем
        if (k < 2 || (k === 2 && !junction.has(n))) continue;
        const inc = edges.filter((e) => e.a === n || e.b === n);
        if (inc.some((e) => e.a === n && e.b === n)) continue;
        // «Тело» рукава: без загибов скелета у этой развилки и у развилки на другом конце.
        const near = 1.6 * sw + 3,
          cap = 10 * sw + 40;
        const arms = inc.map((e) => {
          const pts = e.a === n ? e.pts : e.pts.slice().reverse(),
            other = e.a === n ? e.b : e.a,
            len = plen(pts),
            s1 = Math.min(0.45 * len, near),
            s2 = Math.min(len - Math.min(0.45 * len, other >= 0 && d.get(other) >= 3 ? near : 0), s1 + cap),
            A = at(pts, s1),
            B = at(pts, s2),
            body = pts.slice(A.i, Math.max(A.i + 1, B.i)).concat([B.p]),
            dx = B.p[0] - A.p[0],
            dy = B.p[1] - A.p[1],
            l = Math.hypot(dx, dy) || 1;
          return { e, pts, len, cut: A, body, d: [dx / l, dy / l], other };
        });
        const node = edges.find((e) => e.a === n) ? edges.find((e) => e.a === n).pts[0] : edges.find((e) => e.b === n).pts.slice(-1)[0];
        for (let i = 0; i < arms.length; i++)
          for (let j = i + 1; j < arms.length; j++) {
            const x = arms[i],
              y = arms[j],
              c = x.d[0] * y.d[0] + x.d[1] * y.d[1];
            if (c > -Math.cos((25 * Math.PI) / 180)) continue;
            // одна прямая через оба рукава: главная ось облака точек
            const P = x.body.concat(y.body);
            let mx = 0,
              my = 0;
            for (const p of P) (mx += p[0]), (my += p[1]);
            (mx /= P.length), (my /= P.length);
            let sxx = 0,
              syy = 0,
              sxy = 0;
            for (const p of P) (sxx += (p[0] - mx) ** 2), (syy += (p[1] - my) ** 2), (sxy += (p[0] - mx) * (p[1] - my));
            const th = 0.5 * Math.atan2(2 * sxy, sxx - syy),
              nx = -Math.sin(th),
              ny = Math.cos(th);
            let ss = 0;
            for (const p of P) ss += ((p[0] - mx) * nx + (p[1] - my) * ny) ** 2;
            const rms = Math.sqrt(ss / P.length),
              off = Math.abs((node[0] - mx) * nx + (node[1] - my) * ny);
            if (rms > Math.max(1.2, 0.3 * sw + 1) || off > 2.5 * sw + 3) continue;
            const score = rms + 0.1 * off;
            if (!best || score < best.score) best = { score, n, x, y };
          }
      }
      if (!best) break;
      const { x, y, n } = best,
        px = x.pts.slice(x.cut.i).reverse(),
        py = y.pts.slice(y.cut.i);
      px[px.length - 1] = x.cut.p;
      py[0] = y.cut.p;
      // мост через узел — прямой отрезок с шагом в пиксель
      const br = [],
        L = Math.hypot(py[0][0] - x.cut.p[0], py[0][1] - x.cut.p[1]);
      for (let t = 1; t < L; t++) br.push([x.cut.p[0] + ((py[0][0] - x.cut.p[0]) * t) / L, x.cut.p[1] + ((py[0][1] - x.cut.p[1]) * t) / L]);
      const ne = { a: x.other, b: y.other, pts: px.concat(br, py) };
      edges = edges.filter((e) => e !== x.e && e !== y.e);
      edges.push(ne);
      junction.add(n);
    }
    edges.junction = junction;
    return edges;
  }

  // Сглаживание лесенки пикселей и равномерная расстановка точек.
  function smooth(pts, r) {
    if (pts.length < 5) return pts;
    const o = pts.map((p) => p.slice());
    for (let i = 1; i < pts.length - 1; i++) {
      let sx = 0,
        sy = 0,
        n = 0;
      for (let j = Math.max(0, i - r); j <= Math.min(pts.length - 1, i + r); j++) (sx += pts[j][0]), (sy += pts[j][1]), n++;
      o[i] = [sx / n, sy / n];
    }
    return o;
  }
  function resample(pts, step) {
    const out = [pts[0]];
    let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1],
        b = pts[i],
        L = Math.hypot(b[0] - a[0], b[1] - a[1]);
      let t = 0;
      while (acc + (L - t) >= step) {
        t += step - acc;
        acc = 0;
        out.push([a[0] + ((b[0] - a[0]) * t) / L, a[1] + ((b[1] - a[1]) * t) / L]);
      }
      acc += L - t;
    }
    const last = pts[pts.length - 1],
      lo = out[out.length - 1];
    if (Math.hypot(last[0] - lo[0], last[1] - lo[1]) > step * 0.3) out.push(last);
    else out[out.length - 1] = last;
    return out;
  }
  // Обрезка у развилок (там скелет толстых линий кривится к центру) и продление свободных концов на полтолщины.
  // Резкие изломы (угол коробки, нарисованный одним штрихом; у толстых линий он скруглён) — режем:
  // каждая половина потом продлевается по прямой до угла.
  function splitCorners(pts, sw) {
    const n = pts.length,
      cl = [0];
    for (let i = 1; i < n; i++) cl.push(cl[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const w = Math.max(6, 2 * sw + 3),
      cand = [];
    let j0 = 0,
      j1 = 0;
    for (let i = 0; i < n; i++) {
      while (j0 < i && cl[i] - cl[j0 + 1] >= w) j0++;
      while (j1 < n - 1 && cl[j1] - cl[i] < w) j1++;
      if (cl[i] - cl[j0] < w || cl[j1] - cl[i] < w) continue;
      const ax = pts[i][0] - pts[j0][0],
        ay = pts[i][1] - pts[j0][1],
        bx = pts[j1][0] - pts[i][0],
        by = pts[j1][1] - pts[i][1],
        ang = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by));
      if (ang > (35 * Math.PI) / 180) cand.push({ i, ang });
    }
    cand.sort((a, b) => b.ang - a.ang);
    const cuts = [];
    for (const c of cand) if (cuts.every((k) => Math.abs(cl[k] - cl[c.i]) > 2 * w)) cuts.push(c.i);
    cuts.sort((a, b) => a - b);
    const out = [];
    let s = 0;
    for (const k of cuts) out.push(pts.slice(s, k + 1)), (s = k);
    out.push(pts.slice(s));
    return out;
  }
  // flags: aJ/bJ — конец у развилки или угла (обрезать загиб и дотянуть до узла), aF/bF — свободный конец.
  function trimEnds(pts, sw, fl) {
    const cut = 0.75 * sw + 1,
      total = plen(pts);
    const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
    // У развилки скелет толстых линий загибается к центру: этот кусок отрезаем, а ровную часть
    // продлеваем по прямой до точки напротив центра развилки — там рёбра и сходятся.
    const trim = (arr) => {
      const c = arr[0];
      let i = 1;
      while (i < arr.length - 2 && dist(arr[i], c) < cut) i++;
      const rest = arr.slice(i),
        a = rest[0];
      let j = 0,
        acc = 0;
      while (j < rest.length - 1 && acc < 4 * sw + 8) (acc += dist(rest[j], rest[j + 1])), j++;
      const b = rest[j],
        L = dist(a, b);
      if (L < 2) return rest;
      const u = [(a[0] - b[0]) / L, (a[1] - b[1]) / L],
        t = Math.min((c[0] - a[0]) * u[0] + (c[1] - a[1]) * u[1], cut + sw);
      return t > 0.5 ? [[a[0] + u[0] * t, a[1] + u[1] * t], ...rest] : rest;
    };
    const extend = (arr) => {
      const a = arr[0],
        j = Math.min(arr.length - 1, Math.max(1, Math.round(sw * 2))),
        b = arr[j],
        L = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (L < 1e-6) return arr;
      const k = (0.5 * sw) / L;
      return [[a[0] + (a[0] - b[0]) * k, a[1] + (a[1] - b[1]) * k], ...arr.slice(1)];
    };
    if (total > 4 * cut) {
      if (fl.aJ) pts = trim(pts);
      if (fl.bJ) pts = trim(pts.slice().reverse()).reverse();
    }
    if (fl.aF) pts = extend(pts);
    if (fl.bF) pts = extend(pts.slice().reverse()).reverse();
    return pts;
  }

  function vectorize(im, opt = {}) {
    let W = im.width,
      H = im.height,
      L = luminance(im),
      f = 1;
    if (W < 16 || H < 16) return { error: "small", strokes: [] };
    // Тёмный фон (тёмная тема, мел на доске): переворачиваем яркость.
    const inverted = quantile(L, 0.5, Math.max(1, (L.length / 20000) | 0)) < 110;
    if (inverted) for (let i = 0; i < L.length; i++) L[i] = 255 - L[i];

    const binarize = (L, W, H) => {
      const bg = background(L, W, H),
        d = new Float32Array(W * H);
      for (let i = 0; i < d.length; i++) d[i] = Math.max(0, bg[i] - L[i]);
      const step = Math.max(1, (d.length / 40000) | 0),
        med = quantile(d, 0.5, step),
        q75 = quantile(d, 0.75, step),
        T = clamp(Math.max(0.6 * otsu(d), med + 5 * Math.max(1, q75 - med) + 4), 12, 100),
        lo = Math.max(7, 0.45 * T);
      // маска с рамкой в 1 пиксель из нулей
      const m = new Uint8Array(W * H),
        st = [];
      for (let y = 1; y < H - 1; y++)
        for (let x = 1; x < W - 1; x++) {
          const p = y * W + x;
          if (d[p] > T) (m[p] = 1), st.push(p);
        }
      const nb = N8(W);
      while (st.length) {
        const p = st.pop();
        for (const o of nb) {
          const q = p + o,
            x = q % W,
            y = (q / W) | 0;
          if (!m[q] && x > 0 && y > 0 && x < W - 1 && y < H - 1 && d[q] > lo) (m[q] = 1), st.push(q);
        }
      }
      return { m, T };
    };

    let { m, T } = binarize(L, W, H),
      comps = components(m, W, H);
    const est = (cs) => {
      let a = 0,
        p = 0;
      for (const c of cs) if (c.area > 12) (a += c.area), (p += c.per);
      return p ? (2 * a) / p : 1;
    };
    let sw = est(comps);
    // Толстые линии: уменьшаем картинку, чтобы скелет получался ровным и быстрым.
    if (sw > 7) {
      f = Math.max(2, Math.round(sw / 3.5));
      const s = shrink(L, W, H, f);
      (L = s.L), (W = s.W), (H = s.H);
      ({ m, T } = binarize(L, W, H));
      comps = components(m, W, H);
      sw = est(comps);
    }
    const inkAll = comps.reduce((s, c) => s + c.area, 0);
    if (!inkAll) return { error: "empty", strokes: [] };
    if (inkAll > 0.2 * W * H) return { error: "busy", strokes: [] };

    // Что оставить: крупные области — сам рисунок; мелкие — только рядом с ним (пунктир), без пылинок.
    const diagImg = Math.hypot(W, H),
      big = comps.filter((c) => Math.hypot(c.x1 - c.x0, c.y1 - c.y0) >= 0.04 * diagImg),
      frame = (c) =>
        (c.x0 <= 2 || c.y0 <= 2 || c.x1 >= W - 3 || c.y1 >= H - 3) &&
        (c.x1 - c.x0 > 0.85 * W || c.y1 - c.y0 > 0.85 * H) &&
        c.area < 0.02 * W * H + 4 * (W + H) * Math.max(1, sw);
    let main = big.filter((c) => !frame(c));
    if (!main.length) main = comps.filter((c) => !frame(c)).sort((a, b) => b.area - a.area).slice(0, 1);
    if (!main.length) return { error: "empty", strokes: [] };
    let bx0 = 1e9, by0 = 1e9, bx1 = -1, by1 = -1;
    for (const c of main) (bx0 = Math.min(bx0, c.x0)), (by0 = Math.min(by0, c.y0)), (bx1 = Math.max(bx1, c.x1)), (by1 = Math.max(by1, c.y1));
    const pad = 0.12 * Math.max(bx1 - bx0, by1 - by0, 10),
      minDiag = Math.max(3, 1.2 * sw);
    const keep = comps.filter(
      (c) =>
        main.includes(c) ||
        (!frame(c) &&
          Math.hypot(c.x1 - c.x0, c.y1 - c.y0) >= minDiag &&
          c.x0 >= bx0 - pad && c.x1 <= bx1 + pad && c.y0 >= by0 - pad && c.y1 <= by1 + pad),
    );
    let mk = new Uint8Array(W * H);
    for (const c of keep) for (const p of c.px) mk[p] = 1;
    fillHoles(mk, W, H, Math.max(12, Math.round(4 * sw * sw)), 0.6 * sw + 1.5);
    if (sw >= 3.5) mk = morph(morph(mk, W, H, !0), W, H, !1);
    for (let x = 0; x < W; x++) (mk[x] = 0), (mk[(H - 1) * W + x] = 0);
    for (let y = 0; y < H; y++) (mk[y * W] = 0), (mk[y * W + W - 1] = 0);
    const dt = distance(mk, W, H);
    thin(mk, W, H);
    // толщина линии — удвоенное расстояние от скелета до края (медиана по скелету)
    const rad = [];
    for (let p = 0; p < W * H; p++) if (mk[p]) rad.push(dt[p]);
    sw = clamp(rad.length ? 2 * quantile(rad, 0.5) - 1 : sw, 1, 12);

    const G = graph(mk, W, H);
    let edges = cleanGraph(G, sw);
    const junction = edges.junction;
    const deg = new Map();
    for (const e of edges) {
      if (e.a >= 0) deg.set(e.a, (deg.get(e.a) || 0) + 1);
      if (e.b >= 0) deg.set(e.b, (deg.get(e.b) || 0) + 1);
    }
    const minLen = Math.max(2.5, 0.8 * sw); // штрих пунктира короче своей ширины на скелете
    edges = edges.filter((e) => plen(e.pts) >= minLen || (e.a >= 0 && deg.get(e.a) >= 3) || (e.b >= 0 && deg.get(e.b) >= 3));
    if (edges.length > 700) return { error: "busy", strokes: [] };
    const strokes = [];
    for (const e of edges) {
      // конец «ножки» буквы T уже лежит на пересекаемой линии — его не трогаем
      const isJ = (n) => n >= 0 && deg.get(n) >= 3,
        isF = (n) => n < 0 || (deg.get(n) === 1 && !junction.has(n)),
        pieces = splitCorners(smooth(e.pts, 2), sw);
      pieces.forEach((pc, i) => {
        let pts = trimEnds(pc, sw, {
          aJ: i > 0 || isJ(e.a),
          bJ: i < pieces.length - 1 || isJ(e.b),
          aF: i === 0 && isF(e.a),
          bF: i === pieces.length - 1 && isF(e.b),
        });
        if (plen(pts) < Math.max(3, 1.2 * sw)) return;
        pts = resample(pts, 1.5);
        strokes.push(pts.map((p) => [(p[0] + 0.5) * f, (p[1] + 0.5) * f]));
      });
    }
    if (!strokes.length) return { error: "empty", strokes: [] };
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const s of strokes) for (const p of s) (x0 = Math.min(x0, p[0])), (y0 = Math.min(y0, p[1])), (x1 = Math.max(x1, p[0])), (y1 = Math.max(y1, p[1]));
    return { strokes, bbox: [x0, y0, x1, y1], strokeWidth: sw * f, inverted, threshold: T, scale: f };
  }

  // Размещение на листе: рисунок по центру, с полями. Возвращает штрихи в координатах листа и рамку картинки.
  function place(res, im, page, fill = 0.78) {
    const [x0, y0, x1, y1] = res.bbox,
      bw = Math.max(1, x1 - x0),
      bh = Math.max(1, y1 - y0),
      k = Math.min((page.w * fill) / bw, (page.h * fill) / bh),
      ox = page.w / 2 - k * (x0 + bw / 2),
      oy = page.h / 2 - k * (y0 + bh / 2),
      T = (p) => [Math.round((ox + k * p[0]) * 10) / 10, Math.round((oy + k * p[1]) * 10) / 10];
    const strokes = res.strokes.map((s) => {
      // в листе — точки примерно через 3 единицы, как у обычного рисования мышью
      const st = Math.max(1, Math.round(3 / (1.5 * k)));
      const pts = s.filter((_, i) => i % st === 0 || i === s.length - 1).map(T);
      return { pts, hidden: !1 };
    });
    return { strokes, rect: { x: ox, y: oy, w: im.width * k, h: im.height * k }, k };
  }

  const api = { vectorize, place };
  return api;
})();
if (typeof self !== "undefined") self.Vectorize = Vectorize;
