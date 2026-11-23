(() => {
  var Pe = (t, e) => [t[0] - e[0], t[1] - e[1]];
  var xn = (t, e) => t[0] * e[0] + t[1] * e[1],
    Rt = (t, e) => t[0] * e[1] - t[1] * e[0];
  var U = (t, e) => Math.hypot(t[0] - e[0], t[1] - e[1]),
    ee = (t) => {
      let e = Math.hypot(t[0], t[1]) || 1;
      return [t[0] / e, t[1] / e];
    },
    Ut = (t, e) => ee([e[0] - t[0], e[1] - t[1]]),
    ze = (t, e) => [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2];
  var G = (t, e) => t[0] * e[0] + t[1] * e[1] + t[2] * e[2],
    st = (t, e) => [t[1] * e[2] - t[2] * e[1], t[2] * e[0] - t[0] * e[2], t[0] * e[1] - t[1] * e[0]];
  var N = (t) => {
      let e = Math.hypot(t[0], t[1], t[2]) || 1;
      return [t[0] / e, t[1] / e, t[2] / e];
    },
    ne = (t, e) => [t[0] - e[0], t[1] - e[1], t[2] - e[2]];
  var mt = (t, e) => [t[0] * e, t[1] * e, t[2] * e],
    Q = 180 / Math.PI,
    se = (t, e, n) => Math.max(e, Math.min(n, t));
  function X(t, e) {
    let n = Math.abs(t[0] * e[0] + t[1] * e[1]) / (Math.hypot(t[0], t[1]) * Math.hypot(e[0], e[1]) || 1);
    return Math.acos(Math.min(1, n)) * Q;
  }
  function Xt(t, e) {
    let n = Math.atan2(Rt(t, e), xn(t, e));
    return n > Math.PI / 2 ? (n -= Math.PI) : n < -Math.PI / 2 && (n += Math.PI), n;
  }
  function Pt(t, e, n, s) {
    let o = Rt(e, s);
    if (Math.abs(o) < 1e-12) return null;
    let a = Rt(Pe(n, t), s) / o;
    return [t[0] + e[0] * a, t[1] + e[1] * a, a];
  }
  function it(t, e) {
    let n = e.length,
      s = t.map((a, f) => [...a, e[f]]);
    for (let a = 0; a < n; a++) {
      let f = a;
      for (let i = a + 1; i < n; i++) Math.abs(s[i][a]) > Math.abs(s[f][a]) && (f = i);
      if (Math.abs(s[f][a]) < 1e-300) return null;
      if (f !== a) {
        let i = s[a];
        (s[a] = s[f]), (s[f] = i);
      }
      let l = s[a][a];
      for (let i = a + 1; i < n; i++) {
        let h = s[i][a] / l;
        if (h) for (let u = a; u <= n; u++) s[i][u] -= h * s[a][u];
      }
    }
    let o = new Array(n).fill(0);
    for (let a = n - 1; a >= 0; a--) {
      let f = s[a][n];
      for (let l = a + 1; l < n; l++) f -= s[a][l] * o[l];
      o[a] = f / s[a][a];
    }
    return o.every(Number.isFinite) ? o : null;
  }
  function vn(t) {
    let e = t.length,
      n = [];
    for (let s = 0; s < e; s++) {
      let o = new Array(e).fill(0);
      o[s] = 1;
      let a = it(t, o);
      if (!a) return null;
      n.push(a);
    }
    return t.map((s, o) => n.map((a) => a[o]));
  }
  function bt(t) {
    let e = Math.hypot(t[0], t[1], t[2]);
    if (e < 1e-12)
      return [
        [1, -t[2], t[1]],
        [t[2], 1, -t[0]],
        [-t[1], t[0], 1],
      ];
    let n = [t[0] / e, t[1] / e, t[2] / e],
      s = Math.cos(e),
      o = Math.sin(e),
      a = 1 - s;
    return [
      [s + n[0] * n[0] * a, n[0] * n[1] * a - n[2] * o, n[0] * n[2] * a + n[1] * o],
      [n[1] * n[0] * a + n[2] * o, s + n[1] * n[1] * a, n[1] * n[2] * a - n[0] * o],
      [n[2] * n[0] * a - n[1] * o, n[2] * n[1] * a + n[0] * o, s + n[2] * n[2] * a],
    ];
  }
  var kt = (t, e) => t.map((n) => [0, 1, 2].map((s) => n[0] * e[0][s] + n[1] * e[1][s] + n[2] * e[2][s])),
    oe = (t, e) => [G(t[0], e), G(t[1], e), G(t[2], e)];
  function Ce(t) {
    let e = N([t[0][0], t[1][0], t[2][0]]),
      n = [t[0][1], t[1][1], t[2][1]];
    n = N(ne(n, mt(e, G(e, n))));
    let s = st(e, n);
    return [
      [e[0], n[0], s[0]],
      [e[1], n[1], s[1]],
      [e[2], n[2], s[2]],
    ];
  }
  function Ie(t = Math.random) {
    let e = t(),
      n = t(),
      s = t(),
      o = [
        Math.sqrt(1 - e) * Math.sin(2 * Math.PI * n),
        Math.sqrt(1 - e) * Math.cos(2 * Math.PI * n),
        Math.sqrt(e) * Math.sin(2 * Math.PI * s),
        Math.sqrt(e) * Math.cos(2 * Math.PI * s),
      ],
      [a, f, l, i] = o;
    return [
      [1 - 2 * (f * f + l * l), 2 * (a * f - l * i), 2 * (a * l + f * i)],
      [2 * (a * f + l * i), 1 - 2 * (a * a + l * l), 2 * (f * l - a * i)],
      [2 * (a * l - f * i), 2 * (f * l + a * i), 1 - 2 * (a * a + f * f)],
    ];
  }
  function yn(t, e, n) {
    let s = t + n,
      o = Math.sqrt(Math.max(0, ((t - n) * (t - n)) / 4 + e * e)),
      a = s / 2 + o,
      f = s / 2 - o,
      l = Math.abs(e) > 1e-12 ? [a - n, e] : t >= n ? [1, 0] : [0, 1];
    return (l = ee(l)), { l1: a, l2: f, v1: l, v2: [-l[1], l[0]] };
  }
  function ae(t, e) {
    let n = 0,
      s = 0,
      o = 0;
    for (let b = 0; b < t.length; b++) {
      let c = e ? e[b] : 1;
      (n += c), (s += c * t[b][0]), (o += c * t[b][1]);
    }
    (s /= n), (o /= n);
    let a = 0,
      f = 0,
      l = 0;
    for (let b = 0; b < t.length; b++) {
      let c = e ? e[b] : 1,
        p = t[b][0] - s,
        k = t[b][1] - o;
      (a += c * p * p), (f += c * k * k), (l += c * p * k);
    }
    let i = yn(a, l, f),
      h = i.v1,
      u = 1 / 0,
      x = -1 / 0;
    for (let b of t) {
      let c = (b[0] - s) * h[0] + (b[1] - o) * h[1];
      c < u && (u = c), c > x && (x = c);
    }
    return {
      c: [s, o],
      d: h,
      rms: Math.sqrt(Math.max(0, i.l2) / n),
      t0: u,
      t1: x,
      a: [s + h[0] * u, o + h[1] * u],
      b: [s + h[0] * x, o + h[1] * x],
      len: x - u,
    };
  }
  function gt(t, e, n = {}) {
    let s = n.iters ?? 60,
      o = e.length,
      a = e.slice(),
      f = t(a),
      l = Re(f),
      i = n.lambda ?? 0.001,
      h = null,
      u = (x, b) => {
        let c = [];
        for (let p = 0; p < o; p++) {
          let k = (n.step ? n.step[p] : 1e-6) * Math.max(1, Math.abs(x[p])),
            L = x.slice();
          L[p] += k;
          let C = t(L),
            g = new Float64Array(b.length);
          for (let w = 0; w < b.length; w++) g[w] = (C[w] - b[w]) / k;
          c.push(g);
        }
        return c;
      };
    for (let x = 0; x < s; x++) {
      h = u(a, f);
      let b = [],
        c = new Array(o).fill(0);
      for (let k = 0; k < o; k++) {
        b.push(new Array(o).fill(0));
        let L = h[k];
        for (let C = 0; C < f.length; C++) c[k] += L[C] * f[C];
      }
      for (let k = 0; k < o; k++)
        for (let L = k; L < o; L++) {
          let C = h[k],
            g = h[L],
            w = 0;
          for (let m = 0; m < f.length; m++) w += C[m] * g[m];
          b[k][L] = b[L][k] = w;
        }
      let p = !1;
      for (let k = 0; k < 10; k++) {
        let L = b.map((r, v) => r.map(($, S) => (v === S ? $ * (1 + i) + 1e-12 : $))),
          C = it(
            L,
            c.map((r) => -r),
          );
        if (!C) {
          i *= 10;
          continue;
        }
        let g = a.map((r, v) => r + C[v]),
          w = t(g),
          m = Re(w);
        if (Number.isFinite(m) && m < l) {
          let r = (l - m) / (l || 1);
          (a = g), (f = w), (l = m), (i = Math.max(1e-9, i * 0.3)), (p = !0), r < 1e-10 && (x = s);
          break;
        }
        i *= 10;
      }
      if (!p) break;
    }
    return { p: a, cost: l, r: f, J: n.wantJ ? u(a, f) : null };
  }
  function Re(t) {
    let e = 0;
    for (let n of t) e += n * n;
    return e;
  }
  function Te(t) {
    let e = t.length,
      n = [];
    for (let s = 0; s < e; s++) n.push(new Array(e).fill(0));
    for (let s = 0; s < e; s++)
      for (let o = s; o < e; o++) {
        let a = 0,
          f = t[s],
          l = t[o];
        for (let i = 0; i < f.length; i++) a += f[i] * l[i];
        n[s][o] = n[o][s] = a;
      }
    for (let s = 0; s < e; s++) n[s][s] += 1e-12;
    return vn(n);
  }
  function Mt(t, e) {
    let n = Math.abs(t);
    return n <= e ? t : Math.sign(t) * Math.sqrt(e * (2 * n - e));
  }
  function je(t, e) {
    return Math.sign(t) * e * Math.sqrt(Math.log1p((t / e) * (t / e)));
  }
  function re(t) {
    let e = t >>> 0;
    return () => {
      (e |= 0), (e = (e + 1831565813) | 0);
      let n = Math.imul(e ^ (e >>> 15), 1 | e);
      return (n = (n + Math.imul(n ^ (n >>> 7), 61 | n)) ^ n), ((n ^ (n >>> 14)) >>> 0) / 4294967296;
    };
  }
  function H(t) {
    let e = 0,
      n = 0;
    for (; e === 0; ) e = t();
    for (; n === 0; ) n = t();
    return Math.sqrt(-2 * Math.log(e)) * Math.cos(2 * Math.PI * n);
  }
  function nt(t) {
    let e = 1 / 0,
      n = 1 / 0,
      s = -1 / 0,
      o = -1 / 0;
    for (let a of t)
      a[0] < e && (e = a[0]), a[0] > s && (s = a[0]), a[1] < n && (n = a[1]), a[1] > o && (o = a[1]);
    return {
      x0: e,
      y0: n,
      x1: s,
      y1: o,
      w: s - e,
      h: o - n,
      diag: Math.hypot(s - e, o - n),
      c: [(e + s) / 2, (n + o) / 2],
    };
  }
  var ot = [1, 2, 4],
    zt = (t, e) => {
      let n = t ^ e;
      return n === 1 ? 0 : n === 2 ? 1 : n === 4 ? 2 : -1;
    },
    wn = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ],
    De = [],
    kn = (t) => (t[0] > t[1]) + (t[0] > t[2]) + (t[1] > t[2]);
  for (let t of wn)
    for (let e = 0; e < 8; e++) {
      let n = (e & 1) + ((e >> 1) & 1) + ((e >> 2) & 1);
      (kn(t) + n) % 2 ||
        De.push((s) => {
          let o = 0;
          for (let a = 0; a < 3; a++) s & ot[a] && (o |= ot[t[a]]);
          return o ^ e;
        });
    }
  var ct = [];
  for (let t = 0; t < 8; t++)
    for (let e = 0; e < 3; e++) {
      let n = t ^ ot[e];
      n > t && ct.push([t, n, e]);
    }
  var K = [];
  for (let t = 0; t < 3; t++)
    for (let e of [0, 1]) {
      let n = [0, 1, 2].filter((o) => o !== t),
        s = e ? ot[t] : 0;
      K.push({ axis: t, side: e, v: [s, s | ot[n[0]], s | ot[n[0]] | ot[n[1]], s | ot[n[1]]] });
    }
  function Be(t, e, n, s = 2) {
    let o = t.slice().sort((g, w) => e.adj[w].size - e.adj[g].size);
    if (o.length < 3 || o.length > 12) return [];
    let a = [];
    for (let g of o) for (let [w, m] of e.adj[g]) g < w && a.push([g, w, m]);
    if (a.length < 3) return [];
    let f = [],
      l = new Set([o[0]]),
      i = [o[0]];
    for (; i.length; ) {
      let g = i.shift();
      f.push(g);
      for (let w of [...e.adj[g].keys()].sort((m, r) => e.adj[r].size - e.adj[m].size))
        !l.has(w) && t.includes(w) && (l.add(w), i.push(w));
    }
    let h = new Map(),
      u = new Array(8).fill(-1),
      x = new Map(),
      b = 0,
      c = -1,
      p = () => {
        let g = 0;
        for (let [w, m] of a) {
          let r = h.get(w),
            v = h.get(m);
          r >= 0 && v >= 0 && zt(r, v) >= 0 && g++;
        }
        return g;
      },
      k = 0,
      L = (g) => {
        if (++k > 2e5) return;
        if (g === f.length) {
          let r = p();
          if (r < 3 || r < c - 2) return;
          c = Math.max(c, r);
          let v = f.map((S) => h.get(S)),
            $ = null;
          for (let S of De) {
            let R = v.map((d) => (d < 0 ? 9 : S(d))).join(",");
            ($ === null || R < $) && ($ = R);
          }
          x.has($) || x.set($, { lab: new Map(h), explained: r, unmapped: b });
          return;
        }
        let w = f[g],
          m = g === 0 ? [0] : [0, 1, 2, 3, 4, 5, 6, 7];
        for (let r of m) {
          if (u[r] >= 0) continue;
          let v = !0;
          for (let $ of e.adj[w].keys()) {
            let S = h.get($);
            if (!(S === void 0 || S < 0) && zt(r, S) < 0) {
              v = !1;
              break;
            }
          }
          v && (h.set(w, r), (u[r] = w), L(g + 1), (u[r] = -1), h.delete(w));
        }
        b < s && g > 0 && (b++, h.set(w, -1), L(g + 1), h.delete(w), b--);
      };
    L(0);
    let C = [];
    for (let g of x.values()) {
      if (g.explained < c - 1) continue;
      let w = new Map();
      for (let [R, d, y] of a) {
        let E = g.lab.get(R),
          P = g.lab.get(d);
        if (E >= 0 && P >= 0) {
          let z = zt(E, P);
          z >= 0 && w.set(y, z);
        }
      }
      let m = [[], [], []];
      for (let [R, d] of w) m[d].push(n[R].d);
      let r = 0,
        v = 0;
      for (let R of m)
        for (let d = 0; d < R.length; d++)
          for (let y = d + 1; y < R.length; y++) {
            let E = X(R[d], R[y]);
            (r += E), E > 50 && v++;
          }
      let $ = m.filter((R) => R.length).length,
        S = g.explained * 10 - g.unmapped * 6 - v * 25 - r * 0.05 - ($ < 3 ? 30 : 0);
      C.push({
        lab: g.lab,
        fam: w,
        explained: g.explained,
        unmapped: g.unmapped,
        score: S,
        nEdgesIn: a.length,
        comp: t,
      });
    }
    return C.sort((g, w) => w.score - g.score), C;
  }
  function Ve(t, e, n) {
    let s = [];
    for (let o of e.E) {
      if (o.ok || t.fam.has(o.line)) continue;
      let a = o.u >= 0 ? o.u : o.v;
      if (a < 0) continue;
      let f = t.lab.get(a);
      if (f === void 0 || f < 0) continue;
      let l = n[o.line],
        i = -1,
        h = 14;
      for (let u = 0; u < 3; u++) {
        let x = f ^ ot[u],
          b = !1;
        for (let [k, L] of t.lab) L === x && e.adj[a].has(k) && (b = !0);
        if (b) continue;
        let c = [...t.fam].filter(([, k]) => k === u).map(([k]) => n[k].d);
        if (!c.length) continue;
        let p = Math.min(...c.map((k) => X(k, l.d)));
        p < h && ((h = p), (i = u));
      }
      i >= 0 && (t.fam.set(o.line, i), s.push({ line: o.line, from: f, to: f ^ ot[i], vertex: a }));
    }
    return (t.dangling = s), t;
  }
  function ie(t, e) {
    let n = t.length,
      s = (d) => [(d[0] - e.o[0]) / e.s, (d[1] - e.o[1]) / e.s],
      o = t.map((d) => s(ze(d.a, d.b))),
      a = t.map((d) => d.d),
      f = t.map((d) => d.len / e.s / 2),
      l = (d, y) => {
        let E = o[y],
          P = d[0] - E[0] * d[2],
          z = d[1] - E[1] * d[2],
          T = Math.hypot(P, z);
        return T < 1e-12 ? 0 : (f[y] * (a[y][0] * z - a[y][1] * P)) / T;
      },
      i = 0.004,
      h = (d) =>
        t.map((y, E) => {
          let P = l(d, E);
          return Math.sign(P) * i * Math.sqrt(Math.log1p((P / i) ** 2));
        }),
      u = (d) => h(d).reduce((y, E) => y + E * E, 0),
      x = [],
      b = 0,
      c = 0;
    a.forEach((d, y) => {
      let E = d[0] * a[0][0] + d[1] * a[0][1] < 0 ? -1 : 1;
      (b += E * d[0] * f[y]), (c += E * d[1] * f[y]);
    }),
      x.push(N([b, c, 0]));
    for (let d = 0; d < n; d++)
      for (let y = d + 1; y < n; y++) {
        let E = st([o[d][0], o[d][1], 1], [o[d][0] + a[d][0], o[d][1] + a[d][1], 1]),
          P = st([o[y][0], o[y][1], 1], [o[y][0] + a[y][0], o[y][1] + a[y][1], 1]),
          z = N(st(E, P));
        Number.isFinite(z[0]) && x.push(z);
      }
    let p = x[0],
      k = u(p);
    for (let d of x) {
      let y = u(d);
      y < k && ((k = y), (p = d));
    }
    let L = (d) => {
      let y = N(st(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
      return [y, st(d, y)];
    };
    for (let d = 0; d < 3; d++) {
      let [y, E] = L(p),
        P = p,
        z = (j) => N([0, 1, 2].map((I) => P[I] + j[0] * y[I] + j[1] * E[I])),
        T = gt((j) => h(z(j)), [0, 0], { iters: 40 });
      p = z(T.p);
    }
    p[2] < 0 && (p = p.map((d) => -d));
    let C = (() => {
        let d = 1 / 0;
        for (let y = 0; y < 180; y += 0.5) {
          let E = y / Q,
            P = u([Math.cos(E), Math.sin(E), 0]);
          P < d && (d = P);
        }
        return d;
      })(),
      g = t.map((d, y) => {
        let E = o[y],
          P = [p[0] - E[0] * p[2], p[1] - E[1] * p[2]];
        return { ang: Xt(P, a[y]) * Q, w: d.len };
      }),
      w = g.reduce((d, y) => d + y.w, 0) || 1,
      m = Math.sqrt(g.reduce((d, y) => d + y.w * y.ang * y.ang, 0) / w),
      r = Math.max(0, ...g.map((d) => Math.abs(d.ang))),
      v = [e.s * p[0] + e.o[0] * p[2], e.s * p[1] + e.o[1] * p[2], p[2]],
      $ = Math.abs(p[2]) > 1e-9,
      S = $ ? [v[0] / v[2], v[1] / v[2]] : null,
      R = 0;
    for (let d = 0; d < n; d++) for (let y = d + 1; y < n; y++) R = Math.max(R, X(a[d], a[y]));
    return {
      v,
      vn: p,
      pt: S,
      dirInf: [p[0], p[1]],
      res: g,
      rms: m,
      maxAbs: r,
      spread: R,
      cost: k,
      parCost: C,
      n,
      distNorm: $ ? Math.hypot(p[0], p[1]) / Math.abs(p[2]) : 1 / 0,
    };
  }
  function Wt(t, e) {
    let n = [],
      s = [];
    for (let b = 0; b < 3; b++)
      for (let c = b + 1; c < 3; c++) {
        let p = N(t[b]),
          k = N(t[c]);
        n.push([p[0] * k[2] + k[0] * p[2], p[1] * k[2] + k[1] * p[2], p[2] * k[2]]),
          s.push(-(p[0] * k[0] + p[1] * k[1]));
      }
    let o = e ? e.w : 0.001,
      a = e ? e.c : [0, 0];
    n.push([o, 0, 0]),
      s.push(-o * a[0]),
      n.push([0, o, 0]),
      s.push(-o * a[1]),
      n.push([0, 0, o * 0.001]),
      s.push(0);
    let f = [0, 1, 2].map((b) => [0, 1, 2].map((c) => n.reduce((p, k) => p + k[b] * k[c], 0))),
      l = [0, 1, 2].map((b) => n.reduce((c, p, k) => c + p[b] * s[k], 0)),
      i = it(f, l);
    if (!i) return { ok: !1 };
    let h = [-i[0], -i[1]],
      u = i[2] - i[0] * i[0] - i[1] * i[1],
      x = 0;
    for (let b = 0; b < 3; b++)
      for (let c = b + 1; c < 3; c++) {
        let p = N(t[b]),
          k = N(t[c]),
          L = N([p[0] - h[0] * p[2], p[1] - h[1] * p[2], Math.sqrt(Math.max(u, 1e-9)) * p[2]]),
          C = N([k[0] - h[0] * k[2], k[1] - h[1] * k[2], Math.sqrt(Math.max(u, 1e-9)) * k[2]]);
        x = Math.max(x, Math.abs(90 - Math.acos(Math.max(-1, Math.min(1, G(L, C)))) * Q));
      }
    return { ok: u > 0, c: h, f2: u, f: u > 0 ? Math.sqrt(u) : 0, worst: x };
  }
  function qe(t) {
    for (let e = 0; e < 3; e++) {
      let n = t[e],
        s = t[(e + 1) % 3],
        o = t[(e + 2) % 3],
        a = [s[0] - n[0], s[1] - n[1]],
        f = [o[0] - n[0], o[1] - n[1]],
        l =
          Math.acos(
            Math.max(-1, Math.min(1, (a[0] * f[0] + a[1] * f[1]) / (Math.hypot(...a) * Math.hypot(...f)))),
          ) * Q;
      if (l >= 90) return { i: e, ang: l };
    }
    return null;
  }
  var xt = (t) => [(t & 1) - 0.5, ((t >> 1) & 1) - 0.5, ((t >> 2) & 1) - 0.5];
  function Oe(t, e, n) {
    let s = kt(bt([t[0], t[1], t[2]]), e),
      o = Math.exp(t[5]),
      a = [t[3] * o, t[4] * o, o],
      f = n.size * Math.exp(t[6]),
      l = [n.c0[0] + n.size * t[7], n.c0[1] + n.size * t[8]],
      i = n.box ? [Math.exp(t[9]), Math.exp(t[10]), Math.exp(-t[9] - t[10])] : [1, 1, 1],
      h = [];
    for (let x = 0; x < 8; x++) {
      let b = xt(x);
      h.push(
        [0, 1, 2].map((c) => s[c][0] * b[0] * i[0] + s[c][1] * b[1] * i[1] + s[c][2] * b[2] * i[2] + a[c]),
      );
    }
    let u = h.map((x) => [l[0] + (f * x[0]) / x[2], l[1] + (f * x[1]) / x[2]]);
    return { R: s, T: a, f, c: l, D: i, X: h, P: u };
  }
  function En(t) {
    return K.map((e) => {
      let n = mt([t.R[0][e.axis], t.R[1][e.axis], t.R[2][e.axis]], e.side ? 1 : -1),
        s = [0, 1, 2].map((o) => e.v.reduce((a, f) => a + t.X[f][o], 0) / 4);
      return G(n, N(s)) < 0;
    });
  }
  function $n(t) {
    return [0, 1, 2].map((e) => {
      let n = [t.R[0][e], t.R[1][e], t.R[2][e]];
      return [t.c[0] * n[2] + t.f * n[0], t.c[1] * n[2] + t.f * n[1], n[2]];
    });
  }
  function Jt(t) {
    let e = 0;
    for (let n of t.X) e = Math.max(e, Math.atan(Math.hypot(n[0], n[1]) / Math.max(n[2], 1e-9)) * Q);
    return e;
  }
  function at(t, e) {
    let n = e.size,
      s = e.sigma ?? Math.max(2, 0.012 * n),
      o = { size: n, c0: e.c0, box: !!e.box },
      a = e.camera === "plausible",
      f = a ? (e.cSigma ?? 0.45 * (e.page || 3 * n)) / n : 3,
      l = a ? 31 : 70,
      i = a ? 1.2 : 0.4,
      h = s * 1.4,
      u = e.loss === "cauchy" ? (r) => je(r, 1.2) : (r) => Mt(r, 3),
      x = e.cam ? Math.log(e.cam.f / n) : 0,
      b = e.cam ? [(e.cam.c[0] - e.c0[0]) / n, (e.cam.c[1] - e.c0[1]) / n] : null,
      c = (r) => (v) => {
        let $ = Oe(v, r, o),
          S = [],
          R = 0;
        for (let y of $.X) y[2] < 0.05 * $.T[2] && (R += (0.05 * $.T[2] - y[2]) / $.T[2]);
        for (let y of t.V) {
          let E = $.P[y.l],
            P = y.w ?? 1;
          S.push(u((E[0] - y.p[0]) / s) * P, u((E[1] - y.p[1]) / s) * P);
        }
        for (let y of t.L) {
          let E = $.P[y.la],
            P = $.P[y.lb],
            z = [P[0] - E[0], P[1] - E[1]],
            T = Math.hypot(z[0], z[1]) || 1,
            j = (q) => ((q[0] - E[0]) * z[1] - (q[1] - E[1]) * z[0]) / T / h,
            I = y.w ?? 1;
          S.push(u(j(y.a)) * I, u(j(y.b)) * I);
        }
        if (t.vis && t.vis.length) {
          let y = K.map((E) => {
            let P = [
                $.R[0][E.axis] * (E.side ? 1 : -1),
                $.R[1][E.axis] * (E.side ? 1 : -1),
                $.R[2][E.axis] * (E.side ? 1 : -1),
              ],
              z = N([0, 1, 2].map((T) => E.v.reduce((j, I) => j + $.X[I][T], 0) / 4));
            return G(P, z);
          });
          for (let E of t.vis) S.push(Math.max(0, y[E] + 0.03) * 60);
          for (let E of t.hid || []) S.push(Math.max(0, -y[E] + 0.03) * 60);
        }
        e.cam
          ? S.push((v[6] - x) * 300, (v[7] - b[0]) * 300, (v[8] - b[1]) * 300)
          : S.push(v[7] / f, v[8] / f);
        let d = Jt($);
        return S.push(Math.max(0, d - l) * i), S.push(R * 200), o.box && S.push(v[9] / 2.5, v[10] / 2.5), S;
      },
      p = [],
      k = (r, v, $) => {
        r = Ce(r);
        let S = [0, 0, 0, 0, 0, 0, Math.log(v / n), ($[0] - e.c0[0]) / n, ($[1] - e.c0[1]) / n];
        o.box && S.push(0, 0);
        let R = [],
          d = [];
        for (let P of t.V) {
          let z = xt(P.l),
            T = oe(r, z),
            j = P.p[0] - $[0],
            I = P.p[1] - $[1];
          R.push([-v, 0, j]), d.push(v * T[0] - j * T[2]), R.push([0, -v, I]), d.push(v * T[1] - I * T[2]);
        }
        if (R.length < 3) return;
        let y = [0, 1, 2].map((P) => [0, 1, 2].map((z) => R.reduce((T, j) => T + j[P] * j[z], 0))),
          E = it(
            y,
            [0, 1, 2].map((P) => R.reduce((z, T, j) => z + T[P] * d[j], 0)),
          );
        !E ||
          E[2] <= 0.6 ||
          ((S[3] = E[0] / E[2]), (S[4] = E[1] / E[2]), (S[5] = Math.log(E[2])), p.push({ R0: r, p: S }));
      };
    if (e.starts) for (let r of e.starts) p.push({ R0: r.R0, p: r.p.slice() });
    if (!e.startsOnly && e.vps && e.vps.every(Boolean)) {
      let r = { o: e.c0, s: n },
        v = e.vps.map((R) => [(R[0] - r.o[0] * R[2]) / r.s, (R[1] - r.o[1] * R[2]) / r.s, R[2]]),
        $ = Wt(v, { c: [0, 0], w: 0.05 }),
        S = [];
      e.cam
        ? S.push({ f: e.cam.f, c: e.cam.c })
        : $.ok &&
          $.f > 0.2 &&
          $.f < 60 &&
          S.push({ f: $.f * n, c: [e.c0[0] + $.c[0] * n, e.c0[1] + $.c[1] * n] });
      for (let R of [1.5, 3, 8]) S.push({ f: R * n, c: e.c0 });
      for (let R of S) {
        let d = v.map((y) =>
          N([y[0] * n - (R.c[0] - e.c0[0]) * y[2], y[1] * n - (R.c[1] - e.c0[1]) * y[2], R.f * y[2]]),
        );
        for (let y = 0; y < 8; y++) {
          let E = mt(d[0], y & 1 ? -1 : 1),
            P = mt(d[1], y & 2 ? -1 : 1),
            z = mt(d[2], y & 4 ? -1 : 1);
          G(st(E, P), z) < 0 ||
            k(
              [
                [E[0], P[0], z[0]],
                [E[1], P[1], z[1]],
                [E[2], P[2], z[2]],
              ],
              R.f,
              R.c,
            );
        }
      }
    }
    if (!e.startsOnly && t.V.length >= 4) {
      let r = [0, 1].map((v) => {
        let $ = [...Array(4)].map(() => [0, 0, 0, 0]),
          S = [0, 0, 0, 0];
        t.V.forEach((R) => {
          let d = [...xt(R.l), 1];
          for (let y = 0; y < 4; y++) {
            S[y] += d[y] * R.p[v];
            for (let E = 0; E < 4; E++) $[y][E] += d[y] * d[E];
          }
        });
        for (let R = 0; R < 3; R++) $[R][R] += 1e-6;
        return it($, S);
      });
      if (r[0] && r[1]) {
        let v = r[0].slice(0, 3),
          $ = r[1].slice(0, 3),
          S = (Math.hypot(...v) + Math.hypot(...$)) / 2 || 1,
          R = N(v),
          d = ne($, mt(R, G(R, $)));
        d = N(d);
        let y = [R, d, st(R, d)];
        if (Math.abs(S) > 1e-9)
          for (let E of e.cam ? [e.cam.f / n] : [2, 5, 12]) k(y, E * n, e.cam ? e.cam.c : [e.c0[0], e.c0[1]]);
      }
    }
    if (!e.startsOnly && p.length < 6)
      for (let r = 0; r < 24; r++) {
        let v = bt([((r % 3) - 1) * 0.9, ((((r / 3) | 0) % 4) - 1.5) * 0.8, ((r / 12) | 0) * 1.6 - 0.8]);
        for (let $ of [2.5, 8]) k(kt(v, bt([0.6, 0.7, 0])), $ * n, e.c0);
      }
    if (!p.length) return null;
    let L = p.map((r) => ({ ...r, ...gt(c(r.R0), r.p, { iters: 6 }) })).sort((r, v) => r.cost - v.cost),
      C = [];
    for (let r of L) {
      if (C.length >= (e.maxTop ?? 5)) break;
      C.push(r);
    }
    L = C.map((r) => ({
      R0: r.R0,
      ...gt(c(r.R0), r.p, { iters: e.iters ?? 120, wantJ: !!e.uncertainty }),
    })).sort((r, v) => r.cost - v.cost);
    let g = L[0],
      w = Oe(g.p, g.R0, o),
      m = { ...w, p: g.p, R0: g.R0, cost: g.cost, sigma: s, cone: Jt(w), vis: En(w), vps: $n(w), box: o.box };
    if (
      ((m.vRes = t.V.map((r) => ({
        l: r.l,
        p: r.p,
        q: w.P[r.l],
        d: Math.hypot(w.P[r.l][0] - r.p[0], w.P[r.l][1] - r.p[1]),
      }))),
      (m.rms = Math.sqrt(m.vRes.reduce((r, v) => r + v.d * v.d, 0) / (m.vRes.length || 1))),
      e.uncertainty && g.J)
    ) {
      let r = Te(g.J);
      if (r) {
        let v = g.r.length,
          $ = g.p.length,
          S = Math.max((1.5 / s) ** 2, g.cost / Math.max(1, v - $));
        if (((m.cov = r.map((R) => R.map((d) => d * S))), o.box)) {
          let R = (d) => {
            let y = 0;
            for (let E = 0; E < 2; E++) for (let P = 0; P < 2; P++) y += d[E] * d[P] * m.cov[9 + E][9 + P];
            return Math.sqrt(Math.max(0, y));
          };
          m.dimSig = { "01": R([1, -1]), "02": R([2, 1]), 12: R([1, 2]) };
        }
        m.fSig = Math.sqrt(Math.max(0, m.cov[6][6]));
      }
    }
    return m;
  }
  function Fe(t) {
    let e = Math.cbrt(t.D[0] * t.D[1] * t.D[2]);
    return t.D.map((n) => n / e);
  }
  function ce(t, e = {}) {
    let n = e.page || { w: 1600, h: 1e3 };
    for (let s = 0; s < 400; s++) {
      let o = e.f ?? 900 + t() * 2100,
        a = e.c ?? [n.w / 2 + H(t) * 40, n.h / 2 + H(t) * 30],
        f = e.R ?? Ie(t),
        l = e.D ?? [1, 1, 1],
        i = e.sizePx ?? 230 + t() * 200,
        h = e.at ?? [n.w * (0.25 + 0.5 * t()), n.h * (0.28 + 0.44 * t())],
        u = (o / i) * 1,
        x = [((h[0] - a[0]) / o) * u, ((h[1] - a[1]) / o) * u, u],
        b = [...Array(8)].map((m, r) => {
          let v = xt(r);
          return [0, 1, 2].map(
            ($) => f[$][0] * v[0] * l[0] + f[$][1] * v[1] * l[1] + f[$][2] * v[2] * l[2] + x[$],
          );
        });
      if (b.some((m) => m[2] < 0.2 * u)) continue;
      let c = b.map((m) => [a[0] + (o * m[0]) / m[2], a[1] + (o * m[1]) / m[2]]),
        p = K.map((m) => {
          let r = [0, 1, 2].map(($) => f[$][m.axis] * (m.side ? 1 : -1)),
            v = [0, 1, 2].map(($) => m.v.reduce((S, R) => S + b[R][$], 0) / 4);
          return G(r, N(v));
        }),
        k = p.filter((m) => m < 0).length,
        L = e.faces ?? 3;
      if (
        k !== L ||
        p.some((m) => Math.abs(m) < (e.minTilt ?? 0.12)) ||
        c.some((m) => m[0] < 40 || m[0] > n.w - 40 || m[1] < 40 || m[1] > n.h - 40)
      )
        continue;
      let C = 1 / 0;
      for (let m = 0; m < 8; m++) for (let r = m + 1; r < 8; r++) C = Math.min(C, U(c[m], c[r]));
      if (C < 0.12 * i) continue;
      let g = !1;
      for (let [m, r, v] of ct)
        for (let [$, S, R] of ct) {
          if (v !== R || m >= $) continue;
          let d = [c[r][0] - c[m][0], c[r][1] - c[m][1]],
            y = Math.hypot(...d) || 1,
            E = (P) => Math.abs((P[0] - c[m][0]) * d[1] - (P[1] - c[m][1]) * d[0]) / y;
          Math.max(E(c[$]), E(c[S])) < 0.05 * i && (g = !0);
        }
      if (g && !e.allowAccidental) continue;
      let w = 0;
      for (let m of b) w = Math.max(w, (Math.atan(Math.hypot(m[0], m[1]) / m[2]) * 180) / Math.PI);
      if (!(e.maxCone && w > e.maxCone) && !(e.minCone && w < e.minCone))
        return { f: o, c: a, R: f, D: l, T: x, X: b, P: c, faceVis: p.map((m) => m < 0), cone: w, page: n };
    }
    return null;
  }
  function Ne(t) {
    return ct.map(([e, n, s]) => {
      let a = K.map((f, l) => ({ F: f, i: l }))
        .filter(({ F: f }) => f.v.includes(e) && f.v.includes(n))
        .some(({ i: f }) => t.faceVis[f]);
      return { a: e, b: n, k: s, visible: a };
    });
  }
  function _e(t, e, n, s = {}) {
    let o = {
        hidden: "omit",
        endJ: 1.6,
        bow: 0.007,
        jitter: 0.45,
        over: [-0.03, 0.1],
        retrace: 0.12,
        corners: 0.25,
        hooks: 0.15,
        ...s,
      },
      a = [],
      f = Math.hypot(
        Math.max(...t.map((c) => c[0])) - Math.min(...t.map((c) => c[0])),
        Math.max(...t.map((c) => c[1])) - Math.min(...t.map((c) => c[1])),
      ),
      l = t.map((c) => [c[0] + H(n) * o.endJ, c[1] + H(n) * o.endJ]),
      i = (c, p, k = {}) => {
        let L = U(c, p),
          C = [(p[0] - c[0]) / L, (p[1] - c[1]) / L],
          g = [-C[1], C[0]],
          w = k.noOverStart ? 0 : (o.over[0] + n() * (o.over[1] - o.over[0])) * L,
          m = k.noOverEnd ? 0 : (o.over[0] + n() * (o.over[1] - o.over[0])) * L,
          r = H(n) * o.bow * L,
          v = H(n) * o.bow * 0.4 * L,
          $ = n() * 6,
          S = [],
          R = 3,
          d = Math.max(2, Math.round((L + w + m) / R));
        for (let y = 0; y <= d; y++) {
          let E = -w / L + ((y / d) * (L + w + m)) / L,
            P = Math.min(1, Math.max(0, E)),
            z = r * 4 * P * (1 - P) + v * Math.sin($ + P * 9) * P * (1 - P) + H(n) * o.jitter;
          S.push([c[0] + C[0] * L * E + g[0] * z, c[1] + C[1] * L * E + g[1] * z]);
        }
        return S;
      },
      h = (c) => {
        if (n() > o.hooks) return c;
        let p = c[c.length - 1],
          k = c[c.length - 2],
          L = [p[0] - k[0], p[1] - k[1]],
          C = Math.hypot(...L) || 1,
          g = (n() < 0.5 ? 1 : -1) * (1.6 + n()),
          w = 4 + n() * 5,
          m = Math.cos(g),
          r = Math.sin(g),
          v = [(L[0] * m - L[1] * r) / C, (L[0] * r + L[1] * m) / C];
        return [...c, [p[0] + v[0] * w * 0.5, p[1] + v[1] * w * 0.5], [p[0] + v[0] * w, p[1] + v[1] * w]];
      },
      u = e.filter((c) => c.visible || o.hidden === "solid"),
      x = o.hidden === "dashed" ? e.filter((c) => !c.visible) : [],
      b = new Set();
    for (let c of u) {
      if (b.has(c) || n() > o.corners) continue;
      let p = u.find(
        (m) => m !== c && !b.has(m) && (m.a === c.b || m.b === c.b || m.a === c.a || m.b === c.a),
      );
      if (!p) continue;
      let k = [c.a, c.b].find((m) => m === p.a || m === p.b),
        L = c.a === k ? c.b : c.a,
        C = p.a === k ? p.b : p.a,
        g = i(l[L], l[k], { noOverEnd: !0 }),
        w = i(l[k], l[C], { noOverStart: !0 });
      a.push({ pts: h([...g, ...w.slice(1)]) }), b.add(c), b.add(p);
    }
    for (let c of u) {
      if (b.has(c)) continue;
      let [p, k] = n() < 0.5 ? [c.a, c.b] : [c.b, c.a];
      a.push({ pts: h(i(l[p], l[k])) }),
        n() < o.retrace &&
          a.push({ pts: i([l[p][0] + H(n), l[p][1] + H(n)], [l[k][0] + H(n), l[k][1] + H(n)]) });
    }
    for (let c of x) {
      let p = l[c.a],
        k = l[c.b],
        L = U(p, k),
        C = 9 + n() * 6,
        g = 6 + n() * 4;
      for (let w = 0; w < L; w += C + g) {
        let m = Math.min(L, w + C);
        if (m - w < 3) break;
        let r = [p[0] + ((k[0] - p[0]) * w) / L, p[1] + ((k[1] - p[1]) * w) / L],
          v = [p[0] + ((k[0] - p[0]) * m) / L, p[1] + ((k[1] - p[1]) * m) / L];
        a.push({ pts: [r, [(r[0] + v[0]) / 2 + H(n) * 0.3, (r[1] + v[1]) / 2 + H(n) * 0.3], v], hidden: !0 });
      }
    }
    return { strokes: a, J: l, size: f };
  }
  function An(t, e) {
    if (t.length < 2) return t.slice();
    let n = 0;
    for (let h = 1; h < t.length; h++) n += U(t[h - 1], t[h]);
    if (n < 1e-9) return [t[0]];
    let s = Math.max(2, Math.round(n / e) + 1),
      o = n / (s - 1),
      a = [t[0].slice(0, 2)],
      f = 0,
      l = 1,
      i = t[0];
    for (let h = 1; h < s - 1; h++) {
      let u = h * o;
      for (; l < t.length; ) {
        let x = U(i, t[l]);
        if (f + x >= u) {
          let b = (u - f) / (x || 1),
            c = [i[0] + (t[l][0] - i[0]) * b, i[1] + (t[l][1] - i[1]) * b];
          (f = u), (i = c), a.push(c);
          break;
        }
        (f += x), (i = t[l]), l++;
      }
    }
    return a.push(t[t.length - 1].slice(0, 2)), a;
  }
  function Ln(t) {
    let e = t.length,
      n = {
        x: new Float64Array(e + 1),
        y: new Float64Array(e + 1),
        xx: new Float64Array(e + 1),
        yy: new Float64Array(e + 1),
        xy: new Float64Array(e + 1),
      },
      s = 0,
      o = 0;
    for (let a of t) (s += a[0]), (o += a[1]);
    (s /= e), (o /= e);
    for (let a = 0; a < e; a++) {
      let f = t[a][0] - s,
        l = t[a][1] - o;
      (n.x[a + 1] = n.x[a] + f),
        (n.y[a + 1] = n.y[a] + l),
        (n.xx[a + 1] = n.xx[a] + f * f),
        (n.yy[a + 1] = n.yy[a] + l * l),
        (n.xy[a + 1] = n.xy[a] + f * l);
    }
    return (a, f) => {
      let l = f - a + 1,
        i = n.x[f + 1] - n.x[a],
        h = n.y[f + 1] - n.y[a],
        u = n.xx[f + 1] - n.xx[a] - (i * i) / l,
        x = n.yy[f + 1] - n.yy[a] - (h * h) / l,
        b = n.xy[f + 1] - n.xy[a] - (i * h) / l,
        c = (u + x) / 2 - Math.sqrt(Math.max(0, ((u - x) * (u - x)) / 4 + b * b));
      return { sse: Math.max(0, c), m: l };
    };
  }
  function le(t) {
    let e = ae(t);
    for (let n = 0; n < 4; n++) {
      let s = Math.max(0.8, e.rms * 1.5),
        o = t.map((f) => {
          let l = Math.abs((f[0] - e.c[0]) * e.d[1] - (f[1] - e.c[1]) * e.d[0]) / s;
          return 1 / (1 + l * l);
        });
      e = { ...ae(t, o) };
    }
    return e;
  }
  var Sn = { step: 2, rmsAbs: 1.25, rmsRel: 0.016, minSeg: 7 };
  function Ue(t, e = {}) {
    let n = { ...Sn, ...e },
      s = 0;
    for (let g = 1; g < t.length; g++) s += U(t[g - 1], t[g]);
    let o = Math.max(n.step, s / 700),
      a = An(t, o);
    if (a.length < 2) return { segs: [], curve: !1, pts: a };
    let f = a.length,
      l = Ln(a),
      i = (g, w) => U(a[g], a[w]),
      h = (g, w) => {
        let { sse: m, m: r } = l(g, w),
          v = i(g, w);
        return Math.sqrt(m / r) <= Math.max(n.rmsAbs, n.rmsRel * v);
      },
      u = new Array(f).fill(1 / 0),
      x = new Array(f).fill(1 / 0),
      b = new Array(f).fill(-1);
    (u[0] = 0), (x[0] = 0);
    for (let g = 1; g < f; g++) {
      let w = 0;
      for (let m = g - 1; m >= 0; m--) {
        if (u[m] === 1 / 0) continue;
        if (!h(m, g)) {
          if (++w > 40 && g - m > 60) break;
          continue;
        }
        let r = u[m] + 1,
          v = x[m] + l(m, g).sse;
        (r < u[g] || (r === u[g] && v < x[g])) && ((u[g] = r), (x[g] = v), (b[g] = m));
      }
      u[g] === 1 / 0 && ((u[g] = u[g - 1] + 1), (x[g] = x[g - 1]), (b[g] = g - 1));
    }
    let c = [];
    for (let g = f - 1; g > 0; g = b[g]) c.push([b[g], g]);
    c.reverse();
    for (let g = 0; g < c.length - 1; g++) {
      let w = c[g],
        m = c[g + 1],
        r = w[1],
        v = l(w[0], w[1]).sse + l(m[0], m[1]).sse;
      for (let $ = Math.max(w[0] + 2, w[1] - 8); $ <= Math.min(m[1] - 2, w[1] + 8); $++) {
        let S = l(w[0], $).sse + l($, m[1]).sse;
        S < v && ((v = S), (r = $));
      }
      (w[1] = r), (m[0] = r);
    }
    let p = c.map(([g, w]) => ({ i: g, j: w })),
      k = (g) => ((g.line = le(a.slice(g.i, g.j + 1))), (g.len = g.line.len), g);
    p.forEach(k);
    for (let g = 0; g < p.length - 1; ) {
      let w = p[g],
        m = p[g + 1];
      if (X(w.line.d, m.line.d) < 7) {
        let r = k({ i: w.i, j: m.j }),
          v = r.len;
        if (r.line.rms <= Math.max(n.rmsAbs * 1.6, n.rmsRel * 1.6 * v)) {
          p.splice(g, 2, r);
          continue;
        }
      }
      g++;
    }
    let L = Math.max(...p.map((g) => g.len));
    p = p.filter((g, w) => {
      let m = w === 0 || w === p.length - 1;
      if (p.length === 1) return g.len >= n.minSeg;
      if (m) {
        let r = p[w === 0 ? 1 : w - 1];
        return g.len >= Math.max(n.minSeg * 1.6, 0.14 * r.len, 0.06 * L);
      }
      return g.len >= Math.max(n.minSeg, 0.05 * L);
    });
    for (let g = 0; g < p.length - 1; g++) {
      let w = p[g],
        m = p[g + 1],
        r = Pt(w.line.c, w.line.d, m.line.c, m.line.d);
      (w.linkNext = !0),
        (m.linkPrev = !0),
        r && X(w.line.d, m.line.d) > 12 && ((w.cornerEnd = [r[0], r[1]]), (m.cornerStart = [r[0], r[1]]));
    }
    let C = !1;
    if (p.length >= 4) {
      let g = p.map((v) => v.len).sort((v, $) => v - $),
        w = g[g.length >> 1],
        m = 0,
        r = 0;
      for (let v = 0; v < p.length - 1; v++) {
        let $ = Rt(p[v].line.d, p[v + 1].line.d) * Math.sign(Rn(p[v], p[v + 1])),
          S = Math.sign($);
        S === m && r++, (m = S);
      }
      w < 0.2 * s && r >= p.length - 3 && (C = !0);
    }
    for (let g of p) {
      let w = g.line,
        m = a[g.i];
      (m[0] - w.c[0]) * w.d[0] + (m[1] - w.c[1]) * w.d[1] > 0 &&
        (g.line = { ...w, d: [-w.d[0], -w.d[1]], a: w.b, b: w.a, t0: -w.t1, t1: -w.t0 }),
        (g.pts = a.slice(g.i, g.j + 1));
    }
    return { segs: p, curve: C, pts: a, length: s };
  }
  function Rn(t, e) {
    let n = Ut(t.line.a, t.line.b),
      s = Ut(e.line.a, e.line.b);
    return n[0] * s[0] + n[1] * s[1] || 1;
  }
  function Ct(t, e) {
    return (e[0] - t.c[0]) * t.d[0] + (e[1] - t.c[1]) * t.d[1];
  }
  function fe(t, e) {
    return Math.abs((e[0] - t.c[0]) * t.d[1] - (e[1] - t.c[1]) * t.d[0]);
  }
  function Xe(t, e, n = {}) {
    let s = le(t);
    return {
      pts: t,
      c: s.c,
      d: s.d,
      a: s.a,
      b: s.b,
      len: s.len,
      rms: s.rms,
      t0: s.t0,
      t1: s.t1,
      members: e,
      ...n,
    };
  }
  function We(t, e = {}) {
    if (!t.length) return [];
    let n = t.flatMap((x) => [x.line.a, x.line.b]),
      s = nt(n).diag || 1,
      o = e.tolPerp ?? Math.max(3.5, 0.012 * s),
      a = e.tolAng ?? 5,
      f = t.map((x, b) => Xe(x.pts, [b], { hidden: !!x.hidden, tool: x.hidden ? "h" : "s", pieces: 1 })),
      l = () =>
        f.flatMap((x, b) => [
          { p: x.a, i: b },
          { p: x.b, i: b },
        ]),
      i = !0,
      h = 0;
    for (; i && h++ < 400; ) {
      i = !1;
      let x = f.map((b, c) => c).sort((b, c) => f[c].len - f[b].len);
      t: for (let b of x)
        for (let c of x) {
          if (b === c) continue;
          let p = f[b],
            k = f[c];
          if (k.len > p.len || p.tool !== k.tool) continue;
          let L = k.len < 40;
          if (X(p.d, k.d) > (L ? a * 2.4 : a)) continue;
          let C = fe(p, k.a),
            g = fe(p, k.b),
            w = o * (L ? 1.2 : 1);
          if (C > w || g > w) continue;
          let m = [Ct(p, k.a), Ct(p, k.b)].sort((d, y) => d - y),
            r = Math.min(m[1], p.t1) - Math.max(m[0], p.t0),
            v = !1,
            $ = p.hidden && k.hidden,
            S = p.pieces + k.pieces;
          if (r >= 0.3 * k.len || r >= 0.6 * Math.min(k.len, p.len)) v = !0;
          else if (r > -1) v = !0;
          else {
            let d = -r;
            if (d <= Math.max(26, 1.4 * Math.min(p.len, k.len)) && d < 0.25 * s) {
              let y = m[0] > p.t1 ? p.t1 : m[1],
                E = m[0] > p.t1 ? m[0] : p.t0;
              l().some((z) => {
                if (z.i === b || z.i === c) return !1;
                let T = f[z.i];
                if (T.tool !== p.tool || X(T.d, p.d) < 20) return !1;
                let j = Ct(p, z.p),
                  I = Math.max(4, o);
                return j > y - I && j < E + I && fe(p, z.p) < o * 1.5;
              }) || ((v = !0), (p.hidden || k.hidden || (p.len < 60 && k.len < 60)) && ($ = !0));
            }
          }
          if (!v) continue;
          let R = Xe([...p.pts, ...k.pts], [...p.members, ...k.members], {
            hidden: $,
            pieces: S,
            tool: p.tool,
          });
          if (!(R.rms > Math.max(2.5, o * 0.7))) {
            (f[b] = R), f.splice(c, 1), (i = !0);
            break t;
          }
        }
    }
    let u = Math.max(10, 0.03 * s);
    return (
      (f = f.filter((x) => x.len >= u)),
      f.forEach((x) => {
        if (x.pieces >= 3 && !x.hidden) {
          let b = x.members
              .map((L) => {
                let C = t[L];
                return [Ct(x, C.line.a), Ct(x, C.line.b)].sort((g, w) => g - w);
              })
              .sort((L, C) => L[0] - C[0]),
            c = 0,
            p = 0,
            k = -1 / 0;
          for (let [L, C] of b)
            L > k + 3 && c++, (p += Math.max(0, C - Math.max(L, k))), (k = Math.max(k, C));
          c >= 3 && p < 0.8 * x.len && (x.hidden = !0);
        }
      }),
      f.forEach((x, b) => {
        x.id = b;
      }),
      f
    );
  }
  function Ht(t, e) {
    return (e[0] - t.c[0]) * t.d[0] + (e[1] - t.c[1]) * t.d[1];
  }
  function Je(t) {
    let e = 0,
      n = 0,
      s = 0,
      o = 0,
      a = 0;
    for (let l of t) {
      let i = [-l.d[1], l.d[0]],
        h = i[0] * l.c[0] + i[1] * l.c[1],
        u = 1;
      (e += u * i[0] * i[0]),
        (n += u * i[0] * i[1]),
        (s += u * i[1] * i[1]),
        (o += u * i[0] * h),
        (a += u * i[1] * h);
    }
    return it(
      [
        [e, n],
        [n, s],
      ],
      [o, a],
    );
  }
  function He(t, e, n = 1) {
    let s = t.length,
      o = nt(t.flatMap((r) => [r.a, r.b])).diag || 1,
      a = Math.max(10, 0.045 * o) * n,
      f = Math.max(14, 0.07 * o) * n,
      l = [],
      i = new Map();
    t.forEach((r, v) =>
      r.members.forEach(($) => {
        let S = e[$];
        if (!S) return;
        let R = Ht(r, S.line.a),
          d = Ht(r, S.line.b);
        i.set($, {
          line: v,
          start: Math.abs(R - r.t0) < Math.abs(R - r.t1) ? 0 : 1,
          end: Math.abs(d - r.t0) < Math.abs(d - r.t1) ? 0 : 1,
        });
      }),
    );
    for (let r = 0; r < s; r++)
      for (let v = r + 1; v < s; v++) {
        let $ = t[r],
          S = t[v];
        if (X($.d, S.d) < 10) continue;
        let R = Pt($.c, $.d, S.c, S.d);
        if (!R) continue;
        let d = [R[0], R[1]],
          y = (T) => {
            let j = Ht(T, d),
              I = j - T.t0,
              q = T.t1 - j,
              et = Math.abs(I) < Math.abs(q) ? 0 : 1,
              _ = et === 0 ? I : q,
              ht = Math.min(0.34 * T.len, f);
            return _ < -a || _ > ht ? null : { e: et, out: Math.max(0, -_), in: Math.max(0, _) };
          },
          E = y($),
          P = y(S);
        if (!E || !P) continue;
        let z = E.out + P.out + 0.6 * (E.in + P.in);
        l.push({ i: r, ei: E.e, j: v, ej: P.e, X: d, cost: z / (a + f) });
      }
    for (let [r, v] of i) {
      let $ = e[r];
      if (!$.linkNext) continue;
      let S = i.get(r + 1);
      if (!S || S.line === v.line || e[r + 1].stroke !== $.stroke) continue;
      let R = t[v.line],
        d = t[S.line];
      if (X(R.d, d.d) < 10) continue;
      let y = Pt(R.c, R.d, d.c, d.d);
      y && l.push({ i: v.line, ei: v.end, j: S.line, ej: S.start, X: [y[0], y[1]], cost: -1 });
    }
    l.sort((r, v) => r.cost - v.cost);
    let h = [...Array(2 * s).keys()],
      u = new Map();
    for (let r = 0; r < 2 * s; r++) u.set(r, [r]);
    let x = (r) => (h[r] === r ? r : (h[r] = x(h[r])));
    for (let r of l) {
      let v = x(2 * r.i + r.ei),
        $ = x(2 * r.j + r.ej);
      if (v === $) continue;
      let S = u.get(v),
        R = u.get($),
        d = [...S, ...R];
      if (d.length > 3) continue;
      let y = d.map((P) => P >> 1);
      if (new Set(y).size !== y.length) continue;
      let E = Je(y.map((P) => t[P]));
      E &&
        (y.some((P, z) => {
          let T = t[P],
            j = Ht(T, E),
            q = (d[z] & 1) === 0 ? j - T.t0 : T.t1 - j;
          return q < -a * 1.3 || q > Math.min(0.4 * T.len, f * 1.3);
        }) ||
          ((h[$] = v), u.set(v, d), u.delete($)));
    }
    let b = [],
      c = new Array(2 * s).fill(-1);
    for (let [r, v] of u) {
      if (v.length < 2) continue;
      let $ = v.map((d) => t[d >> 1]),
        S = Je($) || $[0].a,
        R = b.length;
      b.push({ p: S, ends: v.slice(), loose: [] }), v.forEach((d) => (c[d] = R));
    }
    let p = (r) => {
        let v = t[r >> 1];
        return r & 1 ? v.b : v.a;
      },
      k = Math.max(16, 0.06 * o) * n,
      L = [...Array(2 * s).keys()].filter((r) => c[r] < 0);
    for (let r of L) {
      let v = p(r),
        $ = r >> 1,
        S = -1,
        R = k;
      b.forEach((d, y) => {
        if (d.ends.length >= 3 || d.ends.some((P) => P >> 1 === $)) return;
        let E = U(v, d.p);
        E < R && ((R = E), (S = y));
      }),
        S >= 0 && (b[S].ends.push(r), b[S].loose.push(r), (c[r] = S));
    }
    let C = L.filter((r) => c[r] < 0),
      g = [];
    for (let r = 0; r < C.length; r++)
      for (let v = r + 1; v < C.length; v++) {
        let $ = C[r],
          S = C[v];
        if ($ >> 1 === S >> 1) continue;
        let R = U(p($), p(S));
        R < k && g.push([R, $, S]);
      }
    g.sort((r, v) => r[0] - v[0]);
    for (let [, r, v] of g) {
      if (c[r] >= 0 || c[v] >= 0) continue;
      let $ = p(r),
        S = p(v),
        R = b.length;
      b.push({ p: [($[0] + S[0]) / 2, ($[1] + S[1]) / 2], ends: [r, v], loose: [r, v] }), (c[r] = c[v] = R);
    }
    let w = [];
    t.forEach((r, v) => {
      let $ = c[2 * v],
        S = c[2 * v + 1];
      w.push({ line: v, u: $, v: S, ok: $ >= 0 && S >= 0 && $ !== S });
    });
    let m = b.map(() => new Map());
    return (
      w.forEach((r) => {
        r.ok && (m[r.u].has(r.v) ? (r.dup = !0) : (m[r.u].set(r.v, r.line), m[r.v].set(r.u, r.line)));
      }),
      { V: b, E: w, adj: m, vOf: c, size: o, tol: { gapTol: a, overAbs: f, looseTol: k } }
    );
  }
  function Ke(t) {
    let e = new Array(t.V.length).fill(!1),
      n = [];
    for (let s = 0; s < t.V.length; s++) {
      if (e[s]) continue;
      let o = [s],
        a = [];
      for (e[s] = !0; o.length; ) {
        let f = o.pop();
        a.push(f);
        for (let l of t.adj[f].keys()) e[l] || ((e[l] = !0), o.push(l));
      }
      n.push(a);
    }
    return n;
  }
  function he(t, e) {
    let n = t.filter((m) => m.fits.free && m.fits.box);
    if (n.length < 2) return null;
    let s = Math.max(...t.map((m) => m.size)),
      o = e.c0,
      a = Math.hypot(e.page.w, e.page.h),
      f = e.target === "cube",
      l = n.map((m) => m.fits.box.f).sort((m, r) => m - r),
      i = l[l.length >> 1],
      h = n.map((m) => m.fits.box.c[0]).sort((m, r) => m - r),
      u = n.map((m) => m.fits.box.c[1]).sort((m, r) => m - r),
      x = [Math.log(i / s), (h[h.length >> 1] - o[0]) / s, (u[u.length >> 1] - o[1]) / s],
      b = f ? 6 : 8,
      c = n.map((m) => m.fits.box.R),
      p = [...x];
    n.forEach((m) => {
      let r = m.fits.box,
        v = r.T[2];
      p.push(0, 0, 0, r.T[0] / v, r.T[1] / v, Math.log((v * i) / r.f)),
        f || p.push(Math.log(r.D[0]), Math.log(r.D[1]));
    });
    let k = (m) => {
        let r = s * Math.exp(m[0]),
          v = [o[0] + s * m[1], o[1] + s * m[2]];
        return n.map(($, S) => {
          let R = m.slice(3 + S * b, 3 + (S + 1) * b),
            d = kt(bt([R[0], R[1], R[2]]), c[S]),
            y = Math.exp(R[5]),
            E = [R[3] * y, R[4] * y, y],
            P = f ? [1, 1, 1] : [Math.exp(R[6]), Math.exp(R[7]), Math.exp(-R[6] - R[7])],
            z = [...Array(8)].map((T, j) => {
              let I = xt(j);
              return [0, 1, 2].map(
                (q) => d[q][0] * I[0] * P[0] + d[q][1] * I[1] * P[1] + d[q][2] * I[2] * P[2] + E[q],
              );
            });
          return {
            R: d,
            T: E,
            D: P,
            X: z,
            f: r,
            c: v,
            P: z.map((T) => [v[0] + (r * T[0]) / T[2], v[1] + (r * T[1]) / T[2]]),
          };
        });
      },
      C = gt(
        (m) => {
          let r = k(m),
            v = [];
          return (
            n.forEach(($, S) => {
              let R = r[S],
                d = Math.max(2, 0.012 * $.size);
              for (let y of $.obs.V) {
                let E = R.P[y.l];
                v.push(Mt((E[0] - y.p[0]) / d, 3), Mt((E[1] - y.p[1]) / d, 3));
              }
              for (let y of $.obs.L) {
                let E = R.P[y.la],
                  P = R.P[y.lb],
                  z = [P[0] - E[0], P[1] - E[1]],
                  T = Math.hypot(...z) || 1,
                  j = (I) => ((I[0] - E[0]) * z[1] - (I[1] - E[1]) * z[0]) / T / (d * 1.4);
                v.push(Mt(j(y.a), 3), Mt(j(y.b), 3));
              }
              for (let y of R.X) y[2] < 0.05 * R.T[2] && v.push(200);
              v.push(Math.max(0, Jt(R) - 31) * 1.2);
            }),
            v.push(m[1] / ((0.45 * a) / s), m[2] / ((0.45 * a) / s)),
            v
          );
        },
        p,
        { iters: 150 },
      ),
      g = k(C.p),
      w = t.map((m) => {
        let r = n.indexOf(m);
        if (r < 0) return null;
        let v = g[r],
          $ = m.obs.V.map((S) => ({
            l: S.l,
            p: S.p,
            q: v.P[S.l],
            d: Math.hypot(v.P[S.l][0] - S.p[0], v.P[S.l][1] - S.p[1]),
          }));
        return { ...v, vRes: $, rms: Math.sqrt($.reduce((S, R) => S + R.d * R.d, 0) / ($.length || 1)) };
      });
    return { f: g[0].f, c: g[0].c, boxes: w, cost: C.cost };
  }
  var It = [1, 2, 4],
    W = [
      "\u043E\u0440\u0430\u043D\u0436\u0435\u0432\u044B\u0435",
      "\u0441\u0438\u043D\u0438\u0435",
      "\u0440\u043E\u0437\u043E\u0432\u044B\u0435",
    ],
    Pn = [
      "\u043E\u0440\u0430\u043D\u0436\u0435\u0432\u044B\u0445",
      "\u0441\u0438\u043D\u0438\u0445",
      "\u0440\u043E\u0437\u043E\u0432\u044B\u0445",
    ],
    vt = (t, e = 1) => String(Math.round(t * 10 ** e) / 10 ** e).replace(".", ","),
    Z = (t) => t[0].toUpperCase() + t.slice(1);
  function Ge(t, e, n) {
    let { fits: s, vps: o, famLines: a } = t,
      f = n.target,
      l = s.free,
      i = f === "cube" ? s.cube : s.box,
      h = t.size,
      u = t.lineIds.reduce((d, y) => d + e[y].len, 0) / (t.lineIds.length || 1),
      x = [],
      b = [],
      c = { families: [], issues: x, good: b },
      p = [0, 1, 2].map((d) => {
        let y = t.obs.vis.map((z) => K[z]).find((z) => z.axis === d);
        if (y) return y.side;
        if (!l) return 0;
        let E = 0,
          P = 0;
        for (let z = 0; z < 8; z++) z & It[d] ? (P += l.X[z][2]) : (E += l.X[z][2]);
        return P < E ? 1 : 0;
      });
    (c.nearSide = p), (c.nearLabel = p.reduce((d, y, E) => d | (y ? It[E] : 0), 0));
    let k = 0,
      L = 0;
    for (let d = 0; d < 3; d++) {
      let y = [...t.fam].filter(([, I]) => I === d).map(([I]) => I),
        E = o[d],
        P = { k: d, n: y.length, ids: y, vp: E, status: "few", perLine: [] };
      if ((c.families.push(P), !E)) continue;
      P.spread = E.spread;
      let z = E.spread < 1.3 || E.distNorm > 60;
      P.parallel = z;
      let T = 0,
        j = 0;
      if (
        (y.forEach((I) => {
          let [q, et] = t.edgeOf.get(I),
            _ = e[I],
            ht = (q & It[d] ? 1 : 0) === p[d] ? q : et,
            ut = t.vOfLabel[ht] >= 0 ? t.obsV.find((Mn) => Mn.l === ht).p : _.a,
            Ft = U(_.a, ut) < U(_.b, ut) ? _.b : _.a,
            Nt = U(_.a, ut) < U(_.b, ut) ? _.a : _.b,
            Le = [Ft[0] - Nt[0], Ft[1] - Nt[1]],
            _t = E.v,
            Se = [_t[0] - Nt[0] * _t[2], _t[1] - Nt[1] * _t[2]];
          Le[0] * Se[0] + Le[1] * Se[1] > 0 ? (T += _.len) : (j += _.len);
        }),
        (P.diverge = !z && j > T && E.spread > Math.max(2.2, 2 * E.rms)),
        y.length >= 3
          ? ((P.rms = E.rms),
            (P.maxAbs = E.maxAbs),
            (P.perLine = y.map((I, q) => ({ li: I, ang: E.res[q].ang }))),
            P.perLine.forEach((I) => {
              Math.abs(I.ang) >= 3 && (I.ang > 0 ? L++ : k++);
            }),
            (P.status = P.diverge ? "diverge" : E.maxAbs < 3 ? "ok" : "nonconv"))
          : (P.status = P.diverge ? "diverge" : "few"),
        !z && !P.diverge && E.pt)
      ) {
        let I = nt(t.obsV.map((q) => q.p)).c;
        P.vpDist = U(E.pt, I) / h;
      }
    }
    let C = c.families.filter((d) => d.n >= 3 && d.rms !== void 0),
      g = C.reduce((d, y) => d + y.n, 0) || 1;
    if (
      ((c.convRms = C.length ? Math.sqrt(C.reduce((d, y) => d + y.n * y.rms * y.rms, 0) / g) : null),
      o.every(Boolean))
    ) {
      let d = c.families.map((I) => (I.parallel ? "par" : "fin")),
        y = d.filter((I) => I === "par").length,
        E = { nPar: y },
        P = t.norm,
        z = o.map((I, q) => (d[q] === "par" ? [I.vn[0], I.vn[1], 0] : I.vn));
      if (y === 0) {
        let I = o.map((et) => et.pt),
          q = qe(I);
        q && ((E.impossible = !0), (E.obtuse = q));
      } else if (y === 1) {
        let I = d.indexOf("par"),
          [q, et] = [0, 1, 2].filter((ut) => ut !== I),
          _ = o[q].pt,
          ht = o[et].pt;
        if (_ && ht) {
          let ut = [ht[0] - _[0], ht[1] - _[1]],
            Ft = o[I].dirInf;
          (E.perpErr = 90 - X(ut, Ft)), (E.parFam = I), (E.horizonFams = [q, et]);
        }
      } else if (y === 2) {
        let [I, q] = [0, 1, 2].filter((et) => d[et] === "par");
        (E.perpErr = 90 - X(o[I].dirInf, o[q].dirInf)), (E.parFams = [I, q]);
      }
      let T = [(n.c0[0] - P.o[0]) / P.s, (n.c0[1] - P.o[1]) / P.s],
        j = Wt(z, { c: T, w: y ? 0.3 : 0.001 });
      if (j.ok && !E.impossible) {
        (E.f = j.f * P.s), (E.c = [P.o[0] + j.c[0] * P.s, P.o[1] + j.c[1] * P.s]);
        let I = 0;
        for (let q of t.obsV) I = Math.max(I, Math.atan(U(q.p, E.c) / E.f) * Q);
        E.cone = I;
      } else y === 0 && (E.impossible = !0);
      c.camera = E;
    }
    l && (c.implied = { f: l.f, c: l.c, cone: l.cone, rms: l.rms, rel: l.rms / u }), (c.scale = u);
    let w = s.box && s.box.dimSig ? s.box : l;
    if (w && w.D) {
      let d = Fe(w),
        y = w.dimSig || {},
        E = [
          [0, 1],
          [0, 2],
          [1, 2],
        ].map(([z, T]) => ({ i: z, j: T, lr: Math.log(w.D[z] / w.D[T]), s: y[`${z}${T}`] ?? 0.2 }));
      c.props = { r: d, pairs: E, determined: E.every((z) => z.s < 0.12) };
      let P = [0, 1, 2].sort((z, T) => Math.abs(Math.log(d[T])) - Math.abs(Math.log(d[z])))[0];
      (c.props.worst = P),
        (c.props.spread = Math.max(...w.D) / Math.min(...w.D)),
        (c.props.excess = Math.max(0, ...E.map((z) => Math.abs(z.lr) - 1.5 * z.s)));
    }
    let m = c.nearLabel;
    if (t.vOfLabel[m] >= 0 && [0, 1, 2].every((d) => t.vOfLabel[m ^ It[d]] >= 0) && t.obs.vis.length >= 3) {
      let d = t.obsV.find((z) => z.l === m).p,
        E = [0, 1, 2]
          .map((z) => t.obsV.find((T) => T.l === (m ^ It[z])).p)
          .map((z) => Math.atan2(z[1] - d[1], z[0] - d[0])),
        P = [0, 1, 2].sort((z, T) => E[z] - E[T]);
      c.y = {
        p: d,
        angles: P.map((z, T) => {
          let j = P[(T + 1) % 3],
            I = E[j] - E[z];
          return T === 2 && (I += 2 * Math.PI), { k1: z, k2: j, deg: I * Q, mid: E[z] + I / 2 };
        }),
      };
    }
    if (i) {
      (c.answer = { rms: i.rms, rel: i.rms / u, corners: i.vRes, cone: i.cone }), (c.lineFix = []);
      for (let [d, [y, E]] of t.edgeOf) {
        let P = e[d],
          z = i.P[y],
          T = i.P[E],
          j = Xt([T[0] - z[0], T[1] - z[1]], P.d) * Q;
        c.lineFix.push({ li: d, ang: j });
      }
    }
    let r = c.camera || {};
    c.families.forEach((d) => {
      if (d.status === "diverge") {
        let y = d.spread < 4;
        (d.weakDiverge = y),
          x.push({
            sev: y ? 2 : 3,
            kind: "diverge",
            fams: [d.k],
            title: y
              ? `${Z(W[d.k])} \u0440\u0451\u0431\u0440\u0430 \u0441\u043B\u0435\u0433\u043A\u0430 \u0440\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432\u0433\u043B\u0443\u0431\u044C`
              : `${Z(W[d.k])} \u0440\u0451\u0431\u0440\u0430 \u0440\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432\u0433\u043B\u0443\u0431\u044C`,
            text: y
              ? `${Z(W[d.k])} \u0440\u0451\u0431\u0440\u0430 \u043F\u043E\u0447\u0442\u0438 \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B, \u043D\u043E \u0434\u0430\u043B\u044C\u043D\u0438\u0435 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u044B \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0431\u043B\u0438\u0436\u043D\u0438\u0445 (\u043D\u0430 ${vt(d.spread)}\xB0). \u0423\u0445\u043E\u0434\u044F \u0432\u0434\u0430\u043B\u044C, \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B\u0435 \u0440\u0451\u0431\u0440\u0430 \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u0431\u043B\u0438\u0436\u0430\u0442\u044C\u0441\u044F \u0438\u043B\u0438 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B\u043C\u0438.`
              : `\u0427\u0435\u043C \u0434\u0430\u043B\u044C\u0448\u0435 \u043E\u0442 \u0437\u0440\u0438\u0442\u0435\u043B\u044F, \u0442\u0435\u043C \u0434\u0430\u043B\u044C\u0448\u0435 ${W[d.k]} \u0440\u0451\u0431\u0440\u0430 \u0434\u0440\u0443\u0433 \u043E\u0442 \u0434\u0440\u0443\u0433\u0430 (\u0440\u0430\u0437\u0432\u043E\u0440\u043E\u0442 ${vt(d.spread)}\xB0). \u042D\u0442\u043E \u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u0430: \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B\u0435 \u0440\u0451\u0431\u0440\u0430, \u0443\u0445\u043E\u0434\u044F \u0432\u0434\u0430\u043B\u044C, \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u0431\u043B\u0438\u0436\u0430\u0442\u044C\u0441\u044F.`,
          });
      }
    });
    let v = l ? l.rms / u : 1,
      $ = v < 0.022,
      S = (d) => {
        let y = c.families[d];
        return y.n >= 3 && y.spread >= 4 && y.status !== "diverge";
      };
    if (
      (r.obtuse && ![0, 1, 2].every(S) && ((r.impossible = !1), (r.unreliable = !0)),
      r.horizonFams && !r.horizonFams.every(S) && (r.perpErrSoft = !0),
      r.impossible && r.obtuse && $ && r.obtuse.ang < 95 && ((r.impossible = !1), (r.marginal = !0)),
      r.impossible && !r.obtuse && $ && ((r.impossible = !1), (r.marginal = !0)),
      r.perpErr !== void 0 && $ && Math.abs(r.perpErr) < 8 && (r.perpErrSoft = !0),
      r.impossible && r.obtuse)
    ) {
      let d = r.obtuse.i;
      x.push({
        sev: $ ? 2 : 3,
        kind: "camera",
        fams: [d],
        title:
          "\u0422\u0430\u043A\u0438\u0435 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u043D\u0435 \u0434\u0430\u044E\u0442 \u043F\u0440\u044F\u043C\u044B\u0445 \u0443\u0433\u043B\u043E\u0432",
        text: `\u0422\u0440\u0435\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A \u0438\u0437 \u0442\u0440\u0451\u0445 \u0442\u043E\u0447\u0435\u043A \u0441\u0445\u043E\u0434\u0430 \u0442\u0443\u043F\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u044B\u0439 (\u0443\u0433\u043E\u043B \u0443 \u0442\u043E\u0447\u043A\u0438 ${Pn[d]} \u0440\u0451\u0431\u0435\u0440 \u2014 ${Math.round(r.obtuse.ang)}\xB0). \u0423 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u043E\u043D \u0432\u0441\u0435\u0433\u0434\u0430 \u043E\u0441\u0442\u0440\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u044B\u0439, \u0438\u043D\u0430\u0447\u0435 \u0443\u0433\u043B\u044B \u043C\u0435\u0436\u0434\u0443 \u0440\u0451\u0431\u0440\u0430\u043C\u0438 \u043D\u0435 \u043F\u0440\u044F\u043C\u044B\u0435. \u041E\u0431\u044B\u0447\u043D\u043E \u044D\u0442\u043E \u0437\u043D\u0430\u0447\u0438\u0442, \u0447\u0442\u043E ${W[d]} \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u0438\u043B\u044C\u043D\u043E \u0438\u043B\u0438 \u0432 \u0434\u0440\u0443\u0433\u0443\u044E \u0441\u0442\u043E\u0440\u043E\u043D\u0443.`,
      });
    }
    if (
      (r.perpErr !== void 0 &&
        Math.abs(r.perpErr) > 3 &&
        !r.perpErrSoft &&
        (r.parFam !== void 0
          ? x.push({
              sev: Math.abs(r.perpErr) > 7 ? 3 : 2,
              kind: "camera",
              fams: [r.parFam],
              title: `${Z(W[r.parFam])} \u0440\u0451\u0431\u0440\u0430 \u043D\u0435 \u043F\u0435\u0440\u043F\u0435\u043D\u0434\u0438\u043A\u0443\u043B\u044F\u0440\u043D\u044B \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0443`,
              text: `${Z(W[r.parFam])} \u0440\u0451\u0431\u0440\u0430 \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443 \u2014 \u0437\u043D\u0430\u0447\u0438\u0442, \u043E\u043D\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0438\u0434\u0442\u0438 \u043F\u043E\u0434 \u043F\u0440\u044F\u043C\u044B\u043C \u0443\u0433\u043B\u043E\u043C \u043A \u043B\u0438\u043D\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 \u0434\u0432\u0435 \u0434\u0440\u0443\u0433\u0438\u0435 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 (\u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0443). \u0421\u0435\u0439\u0447\u0430\u0441 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 ${Math.round(Math.abs(r.perpErr))}\xB0.`,
            })
          : r.parFams &&
            x.push({
              sev: 2,
              kind: "camera",
              fams: r.parFams,
              title:
                "\u041F\u0435\u0440\u0435\u0434\u043D\u044F\u044F \u0433\u0440\u0430\u043D\u044C \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u043E\u043C",
              text: `${Z(W[r.parFams[0]])} \u0438 ${W[r.parFams[1]]} \u0440\u0451\u0431\u0440\u0430 \u043D\u0435 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F, \u0437\u043D\u0430\u0447\u0438\u0442, \u044D\u0442\u0430 \u0433\u0440\u0430\u043D\u044C \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043F\u0440\u044F\u043C\u043E \u043D\u0430 \u0442\u0435\u0431\u044F. \u0422\u043E\u0433\u0434\u0430 \u0443\u0433\u043E\u043B \u043C\u0435\u0436\u0434\u0443 \u043D\u0438\u043C\u0438 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C 90\xB0, \u0430 \u0441\u0435\u0439\u0447\u0430\u0441 \u043E\u043D \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043D\u0430 ${Math.round(Math.abs(r.perpErr))}\xB0.`,
            })),
      c.families.forEach((d) => {
        if (d.status !== "nonconv") return;
        let y = d.perLine.slice().sort((E, P) => Math.abs(P.ang) - Math.abs(E.ang))[0];
        x.push({
          sev: d.maxAbs > 6 ? 2 : 1,
          slight: d.maxAbs <= 4.5,
          kind: "conv",
          fams: [d.k],
          line: y.li,
          title: `${Z(W[d.k])} \u0440\u0451\u0431\u0440\u0430 \u043D\u0435 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u043E\u0434\u043D\u0443 \u0442\u043E\u0447\u043A\u0443`,
          text: `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u0432\u044B\u0431\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043E\u0434\u043D\u0430 \u043B\u0438\u043D\u0438\u044F: ${vt(Math.abs(y.ang))}\xB0 ${y.ang > 0 ? "\u21BB \u043F\u043E \u0447\u0430\u0441\u043E\u0432\u043E\u0439" : "\u21BA \u043F\u0440\u043E\u0442\u0438\u0432 \u0447\u0430\u0441\u043E\u0432\u043E\u0439"} \u043E\u0442 \u043E\u0431\u0449\u0435\u0439 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430. \u0420\u0430\u0437\u0431\u0440\u043E\u0441 \u043F\u043E \u0441\u0435\u043C\u0435\u0439\u0441\u0442\u0432\u0443 \u2014 ${vt(d.rms)}\xB0.`,
        });
      }),
      f === "cube" && c.props && c.props.excess > 0.07)
    ) {
      let d = c.props.worst,
        y = c.props.r[d];
      x.push({
        sev: c.props.excess > 0.2 ? 2 : 1,
        kind: "props",
        fams: [d],
        title:
          y > 1
            ? `${Z(W[d])} \u0440\u0451\u0431\u0440\u0430 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0434\u043B\u0438\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u043A\u0443\u0431\u0430`
            : `${Z(W[d])} \u0440\u0451\u0431\u0440\u0430 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0434\u043B\u044F \u043A\u0443\u0431\u0430`,
        text: `\u0415\u0441\u043B\u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043F\u043E \u0440\u0438\u0441\u0443\u043D\u043A\u0443 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0443\u044E \u043A\u043E\u0440\u043E\u0431\u043A\u0443, ${W[d]} \u0440\u0451\u0431\u0440\u0430 \u0443 \u043D\u0435\u0451 \u0432 ${vt(y > 1 ? y : 1 / y, 2)} \u0440\u0430\u0437\u0430 ${y > 1 ? "\u0434\u043B\u0438\u043D\u043D\u0435\u0435" : "\u043A\u043E\u0440\u043E\u0447\u0435"} \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E. \u041F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 \u0440\u0451\u0431\u0435\u0440: ${c.props.r.map((E, P) => W[P] + " " + vt(E, 2)).join(" \xB7 ")}.`,
      });
    }
    let R = r.cone ?? (c.implied && c.implied.cone);
    if (
      (R > 34 &&
        x.push({
          sev: R > 45 ? 2 : 1,
          kind: "distort",
          title:
            "\u041F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u0430 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u0438\u043B\u044C\u043D\u0430\u044F",
          text: `\u0427\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u043A\u043E\u0440\u043E\u0431\u043A\u0443 \u0442\u0430\u043A, \u0433\u043B\u0430\u0437 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0447\u0435\u043D\u044C \u0431\u043B\u0438\u0437\u043A\u043E: \u043A\u0440\u0430\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u043D\u0430 ${Math.round(R)}\xB0 \u043E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430 \u0432\u0437\u0433\u043B\u044F\u0434\u0430 (\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u0434\u043E 30\xB0). \u0412 \u0442\u0430\u043A\u043E\u043C \u0432\u0438\u0434\u0435 \u043A\u0443\u0431 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u0438\u0441\u043A\u0430\u0436\u0451\u043D\u043D\u044B\u043C. \u041E\u0442\u043E\u0434\u0432\u0438\u043D\u044C \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u0434\u0430\u043B\u044C\u0448\u0435.`,
        }),
      c.families.forEach((d) => {
        d.vpDist !== void 0 &&
          d.vpDist < 0.9 &&
          d.status !== "diverge" &&
          x.push({
            sev: 1,
            kind: "strong",
            fams: [d.k],
            title: `${Z(W[d.k])} \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0440\u0435\u0437\u043A\u043E`,
            text: "\u0422\u043E\u0447\u043A\u0430 \u0441\u0445\u043E\u0434\u0430 \u043F\u043E\u0447\u0442\u0438 \u0443 \u0441\u0430\u043C\u043E\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438. \u0422\u0430\u043A \u0431\u044B\u0432\u0430\u0435\u0442, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043D\u0430 \u043D\u0435\u0451 \u0432 \u0443\u043F\u043E\u0440.",
          });
      }),
      c.y && c.y.angles.some((d) => d.deg < 89))
    ) {
      let d = Math.min(...c.y.angles.map((y) => y.deg));
      x.push({
        sev: 1,
        kind: "y",
        title:
          "\u041E\u0441\u0442\u0440\u044B\u0439 \u0443\u0433\u043E\u043B \u0443 \u0431\u043B\u0438\u0436\u043D\u0435\u0439 \u0432\u0435\u0440\u0448\u0438\u043D\u044B",
        text: `\u041E\u0434\u0438\u043D \u0438\u0437 \u0443\u0433\u043B\u043E\u0432 \xABY\xBB \u0443 \u0431\u043B\u0438\u0436\u043D\u0435\u0439 \u0432\u0435\u0440\u0448\u0438\u043D\u044B \u2014 ${Math.round(d)}\xB0. \u041F\u0440\u0438 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u0432\u0437\u0433\u043B\u044F\u0434\u0435 \u0432\u0441\u0435 \u0442\u0440\u0438 \u0431\u043E\u043B\u044C\u0448\u0435 90\xB0; \u043C\u0435\u043D\u044C\u0448\u0435 \u0431\u044B\u0432\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0443 \u043A\u0440\u0430\u044F \u043E\u0447\u0435\u043D\u044C \u0448\u0438\u0440\u043E\u043A\u043E\u0433\u043E \u043A\u0430\u0434\u0440\u0430.`,
      });
    }
    if (
      (c.families.forEach((d) => {
        d.n > 0 &&
          d.n < 3 &&
          b.push({
            kind: "few",
            text: `${Z(W[d.k])}: ${d.n === 1 ? "\u043E\u0434\u043D\u043E \u0440\u0435\u0431\u0440\u043E" : "\u0434\u0432\u0430 \u0440\u0435\u0431\u0440\u0430"} \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0438\u0445 \u0441\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F (\u0447\u0435\u0440\u0435\u0437 \u0434\u0432\u0435 \u043B\u0438\u043D\u0438\u0438 \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u043E\u0431\u0449\u0430\u044F \u0442\u043E\u0447\u043A\u0430). \u0414\u043E\u0440\u0438\u0441\u0443\u0439 \u0435\u0449\u0451 \u0440\u0435\u0431\u0440\u043E \u044D\u0442\u043E\u0433\u043E \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F, \u0445\u043E\u0442\u044F \u0431\u044B \u043D\u0435\u0432\u0438\u0434\u0438\u043C\u043E\u0435.`,
          });
      }),
      k + L >= 3 &&
        (k === 0 || L === 0) &&
        x.push({
          sev: 0,
          kind: "bias",
          title:
            "\u041E\u0448\u0438\u0431\u043A\u0438 \u0432 \u043E\u0434\u043D\u0443 \u0441\u0442\u043E\u0440\u043E\u043D\u0443",
          text: `\u0412\u0441\u0435 \u0437\u0430\u043C\u0435\u0442\u043D\u044B\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F \u043F\u043E\u0432\u0451\u0440\u043D\u0443\u0442\u044B ${k ? "\u043F\u0440\u043E\u0442\u0438\u0432 \u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u21BA" : "\u043F\u043E \u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u21BB"}: \u043F\u043E\u0445\u043E\u0436\u0435 \u043D\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443 \u0440\u0443\u043A\u0438. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u043F\u043E\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u043B\u0438\u0441\u0442 \u0438\u043B\u0438 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u044C \u043B\u0438\u043D\u0438\u0438 \u043E\u0442 \u043F\u043B\u0435\u0447\u0430.`,
        }),
      c.answer)
    ) {
      let d = c.answer.corners.slice().sort((y, E) => E.d - y.d)[0];
      d &&
        d.d > Math.max(9, 0.055 * u) &&
        x.push({
          sev: d.d > 0.11 * u ? 2 : 1,
          kind: "corner",
          label: d.l,
          title:
            "\u0423\u0433\u043E\u043B \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043D\u0435 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435",
          text: `\u0421\u0430\u043C\u044B\u0439 \u043D\u0435\u0442\u043E\u0447\u043D\u044B\u0439 \u0443\u0433\u043E\u043B \u2014 \u0432 ${Math.round(d.d)} \u043F\u0438\u043A\u0441. \u043E\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0433\u043E ${f === "cube" ? "\u043A\u0443\u0431\u0430" : "\u043A\u043E\u0440\u043E\u0431\u043A\u0438"}. \u041F\u0443\u043D\u043A\u0442\u0438\u0440 \u043D\u0430 \u0445\u043E\u043B\u0441\u0442\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442, \u043A\u0443\u0434\u0430 \u0435\u0433\u043E \u0441\u0434\u0432\u0438\u043D\u0443\u0442\u044C.`,
        });
    }
    return (
      n.looseCount &&
        x.push({
          sev: 1,
          kind: "loose",
          title:
            n.looseCount === 1
              ? "\u041E\u0434\u043D\u0430 \u043B\u0438\u043D\u0438\u044F \u043D\u0435 \u0441\u0442\u0430\u043B\u0430 \u0440\u0435\u0431\u0440\u043E\u043C"
              : `${n.looseCount} \u043B\u0438\u043D\u0438\u0439 \u043D\u0435 \u0441\u0442\u0430\u043B\u0438 \u0440\u0451\u0431\u0440\u0430\u043C\u0438`,
          text: "\u0421\u0435\u0440\u044B\u0435 \u043B\u0438\u043D\u0438\u0438 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u043A \u0443\u0433\u043B\u0430\u043C \u043A\u043E\u0440\u043E\u0431\u043A\u0438. \u041E\u0431\u044B\u0447\u043D\u043E \u044D\u0442\u043E \u0440\u0435\u0431\u0440\u043E, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043D\u0435 \u0434\u043E\u0445\u043E\u0434\u0438\u0442 \u0434\u043E \u0443\u0433\u043B\u0430, \u0438\u043B\u0438 \u043E\u0434\u043D\u0430 \u043B\u0438\u043D\u0438\u044F, \u043F\u0440\u043E\u0432\u0435\u0434\u0451\u043D\u043D\u0430\u044F \u0447\u0435\u0440\u0435\u0437 \u0434\u0432\u0430 \u0440\u0435\u0431\u0440\u0430 \u0431\u0435\u0437 \u0438\u0437\u043B\u043E\u043C\u0430.",
        }),
      x.sort((d, y) => y.sev - d.sev),
      C.forEach((d) => {
        d.status === "ok" &&
          b.push({
            kind: "ok",
            text: `${Z(W[d.k])} \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u043E\u0434\u043D\u0443 \u0442\u043E\u0447\u043A\u0443 (\u0440\u0430\u0437\u0431\u0440\u043E\u0441 ${vt(d.rms)}\xB0)`,
          });
      }),
      f === "cube" &&
        c.props &&
        c.props.excess <= 0.07 &&
        c.props.determined &&
        b.push({
          kind: "ok",
          text: "\u041F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 \u043A\u0430\u043A \u0443 \u043A\u0443\u0431\u0430",
        }),
      r.cone !== void 0 &&
        r.cone <= 34 &&
        !r.impossible &&
        b.push({
          kind: "ok",
          text: `\u0422\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u044B: \u0442\u0430\u043A\u043E\u0439 \u0432\u0438\u0434 \u0434\u0430\u0451\u0442 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0430\u044F \u043A\u0430\u043C\u0435\u0440\u0430 (\u043A\u0440\u0430\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u0432 ${Math.round(r.cone)}\xB0 \u043E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430 \u0432\u0437\u0433\u043B\u044F\u0434\u0430)`,
        }),
      (c.score = zn(c, f, u)),
      c
    );
  }
  function Kt(t, e, n) {
    return se((100 * (n - t)) / (n - e), 0, 100);
  }
  function zn(t, e, n) {
    let s = [];
    if (
      (t.convRms !== null &&
        t.convRms !== void 0 &&
        s.push({
          key: "conv",
          name: "\u0421\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0440\u0451\u0431\u0435\u0440",
          val: Kt(t.convRms, 0.8, 6),
          w: 0.3,
        }),
      t.implied &&
        s.push({
          key: "cons",
          name: "\u0421\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u043E\u0441\u0442\u044C \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u044B",
          val: Kt(t.implied.rel, 0.012, 0.08),
          w: 0.2,
        }),
      e === "cube" &&
        t.props &&
        s.push({
          key: "props",
          name: "\u041F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 \u043A\u0443\u0431\u0430",
          val: Kt(t.props.excess, 0.04, 0.45),
          w: 0.2,
        }),
      t.answer &&
        s.push({
          key: "answer",
          name:
            e === "cube"
              ? "\u0411\u043B\u0438\u0437\u043E\u0441\u0442\u044C \u043A \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u043C\u0443 \u043A\u0443\u0431\u0443"
              : "\u0411\u043B\u0438\u0437\u043E\u0441\u0442\u044C \u043A \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0435",
          val: Kt(t.answer.rel, 0.015, 0.12),
          w: 0.3,
        }),
      !s.length)
    )
      return null;
    let o = s.reduce((i, h) => i + h.w, 0),
      a = s.reduce((i, h) => i + h.val * h.w, 0) / o;
    (a = 0.75 * a + 0.25 * Math.min(...s.map((i) => i.val))),
      t.families.some((i) => i.status === "diverge" && !i.weakDiverge)
        ? (a = Math.min(a, 45))
        : t.families.some((i) => i.status === "diverge") && (a = Math.min(a, 68)),
      t.camera && t.camera.impossible && (a = Math.min(a, 55));
    let f = t.camera && t.camera.cone !== void 0 ? t.camera.cone : t.implied && t.implied.cone;
    f > 34 && (a -= Math.min(20, (f - 34) * 1.2)),
      (a = Math.round(se(a, 0, 100))),
      s.forEach((i) => (i.val = Math.round(i.val)));
    let l =
      a >= 90
        ? "\u043E\u0442\u043B\u0438\u0447\u043D\u043E"
        : a >= 75
          ? "\u0445\u043E\u0440\u043E\u0448\u043E"
          : a >= 60
            ? "\u043D\u0435\u043F\u043B\u043E\u0445\u043E"
            : "\u043D\u0430\u0434\u043E \u043F\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C";
    return { total: a, grade: l, parts: s };
  }
  function Qe(t, e, n) {
    let s = t
      .map((b, c) => {
        let p = b.fits.free;
        if (!p || !p.cov) return null;
        let k = [6, 7, 8].map((w) => [6, 7, 8].map((m) => p.cov[w][m])),
          L = b.size,
          C = [Math.log(p.f), p.c[0], p.c[1]],
          g = [
            [k[0][0], k[0][1] * L, k[0][2] * L],
            [k[1][0] * L, k[1][1] * L * L, k[1][2] * L * L],
            [k[2][0] * L, k[2][1] * L * L, k[2][2] * L * L],
          ];
        return (
          (g[0][0] += 0.0036),
          (g[1][1] += (0.03 * p.f) ** 2),
          (g[2][2] += (0.03 * p.f) ** 2),
          { i: c, x: C, C: g, Ci: Ye(g), f: p.f }
        );
      })
      .filter(Boolean);
    if (s.length < 2) return null;
    let o = [0, 1, 2].map((b) => Cn(s.map((c) => c.x[b]))),
      a = (b, c) => {
        let p = b.x.map((k, L) => k - c[L]);
        return Math.sqrt(
          Math.max(
            0,
            p.reduce((k, L, C) => k + L * p.reduce((g, w, m) => g + b.Ci[C][m] * w, 0), 0),
          ),
        );
      };
    for (let b = 0; b < 12; b++) {
      let c = [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        p = [0, 0, 0];
      s.forEach((L) => {
        let C = a(L, o),
          g = 1 / (1 + (C * C) / 4);
        for (let w = 0; w < 3; w++) {
          p[w] += g * L.Ci[w].reduce((m, r, v) => m + r * L.x[v], 0);
          for (let m = 0; m < 3; m++) c[w][m] += g * L.Ci[w][m];
        }
      });
      let k = Ye(c);
      if (!k) break;
      o = [0, 1, 2].map((L) => k[L].reduce((C, g, w) => C + g * p[w], 0));
    }
    let f = Math.exp(o[0]),
      l = [o[1], o[2]],
      i = { f, c: l, issues: [] };
    s.forEach((b) => {
      let c = a(b, o),
        p = b.x[0] - o[0],
        k = Math.hypot(b.x[1] - l[0], b.x[2] - l[1]) / f,
        L = c > 3 && (Math.abs(p) > 0.25 || k > 0.2);
      i.issues.push({ box: b.i, d: c, fRatio: Math.exp(p), dc: k, odd: L });
    });
    let h = i.issues.filter((b) => !b.odd).map((b) => t[b.box]),
      u = { f, c: l };
    if (h.length >= 2) {
      let b = he(h, n);
      b && (u = { f: b.f, c: b.c });
    }
    i.issues.forEach((b) => {
      let c = t[b.box],
        p = c.fits.free,
        k = at(c.obs, {
          c0: n.c0,
          page: Math.hypot(n.page.w, n.page.h),
          size: c.size,
          box: !0,
          camera: "free",
          cam: u,
          vps: c.vps.map((L) => L && L.v),
        });
      (b.fixedRel = k ? k.rms / c.size : 1),
        (b.ownRel = p.rms / c.size),
        (b.fixedFit = k),
        b.odd && b.fixedRel < Math.max(0.02, 2 * b.ownRel) && (b.odd = !1);
    });
    let x = i.issues.filter((b) => !b.odd).map((b) => t[b.box]);
    if (x.length >= 2) {
      let b = he(x, n);
      b && ((i.fit = b), (i.f = b.f), (i.c = b.c));
    }
    return (i.horizon = In(t, i)), i;
  }
  function Cn(t) {
    let e = t.slice().sort((n, s) => n - s);
    return e[e.length >> 1];
  }
  function Ye(t) {
    let [e, n, s] = t[0],
      [o, a, f] = t[1],
      [l, i, h] = t[2],
      u = a * h - f * i,
      x = -(o * h - f * l),
      b = o * i - a * l,
      c = e * u + n * x + s * b;
    return Math.abs(c) < 1e-300
      ? null
      : [
          [u / c, -(n * h - s * i) / c, (n * f - s * a) / c],
          [x / c, (e * h - s * l) / c, -(e * f - s * o) / c],
          [b / c, -(e * i - n * l) / c, (e * a - n * o) / c],
        ];
  }
  function In(t, e) {
    if (!e.fit) return null;
    let n = e.fit.boxes.filter(Boolean).map((s) => [0, 1, 2].map((o) => [s.R[0][o], s.R[1][o], s.R[2][o]]));
    if (n.length < 2) return null;
    for (let s = 0; s < 3; s++) {
      let o = n[0][s],
        a = n.map((h) =>
          h.findIndex((u) => Math.abs(u[0] * o[0] + u[1] * o[1] + u[2] * o[2]) > Math.cos(6 / Q)),
        );
      if (a.some((h) => h < 0)) continue;
      let f = e.f,
        l = e.c,
        i = o;
      return {
        n: [i[0], i[1], i[2]],
        f,
        c: l,
        line: [i[0] / f, i[1] / f, i[2] - (i[0] * l[0] + i[1] * l[1]) / f],
        upFam: a,
      };
    }
    return null;
  }
  function tn(t, e = {}) {
    let n = ue(),
      s = e.target || "cube",
      o = e.page || { w: 1600, h: 1e3 },
      a = e.center || [o.w / 2, o.h / 2],
      f = [],
      l = [];
    t.forEach((c, p) => {
      if (!c.pts || c.pts.length < 2) return;
      let k = Ue(c.pts);
      if (k.curve) {
        l.push(p);
        return;
      }
      k.segs.forEach((L) => f.push({ ...L, stroke: p, hidden: !!c.hidden }));
    });
    let i = We(f),
      h = { segs: f, lines: i, curves: l, boxes: [], loose: [], ms: 0, target: s };
    if (i.length < 3) return (h.error = "few-lines"), (h.ms = ue() - n), h;
    let u = nt(i.flatMap((c) => [c.a, c.b])).diag,
      x = null;
    for (let c of [1, 0.6, 1.6]) {
      let p = He(i, f, c),
        k = Ke(p).filter((m) => m.length >= 3),
        L = [];
      for (let m of k) {
        let r = Be(m, p, i).slice(0, 4),
          v = null;
        for (let $ of r) {
          Ve($, p, i);
          let S = Tn($, p, i);
          if (!S) continue;
          let R = nt(S.obsV.map((E) => E.p).concat(S.lineIds.flatMap((E) => [i[E].a, i[E].b]))).diag || u,
            d = at(S.obs, {
              box: !0,
              camera: "free",
              c0: a,
              page: Math.hypot(o.w, o.h),
              size: R,
              vps: S.vps.map((E) => E && E.v),
            });
          if (!d) continue;
          let y =
            d.cost / Math.max(1, S.obs.V.length + S.obs.L.length) +
            (S.nExplained < 7 ? (7 - S.nExplained) * 2 : 0);
          (!v || y < v.q) && (v = { q: y, B: S, F: d, rd: $, bs: R });
        }
        v && L.push(v);
      }
      let C = new Set(L.flatMap((m) => m.B.lineIds)),
        g =
          i.filter((m, r) => !C.has(r)).reduce((m, r) => m + r.len, 0) /
          (i.reduce((m, r) => m + r.len, 0) || 1),
        w = L.reduce((m, r) => m + r.q, 0) + 40 * g - 5 * L.length;
      (!x || w < x.q) && (x = { q: w, boxes: L, G: p, scale: c });
    }
    h.graph = x.G;
    let b = new Set();
    for (let c of x.boxes) {
      let { B: p, F: k, bs: L } = c;
      p.lineIds.forEach((v) => b.add(v));
      let C = { c0: a, page: Math.hypot(o.w, o.h), size: L, vps: p.vps.map((v) => v && v.v) },
        g = at(p.obs, { ...C, box: !0, camera: "free", uncertainty: !0 }) || k,
        w = Ze(p, C, !1),
        m = Ze(p, C, !0, !0),
        r = { ...p, size: L, fits: { free: g, cube: w, box: m } };
      h.boxes.push(r);
    }
    return (
      (h.loose = i.map((c, p) => p).filter((c) => !b.has(c))),
      h.boxes.forEach((c, p) => {
        c.diag = Ge(c, i, { target: s, c0: a, page: o, looseCount: p === 0 ? h.loose.length : 0 });
      }),
      h.boxes.length || ((h.error = "no-box"), (h.fallback = jn(i, a))),
      h.boxes.length > 1 && (h.scene = Qe(h.boxes, i, { target: s, c0: a, page: o })),
      (h.ms = ue() - n),
      h
    );
  }
  var ue = () => (typeof performance < "u" ? performance.now() : Date.now());
  function Ze(t, e, n, s) {
    let o = { ...e, box: n, camera: "plausible", loss: "cauchy" },
      a = at(t.obs, o);
    if (!a || a.rms / e.size < 0.018 || t.obs.V.length < 6)
      return (
        s &&
          a &&
          (a =
            at(t.obs, {
              ...o,
              starts: [{ R0: a.R0, p: a.p }],
              startsOnly: !0,
              maxTop: 1,
              iters: 30,
              uncertainty: !0,
            }) || a),
        a
      );
    for (let f of t.obs.V) {
      let l = {
          ...t.obs,
          V: t.obs.V.map((u) => (u === f ? { ...u, w: 0 } : u)),
          L: t.obs.L.map((u) => (u.la === f.l || u.lb === f.l ? { ...u, w: 0.1 } : u)),
        },
        i = at(l, { ...o, loss: "huber", maxTop: 2, iters: 60 });
      if (!i) continue;
      let h = at(t.obs, { ...o, starts: [{ R0: i.R0, p: i.p }], startsOnly: !0, maxTop: 1, iters: 60 });
      h && h.cost < a.cost && (a = h);
    }
    return (
      s &&
        a &&
        (a =
          at(t.obs, {
            ...o,
            starts: [{ R0: a.R0, p: a.p }],
            startsOnly: !0,
            maxTop: 1,
            iters: 30,
            uncertainty: !0,
          }) || a),
      a
    );
  }
  function Tn(t, e, n) {
    let s = [],
      o = new Array(8).fill(-1);
    for (let [g, w] of t.lab) w >= 0 && (s.push({ l: w, p: e.V[g].p, v: g }), (o[w] = g));
    if (s.length < 4) return null;
    let a = [],
      f = new Map(),
      l = [],
      i = new Map();
    for (let [g, w] of t.fam) {
      let m = e.E[g],
        r,
        v;
      if (m.ok && t.lab.get(m.u) >= 0 && t.lab.get(m.v) >= 0) (r = t.lab.get(m.u)), (v = t.lab.get(m.v));
      else {
        let S = (t.dangling || []).find((R) => R.line === g);
        if (!S) continue;
        (r = S.from), (v = S.to);
      }
      if (zt(r, v) !== w) continue;
      let $ = n[g];
      a.push({ la: r, lb: v, a: $.a, b: $.b, len: $.len, line: g }), f.set(g, w), l.push(g), i.set(g, [r, v]);
    }
    let h = new Map();
    for (let [g, [w, m]] of i) {
      let r = Math.min(w, m) + "-" + Math.max(w, m),
        v = !!n[g].hidden,
        $ = h.get(r);
      h.set(r, { hidden: $ ? $.hidden && v : v, lines: [...($ ? $.lines : []), g] });
    }
    let u = [...h.values()].filter((g) => !g.hidden).length,
      x = [],
      b = [];
    K.forEach((g, w) => {
      let m = [0, 1, 2, 3].map((r) => {
        let v = g.v[r],
          $ = g.v[(r + 1) % 4];
        return h.get(Math.min(v, $) + "-" + Math.max(v, $));
      });
      m.some((r) => r && r.hidden) ? b.push(w) : u <= 10 && m.every((r) => r && !r.hidden) && x.push(w);
    });
    let c = [[], [], []];
    for (let [g, w] of f) c[w].push(n[g]);
    let p = l.flatMap((g) => [n[g].a, n[g].b]),
      k = nt(p),
      L = { o: k.c, s: k.diag || 1 },
      C = c.map((g) => (g.length >= 2 ? ie(g, L) : null));
    return {
      obs: { V: s, L: a, vis: x, hid: b },
      obsV: s,
      obsL: a,
      fam: f,
      lineIds: l,
      edgeOf: i,
      drawn: h,
      vps: C,
      famLines: c,
      norm: L,
      vOfLabel: o,
      nExplained: l.length,
      solid: u,
      transparent: u >= 11,
      reading: t,
    };
  }
  function jn(t, e) {
    if (t.length < 3) return null;
    let n = t.map((i) => {
        let h = Math.atan2(i.d[1], i.d[0]);
        return [Math.cos(2 * h), Math.sin(2 * h)];
      }),
      s = [n[0]];
    for (; s.length < Math.min(3, t.length); ) {
      let i = 0,
        h = -1;
      n.forEach((u, x) => {
        let b = Math.min(...s.map((c) => Math.hypot(u[0] - c[0], u[1] - c[1])));
        b > h && ((h = b), (i = x));
      }),
        s.push(n[i]);
    }
    let o = new Array(t.length).fill(0);
    for (let i = 0; i < 25; i++)
      n.forEach((h, u) => {
        let x = 0,
          b = 1e9;
        s.forEach((c, p) => {
          let k = Math.hypot(h[0] - c[0], h[1] - c[1]);
          k < b && ((b = k), (x = p));
        }),
          (o[u] = x);
      }),
        s.forEach((h, u) => {
          let x = 0,
            b = 0;
          n.forEach((p, k) => {
            o[k] === u && ((x += p[0]), (b += p[1]));
          });
          let c = Math.hypot(x, b);
          c && (s[u] = [x / c, b / c]);
        });
    let a = nt(t.flatMap((i) => [i.a, i.b])),
      f = { o: a.c, s: a.diag || 1 },
      l = [0, 1, 2].map((i) => {
        let h = t.map((u, x) => x).filter((u) => o[u] === i);
        return {
          ids: h,
          vp:
            h.length >= 2
              ? ie(
                  h.map((u) => t[u]),
                  f,
                )
              : null,
        };
      });
    return { fam: o, fams: l };
  }
  var en = [],
    Dn = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ];
  for (let t of Dn)
    for (let e = 0; e < 8; e++)
      en.push((n) => {
        let s = 0;
        for (let o = 0; o < 3; o++) n & (1 << o) && (s |= 1 << t[o]);
        return s ^ e;
      });
  function Bn(t, e) {
    let n = null;
    for (let f of en) {
      let l = 0;
      for (let i of t.obsV) {
        let h = e.P[f(i.l)];
        l += (h[0] - i.p[0]) ** 2 + (h[1] - i.p[1]) ** 2;
      }
      (!n || l < n.c) && (n = { c: l, s: f });
    }
    let s = t.obsV.map((f) => {
        let l = e.P[n.s(f.l)];
        return {
          l: f.l,
          p: f.p,
          q: l,
          d: Math.hypot(l[0] - f.p[0], l[1] - f.p[1]),
          given: e.given.includes(n.s(f.l)),
        };
      }),
      o = s.filter((f) => !f.given),
      a = Math.sqrt(o.reduce((f, l) => f + l.d * l.d, 0) / (o.length || 1));
    return { corners: s, rms: a, map: [...Array(8)].map((f, l) => n.s(l)) };
  }
  function Vn(t, e) {
    let n = {
      ms: t.ms,
      error: t.error,
      curves: t.curves,
      loose: t.loose,
      target: t.target,
      lines: t.lines.map((s) => ({ a: s.a, b: s.b, c: s.c, d: s.d, len: s.len, hidden: !!s.hidden })),
      boxes: t.boxes.map((s) => ({
        lineIds: s.lineIds,
        fam: [...s.fam],
        edgeOf: [...s.edgeOf],
        obsV: s.obsV.map((o) => ({ l: o.l, p: o.p })),
        vis: s.obs.vis,
        transparent: s.transparent,
        size: s.size,
        vps: s.vps.map((o) =>
          o
            ? {
                pt: o.pt,
                v: o.v,
                dirInf: o.dirInf,
                rms: o.rms,
                maxAbs: o.maxAbs,
                spread: o.spread,
                res: o.res,
              }
            : null,
        ),
        fits: Object.fromEntries(
          Object.entries(s.fits).map(([o, a]) => [
            o,
            a
              ? {
                  P: a.P,
                  X: a.X,
                  R: a.R,
                  f: a.f,
                  c: a.c,
                  D: a.D,
                  vis: a.vis,
                  vps: a.vps,
                  cone: a.cone,
                  rms: a.rms,
                  vRes: a.vRes,
                }
              : null,
          ]),
        ),
        diag: s.diag,
      })),
      scene: t.scene
        ? {
            f: t.scene.f,
            c: t.scene.c,
            horizon: t.scene.horizon,
            issues: t.scene.issues.map(({ fixedFit: s, ...o }) => o),
          }
        : null,
      fallback: t.fallback || null,
    };
    return e && n.boxes.length && (n.truth = Bn(t.boxes[0], e)), n;
  }
  function nn(t, e, n) {
    return Vn(tn(t, e), n);
  }
  var F = { w: 1600, h: 1e3 },
    qn = Math.hypot(F.w, F.h),
    D = (t) => document.getElementById(t),
    Y = D("cv"),
    A = Y.getContext("2d"),
    sn = [
      "\u043E\u0440\u0430\u043D\u0436\u0435\u0432\u044B\u0435",
      "\u0441\u0438\u043D\u0438\u0435",
      "\u0440\u043E\u0437\u043E\u0432\u044B\u0435",
    ],
    Et = (t, e = 1) => String(Math.round(t * 10 ** e) / 10 ** e).replace(".", ","),
    de = (t) =>
      String(t).replace(/[&<>"]/g, (e) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[e]),
    M = {
      mode: "free",
      target: "cube",
      tool: "pen",
      strokes: [],
      store: { free: [], face: [] },
      layers: { fam: !0, rays: !0, horizon: !1, answer: !1, mine: !0 },
      view: { s: 1, ox: 0, oy: 0, a: 0 },
      rot: 0,
      result: null,
      stale: !1,
      sel: 0,
      hl: null,
      face: null,
      hint: 0,
      underlay: null,
      underlayA: 0.5,
      example: !1,
      undo: [],
      redo: [],
      busy: !1,
    },
    ln = "perspective-checker.v1";
  function qt() {
    try {
      localStorage.setItem(
        ln,
        JSON.stringify({
          free: M.mode === "free" ? M.strokes : M.store.free,
          target: M.target,
          layers: M.layers,
          example: M.example,
          rot: M.rot,
        }),
      );
    } catch {}
  }
  function On() {
    try {
      let t = JSON.parse(localStorage.getItem(ln) || "null");
      if (t)
        return (
          (M.store.free = t.free || []),
          (M.target = t.target || "cube"),
          Object.assign(M.layers, t.layers || {}),
          (M.example = !!t.example),
          (M.rot = ((t.rot | 0) % 4 + 4) % 4),
          (M.view.a = (M.rot * Math.PI) / 2),
          !0
        );
    } catch {}
    return !1;
  }
  var V = {};
  function ve() {
    let t = (e) => getComputedStyle(document.documentElement).getPropertyValue(e).trim();
    V = {
      desk: t("--desk"),
      paper: t("--paper"),
      ink: t("--ink"),
      muted: t("--muted"),
      faint: t("--faint"),
      line: t("--line"),
      surface: t("--surface"),
      fam: [t("--fam0"), t("--fam1"), t("--fam2")],
      answer: t("--answer"),
      warn: t("--warn"),
      horizon: t("--horizon"),
      sev: [t("--sev0"), t("--sev1"), t("--sev2"), t("--sev3")],
      mono: t("--mono"),
      font: t("--font"),
    };
  }
  // Вид: экран = o + s·R(a)·лист, где R(a) — поворот листа (R / Shift+R, шаг 90°).
  var rotV = (d, a = M.view.a) => {
      let c = Math.cos(a),
        n = Math.sin(a);
      return [c * d[0] - n * d[1], n * d[0] + c * d[1]];
    },
    Rv = (d) => rotV(d),
    J = (t) => {
      let r = rotV(t);
      return [M.view.ox + M.view.s * r[0], M.view.oy + M.view.s * r[1]];
    },
    toPage = (v, t) => rotV([(t[0] - v.ox) / v.s, (t[1] - v.oy) / v.s], -(v.a || 0)),
    Tt = (t) => toPage(M.view, t),
    tt = 0,
    rt = 0,
    jt = 1;
  function ye() {
    let t = Y.getBoundingClientRect();
    jt = window.devicePixelRatio || 1;
    let e = !tt;
    (tt = t.width),
      (rt = t.height),
      (Y.width = Math.round(tt * jt)),
      (Y.height = Math.round(rt * jt)),
      e ? we() : O();
  }
  function fn(t, e, n, s, o = 24) {
    let ang = M.view.a || 0,
      cs = [
        [t, e],
        [n, e],
        [n, s],
        [t, s],
      ].map((q) => rotV(q, ang)),
      bw = Math.max(...cs.map((q) => q[0])) - Math.min(...cs.map((q) => q[0])) || 1,
      bh = Math.max(...cs.map((q) => q[1])) - Math.min(...cs.map((q) => q[1])) || 1,
      a = Math.max(0.03, Math.min(12, Math.min((tt - 2 * o) / bw, (rt - 2 * o) / bh))),
      c = rotV([(t + n) / 2, (e + s) / 2], ang);
    (M.view = { s: a, ox: tt / 2 - a * c[0], oy: rt / 2 - a * c[1], a: ang }), O();
  }
  function we() {
    fn(0, 0, F.w, F.h);
  }
  function hn() {
    let t = [
      [0, 0],
      [F.w, F.h],
    ];
    for (let s of M.result?.boxes || [])
      for (let o of s.vps)
        o && o.pt && Math.hypot(o.pt[0] - F.w / 2, o.pt[1] - F.h / 2) < 9 * F.w && t.push(o.pt);
    if (M.mode === "face" && M.face && M.hint) for (let s of M.face.vps) s && t.push(s);
    let e = t.map((s) => s[0]),
      n = t.map((s) => s[1]);
    fn(Math.min(...e), Math.min(...n), Math.max(...e), Math.max(...n), 40);
  }
  function Fn(t, e) {
    let n = rotV(Tt(t)),
      s = Math.max(0.03, Math.min(12, M.view.s * e));
    (M.view = { s, ox: t[0] - s * n[0], oy: t[1] - s * n[1], a: M.view.a }), O();
  }
  // Поворот листа на 90° вокруг центра экрана с короткой анимацией.
  var rotAnim = 0;
  function rotateSheet(dir) {
    let c = [tt / 2, rt / 2],
      P = Tt(c),
      a0 = M.view.a,
      target = ((M.rot + dir) * Math.PI) / 2,
      t0 = performance.now(),
      dur = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 170;
    (M.rot = (((M.rot + dir) % 4) + 4) % 4), qt(), cancelAnimationFrame(rotAnim);
    let step = (now) => {
      let k = dur ? Math.min(1, (now - t0) / dur) : 1,
        e = 1 - (1 - k) ** 3,
        a = a0 + (target - a0) * e,
        r = rotV(P, a);
      (M.view = { ...M.view, a, ox: c[0] - M.view.s * r[0], oy: c[1] - M.view.s * r[1] }), O();
      if (k < 1) rotAnim = requestAnimationFrame(step);
      else {
        let n = ((M.rot * Math.PI) / 2) % (2 * Math.PI),
          r2 = rotV(P, n);
        M.view = { ...M.view, a: n, ox: c[0] - M.view.s * r2[0], oy: c[1] - M.view.s * r2[1] };
        let lab = D("rotLabel");
        lab && (lab.textContent = M.rot ? `${M.rot * 90}°` : ""), O();
      }
    };
    rotAnim = requestAnimationFrame(step);
  }
  var ke = () => JSON.stringify(M.strokes);
  function Qt() {
    M.undo.push(ke()), M.undo.length > 150 && M.undo.shift(), (M.redo = []), dt();
  }
  function un() {
    !M.undo.length || B || (M.redo.push(ke()), (M.strokes = JSON.parse(M.undo.pop())), Bt());
  }
  function be() {
    !M.redo.length || B || (M.undo.push(ke()), (M.strokes = JSON.parse(M.redo.pop())), Bt());
  }
  function dt() {
    (D("undo").disabled = !M.undo.length), (D("redo").disabled = !M.redo.length);
  }
  function Bt() {
    (M.example = !1), dt(), qt(), pt(), O();
  }
  // Анализ идёт в фоновом потоке (Web Worker) из кода в <script id="worker-src">.
  // Новый запрос отменяет незаконченный старый; если поток недоступен, тот же код
  // выполняется в основном потоке.
  var yt = null,
    ge = 0,
    on = 0,
    wSrc = "",
    wURL = null,
    wBusy = !1,
    pending = null,
    localAnalyze = null;
  try {
    wSrc = D("worker-src").textContent || "";
  } catch {}
  function spawnWorker() {
    try {
      if (wSrc.length < 100) return null;
      wURL = wURL || URL.createObjectURL(new Blob([wSrc], { type: "text/javascript" }));
      let w = new Worker(wURL);
      return (
        (w.onmessage = (e) => {
          if (e.data.partial) {
            e.data.id === ge &&
              (Me(e.data.result), Zt(D("status").textContent + " \xB7 \u0443\u0442\u043E\u0447\u043D\u044F\u044E\u2026"));
            return;
          }
          if (((wBusy = !1), e.data.id !== ge)) return;
          if (((M.busy = !1), e.data.error)) {
            console.error(e.data.error), Zt("\u043E\u0448\u0438\u0431\u043A\u0430 \u0430\u043D\u0430\u043B\u0438\u0437\u0430");
            return;
          }
          Me(e.data.result);
        }),
        (w.onerror = (ev) => {
          ev && ev.preventDefault && ev.preventDefault();
          try {
            w.terminate();
          } catch {}
          yt === w && (yt = null), (wBusy = !1), pending && pending.id === ge && runLocal(pending);
        }),
        w
      );
    } catch {
      return null;
    }
  }
  yt = spawnWorker();
  function runLocal(job) {
    setTimeout(() => {
      if (job.id !== ge) return;
      try {
        if (!localAnalyze) {
          let fake = { postMessage: (m) => (fake.out = m) };
          new Function("self", wSrc)(fake),
            (localAnalyze = (st, o, tr) => {
              fake.onmessage({ data: { id: 0, strokes: st, opt: o, truth: tr } });
              if (fake.out.error) throw new Error(fake.out.error);
              return fake.out.result;
            });
        }
        Me(localAnalyze(job.strokes, job.opt, job.truth));
      } catch (s) {
        console.error(s), Zt("\u043E\u0448\u0438\u0431\u043A\u0430 \u0430\u043D\u0430\u043B\u0438\u0437\u0430");
      }
      M.busy = !1;
    }, 0);
  }
  function pt() {
    (M.stale = !0), clearTimeout(on), (on = setTimeout(Nn, 140));
  }
  function Nn() {
    let t = M.strokes.filter((s) => s.pts.length > 1).map((s) => ({ pts: s.pts, hidden: !!s.hidden })),
      e = { target: M.mode === "face" ? "cube" : M.target, page: F },
      n = M.mode === "face" && M.face ? { P: M.face.B.P, given: M.face.labels } : null;
    if (
      (ge++,
      (M.busy = !0),
      Zt("\u0430\u043D\u0430\u043B\u0438\u0437\u2026"),
      !t.length || (M.mode === "face" && !M.strokes.some((s) => !s.given)))
    ) {
      (M.busy = !1), (pending = null), Me(null);
      return;
    }
    let job = { id: ge, strokes: t, opt: e, truth: n };
    if (((pending = job), yt && wBusy)) {
      // старый разбор ещё идёт — он уже не нужен
      try {
        yt.terminate();
      } catch {}
      (yt = spawnWorker()), (wBusy = !1);
    }
    if (yt)
      try {
        yt.postMessage(job), (wBusy = !0);
        return;
      } catch {}
    runLocal(job);
  }
  function Me(t) {
    (M.result = t),
      (M.stale = !1),
      t && M.sel >= t.boxes.length && (M.sel = 0),
      Zt(
        t
          ? `${t.boxes.length ? (t.boxes.length === 1 ? "1 \u043A\u043E\u0440\u043E\u0431\u043A\u0430" : t.boxes.length + " \u043A\u043E\u0440\u043E\u0431\u043A\u0438") : "\u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u043D\u0435\u0442"} \xB7 \u043B\u0438\u043D\u0438\u0439 ${t.lines.length} \xB7 ${Math.round(t.ms)} \u043C\u0441`
          : "",
      ),
      Lt(),
      O();
  }
  function Zt(t) {
    D("status").textContent = t;
  }
  function Ee() {
    let t = Math.random,
      e = null;
    for (let l = 0; l < 40 && !e; l++)
      e = ce(t, {
        c: [F.w / 2, F.h / 2],
        f: 1150 + t() * 1400,
        maxCone: 29,
        sizePx: 260 + t() * 120,
        at: [F.w * (0.35 + 0.3 * t()), F.h * (0.35 + 0.3 * t())],
      });
    if (!e) return;
    let n = K.map((l, i) => ({
        F: l,
        i,
        area:
          Math.abs(
            l.v.reduce((h, u, x) => {
              let b = e.P[u],
                c = e.P[l.v[(x + 1) % 4]];
              return h + b[0] * c[1] - c[0] * b[1];
            }, 0),
          ) / 2,
      }))
        .filter((l) => e.faceVis[l.i])
        .sort((l, i) => i.area - l.area),
      s = n[Math.random() < 0.6 ? 0 : Math.min(1, n.length - 1)],
      o = s.F.v,
      a = o.map((l, i) => ({ pts: [e.P[l], e.P[o[(i + 1) % 4]]], given: !0 })),
      f = (l) => {
        let i = [e.R[0][l], e.R[1][l], e.R[2][l]];
        return Math.abs(i[2]) < 1e-6 ? null : [e.c[0] + (e.f * i[0]) / i[2], e.c[1] + (e.f * i[1]) / i[2]];
      };
    (M.face = { B: e, labels: o, axis: s.F.axis, side: s.F.side, vps: [0, 1, 2].map(f) }),
      (M.hint = 0),
      (M.strokes = a),
      (M.undo = []),
      (M.redo = []),
      (M.layers.answer = !1),
      te(),
      dt(),
      pt(),
      O();
  }
  function dn() {
    let t = re(20261122),
      e = [1, 1, 1.32],
      n = Math.cbrt(1.32),
      s = ce(t, { D: e.map((u) => u / n), f: 1500, c: [F.w / 2, F.h / 2], at: [760, 520], sizePx: 340 }),
      o = s.P.map((u) => u.slice()),
      a = Ne(s),
      f = [...Array(8).keys()].filter((u) => a.some((x) => x.visible && (x.a === u || x.b === u))),
      l = (u) => a.filter((x) => x.visible && (x.a === u || x.b === u)).length,
      i = f.find((u) => l(u) === 2);
    o[i] = [o[i][0] + 22, o[i][1] - 16];
    let h = _e(o, a, t, { hidden: "dashed", retrace: 0.2 });
    M.mode !== "free" && $e("free", !0),
      Qt(),
      (M.strokes = h.strokes.map((u) => ({
        pts: u.pts.map((x) => [Math.round(x[0] * 10) / 10, Math.round(x[1] * 10) / 10]),
        hidden: !!u.hidden,
      }))),
      (M.target = "cube"),
      Ot(),
      dt(),
      qt(),
      (M.example = !0),
      pt(),
      O();
  }
  function $e(t, e) {
    t !== M.mode &&
      ((M.store[M.mode] = M.strokes),
      (M.mode = t),
      (M.undo = []),
      (M.redo = []),
      (M.result = null),
      (M.hl = null),
      document.querySelectorAll(".face-only").forEach((n) => (n.hidden = t !== "face")),
      D("mFree").setAttribute("aria-pressed", t === "free"),
      D("mFace").setAttribute("aria-pressed", t === "face"),
      (D("tCube").disabled = D("tBox").disabled = t === "face"),
      t === "face"
        ? M.face
          ? ((M.strokes = M.store.face), pt())
          : Ee()
        : ((M.strokes = M.store.free || []), pt()),
      Ot(),
      dt(),
      Lt(),
      O());
  }
  function Ot() {
    let t = M.mode === "face" ? "cube" : M.target;
    D("tCube").setAttribute("aria-pressed", t === "cube"),
      D("tBox").setAttribute("aria-pressed", t === "box"),
      (D("lAnswer").firstChild.textContent =
        t === "cube"
          ? "\u041F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043A\u0443\u0431 "
          : "\u041F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u0430\u044F \u043A\u043E\u0440\u043E\u0431\u043A\u0430 ");
  }
  function te() {
    for (let [t, e] of [
      ["fam", "lFam"],
      ["rays", "lRays"],
      ["horizon", "lHorizon"],
      ["answer", "lAnswer"],
      ["mine", "lMine"],
    ])
      D(e).setAttribute("aria-pressed", !!M.layers[t]);
  }
  function St(t) {
    M.tool = t;
    for (let [e, n] of [
      ["pen", "toolPen"],
      ["line", "toolLine"],
      ["hidden", "toolHidden"],
      ["eraser", "toolEraser"],
    ])
      D(n).setAttribute("aria-pressed", t === e);
    Y.style.cursor = t === "eraser" ? "none" : "crosshair";
  }
  var B = null,
    At = null,
    Vt = !1,
    Ae = !1,
    ft = new Map(),
    pn = null,
    Dt = (t) => {
      let e = Y.getBoundingClientRect();
      return [t.clientX - e.left, t.clientY - e.top];
    };
  function mn(t, e) {
    let n = [],
      s = !1;
    for (let o of M.strokes) {
      if (o.given) {
        n.push(o);
        continue;
      }
      let a = [];
      for (let h = 0; h < o.pts.length; h++) {
        let u = o.pts[h];
        if (!h) {
          a.push(u);
          continue;
        }
        let x = o.pts[h - 1],
          b = Math.hypot(u[0] - x[0], u[1] - x[1]),
          c = Math.max(1, Math.ceil(b / 3));
        for (let p = 1; p <= c; p++) a.push([x[0] + ((u[0] - x[0]) * p) / c, x[1] + ((u[1] - x[1]) * p) / c]);
      }
      let f = [],
        l = !1,
        i = () => {
          f.length > 1 && n.push({ ...o, pts: f }), (f = []);
        };
      for (let h of a) Math.hypot(h[0] - t[0], h[1] - t[1]) <= e ? ((l = !0), i()) : f.push(h);
      if (!l) {
        n.push(o);
        continue;
      }
      (s = !0), i();
    }
    return s && (M.strokes = n), s;
  }
  Y.addEventListener("contextmenu", (t) => t.preventDefault());
  Y.addEventListener("pointerdown", (t) => {
    Y.setPointerCapture(t.pointerId);
    let e = Dt(t);
    if ((ft.set(t.pointerId, e), (At = e), ft.size === 2)) {
      B && B.type === "draw" && (M.strokes.pop(), M.undo.pop(), dt());
      let [a, f] = [...ft.values()];
      (pn = {
        mid: [(a[0] + f[0]) / 2, (a[1] + f[1]) / 2],
        d: Math.hypot(a[0] - f[0], a[1] - f[1]),
        view: { ...M.view },
      }),
        (B = { type: "gesture" });
      return;
    }
    if (B) return;
    if (t.button === 1 || Vt) {
      (B = { type: "pan", start: e, view: { ...M.view } }), (Ae = !0);
      return;
    }
    let n = Tt(e);
    if (M.tool === "eraser" || t.button === 2 || t.button === 5) {
      Qt(), (B = { type: "erase", dirty: mn(n, 14 / M.view.s) }), O();
      return;
    }
    if (t.button !== 0) return;
    Qt();
    let s = M.tool === "line" || t.shiftKey,
      o = { pts: [n, n.slice()], hidden: M.tool === "hidden" };
    s || (o.pts = [n]),
      M.strokes.push(o),
      (B = { type: "draw", s: o, straight: s, start: n }),
      (M.stale = !0),
      M.layers.mine || ((M.layers.mine = !0), te()),
      O();
  });
  Y.addEventListener("pointermove", (t) => {
    let e = Dt(t);
    if (((At = e), ft.has(t.pointerId) && ft.set(t.pointerId, e), !B)) {
      M.tool === "eraser" && O();
      return;
    }
    if (B.type === "gesture" && ft.size >= 2) {
      let [n, s] = [...ft.values()],
        o = [(n[0] + s[0]) / 2, (n[1] + s[1]) / 2],
        a = Math.hypot(n[0] - s[0], n[1] - s[1]),
        f = pn,
        l = Math.max(0.03, Math.min(12, (f.view.s * a) / (f.d || 1))),
        i = rotV(toPage(f.view, f.mid), f.view.a || 0);
      (M.view = { s: l, ox: o[0] - l * i[0], oy: o[1] - l * i[1], a: f.view.a || 0 }), O();
      return;
    }
    if (B.type === "pan") {
      (M.view = { ...B.view, ox: B.view.ox + e[0] - B.start[0], oy: B.view.oy + e[1] - B.start[1] }), O();
      return;
    }
    if (B.type === "erase") {
      mn(Tt(e), 14 / M.view.s) && (B.dirty = !0), O();
      return;
    }
    if (B.type === "draw") {
      let n = t.getCoalescedEvents ? t.getCoalescedEvents() : [t];
      if (B.straight || t.shiftKey) B.s.pts = [B.start, Tt(Dt(n[n.length - 1] || t))];
      else
        for (let s of n) {
          let o = Tt(Dt(s)),
            a = B.s.pts[B.s.pts.length - 1];
          Math.hypot(o[0] - a[0], o[1] - a[1]) * M.view.s >= 1.2 && B.s.pts.push(o);
        }
      O();
    }
  });
  function bn(t) {
    if ((ft.delete(t.pointerId), !!B)) {
      if (B.type === "gesture") {
        ft.size === 0 && (B = null);
        return;
      }
      if (B.type === "draw") {
        let e = B.s,
          n =
            e.pts.length > 1
              ? Math.hypot(e.pts[e.pts.length - 1][0] - e.pts[0][0], e.pts[e.pts.length - 1][1] - e.pts[0][1])
              : 0,
          s = 0;
        for (let o = 1; o < e.pts.length; o++)
          s += Math.hypot(e.pts[o][0] - e.pts[o - 1][0], e.pts[o][1] - e.pts[o - 1][1]);
        if (s * M.view.s < 3) {
          M.strokes.pop(), M.undo.pop(), dt(), (B = null), O();
          return;
        }
        (e.pts = e.pts.map((o) => [Math.round(o[0] * 10) / 10, Math.round(o[1] * 10) / 10])),
          (B = null),
          Bt();
        return;
      }
      if (B.type === "erase") {
        let e = B.dirty;
        (B = null), e ? Bt() : (M.undo.pop(), dt(), O());
        return;
      }
      (B = null), O();
    }
  }
  Y.addEventListener("pointerup", bn);
  Y.addEventListener("pointercancel", bn);
  Y.addEventListener("pointerleave", () => {
    B || ((At = null), O());
  });
  Y.addEventListener(
    "wheel",
    (t) => {
      t.preventDefault();
      let e = Dt(t);
      t.ctrlKey ||
      t.metaKey ||
      t.deltaMode !== 0 ||
      (t.deltaX === 0 && Math.abs(t.deltaY) >= 40 && Number.isInteger(t.deltaY))
        ? Fn(e, Math.exp(-t.deltaY * (t.deltaMode ? 0.05 : 0.0022)))
        : ((M.view.ox -= t.deltaX), (M.view.oy -= t.deltaY), O());
    },
    { passive: !1 },
  );
  window.addEventListener("keydown", (t) => {
    if (t.target.tagName === "INPUT" && t.target.type !== "range" && t.target.type !== "file") return;
    let e = t.metaKey || t.ctrlKey,
      n = t.key.toLowerCase();
    if (e && (n === "z" || n === "\u044F")) {
      t.preventDefault(), t.shiftKey ? be() : un();
      return;
    }
    if (e && (n === "y" || n === "\u043D")) {
      t.preventDefault(), be();
      return;
    }
    if (e || t.altKey) return;
    if (t.code === "Space") {
      t.preventDefault(), Vt || ((Vt = !0), (Ae = !1));
      return;
    }
    let s = {
      b: "pen",
      и: "pen",
      p: "pen",
      з: "pen",
      l: "line",
      д: "line",
      d: "hidden",
      в: "hidden",
      e: "eraser",
      у: "eraser",
    };
    s[n]
      ? St(s[n])
      : t.code === "KeyR" || n === "r" || n === "\u043A"
        ? rotateSheet(t.shiftKey ? -1 : 1)
        : n === "t" || n === "\u0435"
          ? $t("rays")
        : n === "h" || n === "\u0440"
          ? $t("horizon")
          : n === "c" || n === "\u0441"
            ? $t("fam")
            : n === "m" || n === "\u044C"
              ? $t("mine")
              : n === "f" || n === "\u0430"
                ? we()
                : n === "v" || n === "\u043C"
                  ? hn()
                  : (n === "n" || n === "\u0442") && M.mode === "face" && Ee();
  });
  window.addEventListener("keyup", (t) => {
    t.code === "Space" && ((Vt = !1), Ae || $t("answer"));
  });
  window.addEventListener("blur", () => {
    Vt = !1;
  });
  function $t(t) {
    (M.layers[t] = !M.layers[t]), te(), qt(), O();
  }
  function lt(t, e) {
    let n = J(t),
      s = J(e);
    A.beginPath(), A.moveTo(n[0], n[1]), A.lineTo(s[0], s[1]), A.stroke();
  }
  function _n(t) {
    A.beginPath(),
      t.forEach((e, n) => {
        let s = J(e);
        n ? A.lineTo(s[0], s[1]) : A.moveTo(s[0], s[1]);
      }),
      A.stroke();
  }
  function Un(t, e, n) {
    let s = J(t);
    (A.fillStyle = n), A.beginPath(), A.arc(s[0], s[1], e, 0, 7), A.fill();
  }
  function wt(t, e, n, s = {}) {
    A.font = `${s.weight || 600} ${s.size || 12}px ${V.mono}`;
    let o = A.measureText(e).width,
      a = (s.size || 12) + 6,
      f = t[0] + (s.dx || 0),
      l = t[1] + (s.dy || 0);
    s.center && (f -= o / 2),
      (f = Math.max(4, Math.min(tt - o - 8, f))),
      (l = Math.max(a, Math.min(rt - 4, l))),
      (A.globalAlpha = 0.9),
      (A.fillStyle = V.surface),
      A.fillRect(f - 4, l - a + 3, o + 8, a),
      (A.globalAlpha = 1),
      (A.fillStyle = n),
      A.fillText(e, f, l - 1);
  }
  var Yt = (t, e = 6) => t[0] >= e && t[0] <= tt - e && t[1] >= e && t[1] <= rt - e;
  function Xn(t, e, n) {
    let s = J(t),
      o = [tt / 2, rt / 2],
      a = [s[0] - o[0], s[1] - o[1]],
      f = 22,
      l = Math.min(
        a[0] ? ((a[0] > 0 ? tt - f : f) - o[0]) / a[0] : 1 / 0,
        a[1] ? ((a[1] > 0 ? rt - f : f) - o[1]) / a[1] : 1 / 0,
      ),
      i = [o[0] + a[0] * l, o[1] + a[1] * l],
      h = Math.atan2(a[1], a[0]);
    (A.fillStyle = e),
      A.beginPath(),
      A.moveTo(i[0] + Math.cos(h) * 11, i[1] + Math.sin(h) * 11),
      A.lineTo(i[0] + Math.cos(h + 2.5) * 9, i[1] + Math.sin(h + 2.5) * 9),
      A.lineTo(i[0] + Math.cos(h - 2.5) * 9, i[1] + Math.sin(h - 2.5) * 9),
      A.closePath(),
      A.fill(),
      n && wt([i[0] - Math.cos(h) * 18, i[1] - Math.sin(h) * 18 + 4], n, e, { center: !0, size: 11 });
  }
  function xe(t, e, n) {
    let s = J(t);
    if (!Yt(s)) {
      Xn(t, e, n);
      return;
    }
    (A.fillStyle = V.surface),
      A.beginPath(),
      A.arc(s[0], s[1], 7, 0, 7),
      A.fill(),
      (A.fillStyle = e),
      A.beginPath(),
      A.arc(s[0], s[1], 4.5, 0, 7),
      A.fill(),
      (A.strokeStyle = e),
      (A.lineWidth = 1.2),
      A.beginPath(),
      A.arc(s[0], s[1], 10, 0, 7),
      A.stroke(),
      n && wt(s, n, e, { dx: 13, dy: -9, size: 11 });
  }
  function gn(t, e, n, s, o) {
    e = Rv(e);
    let a = J(t),
      f = 4 * (tt + rt);
    (A.strokeStyle = n),
      (A.lineWidth = s),
      A.setLineDash(o || []),
      A.beginPath(),
      A.moveTo(a[0] - e[0] * f, a[1] - e[1] * f),
      A.lineTo(a[0] + e[0] * f, a[1] + e[1] * f),
      A.stroke(),
      A.setLineDash([]);
  }
  var pe = 0;
  function O() {
    pe ||
      (pe = requestAnimationFrame(() => {
        (pe = 0), Wn();
      }));
  }
  function Wn() {
    A.setTransform(jt, 0, 0, jt, 0, 0), (A.fillStyle = V.desk), A.fillRect(0, 0, tt, rt);
    {
      let pc = [
        [0, 0],
        [F.w, 0],
        [F.w, F.h],
        [0, F.h],
      ].map(J);
      (A.fillStyle = V.paper), A.beginPath(), pc.forEach((q, i) => (i ? A.lineTo(q[0], q[1]) : A.moveTo(q[0], q[1])));
      A.closePath(), A.fill(), (A.strokeStyle = V.line), (A.lineWidth = 1), A.stroke();
    }
    if (M.underlay) {
      A.globalAlpha = M.underlayA;
      let l = M.underlay,
        i = Math.min(F.w / l.width, F.h / l.height),
        h = l.width * i,
        u = l.height * i,
        ca = Math.cos(M.view.a) * M.view.s * jt,
        sa = Math.sin(M.view.a) * M.view.s * jt;
      A.setTransform(ca, sa, -sa, ca, M.view.ox * jt, M.view.oy * jt),
        A.drawImage(l, (F.w - h) / 2, (F.h - u) / 2, h, u),
        A.setTransform(jt, 0, 0, jt, 0, 0),
        (A.globalAlpha = 1);
    }
    {
      let l = J([F.w / 2, F.h / 2]);
      (A.strokeStyle = V.faint),
        (A.lineWidth = 1),
        A.beginPath(),
        A.moveTo(l[0] - 6, l[1]),
        A.lineTo(l[0] + 6, l[1]),
        A.moveTo(l[0], l[1] - 6),
        A.lineTo(l[0], l[1] + 6),
        A.stroke();
    }
    let n = M.result,
      s = M.stale ? 0.45 : 1,
      o = n ? n.boxes : [],
      a = new Map();
    o.forEach((l, i) => l.fam.forEach(([h, u]) => a.set(h, { f: u, bi: i })));
    let f = o[M.sel];
    if (M.layers.horizon && f) {
      A.globalAlpha = s;
      let l =
          n.scene && n.scene.issues.find((w) => w.box === M.sel && !w.odd)
            ? { f: n.scene.f, c: n.scene.c }
            : { f: f.fits.free.f, c: f.fits.free.c },
        i = f.fits.free,
        h = [0, 1, 2].sort((w, m) => Math.abs(i.R[1][m]) - Math.abs(i.R[1][w]))[0],
        u = [i.R[0][h], i.R[1][h], i.R[2][h]],
        x = [-u[1], u[0]],
        b = Math.hypot(...x) || 1,
        c = [x[0] / b, x[1] / b],
        p = (-u[2] * l.f) / (u[0] * u[0] + u[1] * u[1] || 1),
        k = [l.c[0] + u[0] * p, l.c[1] + u[1] * p];
      if (Math.hypot(u[0], u[1]) > 0.001) {
        gn(k, c, V.horizon, 1.6);
        let w = J(k),
          m = null,
          cS = Rv(c);
        for (let r = 0; r < 400 && !m; r++) {
          let v = r % 2 ? (r + 1) / 2 : -r / 2,
            $ = [w[0] + cS[0] * v * 14, w[1] + cS[1] * v * 14];
          Yt($, 30) && (m = $);
        }
        m && wt(m, "\u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442", V.horizon, { dy: -6, size: 11 });
      }
      let L = J(l.c),
        C = l.f * Math.tan(30 / 57.2958) * M.view.s;
      (A.strokeStyle = V.horizon),
        (A.lineWidth = 1),
        A.setLineDash([5, 5]),
        A.beginPath(),
        A.arc(L[0], L[1], C, 0, 7),
        A.stroke(),
        A.setLineDash([]),
        A.beginPath(),
        A.arc(L[0], L[1], 5, 0, 7),
        A.stroke(),
        A.beginPath(),
        A.moveTo(L[0] - 9, L[1]),
        A.lineTo(L[0] + 9, L[1]),
        A.moveTo(L[0], L[1] - 9),
        A.lineTo(L[0], L[1] + 9),
        A.stroke(),
        Yt(L) &&
          wt(L, "\u0446\u0435\u043D\u0442\u0440 \u0432\u0437\u0433\u043B\u044F\u0434\u0430", V.horizon, {
            dx: 10,
            dy: 18,
            size: 11,
          });
      let g = [L[0] + C * 0.707, L[1] - C * 0.707];
      Yt(g, 20) &&
        wt(
          g,
          "30\xB0 \u2014 \u0433\u0440\u0430\u043D\u0438\u0446\u0430 \u0431\u0435\u0437 \u0438\u0441\u043A\u0430\u0436\u0435\u043D\u0438\u0439",
          V.horizon,
          { dx: 6, size: 10.5, weight: 500 },
        ),
        (A.globalAlpha = 1);
    }
    if ((M.mode === "face" && M.face && M.hint && Jn(), M.layers.rays && n && M.layers.mine)) {
      (A.globalAlpha = 0.55 * s),
        o.forEach((i, h) =>
          i.vps.forEach((u, x) => {
            !u ||
              !u.pt ||
              i.diag.families[x].n < 2 ||
              ((A.strokeStyle = V.fam[x]),
              (A.lineWidth = h === M.sel ? 1 : 0.7),
              A.setLineDash([5, 5]),
              i.fam.forEach(([b, c]) => {
                if (c !== x) return;
                let p = n.lines[b],
                  k =
                    Math.hypot(p.a[0] - u.pt[0], p.a[1] - u.pt[1]) <
                    Math.hypot(p.b[0] - u.pt[0], p.b[1] - u.pt[1])
                      ? p.a
                      : p.b;
                lt(k, u.pt);
              }),
              A.setLineDash([]));
          }),
        ),
        (A.globalAlpha = s);
      let l = M.mode === "face" && M.hint > 0;
      o.forEach((i, h) =>
        i.vps.forEach((u, x) => {
          !l &&
            u &&
            u.pt &&
            i.diag.families[x].n >= 2 &&
            (h === M.sel || o.length < 4) &&
            xe(u.pt, V.fam[x], o.length > 1 ? `\u0422\u0421 ${h + 1}` : "\u0422\u0421");
        }),
      ),
        (A.globalAlpha = 1);
    }
    if (M.layers.mine) {
      let l = M.layers.fam && n && !M.stale;
      for (let i of M.strokes)
        (A.strokeStyle = V.ink),
          (A.lineWidth = i.given ? 3 : 2),
          (A.lineCap = "round"),
          (A.lineJoin = "round"),
          (A.globalAlpha = l && !i.given ? 0.28 : 1),
          A.setLineDash(i.hidden ? [7, 6] : []),
          _n(i.pts);
      (A.globalAlpha = 1),
        A.setLineDash([]),
        l &&
          n.lines.forEach((i, h) => {
            let u = a.get(h);
            (A.strokeStyle = u ? V.fam[u.f] : V.faint),
              (A.lineWidth = 2.2),
              A.setLineDash(i.hidden ? [7, 5] : []),
              (A.globalAlpha = u && u.bi !== M.sel ? 0.6 : 1),
              lt(i.a, i.b);
          }),
        (A.globalAlpha = 1),
        A.setLineDash([]);
    }
    if (M.layers.answer && n && f) {
      let l, i;
      if (M.mode === "face" && M.face) (l = M.face.B.P), (i = M.face.B.faceVis);
      else {
        let h = M.target === "cube" ? f.fits.cube : f.fits.box;
        h && ((l = h.P), (i = h.vis));
      }
      if (l) {
        A.globalAlpha = s;
        for (let [u, x, b] of ct) {
          let c = !K.some((p, k) => i[k] && p.v.includes(u) && p.v.includes(x));
          (A.strokeStyle = V.answer),
            (A.lineWidth = c ? 1.3 : 2.4),
            A.setLineDash(c ? [7, 6] : []),
            lt(l[u], l[x]);
        }
        A.setLineDash([]);
        let h = M.mode === "face" && n.truth ? n.truth.corners : f.diag.answer ? f.diag.answer.corners : [];
        for (let u of h)
          u.d * M.view.s < 5 ||
            u.given ||
            ((A.strokeStyle = V.answer),
            (A.lineWidth = 1.2),
            A.setLineDash([2, 3]),
            lt(u.p, u.q),
            A.setLineDash([]),
            Un(u.q, 3, V.answer));
        A.globalAlpha = 1;
      }
    }
    if (
      (n &&
        M.layers.mine &&
        M.layers.fam &&
        !M.stale &&
        o.forEach((l, i) => {
          if (
            !(i !== M.sel && o.length > 1) &&
            (l.diag.families.forEach((h) =>
              h.perLine.forEach((u) => {
                if (Math.abs(u.ang) < 3) return;
                let x = n.lines[u.li],
                  b = J([(x.a[0] + x.b[0]) / 2, (x.a[1] + x.b[1]) / 2]),
                  c = Rv([-x.d[1], x.d[0]]);
                wt(
                  [b[0] + c[0] * 14, b[1] + c[1] * 14 + 4],
                  `${Et(Math.abs(u.ang))}\xB0${u.ang > 0 ? "\u21BB" : "\u21BA"}`,
                  Math.abs(u.ang) > 6 ? V.sev[3] : V.sev[2],
                  { center: !0, size: 11.5 },
                );
              }),
            ),
            l.diag.y && i === M.sel && l.diag.y.angles.some((h) => h.deg < 89))
          ) {
            let h = J(l.diag.y.p);
            l.diag.y.angles.forEach((u) =>
              wt(
                [h[0] + Math.cos(u.mid + M.view.a) * 34, h[1] + Math.sin(u.mid + M.view.a) * 34 + 4],
                `${Math.round(u.deg)}\xB0`,
                u.deg < 89 ? V.sev[2] : V.muted,
                { center: !0, size: 11 },
              ),
            );
          }
        }),
      M.hl && n && o[M.hl.box])
    ) {
      let l = o[M.hl.box];
      if (
        ((A.lineWidth = 6),
        (A.globalAlpha = 0.35),
        l.fam.forEach(([i, h]) => {
          ((M.hl.fams && M.hl.fams.includes(h)) || M.hl.line === i) &&
            ((A.strokeStyle = V.fam[h]), lt(n.lines[i].a, n.lines[i].b));
        }),
        (A.globalAlpha = 1),
        M.hl.line !== void 0 &&
          n.lines[M.hl.line] &&
          ((A.strokeStyle = V.ink), (A.lineWidth = 2.6), lt(n.lines[M.hl.line].a, n.lines[M.hl.line].b)),
        M.hl.label !== void 0)
      ) {
        let i = l.obsV.find((h) => h.l === M.hl.label);
        if (i) {
          let h = J(i.p);
          (A.strokeStyle = V.sev[2]),
            (A.lineWidth = 2),
            A.beginPath(),
            A.arc(h[0], h[1], 13, 0, 7),
            A.stroke();
        }
      }
    }
    At &&
      (M.tool === "eraser" || (B && B.type === "erase")) &&
      ((A.strokeStyle = V.muted),
      (A.lineWidth = 1),
      A.setLineDash([3, 3]),
      A.beginPath(),
      A.arc(At[0], At[1], 14, 0, 7),
      A.stroke(),
      A.setLineDash([])),
      Hn();
  }
  function Jn() {
    let t = M.face,
      e = t.B,
      n = [0, 1, 2].filter((o) => o !== t.axis),
      s = t.axis;
    if (
      ((A.globalAlpha = 0.8),
      n.forEach((o) => {
        let a = t.vps[o];
        if (a) {
          (A.strokeStyle = V.fam[o]), (A.lineWidth = 1), A.setLineDash([6, 5]);
          for (let [f, l, i] of ct)
            if (i === o && t.labels.includes(f) && t.labels.includes(l)) {
              let h =
                Math.hypot(e.P[f][0] - a[0], e.P[f][1] - a[1]) <
                Math.hypot(e.P[l][0] - a[0], e.P[l][1] - a[1])
                  ? e.P[f]
                  : e.P[l];
              lt(h, a);
            }
          A.setLineDash([]), xe(a, V.fam[o], "\u0422\u0421 \u0433\u0440\u0430\u043D\u0438");
        }
      }),
      t.vps[n[0]] && t.vps[n[1]])
    ) {
      let o = t.vps[n[0]],
        a = t.vps[n[1]],
        f = Math.hypot(a[0] - o[0], a[1] - o[1]);
      gn(o, [(a[0] - o[0]) / f, (a[1] - o[1]) / f], V.horizon, 1.2, [2, 4]);
    }
    if (
      (M.hint >= 2 &&
        t.vps[s] &&
        xe(t.vps[s], V.fam[s], "\u0422\u0421 \u0433\u043B\u0443\u0431\u0438\u043D\u044B"),
      M.hint >= 3)
    ) {
      (A.strokeStyle = V.fam[s]), (A.lineWidth = 1.2), A.setLineDash([7, 6]);
      for (let o of t.labels) {
        let a = e.P[o],
          f = t.vps[s];
        if (f) lt(a, f);
        else {
          let l = e.P[o ^ (1 << s)],
            i = [l[0] - a[0], l[1] - a[1]],
            h = Math.hypot(...i);
          lt(a, [a[0] + (i[0] / h) * 5e3, a[1] + (i[1] / h) * 5e3]);
        }
      }
      A.setLineDash([]);
    }
    A.globalAlpha = 1;
  }
  function Hn() {
    let t = D("badge"),
      e = "";
    M.example && M.mode === "free"
      ? (e =
          "<b>\u041F\u0440\u0438\u043C\u0435\u0440</b> \u2014 \u043A\u0443\u0431 \u043D\u0430\u0440\u0438\u0441\u043E\u0432\u0430\u043D \u0441 \u043E\u0448\u0438\u0431\u043A\u0430\u043C\u0438. \u0420\u0430\u0437\u0431\u043E\u0440 \u0441\u043F\u0440\u0430\u0432\u0430; \u043D\u0430\u0436\u043C\u0438 \xAB\u0421\u0442\u0435\u0440\u0435\u0442\u044C \u0432\u0441\u0451\xBB, \u0447\u0442\u043E\u0431\u044B \u0440\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u0441\u0432\u043E\u0451.")
      : M.mode === "face"
        ? (e = [
            "<b>\u0414\u0430\u043D\u0430 \u043E\u0434\u043D\u0430 \u0433\u0440\u0430\u043D\u044C \u043A\u0443\u0431\u0430.</b> \u0414\u043E\u0440\u0438\u0441\u0443\u0439 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0435 \u0440\u0451\u0431\u0440\u0430. \u0426\u0435\u043D\u0442\u0440 \u0432\u0437\u0433\u043B\u044F\u0434\u0430 \u2014 \u043A\u0440\u0435\u0441\u0442\u0438\u043A \u0432 \u0446\u0435\u043D\u0442\u0440\u0435 \u043B\u0438\u0441\u0442\u0430.",
            "<b>\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 1.</b> \u0420\u0451\u0431\u0440\u0430 \u0433\u0440\u0430\u043D\u0438 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u0434\u0432\u0443\u0445 \u0442\u043E\u0447\u043A\u0430\u0445 \u0441\u0445\u043E\u0434\u0430; \u043F\u0443\u043D\u043A\u0442\u0438\u0440 \u0447\u0435\u0440\u0435\u0437 \u043D\u0438\u0445 \u2014 \u043B\u0438\u043D\u0438\u044F \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0430 \u044D\u0442\u043E\u0439 \u0433\u0440\u0430\u043D\u0438.",
            "<b>\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 2.</b> \u0420\u0451\u0431\u0440\u0430 \u0433\u043B\u0443\u0431\u0438\u043D\u044B \u0438\u0434\u0443\u0442 \u0432 \u0442\u0440\u0435\u0442\u044C\u044E \u0442\u043E\u0447\u043A\u0443 \u0441\u0445\u043E\u0434\u0430. \u041E\u043D\u0430 \u0441\u0442\u043E\u0438\u0442 \u0442\u0430\u043A, \u0447\u0442\u043E \u0446\u0435\u043D\u0442\u0440 \u0432\u0437\u0433\u043B\u044F\u0434\u0430 \u2014 \u0442\u043E\u0447\u043A\u0430 \u043F\u0435\u0440\u0435\u0441\u0435\u0447\u0435\u043D\u0438\u044F \u0432\u044B\u0441\u043E\u0442 \u0442\u0440\u0435\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u0430 \u0438\u0437 \u0442\u0440\u0451\u0445 \u0442\u043E\u0447\u0435\u043A \u0441\u0445\u043E\u0434\u0430.",
            "<b>\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 3.</b> \u041B\u0443\u0447\u0438 \u0433\u043B\u0443\u0431\u0438\u043D\u044B \u0443\u0436\u0435 \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u044B. \u041E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0440\u0435\u0448\u0438\u0442\u044C, \u0433\u0434\u0435 \u043E\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0434\u0430\u043B\u044C\u043D\u0438\u0435 \u0443\u0433\u043B\u044B.",
          ][M.hint])
        : M.strokes.length ||
          (e =
            "<b>\u041D\u0430\u0440\u0438\u0441\u0443\u0439 \u043A\u0443\u0431</b> \u0438\u043B\u0438 \u043A\u043E\u0440\u043E\u0431\u043A\u0443 \u043E\u0442 \u0440\u0443\u043A\u0438. \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0437\u0430\u043F\u0443\u0441\u043A\u0430\u0435\u0442\u0441\u044F \u0441\u0430\u043C\u0430 \u043F\u043E\u0441\u043B\u0435 \u043A\u0430\u0436\u0434\u043E\u0439 \u043B\u0438\u043D\u0438\u0438."),
      (t.innerHTML = e),
      (t.hidden = !e);
  }
  var Kn = [
    "\u0437\u0430\u043C\u0435\u0442\u043A\u0430",
    "\u043C\u0435\u043B\u043E\u0447\u044C",
    "\u043E\u0448\u0438\u0431\u043A\u0430",
    "\u0433\u0440\u0443\u0431\u043E",
  ];
  function an(t, e) {
    let s = 2 * Math.PI * 38,
      o = s * (1 - t / 100);
    return `<svg class="ring" viewBox="0 0 92 92" role="img" aria-label="\u041E\u0446\u0435\u043D\u043A\u0430 ${t} \u0438\u0437 100"><circle cx="46" cy="46" r="38" fill="none" stroke="color-mix(in srgb, var(--ink) 9%, transparent)" stroke-width="7"/><circle cx="46" cy="46" r="38" fill="none" stroke="${e}" stroke-width="7" stroke-linecap="round" stroke-dasharray="${s}" stroke-dashoffset="${o}" transform="rotate(-90 46 46)"/><text x="46" y="55" text-anchor="middle">${t}</text></svg>`;
  }
  var Gt = (t) =>
    t >= 85 ? "var(--answer)" : t >= 65 ? "var(--sev1)" : t >= 45 ? "var(--sev2)" : "var(--sev3)";
  function me(t) {
    return (t / qn) * 43.27;
  }
  function rn(t) {
    return t < 20
      ? "\u0441\u0432\u0435\u0440\u0445\u0448\u0438\u0440\u043E\u043A\u0438\u0439 \u0443\u0433\u043E\u043B"
      : t < 30
        ? "\u0448\u0438\u0440\u043E\u043A\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u044B\u0439"
        : t < 40
          ? "\u0443\u043C\u0435\u0440\u0435\u043D\u043D\u043E \u0448\u0438\u0440\u043E\u043A\u0438\u0439"
          : t < 60
            ? "\u043D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u044B\u0439, \u043A\u0430\u043A \u0433\u043B\u0430\u0437"
            : t < 110
              ? "\u043F\u043E\u0440\u0442\u0440\u0435\u0442\u043D\u044B\u0439"
              : "\u0442\u0435\u043B\u0435\u0432\u0438\u043A, \u043F\u043E\u0447\u0442\u0438 \u0431\u0435\u0437 \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u044B";
  }
  function Lt() {
    let t = D("report"),
      e = M.result;
    if (!e || (!e.boxes.length && !M.strokes.some((h) => !h.given))) {
      t.innerHTML = `<div class="card empty"><h2>${M.mode === "face" ? "\u0414\u043E\u0440\u0438\u0441\u0443\u0439 \u043A\u0443\u0431 \u043F\u043E \u0433\u0440\u0430\u043D\u0438" : "\u041D\u0430\u0440\u0438\u0441\u0443\u0439 \u043A\u0443\u0431 \u0438\u043B\u0438 \u043A\u043E\u0440\u043E\u0431\u043A\u0443"}</h2>
      <ol><li>\u041F\u0440\u043E\u0432\u043E\u0434\u0438 \u0440\u0451\u0431\u0440\u0430 \u043F\u0440\u044F\u043C\u044B\u043C\u0438 \u0448\u0442\u0440\u0438\u0445\u0430\u043C\u0438 \u0438 \u0441\u043E\u0435\u0434\u0438\u043D\u044F\u0439 \u0438\u0445 \u0432 \u0443\u0433\u043B\u0430\u0445.</li><li>\u041D\u0435\u0432\u0438\u0434\u0438\u043C\u044B\u0435 \u0440\u0451\u0431\u0440\u0430 \u2014 \u043F\u0435\u0440\u043E\u043C \xAB\u041D\u0435\u0432\u0438\u0434\u0438\u043C\u043E\u0435\xBB \u0438\u043B\u0438 \u043F\u0443\u043D\u043A\u0442\u0438\u0440\u043E\u043C; \u043C\u043E\u0436\u043D\u043E \u0438 \u043D\u0435 \u0440\u0438\u0441\u043E\u0432\u0430\u0442\u044C.</li><li>\u0420\u0430\u0437\u0431\u043E\u0440 \u043F\u043E\u044F\u0432\u0438\u0442\u0441\u044F \u0437\u0434\u0435\u0441\u044C \u0441\u0430\u043C. \u0426\u0432\u0435\u0442 \u043B\u0438\u043D\u0438\u0438 \u043D\u0430 \u043B\u0438\u0441\u0442\u0435 \u2014 \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u0440\u0435\u0431\u0440\u0430.</li></ol>
      <p class="small">\u041D\u0435 \u0437\u043D\u0430\u0435\u0448\u044C, \u0441 \u0447\u0435\u0433\u043E \u043D\u0430\u0447\u0430\u0442\u044C \u2014 \u043D\u0430\u0436\u043C\u0438 \xAB\u041F\u0440\u0438\u043C\u0435\u0440\xBB \u0432\u0432\u0435\u0440\u0445\u0443.</p></div>`;
      return;
    }
    if (!e.boxes.length) {
      t.innerHTML = `<div class="card"><h2>\u041A\u043E\u0440\u043E\u0431\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430</h2><p>${e.error === "few-lines" ? "\u041F\u043E\u043A\u0430 \u043C\u0430\u043B\u043E \u043F\u0440\u044F\u043C\u044B\u0445 \u043B\u0438\u043D\u0438\u0439: \u043D\u0443\u0436\u043D\u043E \u0445\u043E\u0442\u044F \u0431\u044B 7\u20139 \u0440\u0451\u0431\u0435\u0440." : "\u041D\u0435 \u043F\u043E\u043B\u0443\u0447\u0438\u043B\u043E\u0441\u044C \u043F\u043E\u043D\u044F\u0442\u044C, \u0433\u0434\u0435 \u0443 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u0433\u0440\u0430\u043D\u0438. \u041E\u0431\u044B\u0447\u043D\u043E \u044D\u0442\u043E \u0437\u043D\u0430\u0447\u0438\u0442, \u0447\u0442\u043E \u0440\u0435\u0431\u0440\u043E \u043D\u0435 \u0434\u043E\u0445\u043E\u0434\u0438\u0442 \u0434\u043E \u0443\u0433\u043B\u0430 \u0438\u043B\u0438 \u043E\u0434\u043D\u0430 \u043B\u0438\u043D\u0438\u044F \u0438\u0434\u0451\u0442 \u0447\u0435\u0440\u0435\u0437 \u0434\u0432\u0430 \u0440\u0435\u0431\u0440\u0430 \u0431\u0435\u0437 \u0438\u0437\u043B\u043E\u043C\u0430."}</p>${e.fallback ? Gn(e) : ""}</div>`;
      return;
    }
    let n = e.boxes[M.sel],
      s = n.diag,
      o = "",
      a = M.mode === "face" && e.truth;
    if (a) {
      let h = a.rms / (s.scale || 1),
        u = Math.round(Math.max(0, Math.min(100, (100 * (0.12 - h)) / (0.12 - 0.012))));
      o += `<div class="card scorecard">${an(u, Gt(u))}<div><p class="grade">${u >= 90 ? "\u041F\u043E\u0447\u0442\u0438 \u0442\u043E\u0447\u043D\u043E" : u >= 70 ? "\u0411\u043B\u0438\u0437\u043A\u043E" : u >= 45 ? "\u0415\u0441\u0442\u044C \u0440\u0430\u0441\u0445\u043E\u0436\u0434\u0435\u043D\u0438\u044F" : "\u0414\u0430\u043B\u0435\u043A\u043E \u043E\u0442 \u043E\u0442\u0432\u0435\u0442\u0430"}</p>
      <div class="parts"><div class="part"><span>\u0423\u0433\u043B\u044B \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043E\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0445</span><b>${Math.round(a.rms)}</b><div class="bar"><i style="width:${u}%;background:${Gt(u)}"></i></div></div>
      ${
        s.score
          ? s.score.parts
              .filter((x) => x.key === "conv" || x.key === "props")
              .map(cn)
              .join("")
          : ""
      }</div></div></div>`;
    } else
      s.score &&
        (o += `<div class="card scorecard">${an(s.score.total, Gt(s.score.total))}<div><p class="grade">${Yn(s.score.grade)}</p><div class="parts">${s.score.parts.map(cn).join("")}</div></div></div>`);
    if (
      (e.boxes.length > 1 &&
        (o += `<div class="boxtabs" role="group" aria-label="\u041A\u043E\u0440\u043E\u0431\u043A\u0438">${e.boxes
          .map((h, u) => {
            let x = e.scene && e.scene.issues.find((b) => b.box === u && b.odd);
            return `<button data-box="${u}" aria-pressed="${u === M.sel}" class="${x ? "odd" : ""}">\u041A\u043E\u0440\u043E\u0431\u043A\u0430 ${u + 1}${h.diag.score ? " \xB7 " + h.diag.score.total : ""}</button>`;
          })
          .join("")}</div>`),
      e.scene)
    ) {
      let h = e.scene.issues.filter((u) => u.odd);
      o += `<div class="card"><h2>\u0412\u0441\u0435 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u043E\u0434\u043D\u0438\u043C \u0432\u0437\u0433\u043B\u044F\u0434\u043E\u043C</h2>${h.length ? h.map((u) => `<ul class="issues"><li class="issue" data-sev="2" data-box="${u.box}"><h3><span class="sevtag">\u043E\u0448\u0438\u0431\u043A\u0430</span>\u041A\u043E\u0440\u043E\u0431\u043A\u0430 ${u.box + 1} \u043D\u0430\u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0430 \u0441 \u0434\u0440\u0443\u0433\u043E\u0439 \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u043E\u0439</h3><p>${u.fRatio < 0.8 ? `\u0415\u0451 \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0441\u0438\u043B\u044C\u043D\u0435\u0435, \u0447\u0435\u043C \u0443 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445: \u0431\u0443\u0434\u0442\u043E \u0441\u043D\u044F\u0442\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432\u043E\u043C \u0432 ${Et(1 / u.fRatio)} \u0440\u0430\u0437\u0430 \u043A\u043E\u0440\u043E\u0447\u0435.` : u.fRatio > 1.25 ? `\u0415\u0451 \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u0441\u043B\u0430\u0431\u0435\u0435, \u0447\u0435\u043C \u0443 \u043E\u0441\u0442\u0430\u043B\u044C\u043D\u044B\u0445: \u0431\u0443\u0434\u0442\u043E \u0441\u043D\u044F\u0442\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432\u043E\u043C \u0432 ${Et(u.fRatio)} \u0440\u0430\u0437\u0430 \u0434\u043B\u0438\u043D\u043D\u0435\u0435.` : "\u0415\u0451 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u0442\u0440\u0435\u0431\u0443\u044E\u0442 \u0434\u0440\u0443\u0433\u043E\u0433\u043E \u0446\u0435\u043D\u0442\u0440\u0430 \u0432\u0437\u0433\u043B\u044F\u0434\u0430."} \u0421 \u043E\u0431\u0449\u0435\u0439 \u043A\u0430\u043C\u0435\u0440\u043E\u0439 \u0435\u0451 \u0443\u0433\u043B\u044B \u043F\u0440\u0438\u0448\u043B\u043E\u0441\u044C \u0431\u044B \u0441\u0434\u0432\u0438\u043D\u0443\u0442\u044C \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u043D\u0430 ${Math.round(u.fixedRel * (s.scale || 1) * 100) / 100 > 0 ? Math.round(u.fixedRel * 100) + "% \u0440\u0435\u0431\u0440\u0430" : "\u043D\u0435\u043C\u043D\u043E\u0433\u043E"}.</p></li></ul>`).join("") : '<ul class="good"><li>\u0412\u0441\u0435 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u044B \u0441 \u043E\u0434\u043D\u043E\u0439 \u043A\u0430\u043C\u0435\u0440\u043E\u0439: \u043E\u0434\u0438\u043D \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442, \u043E\u0434\u0438\u043D \u0446\u0435\u043D\u0442\u0440 \u0432\u0437\u0433\u043B\u044F\u0434\u0430.</li></ul>'}
      <dl class="facts" style="margin-top:8px"><dt>\u041E\u0431\u0449\u0438\u0439 \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432</dt><dd class="mono">\u2248 ${Math.round(me(e.scene.f))} \u043C\u043C \xB7 ${rn(me(e.scene.f))}</dd></dl></div>`;
    }
    let f = s.issues;
    (o += `<div class="card"><h2>${f.filter((h) => h.sev >= 1).length ? "\u0427\u0442\u043E \u0438\u0441\u043F\u0440\u0430\u0432\u0438\u0442\u044C" : "\u0420\u0430\u0437\u0431\u043E\u0440"}</h2>`),
      f.length
        ? (o += `<ul class="issues">${f.map((h, u) => `<li class="issue" data-sev="${h.sev}" data-i="${u}" tabindex="0"><h3><span class="sevtag">${Kn[h.sev]}</span>${de(h.title)}</h3><p>${de(h.text)}</p></li>`).join("")}</ul>`)
        : (o +=
            '<p style="margin:0;color:var(--muted)">\u041E\u0448\u0438\u0431\u043E\u043A \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u044B \u043D\u0435 \u043D\u0430\u0448\u043B\u043E\u0441\u044C.</p>'),
      s.good.length &&
        (o += `<ul class="good">${s.good.map((h) => `<li class="${h.kind === "few" ? "info" : ""}">${de(h.text)}</li>`).join("")}</ul>`),
      (o += "</div>"),
      (o += `<div class="card"><h2>\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0440\u0451\u0431\u0435\u0440</h2><table class="fams"><thead><tr><th>\u0426\u0432\u0435\u0442</th><th>\u0440\u0451\u0431\u0435\u0440</th><th class="num">\u0440\u0430\u0437\u0431\u0440\u043E\u0441</th><th>\u0442\u043E\u0447\u043A\u0430 \u0441\u0445\u043E\u0434\u0430</th></tr></thead><tbody>${s.families
        .map((h) => {
          let u =
              h.status === "ok"
                ? '<span class="st-ok">\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F</span>'
                : h.status === "nonconv"
                  ? '<span class="st-bad">\u043C\u0438\u043C\u043E \u0442\u043E\u0447\u043A\u0438</span>'
                  : h.status === "diverge"
                    ? '<span class="st-bad">\u0440\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F</span>'
                    : '<span class="st-few">\u043C\u0430\u043B\u043E \u0440\u0451\u0431\u0435\u0440</span>',
            x = n.vps[h.k],
            b = x
              ? h.parallel
                ? "\u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B"
                : x.pt && x.pt[0] > 0 && x.pt[0] < F.w && x.pt[1] > 0 && x.pt[1] < F.h
                  ? "\u043D\u0430 \u043B\u0438\u0441\u0442\u0435"
                  : "\u0437\u0430 \u043B\u0438\u0441\u0442\u043E\u043C"
              : "\u2014";
          return `<tr><td><span class="sw" style="background:var(--fam${h.k})"></span>${sn[h.k]}</td><td>${h.n} \xB7 ${u}</td><td class="num">${h.rms !== void 0 ? Et(h.rms) + "\xB0" : "\u2014"}</td><td>${b}</td></tr>`;
        })
        .join("")}</tbody></table>
    <p class="small">\u0420\u0430\u0437\u0431\u0440\u043E\u0441 \u2014 \u043D\u0430\u0441\u043A\u043E\u043B\u044C\u043A\u043E \u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u0440\u0451\u0431\u0440\u0430 \u043E\u0434\u043D\u043E\u0433\u043E \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u0440\u043E\u0445\u043E\u0434\u044F\u0442 \u043C\u0438\u043C\u043E \u043E\u0431\u0449\u0435\u0439 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430. \u0414\u043E 1,5\xB0 \u2014 \u0442\u0432\u0451\u0440\u0434\u0430\u044F \u0440\u0443\u043A\u0430, \u0434\u043E 3\xB0 \u2014 \u043D\u043E\u0440\u043C\u0430\u043B\u044C\u043D\u043E.</p></div>`);
    let l = s.camera && s.camera.f ? s.camera : null,
      i = s.implied;
    if (i) {
      let h = l ? l.f : i.f,
        u = me(h),
        x = l ? l.cone : i.cone;
      o += `<div class="card"><h2>\u041A\u0430\u043A\u0438\u043C \u0433\u043B\u0430\u0437\u043E\u043C \u044D\u0442\u043E \u0432\u0438\u0434\u043D\u043E</h2><dl class="facts">
      <dt>\u041E\u0431\u044A\u0435\u043A\u0442\u0438\u0432</dt><dd class="mono">\u2248 ${Math.round(u)} \u043C\u043C <span style="font-family:var(--font);color:var(--muted)">\xB7 ${rn(u)}</span></dd>
      <dt>\u041A\u0440\u0430\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438</dt><dd class="mono">${Math.round(x)}\xB0 \u043E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430 \u0432\u0437\u0433\u043B\u044F\u0434\u0430${x > 34 ? ' <span style="color:var(--sev2)">\xB7 \u0438\u0441\u043A\u0430\u0436\u0435\u043D\u0438\u044F</span>' : ""}</dd>
      <dt>\u0426\u0435\u043D\u0442\u0440 \u0432\u0437\u0433\u043B\u044F\u0434\u0430</dt><dd>${(() => {
        let b = l ? l.c : i.c;
        return b[0] > 0 && b[0] < F.w && b[1] > 0 && b[1] < F.h
          ? "\u043D\u0430 \u043B\u0438\u0441\u0442\u0435"
          : "\u0437\u0430 \u043A\u0440\u0430\u0435\u043C \u043B\u0438\u0441\u0442\u0430";
      })()} <span style="color:var(--faint)">(\u0441\u043B\u043E\u0439 \xAB\u0413\u043E\u0440\u0438\u0437\u043E\u043D\u0442 \u0438 \u0446\u0435\u043D\u0442\u0440 \u0432\u0437\u0433\u043B\u044F\u0434\u0430\xBB)</span></dd>
      ${s.camera && s.camera.impossible ? '<dt>\u041A\u0430\u043C\u0435\u0440\u0430</dt><dd style="color:var(--sev3)">\u0442\u0430\u043A\u0438\u0435 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u043D\u0435\u0432\u043E\u0437\u043C\u043E\u0436\u043D\u044B</dd>' : ""}</dl>
      <p class="small">\u0414\u043B\u0438\u043D\u0430 \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432\u0430 \u043F\u043E\u0441\u0447\u0438\u0442\u0430\u043D\u0430 \u0434\u043B\u044F \u043B\u0438\u0441\u0442\u0430 \u043A\u0430\u043A \u043A\u0430\u0434\u0440\u0430 36\xD724 \u043C\u043C. \u0427\u0435\u043C \u043A\u043E\u0440\u043E\u0447\u0435 \u043E\u0431\u044A\u0435\u043A\u0442\u0438\u0432, \u0442\u0435\u043C \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0440\u0451\u0431\u0440\u0430.</p></div>`;
    }
    s.props &&
      (o += `<div class="card"><h2>\u041F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 \u0432\u043E\u0441\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u043E\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438</h2><div class="props">${s.props.r
        .map((h, u) => {
          let x = Math.log(h),
            b = Math.min(50, (Math.abs(x) / Math.log(1.6)) * 50);
          return `<div class="prop"><span><span class="sw" style="background:var(--fam${u})"></span>${sn[u]}</span><span class="track"><i style="background:var(--fam${u});${x >= 0 ? `left:50%;width:${b}%` : `right:50%;width:${b}%`}"></i></span><b>\xD7${Et(h, 2)}</b></div>`;
        })
        .join("")}</div>
      <p class="small">\u0414\u043B\u0438\u043D\u0430 \u0440\u0451\u0431\u0435\u0440 \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u0443 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438, \u043A\u043E\u0442\u043E\u0440\u0430\u044F \u043F\u043E\u043B\u0443\u0447\u0430\u0435\u0442\u0441\u044F \u0438\u0437 \u0440\u0438\u0441\u0443\u043D\u043A\u0430, \u043E\u0442\u043D\u043E\u0441\u0438\u0442\u0435\u043B\u044C\u043D\u043E \u0441\u0440\u0435\u0434\u043D\u0435\u0439. \u0423 \u043A\u0443\u0431\u0430 \u0432\u0441\u0435 \xD71,00.${s.props.determined ? "" : " \u041F\u043E \u044D\u0442\u043E\u043C\u0443 \u0440\u0438\u0441\u0443\u043D\u043A\u0443 \u043F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u044E\u0442\u0441\u044F \u043D\u0435\u0442\u043E\u0447\u043D\u043E."}</p></div>`),
      (t.innerHTML = o),
      t.querySelectorAll(".boxtabs button").forEach((h) =>
        h.addEventListener("click", () => {
          (M.sel = +h.dataset.box), Lt(), O();
        }),
      ),
      t.querySelectorAll(".issue[data-i]").forEach((h) => {
        let u = f[+h.dataset.i],
          x = () => {
            (M.hl = { box: M.sel, fams: u.fams, line: u.line, label: u.label }), O();
          },
          b = () => {
            (M.hl = null), O();
          };
        h.addEventListener("mouseenter", x),
          h.addEventListener("mouseleave", b),
          h.addEventListener("focus", x),
          h.addEventListener("blur", b);
      }),
      t.querySelectorAll(".issue[data-box]").forEach((h) =>
        h.addEventListener("click", () => {
          (M.sel = +h.dataset.box), Lt(), O();
        }),
      );
  }
  var Yn = (t) => t[0].toUpperCase() + t.slice(1);
  function cn(t) {
    return `<div class="part"><span>${t.name}</span><b>${t.val}</b><div class="bar"><i style="width:${t.val}%;background:${Gt(t.val)}"></i></div></div>`;
  }
  function Gn(t) {
    let e = t.fallback.fams.filter((n) => n.vp && n.ids.length >= 3);
    return e.length
      ? `<p class="small">\u041F\u043E\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u0435\u043D\u044B \u0442\u043E\u043B\u044C\u043A\u043E \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043B\u0438\u043D\u0438\u0439:</p><ul class="good">${e.map((n) => `<li class="info">${n.ids.length} \u043B\u0438\u043D\u0438\u0439 \u043E\u0434\u043D\u043E\u0433\u043E \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F: \u0440\u0430\u0437\u0431\u0440\u043E\u0441 ${Et(n.vp.rms)}\xB0</li>`).join("")}</ul>`
      : "";
  }
  D("toolPen").onclick = () => St("pen");
  D("toolLine").onclick = () => St("line");
  D("toolHidden").onclick = () => St("hidden");
  D("toolEraser").onclick = () => St("eraser");
  D("undo").onclick = un;
  D("redo").onclick = be;
  D("clear").onclick = () => {
    M.strokes.some((t) => !t.given) && (Qt(), (M.strokes = M.strokes.filter((t) => t.given)), Bt());
  };
  D("mFree").onclick = () => $e("free");
  D("mFace").onclick = () => $e("face");
  D("tCube").onclick = () => {
    (M.target = "cube"), Ot(), qt(), pt();
  };
  D("tBox").onclick = () => {
    (M.target = "box"), Ot(), qt(), pt();
  };
  D("newFace").onclick = Ee;
  D("hintBtn").onclick = () => {
    (M.hint = (M.hint + 1) % 4),
      (D("hintBtn").textContent = M.hint
        ? `\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430 ${M.hint} \u0438\u0437 3`
        : "\u041F\u043E\u0434\u0441\u043A\u0430\u0437\u043A\u0430"),
      O();
  };
  D("exampleBtn").onclick = dn;
  D("helpBtn").onclick = () => {
    let t = D("help");
    (t.hidden = !t.hidden), D("helpBtn").setAttribute("aria-expanded", !t.hidden), requestAnimationFrame(ye);
  };
  D("fitPage").onclick = we;
  D("rotSheet").onclick = (e) => rotateSheet(e.shiftKey ? -1 : 1);
  D("fitVP").onclick = hn;
  for (let [t, e] of [
    ["fam", "lFam"],
    ["rays", "lRays"],
    ["horizon", "lHorizon"],
    ["answer", "lAnswer"],
    ["mine", "lMine"],
  ])
    D(e).onclick = () => $t(t);
  D("underlayIn").addEventListener("change", (t) => {
    let e = t.target.files && t.target.files[0];
    if (!e) return;
    let n = new Image();
    (n.onload = () => {
      (M.underlay = n), (D("underlayA").hidden = !1), O();
    }),
      (n.src = URL.createObjectURL(e));
  });
  D("underlayA").addEventListener("input", (t) => {
    (M.underlayA = +t.target.value), O();
  });
  new ResizeObserver(ye).observe(D("stage"));
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => {
    ve(), O(), Lt();
  });
  new MutationObserver(() => {
    ve(), O();
  }).observe(document.documentElement, { attributes: !0, attributeFilter: ["data-theme"] });
  ve();
  var Qn = On();
  D("rotLabel").textContent = M.rot ? `${M.rot * 90}\xB0` : "";
  Ot();
  te();
  St("pen");
  M.strokes = M.store.free || [];
  Qn ? pt() : dn();
  Lt();
  ye();
  window.perspectiveChecker = { state: M, toS: J };
})();
