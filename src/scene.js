// Тренажёр «Сцена»: случайная стопка предметов (кубы, коробки, цилиндры, диски) в настоящей перспективе.
// Видно, как горизонтальные рёбра каждого предмета уходят в свои точки схода на линии горизонта;
// горизонт (высоту глаз) можно поднимать и опускать, сцену — поворачивать и перегенерировать.
// Камера смотрит горизонтально (двухточечная перспектива: вертикали остаются вертикальными).
(() => {
  const $ = (id) => document.getElementById(id);
  const PW = 1600, MID_Y = 520, CX = PW / 2;
  const KEY = "perspective-checker.scene.v1";
  const KINDS = ["cube", "box", "cyl", "disc"];
  const NAMES = { cube: "куб", box: "коробка", cyl: "цилиндр", disc: "диск" };
  const S = {
    seed: 1 + Math.floor(Math.random() * 999999),
    layout: "mix",
    types: { cube: !0, box: !0, cyl: !0, disc: !0 },
    t: 0.42,
    orbit: 0,
    same: !1,
    free: !1, // свободная камера: смотрит на середину сцены, вертикали сходятся
    dist: 1, // расстояние до сцены относительно обычного
    off: [], // спрятанные предметы (номера) этой сцены
    offKey: "",
    show: { vp: !0, hor: !0, ell: !1, axis: !0, hid: !1 },
    tab: "check",
  };
  try {
    const s = JSON.parse(localStorage.getItem(KEY) || "null");
    if (s) Object.assign(S, s, { show: { ...S.show, ...(s.show || {}) }, types: { ...S.types, ...(s.types || {}) } });
  } catch {}
  const save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(S));
    } catch {}
  };

  // ---------- генерация сцены ----------
  const rngOf = (seed) => {
    let a = ((seed * 2654435761) ^ 0x6d2b79f5) >>> 0;
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  function generate(seed, layout, types) {
    const rnd = rngOf(seed),
      R = (a, b) => a + (b - a) * rnd(),
      pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    let kinds = KINDS.filter((k) => types[k]);
    if (!kinds.length) kinds = ["cube"];
    const nStacks = layout === "stack" ? 1 : layout === "row" ? 2 + Math.floor(rnd() * 3) : 2 + Math.floor(rnd() * 2);
    const stacks = [];
    for (let k = 0; k < nStacks; k++) {
      const want =
        layout === "stack" ? 3 + Math.floor(rnd() * 2) : layout === "row" ? 1 + (rnd() < 0.25 ? 1 : 0) : 1 + Math.floor(rnd() * 3);
      const objs = [];
      let y = 0,
        sup = null,
        cx = 0,
        cz = 0;
      for (let i = 0; i < want; i++) {
        let type = pick(kinds);
        // тонкий диск в основании стопки — только если других предметов не выбрано
        if (!sup && type === "disc" && want > 1 && kinds.length > 1) type = pick(kinds.filter((t) => t !== "disc"));
        const L = sup ? sup.inR : 0;
        if (sup && L < 0.26) break;
        const o = { type, th: R(0, Math.PI / 2), y0: y };
        if (type === "cube") {
          const s = sup ? Math.min(1.6, 1.41 * L) * R(0.62, 0.97) : R(1.0, 1.6);
          o.w = o.d = o.h = s;
        } else if (type === "box") {
          (o.w = R(0.8, 2.0)), (o.d = R(0.6, 1.4)), (o.h = R(0.35, 1.2));
          if (sup) {
            const q = Math.min(1, (2 * L * 0.97) / Math.hypot(o.w, o.d));
            (o.w *= q), (o.d *= q), (o.h *= Math.max(0.55, q));
          }
        } else if (type === "cyl") {
          o.r = sup ? L * R(0.55, 0.95) : R(0.45, 0.85);
          o.h = o.r * R(1.2, 2.6);
        } else {
          o.r = sup ? L * R(0.7, 1.0) : R(0.6, 1.0);
          o.h = R(0.08, 0.16);
        }
        o.fr = o.r || Math.hypot(o.w, o.d) / 2; // радиус описанного круга основания
        o.inR = o.r || Math.min(o.w, o.d) / 2; // радиус круга, вписанного в верх: на нём стоит следующий
        if (sup) {
          const slack = Math.max(0, L - o.fr) * 0.6,
            a = R(0, 2 * Math.PI),
            m = slack * rnd();
          (cx += Math.cos(a) * m), (cz += Math.sin(a) * m);
        }
        (o.ox = cx), (o.oz = cz);
        objs.push(o);
        y += o.h;
        sup = o;
      }
      stacks.push({ objs, rad: Math.max(...objs.map((o) => Math.hypot(o.ox, o.oz) + o.fr)), H: y });
    }
    // расстановка стопок на полу без пересечений
    const gap = 0.35;
    if (layout === "row") {
      let x = 0;
      stacks.forEach((st, i) => {
        if (i) x += stacks[i - 1].rad + gap + st.rad + R(0, 0.5);
        (st.x = x), (st.z = R(-0.8, 0.8));
      });
    } else {
      let A = stacks.reduce((s, st) => s + st.rad, 0) * 0.9 + 0.5;
      stacks.forEach((st, i) => {
        for (let tries = 0; ; tries++) {
          (st.x = R(-A, A)), (st.z = R(-0.75 * A, 0.75 * A));
          if (stacks.slice(0, i).every((q) => Math.hypot(q.x - st.x, q.z - st.z) >= q.rad + st.rad + gap)) break;
          if (tries % 40 === 39) A *= 1.15;
        }
      });
    }
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (const st of stacks) (x0 = Math.min(x0, st.x - st.rad)), (x1 = Math.max(x1, st.x + st.rad)), (z0 = Math.min(z0, st.z - st.rad)), (z1 = Math.max(z1, st.z + st.rad));
    for (const st of stacks) (st.x -= (x0 + x1) / 2), (st.z -= (z0 + z1) / 2);
    let n = 0;
    for (const st of stacks) for (const o of st.objs) o.color = n++;
    return { stacks, sameTh: R(0.2, Math.PI / 2 - 0.2), n };
  }

  // ---------- камера и геометрия ----------
  let scene = null,
    F = null; // кадр: камера, предметы в координатах камеры, порядок рисования
  function frame() {
    const phi = (S.orbit * Math.PI) / 180,
      c = Math.cos(phi),
      s = Math.sin(phi);
    const Rs = Math.max(...scene.stacks.map((st) => Math.hypot(st.x, st.z) + st.rad)),
      Htot = Math.max(...scene.stacks.map((st) => st.H)),
      // камера близко: перспектива заметная, но край сцены не дальше ~30° от центра взгляда
      D0 = Math.max(2.0 * Rs + 1.5, 1.7 * Htot + 1.5, 4.5),
      // «Расстояние»: камера ближе или дальше, а сцена на экране того же размера (f растёт вместе с D) —
      // меняется только сила перспективы
      D = D0 * S.dist,
      f = Math.min((1000 * D0) / (2 * Rs + 0.6), (600 * D0) / Math.max(Htot, 0.8)) * S.dist,
      hmin = 0.05,
      hmax = Math.max(Htot * 2.3 + 1.2, 0.85 * D0),
      h = hmin + S.t * (hmax - hmin),
      // Обычная камера смотрит горизонтально (вертикали вертикальны), сцена удерживается в кадре сдвигом
      // объектива. Свободная камера смотрит на середину сцены: наклон даёт третью точку схода — вертикалей.
      pitch = S.free ? Math.atan2(Htot / 2 - h, D) : 0,
      sp = Math.sin(pitch),
      cp = Math.cos(pitch),
      cy0 = S.free ? MID_Y : MID_Y + (f * (Htot / 2 - h)) / D,
      hy = cy0 + f * Math.tan(pitch);
    const P = (x, y, z) => {
      const ry = y - h,
        rz = z + D,
        yc = ry * cp - rz * sp,
        zc = Math.max(1e-3, ry * sp + rz * cp);
      return [CX + (f * x) / zc, cy0 - (f * yc) / zc];
    };
    // точка схода горизонтального направления (dx, dz) — всегда на линии горизонта
    const VP = (dx, dz) => (Math.abs(dz * cp) < 1e-9 || Math.abs(dx / dz) > 60 ? null : [CX + (f * dx) / (dz * cp), hy]);
    const vpY = Math.abs(sp) < 0.02 ? null : [CX, cy0 - (f * cp) / sp];
    const objs = [];
    scene.stacks.forEach((st, si) => {
      const sx = st.x * c - st.z * s,
        sz = st.x * s + st.z * c;
      st.cx = sx;
      st.cz = sz;
      st.objs.forEach((o, oi) => {
        const rx = o.ox * c - o.oz * s,
          rz = o.ox * s + o.oz * c;
        objs.push({ ...o, si, oi, X: sx + rx, Z: sz + rz, TH: (S.same ? scene.sameTh : o.th) + phi });
      });
    });
    F = { D, f, h, hy, hmin, hmax, Htot, P, VP, vpY, pitch, cam: [0, h, -D], objs };
    objs.forEach((o, i) => ((o.i = i), Object.assign(o, o.type === "cube" || o.type === "box" ? boxGeo(o) : cylGeo(o))));
    F.order = drawOrder();
  }

  const shown = (o) => !S.off.includes(o.i);
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

  // Коробка: 8 углов, 6 граней с наружными нормалями, 12 рёбер; ребро видно, если видна одна из его граней.
  function boxGeo(o) {
    const u = [Math.cos(o.TH), Math.sin(o.TH)],
      v = [-u[1], u[0]],
      hw = o.w / 2,
      hd = o.d / 2;
    const base = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [o.X + a * hw * u[0] + b * hd * v[0], o.Z + a * hw * u[1] + b * hd * v[1]]);
    const V3 = [...base.map((p) => [p[0], o.y0, p[1]]), ...base.map((p) => [p[0], o.y0 + o.h, p[1]])];
    const nrm = [[-v[0], 0, -v[1]], [u[0], 0, u[1]], [v[0], 0, v[1]], [-u[0], 0, -u[1]]];
    const faces = [
      { v: [0, 1, 2, 3], n: [0, -1, 0] },
      { v: [4, 5, 6, 7], n: [0, 1, 0] },
      ...[0, 1, 2, 3].map((k) => ({ v: [k, (k + 1) % 4, ((k + 1) % 4) + 4, k + 4], n: nrm[k] })),
    ];
    faces.forEach((fc) => (fc.vis = dot(sub(F.cam, V3[fc.v[0]]), fc.n) > 1e-9));
    const P2 = V3.map((p) => F.P(...p));
    const edges = [];
    for (let k = 0; k < 4; k++) {
      const k1 = (k + 1) % 4,
        dir = k % 2 ? "v" : "u";
      edges.push({ a: k, b: k1, dir, vis: faces[0].vis || faces[2 + k].vis });
      edges.push({ a: k + 4, b: k1 + 4, dir, vis: faces[1].vis || faces[2 + k].vis });
      edges.push({ a: k, b: k + 4, dir: "y", vis: faces[2 + k].vis || faces[2 + ((k + 3) % 4)].vis });
    }
    const path = new Path2D();
    for (const fc of faces) if (fc.vis) fc.v.forEach((i, j) => (j ? path.lineTo(...P2[i]) : path.moveTo(...P2[i]))), path.closePath();
    const lines = edges.map((e) => ({ pts: [P2[e.a], P2[e.b]], vis: e.vis, dir: e.dir }));
    const vps = { u: F.VP(u[0], u[1]), v: F.VP(v[0], v[1]) };
    return { P2, lines, path, vps, u, v, topVis: faces[1].vis, botVis: faces[0].vis, pts: P2 };
  }

  // Цилиндр (и диск): контур — передние дуги верхнего и нижнего круга и две образующие в точках касания
  // лучей зрения; задние дуги видны, только если видно донышко/крышку.
  function cylGeo(o) {
    const N = 96,
      cam = [F.cam[0] - o.X, F.cam[2] - o.Z],
      d = Math.hypot(cam[0], cam[1]),
      beta = Math.atan2(cam[1], cam[0]),
      alpha = Math.acos(Math.min(1, o.r / d)),
      y1 = o.y0 + o.h,
      ring = (y, a0, a1) => {
        const n = Math.max(2, Math.ceil((N * Math.abs(a1 - a0)) / (2 * Math.PI)));
        const out = [];
        for (let i = 0; i <= n; i++) {
          const a = a0 + ((a1 - a0) * i) / n;
          out.push(F.P(o.X + o.r * Math.cos(a), y, o.Z + o.r * Math.sin(a)));
        }
        return out;
      },
      t1 = beta - alpha,
      t2 = beta + alpha,
      topVis = F.h > y1,
      botVis = F.h < o.y0;
    const g = (a, y) => F.P(o.X + o.r * Math.cos(a), y, o.Z + o.r * Math.sin(a));
    const lines = [
      { pts: ring(o.y0, t1, t2), vis: !0 },
      { pts: ring(o.y0, t2, t1 + 2 * Math.PI), vis: botVis },
      { pts: ring(y1, t1, t2), vis: !0 },
      { pts: ring(y1, t2, t1 + 2 * Math.PI), vis: topVis },
      { pts: [g(t1, o.y0), g(t1, y1)], vis: !0 },
      { pts: [g(t2, o.y0), g(t2, y1)], vis: !0 },
    ];
    const path = new Path2D(),
      poly = (pts) => (pts.forEach((p, j) => (j ? path.lineTo(...p) : path.moveTo(...p))), path.closePath());
    poly(ring(o.y0, 0, 2 * Math.PI));
    poly(ring(y1, 0, 2 * Math.PI));
    poly([g(t1, o.y0), g(t1, y1), g(t2, y1), g(t2, o.y0)]);
    // квадрат вокруг круга, повёрнутый как предмет: через него эллипс строят от руки
    const u = [Math.cos(o.TH), Math.sin(o.TH)],
      v = [-u[1], u[0]],
      sq = (y) =>
        [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => F.P(o.X + o.r * (a * u[0] + b * v[0]), y, o.Z + o.r * (a * u[1] + b * v[1])));
    const vps = { u: F.VP(u[0], u[1]), v: F.VP(v[0], v[1]) },
      mid = (y) => ({ u: [g(o.TH + Math.PI, y), g(o.TH, y)], v: [g(o.TH - Math.PI / 2, y), g(o.TH + Math.PI / 2, y)] });
    const pts = [...lines[0].pts, ...lines[1].pts, ...lines[2].pts, ...lines[3].pts];
    return { lines, path, vps, sqB: sq(o.y0), sqT: sq(y1), midB: mid(o.y0), midT: mid(y1), cB: F.P(o.X, o.y0, o.Z), cT: F.P(o.X, y1, o.Z), topVis, botVis, pts };
  }

  // Порядок рисования (от дальних к ближним). Разные стопки разделены вертикальной плоскостью: ближе к глазу
  // та, на чьей стороне камера. Внутри стопки — по высоте: ниже уровня глаз снизу вверх, выше — сверху вниз.
  function drawOrder() {
    const st = scene.stacks,
      n = st.length,
      after = st.map(() => new Set()),
      indeg = new Array(n).fill(0);
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const dx = st[j].cx - st[i].cx,
          dz = st[j].cz - st[i].cz,
          L = Math.hypot(dx, dz) || 1,
          ux = dx / L,
          uz = dz / L,
          m = st[i].rad + (L - st[i].rad - st[j].rad) / 2,
          px = st[i].cx + ux * m,
          pz = st[i].cz + uz * m,
          side = (0 - px) * ux + (-F.D - pz) * uz;
        side > 0 ? after[i].add(j) : after[j].add(i);
      }
    after.forEach((s) => s.forEach((j) => indeg[j]++));
    const q = [...Array(n).keys()].filter((i) => !indeg[i]),
      seq = [];
    while (q.length) {
      const i = q.shift();
      seq.push(i);
      for (const j of after[i]) if (!--indeg[j]) q.push(j);
    }
    if (seq.length < n) {
      // запасной путь: дальние раньше
      seq.length = 0;
      [...Array(n).keys()].sort((a, b) => Math.hypot(st[b].cx, st[b].cz + F.D) - Math.hypot(st[a].cx, st[a].cz + F.D)).forEach((i) => seq.push(i));
    }
    const order = [];
    for (const si of seq) {
      const objs = F.objs.filter((o) => o.si === si),
        low = objs.filter((o) => o.y0 + o.h <= F.h),
        high = objs.filter((o) => o.y0 + o.h > F.h).reverse();
      order.push(...low.map((o) => o.i), ...high.map((o) => o.i));
    }
    return order;
  }

  // ---------- рисование ----------
  const cv = $("scCv"),
    ctx = cv.getContext("2d"),
    hit = document.createElement("canvas").getContext("2d");
  let view = { s: 1, ox: 0, oy: 0 },
    userView = !1, // вид двигали руками — при смене размера окна не вписываем заново
    sel = -1,
    W = 0,
    H = 0,
    dpr = 1,
    col = {};
  const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  const readColors = () =>
    (col = {
      paper: css("--paper"),
      desk: css("--desk"),
      ink: css("--ink"),
      muted: css("--muted"),
      faint: css("--faint"),
      line: css("--line"),
      horizon: css("--horizon"),
      pal: [css("--fam0"), css("--fam1"), css("--fam2"), css("--answer"), css("--horizon"), "#7C5CD6", "#0E8FA8"],
    });
  const colorOf = (o) => col.pal[o.color % col.pal.length];

  function resize() {
    const r = cv.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    if (!r.width || !r.height) return !1;
    (W = r.width), (H = r.height);
    cv.width = Math.round(W * dpr);
    cv.height = Math.round(H * dpr);
    return !0;
  }
  function fit(withVP) {
    if (!F || !W) return;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (p) => ((x0 = Math.min(x0, p[0])), (x1 = Math.max(x1, p[0])), (y0 = Math.min(y0, p[1])), (y1 = Math.max(y1, p[1])));
    const vis = F.objs.some(shown) ? F.objs.filter(shown) : F.objs;
    for (const o of vis) o.pts.forEach(add), o.sqB && (o.sqB.forEach(add), o.sqT.forEach(add));
    // горизонт — в кадр, если он не слишком далеко (у наклонённой камеры он может уйти далеко вверх/вниз)
    if (Math.max(y0 - F.hy, F.hy - y1) < 1.2 * (y1 - y0)) add([CX, F.hy]);
    if (withVP) {
      for (const o of vis) for (const p of [o.vps.u, o.vps.v]) p && Math.abs(p[0] - CX) < 40 * F.f && add(p);
      F.vpY && Math.abs(F.vpY[1] - MID_Y) < 40 * F.f && add(F.vpY);
    }
    const pad = 40,
      s = Math.min((W - 2 * pad) / Math.max(1, x1 - x0), (H - 2 * pad) / Math.max(1, y1 - y0));
    view = { s, ox: W / 2 - (s * (x0 + x1)) / 2, oy: H / 2 - (s * (y0 + y1)) / 2 };
    userView = !1;
  }

  function draw() {
    if (!F || !W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = col.paper;
    ctx.fillRect(0, 0, W, H);
    ctx.setTransform(dpr * view.s, 0, 0, dpr * view.s, dpr * view.ox, dpr * view.oy);
    const px = (n) => n / view.s,
      L0 = -view.ox / view.s,
      L1 = (W - view.ox) / view.s;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    const stroke = (pts, color, w, dash) => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
      ctx.strokeStyle = color;
      ctx.lineWidth = px(w);
      ctx.setLineDash(dash ? dash.map(px) : []);
      ctx.stroke();
    };
    // пол: лёгкая тень-подложка под горизонтом не нужна — горизонт сам по себе ориентир
    if (S.show.hor) {
      stroke([[L0, F.hy], [L1, F.hy]], col.horizon, 1.6);
      ctx.fillStyle = col.horizon;
      ctx.font = `600 ${px(12)}px ${css("--font") || "sans-serif"}`;
      ctx.fillText("линия горизонта = уровень глаз", L0 + px(10), F.hy - px(7));
    }
    const sel_ = sel >= 0 ? F.objs[sel] : null,
      focus = (o) => !sel_ || o === sel_;
    // предметы, от дальних к ближним
    for (const i of F.order) {
      const o = F.objs[i];
      if (!shown(o)) continue;
      if (!S.show.hid) (ctx.fillStyle = col.paper), ctx.fill(o.path);
      const c = o === sel_ ? colorOf(o) : col.ink,
        w = o === sel_ ? 2.4 : 1.7;
      for (const l of o.lines) {
        if (l.vis) stroke(l.pts, c, w);
        else if (S.show.hid) stroke(l.pts, o === sel_ ? c : col.faint, 1.1, [5, 4]);
      }
    }
    // построения поверх, полупрозрачно
    ctx.globalAlpha = 0.6;
    const toVP = (a, b, vp, c) => {
      if (vp) {
        const far = Math.hypot(a[0] - vp[0], a[1] - vp[1]) > Math.hypot(b[0] - vp[0], b[1] - vp[1]) ? a : b;
        stroke([far, vp], c, 1);
      } else {
        // точка схода «в бесконечности»: рёбра на картинке параллельны — продлеваем их
        const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1, k = 3000 / L;
        stroke([[a[0] - dx * k, a[1] - dy * k], [b[0] + dx * k, b[1] + dy * k]], c, 1, [2, 5]);
      }
    };
    const usedVP = [];
    for (const o of F.objs) {
      if (!focus(o) || !shown(o)) continue;
      const c = colorOf(o),
        isCyl = o.type === "cyl" || o.type === "disc";
      if (isCyl && (S.show.vp || S.show.ell)) {
        for (const sq of [o.sqB, o.sqT]) {
          stroke([...sq, sq[0]], c, 1, [4, 3]);
          if (S.show.vp)
            for (let k = 0; k < 4; k++) toVP(sq[k], sq[(k + 1) % 4], k % 2 ? o.vps.v : o.vps.u, c);
          if (S.show.ell) {
            stroke([sq[0], sq[2]], c, 1);
            stroke([sq[1], sq[3]], c, 1);
            // средние линии квадрата: через центр (пересечение диагоналей) к тем же точкам схода;
            // их концы — точки, где круг касается квадрата
            const top = sq === o.sqT,
              ctr = top ? o.cT : o.cB,
              mids = top ? o.midT : o.midB;
            stroke(mids.u, c, 1);
            stroke(mids.v, c, 1);
            for (const q of [...mids.u, ...mids.v]) ctx.beginPath(), ctx.arc(q[0], q[1], px(2.2), 0, 7), (ctx.fillStyle = c), ctx.fill();
            ctx.fillStyle = c;
            ctx.beginPath();
            ctx.arc(ctr[0], ctr[1], px(3), 0, 7);
            ctx.fill();
          }
        }
        if (S.show.ell) for (let k = 0; k < 4; k++) stroke([o.sqB[k], o.sqT[k]], c, 1, [4, 3]);
      }
      if (!isCyl && S.show.vp)
        for (const l of o.lines)
          if (l.dir !== "y") toVP(l.pts[0], l.pts[1], o.vps[l.dir], c);
          else if (F.vpY) toVP(l.pts[0], l.pts[1], F.vpY, c); // наклонённая камера: вертикали сходятся в третью точку
      if (isCyl && S.show.axis) {
        const ext = (o.cB[1] - o.cT[1]) * 0.12 + px(8);
        stroke([[o.cB[0], o.cB[1] + ext], [o.cT[0], o.cT[1] - ext]], c, 1.2, [9, 3, 2, 3]);
        if (F.vpY && S.show.vp) toVP(o.cB, o.cT, F.vpY, c);
      }
      if (isCyl && S.show.ell && S.show.vp && F.vpY) for (let k = 0; k < 4; k++) toVP(o.sqB[k], o.sqT[k], F.vpY, c);
      if (S.show.vp) for (const vp of [o.vps.u, o.vps.v]) vp && usedVP.push([vp, c]);
    }
    ctx.globalAlpha = 1;
    if (F.vpY && S.show.vp && F.objs.some((o) => shown(o) && focus(o))) usedVP.push([F.vpY, col.ink]);
    for (const [vp, c] of usedVP) {
      ctx.beginPath();
      ctx.arc(vp[0], vp[1], px(5), 0, 7);
      ctx.fillStyle = c;
      ctx.fill();
      ctx.lineWidth = px(1.5);
      ctx.strokeStyle = col.paper;
      ctx.setLineDash([]);
      ctx.stroke();
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  // ---------- подписи ----------
  const plural = (n, a, b, c) => (n % 10 === 1 && n % 100 !== 11 ? a : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? b : c);
  const fmt = (x) => String(Math.round(x * 10) / 10).replace(".", ",");
  function texts() {
    const eps = 0.02,
      vis = F.objs.filter(shown),
      above = vis.filter((o) => o.y0 > F.h + eps).length,
      below = vis.filter((o) => o.y0 + o.h < F.h - eps).length,
      level = vis.length - above - below,
      nVP = new Set(vis.flatMap((o) => [o.vps.u, o.vps.v]).filter(Boolean).map((p) => Math.round(p[0]))).size,
      pct = Math.round((100 * F.h) / F.Htot);
    const parts = [];
    below && parts.push(`сверху видно ${below} ${plural(below, "предмет", "предмета", "предметов")}`);
    level && parts.push(`${level} — на уровне глаз (ни верха, ни низа)`);
    above && parts.push(`снизу — ${above}`);
    $("scHInfo").innerHTML =
      `Глаз на высоте <b>${fmt(F.h)}</b> при высоте сцены ${fmt(F.Htot)} (${pct}%): ` +
      (F.h < 0.3 ? "почти с пола, «взгляд лягушки». " : F.h > F.Htot * 1.6 ? "высоко над предметами, «взгляд птицы». " : "") +
      parts.join(", ") +
      "." +
      (S.free
        ? ` Камера ${F.pitch < -0.02 ? "смотрит вниз" : F.pitch > 0.02 ? "смотрит вверх" : "смотрит прямо"} на ${Math.round(Math.abs((F.pitch * 180) / Math.PI))}°` +
          (F.vpY ? `: вертикали сходятся в третью точку ${F.pitch < 0 ? "внизу" : "вверху"} (чёрная).` : ": вертикали почти параллельны.")
        : "");
    const sl = sel >= 0 ? F.objs[sel] : null;
    $("scBadge").innerHTML = sl
      ? `<b>${NAMES[sl.type]}</b>${sl.oi ? ` (${sl.oi + 1}-й в стопке)` : ""}: ${sl.topVis ? "виден верх" : sl.botVis ? "виден низ" : "верх и низ на уровне глаз"} · щёлкни мимо, чтобы показать все`
      : `<b>${vis.length} ${plural(vis.length, "предмет", "предмета", "предметов")}</b>${vis.length < F.objs.length ? ` (спрятано ${F.objs.length - vis.length})` : ""} · точек схода на горизонте: ${nVP}${F.vpY ? " + 1 для вертикалей" : ""}`;
    $("scStatus").textContent = `сцена ${S.seed}`;
    $("scOrbitVal").textContent = `${S.orbit}°`;
    $("scDistVal").textContent = S.dist < 0.85 ? "близко: сильная перспектива" : S.dist > 1.3 ? "далеко: слабая перспектива" : "обычно";
    renderList();
  }

  // ---------- список предметов с «глазиком» ----------
  const EYE_ON =
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M1.8 10s3-5.6 8.2-5.6S18.2 10 18.2 10s-3 5.6-8.2 5.6S1.8 10 1.8 10z" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="10" cy="10" r="2.6" fill="currentColor"/></svg>';
  const EYE_OFF =
    '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M1.8 10s3-5.6 8.2-5.6S18.2 10 18.2 10s-3 5.6-8.2 5.6S1.8 10 1.8 10z" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".45"/><path d="M3 17L17 3" stroke="currentColor" stroke-width="1.7"/></svg>';
  function renderList() {
    const many = scene.stacks.length > 1,
      rows = F.objs.map((o) => {
        const on = shown(o),
          tall = scene.stacks[o.si].objs.length > 1,
          where = [many ? `стопка ${o.si + 1}` : "", tall ? `${o.oi + 1}-й снизу` : ""].filter(Boolean).join(" · ");
        return `<li class="${on ? "" : "off"}${o.i === sel ? " sel" : ""}"><span class="sw" style="background:${colorOf(o)}"></span><button class="nm" data-pick="${o.i}" title="Показать только линии этого предмета">${NAMES[o.type][0].toUpperCase() + NAMES[o.type].slice(1)}<small>${where}</small></button><button class="eye" data-eye="${o.i}" aria-pressed="${on}" title="${on ? "Спрятать предмет и его линии" : "Показать предмет"}" aria-label="${on ? "Спрятать" : "Показать"}: ${NAMES[o.type]}${where ? ", " + where : ""}">${on ? EYE_ON : EYE_OFF}</button></li>`;
      });
    $("scList").innerHTML = rows.join("");
    $("scAll").hidden = !S.off.length;
  }
  $("scList").addEventListener("click", (e) => {
    const eye = e.target.closest("[data-eye]"),
      nm = e.target.closest("[data-pick]");
    if (eye) {
      const i = +eye.dataset.eye;
      S.off = S.off.includes(i) ? S.off.filter((j) => j !== i) : [...S.off, i];
      if (S.off.includes(sel)) sel = -1;
      sync();
    } else if (nm) {
      const i = +nm.dataset.pick;
      if (S.off.includes(i)) S.off = S.off.filter((j) => j !== i);
      sel = sel === i ? -1 : i;
      sync();
    }
  });
  $("scAll").onclick = () => ((S.off = []), sync());

  // ---------- управление ----------
  function rebuild(refit) {
    scene = generate(S.seed, S.layout, S.types);
    const key = [S.seed, S.layout, KINDS.filter((k) => S.types[k]).join()].join("|");
    if (S.offKey !== key) (S.off = []), (S.offKey = key);
    sel = -1;
    frame();
    refit && fit(!1);
    sync();
  }
  function update() {
    frame();
    sync();
  }
  function sync() {
    $("scSeed").value = S.seed;
    $("scH").value = Math.round(S.t * 1000);
    $("scOrbit").value = S.orbit;
    $("scDist").value = Math.round(Math.log(S.dist) * 1000);
    $("scFree").setAttribute("aria-pressed", S.free);
    $("scStage").classList.toggle("free", S.free);
    document.querySelectorAll("#sceneTab [data-lay]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.lay === S.layout));
    document.querySelectorAll("#sceneTab [data-ty]").forEach((b) => b.setAttribute("aria-pressed", !!S.types[b.dataset.ty]));
    $("scRotFree").setAttribute("aria-pressed", !S.same);
    $("scRotSame").setAttribute("aria-pressed", S.same);
    for (const [id, k] of [["scVP", "vp"], ["scHor", "hor"], ["scEll", "ell"], ["scAxis", "axis"], ["scHid", "hid"]]) $(id).setAttribute("aria-pressed", S.show[k]);
    texts();
    save();
    draw();
  }
  const setSeed = (n) => ((S.seed = Math.min(999999, Math.max(1, n | 0))), rebuild(!0));
  const setT = (t) => ((S.t = Math.min(1, Math.max(0, t))), update());
  $("scNew").onclick = () => setSeed(1 + Math.floor(Math.random() * 999999));
  $("scPrev").onclick = () => setSeed(S.seed > 1 ? S.seed - 1 : 999999);
  $("scNext").onclick = () => setSeed(S.seed < 999999 ? S.seed + 1 : 1);
  $("scSeed").addEventListener("change", (e) => e.target.value !== "" && setSeed(+e.target.value));
  document.querySelectorAll("#sceneTab [data-lay]").forEach((b) => (b.onclick = () => ((S.layout = b.dataset.lay), rebuild(!0))));
  document.querySelectorAll("#sceneTab [data-ty]").forEach(
    (b) =>
      (b.onclick = () => {
        const k = b.dataset.ty;
        if (S.types[k] && KINDS.filter((q) => S.types[q]).length === 1) return; // хоть один вид предметов остаётся
        (S.types[k] = !S.types[k]), rebuild(!0);
      }),
  );
  $("scH").addEventListener("input", (e) => setT(+e.target.value / 1000));
  $("scOrbit").addEventListener("input", (e) => ((S.orbit = +e.target.value), update()));
  $("scDist").addEventListener("input", (e) => ((S.dist = Math.exp(+e.target.value / 1000)), update()));
  $("scFree").onclick = () => ((S.free = !S.free), update(), userView || (fit(!1), draw()));
  $("scRotFree").onclick = () => ((S.same = !1), update());
  $("scRotSame").onclick = () => ((S.same = !0), update());
  const toggle = (k) => ((S.show[k] = !S.show[k]), sync());
  for (const [id, k] of [["scVP", "vp"], ["scHor", "hor"], ["scEll", "ell"], ["scAxis", "axis"], ["scHid", "hid"]]) $(id).onclick = () => toggle(k);
  $("scFit").onclick = () => (fit(!1), draw());
  $("scFitVP").onclick = () => (fit(!0), draw());

  // мышь: тащить горизонт, сдвигать вид, выбирать предмет
  const toPage = (e) => {
    const r = cv.getBoundingClientRect();
    return [(e.clientX - r.left - view.ox) / view.s, (e.clientY - r.top - view.oy) / view.s];
  };
  const nearHorizon = (e) => {
    const r = cv.getBoundingClientRect();
    return S.show.hor && F && !S.free && Math.abs(e.clientY - r.top - (view.oy + view.s * F.hy)) < 8;
  };
  const pick = (p) => {
    for (let k = F.order.length - 1; k >= 0; k--) {
      const o = F.objs[F.order[k]];
      if (shown(o) && hit.isPointInPath(o.path, p[0], p[1])) return o.i;
    }
    return -1;
  };
  let drag = null;
  cv.addEventListener("pointerdown", (e) => {
    if (!F) return;
    cv.setPointerCapture(e.pointerId);
    // свободная камера: тащить — облёт сцены (влево-вправо) и высота глаз (вверх-вниз);
    // со Shift или правой кнопкой — сдвиг листа
    const orbitDrag = S.free && e.button === 0 && !e.shiftKey;
    drag = nearHorizon(e)
      ? { type: "hz" }
      : { type: orbitDrag ? "orbit" : "pan", x: e.clientX, y: e.clientY, ox: view.ox, oy: view.oy, orbit: S.orbit, t: S.t, moved: !1 };
    cv.classList.toggle("drag", drag.type === "pan");
  });
  cv.addEventListener("pointermove", (e) => {
    if (!F) return;
    if (!drag) {
      cv.classList.toggle("hz", nearHorizon(e));
      cv.classList.toggle("obj", !nearHorizon(e) && pick(toPage(e)) >= 0);
      return;
    }
    if (drag.type === "orbit") {
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 4) drag.moved = !0;
      if (!drag.moved) return;
      let o = Math.round(drag.orbit - dx * 0.4);
      o = ((((o + 180) % 360) + 360) % 360) - 180;
      S.orbit = o;
      setT(drag.t + dy / 400);
      return;
    }
    if (drag.type === "hz") {
      // горизонт идёт за курсором: из его положения на листе — высота глаз
      const hy = toPage(e)[1],
        h = F.Htot / 2 - ((hy - MID_Y) * F.D) / F.f;
      setT((h - F.hmin) / (F.hmax - F.hmin));
    } else {
      const dx = e.clientX - drag.x,
        dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 4) drag.moved = !0;
      (view.ox = drag.ox + dx), (view.oy = drag.oy + dy), drag.moved && (userView = !0);
      draw();
    }
  });
  const end = (e) => {
    if (drag && (drag.type === "pan" || drag.type === "orbit") && !drag.moved) {
      sel = pick(toPage(e));
      texts();
      draw();
    }
    drag = null;
    cv.classList.remove("drag");
  };
  cv.addEventListener("pointerup", end);
  cv.addEventListener("contextmenu", (e) => e.preventDefault()); // правая кнопка — сдвиг
  cv.addEventListener("pointercancel", () => ((drag = null), cv.classList.remove("drag")));
  cv.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const r = cv.getBoundingClientRect(),
        mx = e.clientX - r.left,
        my = e.clientY - r.top,
        k = Math.exp(-e.deltaY * (e.deltaMode ? 0.05 : 0.0015)),
        s = Math.min(50, Math.max(0.02, view.s * k));
      view = { s, ox: mx - ((mx - view.ox) * s) / view.s, oy: my - ((my - view.oy) * s) / view.s };
      userView = !0;
      draw();
    },
    { passive: !1 },
  );
  window.addEventListener("keydown", (e) => {
    if (document.body.dataset.tab !== "scene" || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.tagName === "INPUT" && e.target.type !== "range") return;
    const k = e.key.toLowerCase();
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      setT(S.t + (e.key === "ArrowUp" ? 1 : -1) * (e.shiftKey ? 0.1 : 0.02));
    } else if (k === "n" || k === "т") $("scNew").click();
    else if (k === "t" || k === "е") toggle("vp");
    else if (k === "h" || k === "р") toggle("hor");
    else if (k === "e" || k === "у") toggle("ell");
    else if (k === "x" || k === "ч") toggle("hid");
    else if (k === "c" || k === "с") $("scFree").click();
    else if (k === "f" || k === "а") $("scFit").click();
    else if (k === "v" || k === "м") $("scFitVP").click();
    else if (k === "escape") (sel = -1), texts(), draw();
    else return;
  });

  // ---------- вкладки ----------
  let first = !0;
  function setTab(tab) {
    S.tab = tab;
    document.body.dataset.tab = tab;
    const sc = tab === "scene";
    $("sceneTab").hidden = !sc;
    document.querySelector("main.work").hidden = sc;
    $("tabCheck").setAttribute("aria-pressed", !sc);
    $("tabScene").setAttribute("aria-pressed", sc);
    $("tabCheck").setAttribute("aria-selected", !sc);
    $("tabScene").setAttribute("aria-selected", sc);
    try {
      history.replaceState(null, "", sc ? "#scene" : location.pathname + location.search);
    } catch {}
    save();
    if (sc)
      requestAnimationFrame(() => {
        readColors();
        if (resize()) {
          if (first) fit(!1), (first = !1);
          draw();
        }
      });
  }
  $("tabCheck").onclick = () => setTab("check");
  $("tabScene").onclick = () => setTab("scene");
  new ResizeObserver(() => {
    if (S.tab !== "scene") return;
    if (resize()) {
      (first || !userView) && (fit(!1), (first = !1));
      draw();
    }
  }).observe($("scStage"));
  const recolor = () => (readColors(), draw());
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", recolor);
  new MutationObserver(recolor).observe(document.documentElement, { attributes: !0, attributeFilter: ["data-theme"] });

  readColors();
  rebuild(!1);
  setTab(location.hash === "#scene" ? "scene" : S.tab === "scene" ? "scene" : "check");
  window.perspectiveScene = { state: S, get frame() { return F; }, get view() { return view; }, generate, setTab };
})();
