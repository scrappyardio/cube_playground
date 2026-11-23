(() => {
  var Vt = (t, e) => [t[0] - e[0], t[1] - e[1]];
  var oe = (t, e) => t[0] * e[0] + t[1] * e[1],
    st = (t, e) => t[0] * e[1] - t[1] * e[0];
  var T = (t, e) => Math.hypot(t[0] - e[0], t[1] - e[1]),
    bt = (t) => {
      let e = Math.hypot(t[0], t[1]) || 1;
      return [t[0] / e, t[1] / e];
    },
    pt = (t, e) => bt([e[0] - t[0], e[1] - t[1]]),
    Lt = (t, e) => [(t[0] + e[0]) / 2, (t[1] + e[1]) / 2];
  var _ = (t, e) => t[0] * e[0] + t[1] * e[1] + t[2] * e[2],
    U = (t, e) => [t[1] * e[2] - t[2] * e[1], t[2] * e[0] - t[0] * e[2], t[0] * e[1] - t[1] * e[0]];
  var C = (t) => {
      let e = Math.hypot(t[0], t[1], t[2]) || 1;
      return [t[0] / e, t[1] / e, t[2] / e];
    },
    yt = (t, e) => [t[0] - e[0], t[1] - e[1], t[2] - e[2]];
  var W = (t, e) => [t[0] * e, t[1] * e, t[2] * e],
    O = 180 / Math.PI,
    vt = (t, e, n) => Math.max(e, Math.min(n, t));
  function F(t, e) {
    let n = Math.abs(t[0] * e[0] + t[1] * e[1]) / (Math.hypot(t[0], t[1]) * Math.hypot(e[0], e[1]) || 1);
    return Math.acos(Math.min(1, n)) * O;
  }
  function mt(t, e) {
    let n = Math.atan2(st(t, e), oe(t, e));
    return n > Math.PI / 2 ? (n -= Math.PI) : n < -Math.PI / 2 && (n += Math.PI), n;
  }
  function ot(t, e, n, r) {
    let a = st(e, r);
    if (Math.abs(a) < 1e-12) return null;
    let o = st(Vt(n, t), r) / a;
    return [t[0] + e[0] * o, t[1] + e[1] * o, o];
  }
  function G(t, e) {
    let n = e.length,
      r = t.map((o, m) => [...o, e[m]]);
    for (let o = 0; o < n; o++) {
      let m = o;
      for (let h = o + 1; h < n; h++) Math.abs(r[h][o]) > Math.abs(r[m][o]) && (m = h);
      if (Math.abs(r[m][o]) < 1e-300) return null;
      if (m !== o) {
        let h = r[o];
        (r[o] = r[m]), (r[m] = h);
      }
      let b = r[o][o];
      for (let h = o + 1; h < n; h++) {
        let v = r[h][o] / b;
        if (v) for (let E = o; E <= n; E++) r[h][E] -= v * r[o][E];
      }
    }
    let a = new Array(n).fill(0);
    for (let o = n - 1; o >= 0; o--) {
      let m = r[o][n];
      for (let b = o + 1; b < n; b++) m -= r[o][b] * a[b];
      a[o] = m / r[o][o];
    }
    return a.every(Number.isFinite) ? a : null;
  }
  function re(t) {
    let e = t.length,
      n = [];
    for (let r = 0; r < e; r++) {
      let a = new Array(e).fill(0);
      a[r] = 1;
      let o = G(t, a);
      if (!o) return null;
      n.push(o);
    }
    return t.map((r, a) => n.map((o) => o[a]));
  }
  function nt(t) {
    let e = Math.hypot(t[0], t[1], t[2]);
    if (e < 1e-12)
      return [
        [1, -t[2], t[1]],
        [t[2], 1, -t[0]],
        [-t[1], t[0], 1],
      ];
    let n = [t[0] / e, t[1] / e, t[2] / e],
      r = Math.cos(e),
      a = Math.sin(e),
      o = 1 - r;
    return [
      [r + n[0] * n[0] * o, n[0] * n[1] * o - n[2] * a, n[0] * n[2] * o + n[1] * a],
      [n[1] * n[0] * o + n[2] * a, r + n[1] * n[1] * o, n[1] * n[2] * o - n[0] * a],
      [n[2] * n[0] * o - n[1] * a, n[2] * n[1] * o + n[0] * a, r + n[2] * n[2] * o],
    ];
  }
  var rt = (t, e) => t.map((n) => [0, 1, 2].map((r) => n[0] * e[0][r] + n[1] * e[1][r] + n[2] * e[2][r])),
    Pt = (t, e) => [_(t[0], e), _(t[1], e), _(t[2], e)];
  function qt(t) {
    let e = C([t[0][0], t[1][0], t[2][0]]),
      n = [t[0][1], t[1][1], t[2][1]];
    n = C(yt(n, W(e, _(e, n))));
    let r = U(e, n);
    return [
      [e[0], n[0], r[0]],
      [e[1], n[1], r[1]],
      [e[2], n[2], r[2]],
    ];
  }
  function ce(t, e, n) {
    let r = t + n,
      a = Math.sqrt(Math.max(0, ((t - n) * (t - n)) / 4 + e * e)),
      o = r / 2 + a,
      m = r / 2 - a,
      b = Math.abs(e) > 1e-12 ? [o - n, e] : t >= n ? [1, 0] : [0, 1];
    return (b = bt(b)), { l1: o, l2: m, v1: b, v2: [-b[1], b[0]] };
  }
  function wt(t, e) {
    let n = 0,
      r = 0,
      a = 0;
    for (let d = 0; d < t.length; d++) {
      let i = e ? e[d] : 1;
      (n += i), (r += i * t[d][0]), (a += i * t[d][1]);
    }
    (r /= n), (a /= n);
    let o = 0,
      m = 0,
      b = 0;
    for (let d = 0; d < t.length; d++) {
      let i = e ? e[d] : 1,
        u = t[d][0] - r,
        y = t[d][1] - a;
      (o += i * u * u), (m += i * y * y), (b += i * u * y);
    }
    let h = ce(o, b, m),
      v = h.v1,
      E = 1 / 0,
      k = -1 / 0;
    for (let d of t) {
      let i = (d[0] - r) * v[0] + (d[1] - a) * v[1];
      i < E && (E = i), i > k && (k = i);
    }
    return {
      c: [r, a],
      d: v,
      rms: Math.sqrt(Math.max(0, h.l2) / n),
      t0: E,
      t1: k,
      a: [r + v[0] * E, a + v[1] * E],
      b: [r + v[0] * k, a + v[1] * k],
      len: k - E,
    };
  }
  function Z(t, e, n = {}) {
    let r = n.iters ?? 60,
      a = e.length,
      o = e.slice(),
      m = t(o),
      b = $t(m),
      h = n.lambda ?? 0.001,
      v = null,
      E = (k, d) => {
        let i = [];
        for (let u = 0; u < a; u++) {
          let y = (n.step ? n.step[u] : 1e-6) * Math.max(1, Math.abs(k[u])),
            S = k.slice();
          S[u] += y;
          let $ = t(S),
            l = new Float64Array(d.length);
          for (let M = 0; M < d.length; M++) l[M] = ($[M] - d[M]) / y;
          i.push(l);
        }
        return i;
      };
    for (let k = 0; k < r; k++) {
      v = E(o, m);
      let d = [],
        i = new Array(a).fill(0);
      for (let y = 0; y < a; y++) {
        d.push(new Array(a).fill(0));
        let S = v[y];
        for (let $ = 0; $ < m.length; $++) i[y] += S[$] * m[$];
      }
      for (let y = 0; y < a; y++)
        for (let S = y; S < a; S++) {
          let $ = v[y],
            l = v[S],
            M = 0;
          for (let g = 0; g < m.length; g++) M += $[g] * l[g];
          d[y][S] = d[S][y] = M;
        }
      let u = !1;
      for (let y = 0; y < 10; y++) {
        let S = d.map((s, p) => s.map((w, A) => (p === A ? w * (1 + h) + 1e-12 : w))),
          $ = G(
            S,
            i.map((s) => -s),
          );
        if (!$) {
          h *= 10;
          continue;
        }
        let l = o.map((s, p) => s + $[p]),
          M = t(l),
          g = $t(M);
        if (Number.isFinite(g) && g < b) {
          let s = (b - g) / (b || 1);
          (o = l), (m = M), (b = g), (h = Math.max(1e-9, h * 0.3)), (u = !0), s < 1e-10 && (k = r);
          break;
        }
        h *= 10;
      }
      if (!u) break;
    }
    return { p: o, cost: b, r: m, J: n.wantJ ? E(o, m) : null };
  }
  function $t(t) {
    let e = 0;
    for (let n of t) e += n * n;
    return e;
  }
  function jt(t) {
    let e = t.length,
      n = [];
    for (let r = 0; r < e; r++) n.push(new Array(e).fill(0));
    for (let r = 0; r < e; r++)
      for (let a = r; a < e; a++) {
        let o = 0,
          m = t[r],
          b = t[a];
        for (let h = 0; h < m.length; h++) o += m[h] * b[h];
        n[r][a] = n[a][r] = o;
      }
    for (let r = 0; r < e; r++) n[r][r] += 1e-12;
    return re(n);
  }
  function tt(t, e) {
    let n = Math.abs(t);
    return n <= e ? t : Math.sign(t) * Math.sqrt(e * (2 * n - e));
  }
  function Ct(t, e) {
    return Math.sign(t) * e * Math.sqrt(Math.log1p((t / e) * (t / e)));
  }
  function N(t) {
    let e = 1 / 0,
      n = 1 / 0,
      r = -1 / 0,
      a = -1 / 0;
    for (let o of t)
      o[0] < e && (e = o[0]), o[0] > r && (r = o[0]), o[1] < n && (n = o[1]), o[1] > a && (a = o[1]);
    return {
      x0: e,
      y0: n,
      x1: r,
      y1: a,
      w: r - e,
      h: a - n,
      diag: Math.hypot(r - e, a - n),
      c: [(e + r) / 2, (n + a) / 2],
    };
  }
  function ae(t, e) {
    if (t.length < 2) return t.slice();
    let n = 0;
    for (let v = 1; v < t.length; v++) n += T(t[v - 1], t[v]);
    if (n < 1e-9) return [t[0]];
    let r = Math.max(2, Math.round(n / e) + 1),
      a = n / (r - 1),
      o = [t[0].slice(0, 2)],
      m = 0,
      b = 1,
      h = t[0];
    for (let v = 1; v < r - 1; v++) {
      let E = v * a;
      for (; b < t.length; ) {
        let k = T(h, t[b]);
        if (m + k >= E) {
          let d = (E - m) / (k || 1),
            i = [h[0] + (t[b][0] - h[0]) * d, h[1] + (t[b][1] - h[1]) * d];
          (m = E), (h = i), o.push(i);
          break;
        }
        (m += k), (h = t[b]), b++;
      }
    }
    return o.push(t[t.length - 1].slice(0, 2)), o;
  }
  function ie(t) {
    let e = t.length,
      n = {
        x: new Float64Array(e + 1),
        y: new Float64Array(e + 1),
        xx: new Float64Array(e + 1),
        yy: new Float64Array(e + 1),
        xy: new Float64Array(e + 1),
      },
      r = 0,
      a = 0;
    for (let o of t) (r += o[0]), (a += o[1]);
    (r /= e), (a /= e);
    for (let o = 0; o < e; o++) {
      let m = t[o][0] - r,
        b = t[o][1] - a;
      (n.x[o + 1] = n.x[o] + m),
        (n.y[o + 1] = n.y[o] + b),
        (n.xx[o + 1] = n.xx[o] + m * m),
        (n.yy[o + 1] = n.yy[o] + b * b),
        (n.xy[o + 1] = n.xy[o] + m * b);
    }
    return (o, m) => {
      let b = m - o + 1,
        h = n.x[m + 1] - n.x[o],
        v = n.y[m + 1] - n.y[o],
        E = n.xx[m + 1] - n.xx[o] - (h * h) / b,
        k = n.yy[m + 1] - n.yy[o] - (v * v) / b,
        d = n.xy[m + 1] - n.xy[o] - (h * v) / b,
        i = (E + k) / 2 - Math.sqrt(Math.max(0, ((E - k) * (E - k)) / 4 + d * d));
      return { sse: Math.max(0, i), m: b };
    };
  }
  function kt(t) {
    let e = wt(t);
    for (let n = 0; n < 4; n++) {
      let r = Math.max(0.8, e.rms * 1.5),
        a = t.map((m) => {
          let b = Math.abs((m[0] - e.c[0]) * e.d[1] - (m[1] - e.c[1]) * e.d[0]) / r;
          return 1 / (1 + b * b);
        });
      e = { ...wt(t, a) };
    }
    return e;
  }
  var le = { step: 2, rmsAbs: 1.25, rmsRel: 0.016, minSeg: 7 };
  function Ft(t, e = {}) {
    let n = { ...le, ...e },
      r = 0;
    for (let l = 1; l < t.length; l++) r += T(t[l - 1], t[l]);
    let a = Math.max(n.step, r / 700),
      o = ae(t, a);
    if (o.length < 2) return { segs: [], curve: !1, pts: o };
    let m = o.length,
      b = ie(o),
      h = (l, M) => T(o[l], o[M]),
      v = (l, M) => {
        let { sse: g, m: s } = b(l, M),
          p = h(l, M);
        return Math.sqrt(g / s) <= Math.max(n.rmsAbs, n.rmsRel * p);
      },
      E = new Array(m).fill(1 / 0),
      k = new Array(m).fill(1 / 0),
      d = new Array(m).fill(-1);
    (E[0] = 0), (k[0] = 0);
    for (let l = 1; l < m; l++) {
      let M = 0;
      for (let g = l - 1; g >= 0; g--) {
        if (E[g] === 1 / 0) continue;
        if (!v(g, l)) {
          if (++M > 40 && l - g > 60) break;
          continue;
        }
        let s = E[g] + 1,
          p = k[g] + b(g, l).sse;
        (s < E[l] || (s === E[l] && p < k[l])) && ((E[l] = s), (k[l] = p), (d[l] = g));
      }
      E[l] === 1 / 0 && ((E[l] = E[l - 1] + 1), (k[l] = k[l - 1]), (d[l] = l - 1));
    }
    let i = [];
    for (let l = m - 1; l > 0; l = d[l]) i.push([d[l], l]);
    i.reverse();
    for (let l = 0; l < i.length - 1; l++) {
      let M = i[l],
        g = i[l + 1],
        s = M[1],
        p = b(M[0], M[1]).sse + b(g[0], g[1]).sse;
      for (let w = Math.max(M[0] + 2, M[1] - 8); w <= Math.min(g[1] - 2, M[1] + 8); w++) {
        let A = b(M[0], w).sse + b(w, g[1]).sse;
        A < p && ((p = A), (s = w));
      }
      (M[1] = s), (g[0] = s);
    }
    let u = i.map(([l, M]) => ({ i: l, j: M })),
      y = (l) => ((l.line = kt(o.slice(l.i, l.j + 1))), (l.len = l.line.len), l);
    u.forEach(y);
    for (let l = 0; l < u.length - 1; ) {
      let M = u[l],
        g = u[l + 1];
      if (F(M.line.d, g.line.d) < 7) {
        let s = y({ i: M.i, j: g.j }),
          p = s.len;
        if (s.line.rms <= Math.max(n.rmsAbs * 1.6, n.rmsRel * 1.6 * p)) {
          u.splice(l, 2, s);
          continue;
        }
      }
      l++;
    }
    let S = Math.max(...u.map((l) => l.len));
    u = u.filter((l, M) => {
      let g = M === 0 || M === u.length - 1;
      if (u.length === 1) return l.len >= n.minSeg;
      if (g) {
        let s = u[M === 0 ? 1 : M - 1];
        return l.len >= Math.max(n.minSeg * 1.6, 0.14 * s.len, 0.06 * S);
      }
      return l.len >= Math.max(n.minSeg, 0.05 * S);
    });
    for (let l = 0; l < u.length - 1; l++) {
      let M = u[l],
        g = u[l + 1],
        s = ot(M.line.c, M.line.d, g.line.c, g.line.d);
      (M.linkNext = !0),
        (g.linkPrev = !0),
        s && F(M.line.d, g.line.d) > 12 && ((M.cornerEnd = [s[0], s[1]]), (g.cornerStart = [s[0], s[1]]));
    }
    let $ = !1;
    if (u.length >= 4) {
      let l = u.map((p) => p.len).sort((p, w) => p - w),
        M = l[l.length >> 1],
        g = 0,
        s = 0;
      for (let p = 0; p < u.length - 1; p++) {
        let w = st(u[p].line.d, u[p + 1].line.d) * Math.sign(fe(u[p], u[p + 1])),
          A = Math.sign(w);
        A === g && s++, (g = A);
      }
      M < 0.2 * r && s >= u.length - 3 && ($ = !0);
    }
    for (let l of u) {
      let M = l.line,
        g = o[l.i];
      (g[0] - M.c[0]) * M.d[0] + (g[1] - M.c[1]) * M.d[1] > 0 &&
        (l.line = { ...M, d: [-M.d[0], -M.d[1]], a: M.b, b: M.a, t0: -M.t1, t1: -M.t0 }),
        (l.pts = o.slice(l.i, l.j + 1));
    }
    return { segs: u, curve: $, pts: o, length: r };
  }
  function fe(t, e) {
    let n = pt(t.line.a, t.line.b),
      r = pt(e.line.a, e.line.b);
    return n[0] * r[0] + n[1] * r[1] || 1;
  }
  function ct(t, e) {
    return (e[0] - t.c[0]) * t.d[0] + (e[1] - t.c[1]) * t.d[1];
  }
  function Et(t, e) {
    return Math.abs((e[0] - t.c[0]) * t.d[1] - (e[1] - t.c[1]) * t.d[0]);
  }
  function Bt(t, e, n = {}) {
    let r = kt(t);
    return {
      pts: t,
      c: r.c,
      d: r.d,
      a: r.a,
      b: r.b,
      len: r.len,
      rms: r.rms,
      t0: r.t0,
      t1: r.t1,
      members: e,
      ...n,
    };
  }
  function Tt(t, e = {}) {
    if (!t.length) return [];
    let n = t.flatMap((k) => [k.line.a, k.line.b]),
      r = N(n).diag || 1,
      a = e.tolPerp ?? Math.max(3.5, 0.012 * r),
      o = e.tolAng ?? 5,
      m = t.map((k, d) => Bt(k.pts, [d], { hidden: !!k.hidden, tool: k.hidden ? "h" : "s", pieces: 1 })),
      b = () =>
        m.flatMap((k, d) => [
          { p: k.a, i: d },
          { p: k.b, i: d },
        ]),
      h = !0,
      v = 0;
    for (; h && v++ < 400; ) {
      h = !1;
      let k = m.map((d, i) => i).sort((d, i) => m[i].len - m[d].len);
      t: for (let d of k)
        for (let i of k) {
          if (d === i) continue;
          let u = m[d],
            y = m[i];
          if (y.len > u.len || u.tool !== y.tool) continue;
          let S = y.len < 40;
          if (F(u.d, y.d) > (S ? o * 2.4 : o)) continue;
          let $ = Et(u, y.a),
            l = Et(u, y.b),
            M = a * (S ? 1.2 : 1),
            g = [ct(u, y.a), ct(u, y.b)].sort((c, f) => c - f),
            s = Math.min(g[1], u.t1) - Math.max(g[0], u.t0);
          // Обводка: линия проведена второй раз почти поверх первой — допускаем сдвиг побольше.
          s >= 0.6 * Math.min(y.len, u.len) &&
            F(u.d, y.d) <= 2.5 &&
            !S &&
            (M = Math.max(1.8 * M, 0.035 * Math.min(u.len, y.len)));
          if ($ > M || l > M) continue;
          let
            p = !1,
            w = u.hidden && y.hidden,
            A = u.pieces + y.pieces;
          if (s >= 0.3 * y.len || s >= 0.6 * Math.min(y.len, u.len)) p = !0;
          else if (s > -1) p = !0;
          else {
            let c = -s;
            if (c <= Math.max(26, 1.4 * Math.min(u.len, y.len)) && c < 0.25 * r) {
              let f = g[0] > u.t1 ? u.t1 : g[1],
                x = g[0] > u.t1 ? g[0] : u.t0;
              b().some((I) => {
                if (I.i === d || I.i === i) return !1;
                let L = m[I.i];
                if (L.tool !== u.tool || F(L.d, u.d) < 20) return !1;
                let P = ct(u, I.p),
                  V = Math.max(4, a);
                return P > f - V && P < x + V && Et(u, I.p) < a * 1.5;
              }) || ((p = !0), (u.hidden || y.hidden || (u.len < 60 && y.len < 60)) && (w = !0));
            }
          }
          if (!p || cutConflict(t, u.members, y.members)) continue;
          let R = Bt([...u.pts, ...y.pts], [...u.members, ...y.members], {
            hidden: w,
            pieces: A,
            tool: u.tool,
          });
          if (!(R.rms > Math.max(2.5, a * 0.7))) {
            (m[d] = R), m.splice(i, 1), (h = !0);
            break t;
          }
        }
    }
    let E = Math.max(10, 0.03 * r);
    return (
      (m = m.filter((k) => k.len >= E)),
      m.forEach((k) => {
        if (k.pieces >= 3 && !k.hidden) {
          let d = k.members
              .map((S) => {
                let $ = t[S];
                return [ct(k, $.line.a), ct(k, $.line.b)].sort((l, M) => l - M);
              })
              .sort((S, $) => S[0] - $[0]),
            i = 0,
            u = 0,
            y = -1 / 0;
          for (let [S, $] of d)
            S > y + 3 && i++, (u += Math.max(0, $ - Math.max(S, y))), (y = Math.max(y, $));
          i >= 3 && u < 0.8 * k.len && (k.hidden = !0);
        }
      }),
      m.forEach((k, d) => {
        k.id = d;
      }),
      m
    );
  }
  function dt(t, e) {
    return (e[0] - t.c[0]) * t.d[0] + (e[1] - t.c[1]) * t.d[1];
  }
  function Ot(t) {
    let e = 0,
      n = 0,
      r = 0,
      a = 0,
      o = 0;
    for (let b of t) {
      let h = [-b.d[1], b.d[0]],
        v = h[0] * b.c[0] + h[1] * b.c[1],
        E = 1;
      (e += E * h[0] * h[0]),
        (n += E * h[0] * h[1]),
        (r += E * h[1] * h[1]),
        (a += E * h[0] * v),
        (o += E * h[1] * v);
    }
    return G(
      [
        [e, n],
        [n, r],
      ],
      [a, o],
    );
  }
  function Dt(t, e, n = 1) {
    let r = t.length,
      a = N(t.flatMap((s) => [s.a, s.b])).diag || 1,
      o = Math.max(10, 0.045 * a) * n,
      m = Math.max(14, 0.07 * a) * n,
      b = [],
      h = new Map();
    t.forEach((s, p) =>
      s.members.forEach((w) => {
        let A = e[w];
        if (!A) return;
        let R = dt(s, A.line.a),
          c = dt(s, A.line.b);
        h.set(w, {
          line: p,
          start: Math.abs(R - s.t0) < Math.abs(R - s.t1) ? 0 : 1,
          end: Math.abs(c - s.t0) < Math.abs(c - s.t1) ? 0 : 1,
        });
      }),
    );
    for (let s = 0; s < r; s++)
      for (let p = s + 1; p < r; p++) {
        let w = t[s],
          A = t[p];
        if (F(w.d, A.d) < 10) continue;
        let R = ot(w.c, w.d, A.c, A.d);
        if (!R) continue;
        let c = [R[0], R[1]],
          f = (L) => {
            let P = dt(L, c),
              V = P - L.t0,
              q = L.t1 - P,
              X = Math.abs(V) < Math.abs(q) ? 0 : 1,
              j = X === 0 ? V : q,
              Q = Math.min(0.34 * L.len, m);
            return j < -o || j > Q ? null : { e: X, out: Math.max(0, -j), in: Math.max(0, j) };
          },
          x = f(w),
          z = f(A);
        if (!x || !z) continue;
        let I = x.out + z.out + 0.6 * (x.in + z.in);
        b.push({ i: s, ei: x.e, j: p, ej: z.e, X: c, cost: I / (o + m) });
      }
    for (let [s, p] of h) {
      let w = e[s];
      if (!w.linkNext) continue;
      let A = h.get(s + 1);
      if (!A || A.line === p.line || e[s + 1].stroke !== w.stroke) continue;
      let R = t[p.line],
        c = t[A.line];
      if (F(R.d, c.d) < 10) continue;
      let f = ot(R.c, R.d, c.c, c.d);
      f && b.push({ i: p.line, ei: p.end, j: A.line, ej: A.start, X: [f[0], f[1]], cost: -1 });
    }
    b.sort((s, p) => s.cost - p.cost);
    let v = [...Array(2 * r).keys()],
      E = new Map();
    for (let s = 0; s < 2 * r; s++) E.set(s, [s]);
    let k = (s) => (v[s] === s ? s : (v[s] = k(v[s])));
    for (let s of b) {
      let p = k(2 * s.i + s.ei),
        w = k(2 * s.j + s.ej);
      if (p === w) continue;
      let A = E.get(p),
        R = E.get(w),
        c = [...A, ...R];
      if (c.length > 3) continue;
      let f = c.map((z) => z >> 1);
      if (new Set(f).size !== f.length) continue;
      let x = Ot(f.map((z) => t[z]));
      x &&
        (f.some((z, I) => {
          let L = t[z],
            P = dt(L, x),
            q = (c[I] & 1) === 0 ? P - L.t0 : L.t1 - P;
          return q < -o * 1.3 || q > Math.min(0.4 * L.len, m * 1.3);
        }) ||
          ((v[w] = p), E.set(p, c), E.delete(w)));
    }
    let d = [],
      i = new Array(2 * r).fill(-1);
    for (let [s, p] of E) {
      if (p.length < 2) continue;
      let w = p.map((c) => t[c >> 1]),
        A = Ot(w) || w[0].a,
        R = d.length;
      d.push({ p: A, ends: p.slice(), loose: [] }), p.forEach((c) => (i[c] = R));
    }
    let u = (s) => {
        let p = t[s >> 1];
        return s & 1 ? p.b : p.a;
      },
      y = Math.max(16, 0.06 * a) * n,
      S = [...Array(2 * r).keys()].filter((s) => i[s] < 0);
    for (let s of S) {
      let p = u(s),
        w = s >> 1,
        A = -1,
        R = y;
      d.forEach((c, f) => {
        if (c.ends.length >= 3 || c.ends.some((z) => z >> 1 === w)) return;
        let x = T(p, c.p);
        x < R && ((R = x), (A = f));
      }),
        A >= 0 && (d[A].ends.push(s), d[A].loose.push(s), (i[s] = A));
    }
    let $ = S.filter((s) => i[s] < 0),
      l = [];
    for (let s = 0; s < $.length; s++)
      for (let p = s + 1; p < $.length; p++) {
        let w = $[s],
          A = $[p];
        if (w >> 1 === A >> 1) continue;
        let R = T(u(w), u(A));
        R < y && l.push([R, w, A]);
      }
    l.sort((s, p) => s[0] - p[0]);
    for (let [, s, p] of l) {
      if (i[s] >= 0 || i[p] >= 0) continue;
      let w = u(s),
        A = u(p),
        R = d.length;
      d.push({ p: [(w[0] + A[0]) / 2, (w[1] + A[1]) / 2], ends: [s, p], loose: [s, p] }), (i[s] = i[p] = R);
    }
    let M = [];
    t.forEach((s, p) => {
      let w = i[2 * p],
        A = i[2 * p + 1];
      M.push({ line: p, u: w, v: A, ok: w >= 0 && A >= 0 && w !== A });
    });
    let g = d.map(() => new Map());
    return (
      M.forEach((s) => {
        s.ok && (g[s.u].has(s.v) ? (s.dup = !0) : (g[s.u].set(s.v, s.line), g[s.v].set(s.u, s.line)));
      }),
      { V: d, E: M, adj: g, vOf: i, size: a, tol: { gapTol: o, overAbs: m, looseTol: y } }
    );
  }
  function Xt(t) {
    let e = new Array(t.V.length).fill(!1),
      n = [];
    for (let r = 0; r < t.V.length; r++) {
      if (e[r]) continue;
      let a = [r],
        o = [];
      for (e[r] = !0; a.length; ) {
        let m = a.pop();
        o.push(m);
        for (let b of t.adj[m].keys()) e[b] || ((e[b] = !0), a.push(b));
      }
      n.push(o);
    }
    return n;
  }
  var J = [1, 2, 4],
    at = (t, e) => {
      let n = t ^ e;
      return n === 1 ? 0 : n === 2 ? 1 : n === 4 ? 2 : -1;
    },
    ue = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ],
    _t = [],
    he = (t) => (t[0] > t[1]) + (t[0] > t[2]) + (t[1] > t[2]);
  for (let t of ue)
    for (let e = 0; e < 8; e++) {
      let n = (e & 1) + ((e >> 1) & 1) + ((e >> 2) & 1);
      (he(t) + n) % 2 ||
        _t.push((r) => {
          let a = 0;
          for (let o = 0; o < 3; o++) r & J[o] && (a |= J[t[o]]);
          return a ^ e;
        });
    }
  var Nt = [];
  for (let t = 0; t < 8; t++)
    for (let e = 0; e < 3; e++) {
      let n = t ^ J[e];
      n > t && Nt.push([t, n, e]);
    }
  var K = [];
  for (let t = 0; t < 3; t++)
    for (let e of [0, 1]) {
      let n = [0, 1, 2].filter((a) => a !== t),
        r = e ? J[t] : 0;
      K.push({ axis: t, side: e, v: [r, r | J[n[0]], r | J[n[0]] | J[n[1]], r | J[n[1]]] });
    }
  function Ut(t, e, n, r = 2) {
    let a = t.slice().sort((l, M) => e.adj[M].size - e.adj[l].size);
    if (a.length < 3 || a.length > 12) return [];
    let o = [];
    for (let l of a) for (let [M, g] of e.adj[l]) l < M && o.push([l, M, g]);
    if (o.length < 3) return [];
    let m = [],
      b = new Set([a[0]]),
      h = [a[0]];
    for (; h.length; ) {
      let l = h.shift();
      m.push(l);
      for (let M of [...e.adj[l].keys()].sort((g, s) => e.adj[s].size - e.adj[g].size))
        !b.has(M) && t.includes(M) && (b.add(M), h.push(M));
    }
    let v = new Map(),
      E = new Array(8).fill(-1),
      k = new Map(),
      d = 0,
      i = -1,
      u = () => {
        let l = 0;
        for (let [M, g] of o) {
          let s = v.get(M),
            p = v.get(g);
          s >= 0 && p >= 0 && at(s, p) >= 0 && l++;
        }
        return l;
      },
      y = 0,
      S = (l) => {
        if (++y > 2e5) return;
        if (l === m.length) {
          let s = u();
          if (s < 3 || s < i - 2) return;
          i = Math.max(i, s);
          let p = m.map((A) => v.get(A)),
            w = null;
          for (let A of _t) {
            let R = p.map((c) => (c < 0 ? 9 : A(c))).join(",");
            (w === null || R < w) && (w = R);
          }
          k.has(w) || k.set(w, { lab: new Map(v), explained: s, unmapped: d });
          return;
        }
        let M = m[l],
          g = l === 0 ? [0] : [0, 1, 2, 3, 4, 5, 6, 7];
        for (let s of g) {
          if (E[s] >= 0) continue;
          let p = !0;
          for (let w of e.adj[M].keys()) {
            let A = v.get(w);
            if (!(A === void 0 || A < 0) && at(s, A) < 0) {
              p = !1;
              break;
            }
          }
          p && (v.set(M, s), (E[s] = M), S(l + 1), (E[s] = -1), v.delete(M));
        }
        d < r && l > 0 && (d++, v.set(M, -1), S(l + 1), v.delete(M), d--);
      };
    S(0);
    let $ = [];
    for (let l of k.values()) {
      if (l.explained < i - 1) continue;
      let M = new Map();
      for (let [R, c, f] of o) {
        let x = l.lab.get(R),
          z = l.lab.get(c);
        if (x >= 0 && z >= 0) {
          let I = at(x, z);
          I >= 0 && M.set(f, I);
        }
      }
      let g = [[], [], []];
      for (let [R, c] of M) g[c].push(n[R].d);
      let s = 0,
        p = 0;
      for (let R of g)
        for (let c = 0; c < R.length; c++)
          for (let f = c + 1; f < R.length; f++) {
            let x = F(R[c], R[f]);
            (s += x), x > 50 && p++;
          }
      let w = g.filter((R) => R.length).length,
        A = l.explained * 10 - l.unmapped * 6 - p * 25 - s * 0.05 - (w < 3 ? 30 : 0);
      $.push({
        lab: l.lab,
        fam: M,
        explained: l.explained,
        unmapped: l.unmapped,
        score: A,
        nEdgesIn: o.length,
        comp: t,
      });
    }
    return $.sort((l, M) => M.score - l.score), $;
  }
  function Jt(t, e, n) {
    let r = [];
    for (let a of e.E) {
      if (a.ok || t.fam.has(a.line)) continue;
      let o = a.u >= 0 ? a.u : a.v;
      if (o < 0) continue;
      let m = t.lab.get(o);
      if (m === void 0 || m < 0) continue;
      let b = n[a.line],
        h = -1,
        v = 14;
      for (let E = 0; E < 3; E++) {
        let k = m ^ J[E],
          d = !1;
        for (let [y, S] of t.lab) S === k && e.adj[o].has(y) && (d = !0);
        if (d) continue;
        let i = [...t.fam].filter(([, y]) => y === E).map(([y]) => n[y].d);
        if (!i.length) continue;
        let u = Math.min(...i.map((y) => F(y, b.d)));
        u < v && ((v = u), (h = E));
      }
      h >= 0 && (t.fam.set(a.line, h), r.push({ line: a.line, from: m, to: m ^ J[h], vertex: o }));
    }
    return (t.dangling = r), t;
  }
  function At(t, e) {
    let n = t.length,
      r = (c) => [(c[0] - e.o[0]) / e.s, (c[1] - e.o[1]) / e.s],
      a = t.map((c) => r(Lt(c.a, c.b))),
      o = t.map((c) => c.d),
      m = t.map((c) => c.len / e.s / 2),
      b = (c, f) => {
        let x = a[f],
          z = c[0] - x[0] * c[2],
          I = c[1] - x[1] * c[2],
          L = Math.hypot(z, I);
        return L < 1e-12 ? 0 : (m[f] * (o[f][0] * I - o[f][1] * z)) / L;
      },
      h = 0.004,
      v = (c) =>
        t.map((f, x) => {
          let z = b(c, x);
          return Math.sign(z) * h * Math.sqrt(Math.log1p((z / h) ** 2));
        }),
      E = (c) => v(c).reduce((f, x) => f + x * x, 0),
      k = [],
      d = 0,
      i = 0;
    o.forEach((c, f) => {
      let x = c[0] * o[0][0] + c[1] * o[0][1] < 0 ? -1 : 1;
      (d += x * c[0] * m[f]), (i += x * c[1] * m[f]);
    }),
      k.push(C([d, i, 0]));
    for (let c = 0; c < n; c++)
      for (let f = c + 1; f < n; f++) {
        let x = U([a[c][0], a[c][1], 1], [a[c][0] + o[c][0], a[c][1] + o[c][1], 1]),
          z = U([a[f][0], a[f][1], 1], [a[f][0] + o[f][0], a[f][1] + o[f][1], 1]),
          I = C(U(x, z));
        Number.isFinite(I[0]) && k.push(I);
      }
    let u = k[0],
      y = E(u);
    for (let c of k) {
      let f = E(c);
      f < y && ((y = f), (u = c));
    }
    let S = (c) => {
      let f = C(U(c, Math.abs(c[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]));
      return [f, U(c, f)];
    };
    for (let c = 0; c < 3; c++) {
      let [f, x] = S(u),
        z = u,
        I = (P) => C([0, 1, 2].map((V) => z[V] + P[0] * f[V] + P[1] * x[V])),
        L = Z((P) => v(I(P)), [0, 0], { iters: 40 });
      u = I(L.p);
    }
    u[2] < 0 && (u = u.map((c) => -c));
    let $ = (() => {
        let c = 1 / 0;
        for (let f = 0; f < 180; f += 0.5) {
          let x = f / O,
            z = E([Math.cos(x), Math.sin(x), 0]);
          z < c && (c = z);
        }
        return c;
      })(),
      l = t.map((c, f) => {
        let x = a[f],
          z = [u[0] - x[0] * u[2], u[1] - x[1] * u[2]];
        return { ang: mt(z, o[f]) * O, w: c.len };
      }),
      M = l.reduce((c, f) => c + f.w, 0) || 1,
      g = Math.sqrt(l.reduce((c, f) => c + f.w * f.ang * f.ang, 0) / M),
      s = Math.max(0, ...l.map((c) => Math.abs(c.ang))),
      p = [e.s * u[0] + e.o[0] * u[2], e.s * u[1] + e.o[1] * u[2], u[2]],
      w = Math.abs(u[2]) > 1e-9,
      A = w ? [p[0] / p[2], p[1] / p[2]] : null,
      R = 0;
    for (let c = 0; c < n; c++) for (let f = c + 1; f < n; f++) R = Math.max(R, F(o[c], o[f]));
    return {
      v: p,
      vn: u,
      pt: A,
      dirInf: [u[0], u[1]],
      res: l,
      rms: g,
      maxAbs: s,
      spread: R,
      cost: y,
      parCost: $,
      n,
      distNorm: w ? Math.hypot(u[0], u[1]) / Math.abs(u[2]) : 1 / 0,
    };
  }
  function gt(t, e) {
    let n = [],
      r = [];
    for (let d = 0; d < 3; d++)
      for (let i = d + 1; i < 3; i++) {
        let u = C(t[d]),
          y = C(t[i]);
        n.push([u[0] * y[2] + y[0] * u[2], u[1] * y[2] + y[1] * u[2], u[2] * y[2]]),
          r.push(-(u[0] * y[0] + u[1] * y[1]));
      }
    let a = e ? e.w : 0.001,
      o = e ? e.c : [0, 0];
    n.push([a, 0, 0]),
      r.push(-a * o[0]),
      n.push([0, a, 0]),
      r.push(-a * o[1]),
      n.push([0, 0, a * 0.001]),
      r.push(0);
    let m = [0, 1, 2].map((d) => [0, 1, 2].map((i) => n.reduce((u, y) => u + y[d] * y[i], 0))),
      b = [0, 1, 2].map((d) => n.reduce((i, u, y) => i + u[d] * r[y], 0)),
      h = G(m, b);
    if (!h) return { ok: !1 };
    let v = [-h[0], -h[1]],
      E = h[2] - h[0] * h[0] - h[1] * h[1],
      k = 0;
    for (let d = 0; d < 3; d++)
      for (let i = d + 1; i < 3; i++) {
        let u = C(t[d]),
          y = C(t[i]),
          S = C([u[0] - v[0] * u[2], u[1] - v[1] * u[2], Math.sqrt(Math.max(E, 1e-9)) * u[2]]),
          $ = C([y[0] - v[0] * y[2], y[1] - v[1] * y[2], Math.sqrt(Math.max(E, 1e-9)) * y[2]]);
        k = Math.max(k, Math.abs(90 - Math.acos(Math.max(-1, Math.min(1, _(S, $)))) * O));
      }
    return { ok: E > 0, c: v, f2: E, f: E > 0 ? Math.sqrt(E) : 0, worst: k };
  }
  function Ht(t) {
    for (let e = 0; e < 3; e++) {
      let n = t[e],
        r = t[(e + 1) % 3],
        a = t[(e + 2) % 3],
        o = [r[0] - n[0], r[1] - n[1]],
        m = [a[0] - n[0], a[1] - n[1]],
        b =
          Math.acos(
            Math.max(-1, Math.min(1, (o[0] * m[0] + o[1] * m[1]) / (Math.hypot(...o) * Math.hypot(...m)))),
          ) * O;
      if (b >= 90) return { i: e, ang: b };
    }
    return null;
  }
  var it = (t) => [(t & 1) - 0.5, ((t >> 1) & 1) - 0.5, ((t >> 2) & 1) - 0.5];
  function Gt(t, e, n) {
    let r = rt(nt([t[0], t[1], t[2]]), e),
      a = Math.exp(t[5]),
      o = [t[3] * a, t[4] * a, a],
      m = n.size * Math.exp(t[6]),
      b = [n.c0[0] + n.size * t[7], n.c0[1] + n.size * t[8]],
      h = n.box ? [Math.exp(t[9]), Math.exp(t[10]), Math.exp(-t[9] - t[10])] : [1, 1, 1],
      v = [];
    for (let k = 0; k < 8; k++) {
      let d = it(k);
      v.push(
        [0, 1, 2].map((i) => r[i][0] * d[0] * h[0] + r[i][1] * d[1] * h[1] + r[i][2] * d[2] * h[2] + o[i]),
      );
    }
    let E = v.map((k) => [b[0] + (m * k[0]) / k[2], b[1] + (m * k[1]) / k[2]]);
    return { R: r, T: o, f: m, c: b, D: h, X: v, P: E };
  }
  function pe(t) {
    return K.map((e) => {
      let n = W([t.R[0][e.axis], t.R[1][e.axis], t.R[2][e.axis]], e.side ? 1 : -1),
        r = [0, 1, 2].map((a) => e.v.reduce((o, m) => o + t.X[m][a], 0) / 4);
      return _(n, C(r)) < 0;
    });
  }
  function me(t) {
    return [0, 1, 2].map((e) => {
      let n = [t.R[0][e], t.R[1][e], t.R[2][e]];
      return [t.c[0] * n[2] + t.f * n[0], t.c[1] * n[2] + t.f * n[1], n[2]];
    });
  }
  function xt(t) {
    let e = 0;
    for (let n of t.X) e = Math.max(e, Math.atan(Math.hypot(n[0], n[1]) / Math.max(n[2], 1e-9)) * O);
    return e;
  }
  function H(t, e) {
    let n = e.size,
      r = e.sigma ?? Math.max(2, 0.012 * n),
      a = { size: n, c0: e.c0, box: !!e.box },
      o = e.camera === "plausible",
      m = o ? (e.cSigma ?? 0.45 * (e.page || 3 * n)) / n : 3,
      b = o ? 31 : 70,
      h = o ? 1.2 : 0.4,
      v = r * 1.4,
      E = e.loss === "cauchy" ? (s) => Ct(s, 1.2) : (s) => tt(s, 3),
      k = e.cam ? Math.log(e.cam.f / n) : 0,
      d = e.cam ? [(e.cam.c[0] - e.c0[0]) / n, (e.cam.c[1] - e.c0[1]) / n] : null,
      i = (s) => (p) => {
        let w = Gt(p, s, a),
          A = [],
          R = 0;
        for (let f of w.X) f[2] < 0.05 * w.T[2] && (R += (0.05 * w.T[2] - f[2]) / w.T[2]);
        for (let f of t.V) {
          let x = w.P[f.l],
            z = f.w ?? 1;
          A.push(E((x[0] - f.p[0]) / r) * z, E((x[1] - f.p[1]) / r) * z);
        }
        for (let f of t.L) {
          let x = w.P[f.la],
            z = w.P[f.lb],
            I = [z[0] - x[0], z[1] - x[1]],
            L = Math.hypot(I[0], I[1]) || 1,
            P = (q) => ((q[0] - x[0]) * I[1] - (q[1] - x[1]) * I[0]) / L / v,
            V = f.w ?? 1;
          A.push(E(P(f.a)) * V, E(P(f.b)) * V);
        }
        if (t.vis && t.vis.length) {
          let f = K.map((x) => {
            let z = [
                w.R[0][x.axis] * (x.side ? 1 : -1),
                w.R[1][x.axis] * (x.side ? 1 : -1),
                w.R[2][x.axis] * (x.side ? 1 : -1),
              ],
              I = C([0, 1, 2].map((L) => x.v.reduce((P, V) => P + w.X[V][L], 0) / 4));
            return _(z, I);
          });
          for (let x of t.vis) A.push(Math.max(0, f[x] + 0.03) * 60);
          for (let x of t.hid || []) A.push(Math.max(0, -f[x] + 0.03) * 60);
        }
        e.cam
          ? A.push((p[6] - k) * 300, (p[7] - d[0]) * 300, (p[8] - d[1]) * 300)
          : A.push(p[7] / m, p[8] / m);
        let c = xt(w);
        return A.push(Math.max(0, c - b) * h), A.push(R * 200), a.box && A.push(p[9] / 2.5, p[10] / 2.5), A;
      },
      u = [],
      y = (s, p, w) => {
        s = qt(s);
        let A = [0, 0, 0, 0, 0, 0, Math.log(p / n), (w[0] - e.c0[0]) / n, (w[1] - e.c0[1]) / n];
        a.box && A.push(0, 0);
        let R = [],
          c = [];
        for (let z of t.V) {
          let I = it(z.l),
            L = Pt(s, I),
            P = z.p[0] - w[0],
            V = z.p[1] - w[1];
          R.push([-p, 0, P]), c.push(p * L[0] - P * L[2]), R.push([0, -p, V]), c.push(p * L[1] - V * L[2]);
        }
        if (R.length < 3) return;
        let f = [0, 1, 2].map((z) => [0, 1, 2].map((I) => R.reduce((L, P) => L + P[z] * P[I], 0))),
          x = G(
            f,
            [0, 1, 2].map((z) => R.reduce((I, L, P) => I + L[z] * c[P], 0)),
          );
        !x ||
          x[2] <= 0.6 ||
          ((A[3] = x[0] / x[2]), (A[4] = x[1] / x[2]), (A[5] = Math.log(x[2])), u.push({ R0: s, p: A }));
      };
    if (e.starts) for (let s of e.starts) u.push({ R0: s.R0, p: s.p.slice() });
    if (!e.startsOnly && e.vps && e.vps.every(Boolean)) {
      let s = { o: e.c0, s: n },
        p = e.vps.map((R) => [(R[0] - s.o[0] * R[2]) / s.s, (R[1] - s.o[1] * R[2]) / s.s, R[2]]),
        w = gt(p, { c: [0, 0], w: 0.05 }),
        A = [];
      e.cam
        ? A.push({ f: e.cam.f, c: e.cam.c })
        : w.ok &&
          w.f > 0.2 &&
          w.f < 60 &&
          A.push({ f: w.f * n, c: [e.c0[0] + w.c[0] * n, e.c0[1] + w.c[1] * n] });
      for (let R of [1.5, 3, 8]) A.push({ f: R * n, c: e.c0 });
      for (let R of A) {
        let c = p.map((f) =>
          C([f[0] * n - (R.c[0] - e.c0[0]) * f[2], f[1] * n - (R.c[1] - e.c0[1]) * f[2], R.f * f[2]]),
        );
        for (let f = 0; f < 8; f++) {
          let x = W(c[0], f & 1 ? -1 : 1),
            z = W(c[1], f & 2 ? -1 : 1),
            I = W(c[2], f & 4 ? -1 : 1);
          _(U(x, z), I) < 0 ||
            y(
              [
                [x[0], z[0], I[0]],
                [x[1], z[1], I[1]],
                [x[2], z[2], I[2]],
              ],
              R.f,
              R.c,
            );
        }
      }
    }
    if (!e.startsOnly && t.V.length >= 4) {
      let s = [0, 1].map((p) => {
        let w = [...Array(4)].map(() => [0, 0, 0, 0]),
          A = [0, 0, 0, 0];
        t.V.forEach((R) => {
          let c = [...it(R.l), 1];
          for (let f = 0; f < 4; f++) {
            A[f] += c[f] * R.p[p];
            for (let x = 0; x < 4; x++) w[f][x] += c[f] * c[x];
          }
        });
        for (let R = 0; R < 3; R++) w[R][R] += 1e-6;
        return G(w, A);
      });
      if (s[0] && s[1]) {
        let p = s[0].slice(0, 3),
          w = s[1].slice(0, 3),
          A = (Math.hypot(...p) + Math.hypot(...w)) / 2 || 1,
          R = C(p),
          c = yt(w, W(R, _(R, w)));
        c = C(c);
        let f = [R, c, U(R, c)];
        if (Math.abs(A) > 1e-9)
          for (let x of e.cam ? [e.cam.f / n] : [2, 5, 12]) y(f, x * n, e.cam ? e.cam.c : [e.c0[0], e.c0[1]]);
      }
    }
    if (!e.startsOnly && u.length < 6)
      for (let s = 0; s < 24; s++) {
        let p = nt([((s % 3) - 1) * 0.9, ((((s / 3) | 0) % 4) - 1.5) * 0.8, ((s / 12) | 0) * 1.6 - 0.8]);
        for (let w of [2.5, 8]) y(rt(p, nt([0.6, 0.7, 0])), w * n, e.c0);
      }
    if (!u.length) return null;
    let S = u.map((s) => ({ ...s, ...Z(i(s.R0), s.p, { iters: 6 }) })).sort((s, p) => s.cost - p.cost),
      $ = [];
    for (let s of S) {
      if ($.length >= (e.maxTop ?? 5)) break;
      $.push(s);
    }
    S = $.map((s) => ({
      R0: s.R0,
      ...Z(i(s.R0), s.p, { iters: e.iters ?? 120, wantJ: !!e.uncertainty }),
    })).sort((s, p) => s.cost - p.cost);
    let l = S[0],
      M = Gt(l.p, l.R0, a),
      g = { ...M, p: l.p, R0: l.R0, cost: l.cost, sigma: r, cone: xt(M), vis: pe(M), vps: me(M), box: a.box };
    if (
      ((g.vRes = t.V.map((s) => ({
        l: s.l,
        p: s.p,
        q: M.P[s.l],
        d: Math.hypot(M.P[s.l][0] - s.p[0], M.P[s.l][1] - s.p[1]),
      }))),
      (g.rms = Math.sqrt(g.vRes.reduce((s, p) => s + p.d * p.d, 0) / (g.vRes.length || 1))),
      e.uncertainty && l.J)
    ) {
      let s = jt(l.J);
      if (s) {
        let p = l.r.length,
          w = l.p.length,
          A = Math.max((1.5 / r) ** 2, l.cost / Math.max(1, p - w));
        if (((g.cov = s.map((R) => R.map((c) => c * A))), a.box)) {
          let R = (c) => {
            let f = 0;
            for (let x = 0; x < 2; x++) for (let z = 0; z < 2; z++) f += c[x] * c[z] * g.cov[9 + x][9 + z];
            return Math.sqrt(Math.max(0, f));
          };
          g.dimSig = { "01": R([1, -1]), "02": R([2, 1]), 12: R([1, 2]) };
        }
        g.fSig = Math.sqrt(Math.max(0, g.cov[6][6]));
      }
    }
    return g;
  }
  function Qt(t) {
    let e = Math.cbrt(t.D[0] * t.D[1] * t.D[2]);
    return t.D.map((n) => n / e);
  }
  function Rt(t, e) {
    let n = t.filter((g) => g.fits.free && g.fits.box);
    if (n.length < 2) return null;
    let r = Math.max(...t.map((g) => g.size)),
      a = e.c0,
      o = Math.hypot(e.page.w, e.page.h),
      m = e.target === "cube",
      b = n.map((g) => g.fits.box.f).sort((g, s) => g - s),
      h = b[b.length >> 1],
      v = n.map((g) => g.fits.box.c[0]).sort((g, s) => g - s),
      E = n.map((g) => g.fits.box.c[1]).sort((g, s) => g - s),
      k = [Math.log(h / r), (v[v.length >> 1] - a[0]) / r, (E[E.length >> 1] - a[1]) / r],
      d = m ? 6 : 8,
      i = n.map((g) => g.fits.box.R),
      u = [...k];
    n.forEach((g) => {
      let s = g.fits.box,
        p = s.T[2];
      u.push(0, 0, 0, s.T[0] / p, s.T[1] / p, Math.log((p * h) / s.f)),
        m || u.push(Math.log(s.D[0]), Math.log(s.D[1]));
    });
    let y = (g) => {
        let s = r * Math.exp(g[0]),
          p = [a[0] + r * g[1], a[1] + r * g[2]];
        return n.map((w, A) => {
          let R = g.slice(3 + A * d, 3 + (A + 1) * d),
            c = rt(nt([R[0], R[1], R[2]]), i[A]),
            f = Math.exp(R[5]),
            x = [R[3] * f, R[4] * f, f],
            z = m ? [1, 1, 1] : [Math.exp(R[6]), Math.exp(R[7]), Math.exp(-R[6] - R[7])],
            I = [...Array(8)].map((L, P) => {
              let V = it(P);
              return [0, 1, 2].map(
                (q) => c[q][0] * V[0] * z[0] + c[q][1] * V[1] * z[1] + c[q][2] * V[2] * z[2] + x[q],
              );
            });
          return {
            R: c,
            T: x,
            D: z,
            X: I,
            f: s,
            c: p,
            P: I.map((L) => [p[0] + (s * L[0]) / L[2], p[1] + (s * L[1]) / L[2]]),
          };
        });
      },
      $ = Z(
        (g) => {
          let s = y(g),
            p = [];
          return (
            n.forEach((w, A) => {
              let R = s[A],
                c = Math.max(2, 0.012 * w.size);
              for (let f of w.obs.V) {
                let x = R.P[f.l];
                p.push(tt((x[0] - f.p[0]) / c, 3), tt((x[1] - f.p[1]) / c, 3));
              }
              for (let f of w.obs.L) {
                let x = R.P[f.la],
                  z = R.P[f.lb],
                  I = [z[0] - x[0], z[1] - x[1]],
                  L = Math.hypot(...I) || 1,
                  P = (V) => ((V[0] - x[0]) * I[1] - (V[1] - x[1]) * I[0]) / L / (c * 1.4);
                p.push(tt(P(f.a), 3), tt(P(f.b), 3));
              }
              for (let f of R.X) f[2] < 0.05 * R.T[2] && p.push(200);
              p.push(Math.max(0, xt(R) - 31) * 1.2);
            }),
            p.push(g[1] / ((0.45 * o) / r), g[2] / ((0.45 * o) / r)),
            p
          );
        },
        u,
        { iters: 150 },
      ),
      l = y($.p),
      M = t.map((g) => {
        let s = n.indexOf(g);
        if (s < 0) return null;
        let p = l[s],
          w = g.obs.V.map((A) => ({
            l: A.l,
            p: A.p,
            q: p.P[A.l],
            d: Math.hypot(p.P[A.l][0] - A.p[0], p.P[A.l][1] - A.p[1]),
          }));
        return { ...p, vRes: w, rms: Math.sqrt(w.reduce((A, R) => A + R.d * R.d, 0) / (w.length || 1)) };
      });
    return { f: l[0].f, c: l[0].c, boxes: M, cost: $.cost };
  }
  var lt = [1, 2, 4],
    B = [
      "\u043E\u0440\u0430\u043D\u0436\u0435\u0432\u044B\u0435",
      "\u0441\u0438\u043D\u0438\u0435",
      "\u0440\u043E\u0437\u043E\u0432\u044B\u0435",
    ],
    de = [
      "\u043E\u0440\u0430\u043D\u0436\u0435\u0432\u044B\u0445",
      "\u0441\u0438\u043D\u0438\u0445",
      "\u0440\u043E\u0437\u043E\u0432\u044B\u0445",
    ],
    et = (t, e = 1) => String(Math.round(t * 10 ** e) / 10 ** e).replace(".", ","),
    D = (t) => t[0].toUpperCase() + t.slice(1);
  function Kt(t, e, n) {
    let { fits: r, vps: a, famLines: o } = t,
      m = n.target,
      b = r.free,
      h = m === "cube" ? r.cube : r.box,
      v = t.size,
      E = t.lineIds.reduce((c, f) => c + e[f].len, 0) / (t.lineIds.length || 1),
      k = [],
      d = [],
      i = { families: [], issues: k, good: d },
      u = [0, 1, 2].map((c) => {
        let f = t.obs.vis.map((I) => K[I]).find((I) => I.axis === c);
        if (f) return f.side;
        if (!b) return 0;
        let x = 0,
          z = 0;
        for (let I = 0; I < 8; I++) I & lt[c] ? (z += b.X[I][2]) : (x += b.X[I][2]);
        return z < x ? 1 : 0;
      });
    (i.nearSide = u), (i.nearLabel = u.reduce((c, f, x) => c | (f ? lt[x] : 0), 0));
    let y = 0,
      S = 0;
    for (let c = 0; c < 3; c++) {
      let f = [...t.fam].filter(([, V]) => V === c).map(([V]) => V),
        x = a[c],
        z = { k: c, n: f.length, ids: f, vp: x, status: "few", perLine: [] };
      if ((i.families.push(z), !x)) continue;
      z.spread = x.spread;
      let I = x.spread < 1.3 || x.distNorm > 60;
      z.parallel = I;
      let L = 0,
        P = 0;
      if (
        (f.forEach((V) => {
          let [q, X] = t.edgeOf.get(V),
            j = e[V],
            Q = (q & lt[c] ? 1 : 0) === u[c] ? q : X,
            Y = t.vOfLabel[Q] >= 0 ? t.obsV.find((se) => se.l === Q).p : j.a,
            ft = T(j.a, Y) < T(j.b, Y) ? j.b : j.a,
            ut = T(j.a, Y) < T(j.b, Y) ? j.a : j.b,
            St = [ft[0] - ut[0], ft[1] - ut[1]],
            ht = x.v,
            It = [ht[0] - ut[0] * ht[2], ht[1] - ut[1] * ht[2]];
          St[0] * It[0] + St[1] * It[1] > 0 ? (L += j.len) : (P += j.len);
        }),
        // слабое «расхождение» почти параллельных рёбер при рисунке, который настоящая коробка
        // повторяет почти точно, — дрожание руки, а не обратная перспектива
        (z.diverge = !I && P > L && x.spread > Math.max(2.2, 2 * x.rms) && !(x.spread < 4 && b && b.rms / E < 0.012)),
        f.length >= 3
          ? ((z.rms = x.rms),
            (z.maxAbs = x.maxAbs),
            (z.perLine = f.map((V, q) => ({ li: V, ang: x.res[q].ang }))),
            z.perLine.forEach((V) => {
              Math.abs(V.ang) >= 3 && (V.ang > 0 ? S++ : y++);
            }),
            (z.status = z.diverge ? "diverge" : x.maxAbs < 3 ? "ok" : "nonconv"))
          : (z.status = z.diverge ? "diverge" : "few"),
        !I && !z.diverge && x.pt)
      ) {
        let V = N(t.obsV.map((q) => q.p)).c;
        z.vpDist = T(x.pt, V) / v;
      }
    }
    let $ = i.families.filter((c) => c.n >= 3 && c.rms !== void 0),
      l = $.reduce((c, f) => c + f.n, 0) || 1;
    if (
      ((i.convRms = $.length ? Math.sqrt($.reduce((c, f) => c + f.n * f.rms * f.rms, 0) / l) : null),
      a.every(Boolean))
    ) {
      let c = i.families.map((V) => (V.parallel ? "par" : "fin")),
        f = c.filter((V) => V === "par").length,
        x = { nPar: f },
        z = t.norm,
        I = a.map((V, q) => (c[q] === "par" ? [V.vn[0], V.vn[1], 0] : V.vn));
      if (f === 0) {
        let V = a.map((X) => X.pt),
          q = Ht(V);
        q && ((x.impossible = !0), (x.obtuse = q));
      } else if (f === 1) {
        let V = c.indexOf("par"),
          [q, X] = [0, 1, 2].filter((Y) => Y !== V),
          j = a[q].pt,
          Q = a[X].pt;
        if (j && Q) {
          let Y = [Q[0] - j[0], Q[1] - j[1]],
            ft = a[V].dirInf;
          (x.perpErr = 90 - F(Y, ft)), (x.parFam = V), (x.horizonFams = [q, X]);
        }
      } else if (f === 2) {
        let [V, q] = [0, 1, 2].filter((X) => c[X] === "par");
        (x.perpErr = 90 - F(a[V].dirInf, a[q].dirInf)), (x.parFams = [V, q]);
      }
      let L = [(n.c0[0] - z.o[0]) / z.s, (n.c0[1] - z.o[1]) / z.s],
        P = gt(I, { c: L, w: f ? 0.3 : 0.001 });
      if (P.ok && !x.impossible) {
        (x.f = P.f * z.s), (x.c = [z.o[0] + P.c[0] * z.s, z.o[1] + P.c[1] * z.s]);
        let V = 0;
        for (let q of t.obsV) V = Math.max(V, Math.atan(T(q.p, x.c) / x.f) * O);
        x.cone = V;
      } else f === 0 && (x.impossible = !0);
      i.camera = x;
    }
    b && (i.implied = { f: b.f, c: b.c, cone: b.cone, rms: b.rms, rel: b.rms / E }), (i.scale = E);
    let M = r.box && r.box.dimSig ? r.box : b;
    if (M && M.D) {
      let c = Qt(M),
        f = M.dimSig || {},
        x = [
          [0, 1],
          [0, 2],
          [1, 2],
        ].map(([I, L]) => ({ i: I, j: L, lr: Math.log(M.D[I] / M.D[L]), s: f[`${I}${L}`] ?? 0.2 }));
      i.props = { r: c, pairs: x, determined: x.every((I) => I.s < 0.12) };
      let z = [0, 1, 2].sort((I, L) => Math.abs(Math.log(c[L])) - Math.abs(Math.log(c[I])))[0];
      (i.props.worst = z),
        (i.props.spread = Math.max(...M.D) / Math.min(...M.D)),
        (i.props.excess = Math.max(0, ...x.map((I) => Math.abs(I.lr) - 1.5 * I.s)));
      // Насколько куб хуже коробки повторяет рисунок (в долях длины ребра). В некоторых ракурсах
      // (почти фронтальный вид, слабая перспектива) длину рёбер вглубь не отличить от силы
      // перспективы: коробка «находит» вытянутую глубину, хотя куб подходит почти так же хорошо.
      // На стенде у правильных кубов разрыв не больше ~2%, у вытянутых в 1,45 раза — от 3%.
      r.cube && r.box && E > 0 && (i.props.gap = Math.sqrt(Math.max(0, r.cube.rms ** 2 - r.box.rms ** 2)) / E);
      // решает это сравнение, только если сами пропорции по ракурсу определяются неточно
      i.props.cubeOk = i.props.gap !== void 0 && i.props.gap <= 0.025 && !i.props.determined;
    }
    // Мерка пропорций: настоящий куб с тем же ближним углом, теми же направлениями рёбер и той же
    // камерой, что у восстановленной коробки. Его углы — куда должны приходить рёбра рисунка.
    // если рисунок объясняется кубом, мерка строится от правильного куба (того же, что слой «Правильный куб»)
    let GM = i.props && i.props.cubeOk && r.cube && r.cube.X ? { ...r.cube, D: [1, 1, 1] } : M;
    GM && GM.D && GM.X && (i.guide = propGuide(t, GM, i.nearLabel, E));
    // показываем мерку, только когда пропорции действительно не кубические
    i.guide &&
      (i.guide.edges.forEach((q) => q.off && Math.abs(Math.log(i.guide.fam[q.k])) < 0.06 && (q.off = !1)),
      // а исправлять есть что только на самих рёбрах из ближнего угла
      (i.guide.show = m === "cube" && !!i.props && i.props.excess > 0.07 && !i.props.cubeOk && i.guide.edges.some((q) => q.off)));
    let g = i.nearLabel;
    if (t.vOfLabel[g] >= 0 && [0, 1, 2].every((c) => t.vOfLabel[g ^ lt[c]] >= 0) && t.obs.vis.length >= 3) {
      let c = t.obsV.find((I) => I.l === g).p,
        x = [0, 1, 2]
          .map((I) => t.obsV.find((L) => L.l === (g ^ lt[I])).p)
          .map((I) => Math.atan2(I[1] - c[1], I[0] - c[0])),
        z = [0, 1, 2].sort((I, L) => x[I] - x[L]);
      i.y = {
        p: c,
        angles: z.map((I, L) => {
          let P = z[(L + 1) % 3],
            V = x[P] - x[I];
          return L === 2 && (V += 2 * Math.PI), { k1: I, k2: P, deg: V * O, mid: x[I] + V / 2 };
        }),
      };
    }
    if (h) {
      (i.answer = { rms: h.rms, rel: h.rms / E, corners: h.vRes, cone: h.cone }), (i.lineFix = []);
      for (let [c, [f, x]] of t.edgeOf) {
        let z = e[c],
          I = h.P[f],
          L = h.P[x],
          P = mt([L[0] - I[0], L[1] - I[1]], z.d) * O;
        i.lineFix.push({ li: c, ang: P });
      }
    }
    let s = i.camera || {};
    i.families.forEach((c) => {
      if (c.status === "diverge") {
        let f = c.spread < 4;
        (c.weakDiverge = f),
          k.push({
            sev: f ? 2 : 3,
            kind: "diverge",
            fams: [c.k],
            title: f
              ? `${D(B[c.k])} \u0440\u0451\u0431\u0440\u0430 \u0441\u043B\u0435\u0433\u043A\u0430 \u0440\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432\u0433\u043B\u0443\u0431\u044C`
              : `${D(B[c.k])} \u0440\u0451\u0431\u0440\u0430 \u0440\u0430\u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432\u0433\u043B\u0443\u0431\u044C`,
            text: f
              ? `${D(B[c.k])} \u0440\u0451\u0431\u0440\u0430 \u043F\u043E\u0447\u0442\u0438 \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B, \u043D\u043E \u0434\u0430\u043B\u044C\u043D\u0438\u0435 \u0440\u0430\u0437\u0432\u0435\u0434\u0435\u043D\u044B \u0441\u0438\u043B\u044C\u043D\u0435\u0435 \u0431\u043B\u0438\u0436\u043D\u0438\u0445 (\u043D\u0430 ${et(c.spread)}\xB0). \u0423\u0445\u043E\u0434\u044F \u0432\u0434\u0430\u043B\u044C, \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B\u0435 \u0440\u0451\u0431\u0440\u0430 \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u0431\u043B\u0438\u0436\u0430\u0442\u044C\u0441\u044F \u0438\u043B\u0438 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0441\u0442\u0430\u0432\u0430\u0442\u044C\u0441\u044F \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B\u043C\u0438.`
              : `\u0427\u0435\u043C \u0434\u0430\u043B\u044C\u0448\u0435 \u043E\u0442 \u0437\u0440\u0438\u0442\u0435\u043B\u044F, \u0442\u0435\u043C \u0434\u0430\u043B\u044C\u0448\u0435 ${B[c.k]} \u0440\u0451\u0431\u0440\u0430 \u0434\u0440\u0443\u0433 \u043E\u0442 \u0434\u0440\u0443\u0433\u0430 (\u0440\u0430\u0437\u0432\u043E\u0440\u043E\u0442 ${et(c.spread)}\xB0). \u042D\u0442\u043E \u043E\u0431\u0440\u0430\u0442\u043D\u0430\u044F \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u0430: \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B\u0435 \u0440\u0451\u0431\u0440\u0430, \u0443\u0445\u043E\u0434\u044F \u0432\u0434\u0430\u043B\u044C, \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u0431\u043B\u0438\u0436\u0430\u0442\u044C\u0441\u044F.`,
          });
      }
    });
    let p = b ? b.rms / E : 1,
      w = p < 0.022,
      A = (c) => {
        let f = i.families[c];
        return f.n >= 3 && f.spread >= 4 && f.status !== "diverge";
      };
    // Если настоящая коробка с настоящей камерой повторяет рисунок почти точно (fitsWell),
    // выводы по отдельным точкам схода не могут быть грубой ошибкой: точки схода почти
    // параллельных рёбер определяются очень неточно.
    let fitsWell = p < 0.012,
      vpReliable = [0, 1, 2].every(A);
    fitsWell && s.perpErr !== void 0 && (s.perpErrSoft = !0);
    if (
      (s.obtuse && ![0, 1, 2].every(A) && ((s.impossible = !1), (s.unreliable = !0)),
      fitsWell && s.impossible && ((s.impossible = !1), (s.marginal = !0)),
      s.horizonFams && !s.horizonFams.every(A) && (s.perpErrSoft = !0),
      s.impossible && s.obtuse && w && s.obtuse.ang < 95 && ((s.impossible = !1), (s.marginal = !0)),
      s.impossible && !s.obtuse && w && ((s.impossible = !1), (s.marginal = !0)),
      s.perpErr !== void 0 && w && Math.abs(s.perpErr) < 8 && (s.perpErrSoft = !0),
      s.impossible && s.obtuse)
    ) {
      let c = s.obtuse.i;
      k.push({
        sev: w ? 2 : 3,
        kind: "camera",
        fams: [c],
        title:
          "\u0422\u0430\u043A\u0438\u0435 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u043D\u0435 \u0434\u0430\u044E\u0442 \u043F\u0440\u044F\u043C\u044B\u0445 \u0443\u0433\u043B\u043E\u0432",
        text: `\u0422\u0440\u0435\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A \u0438\u0437 \u0442\u0440\u0451\u0445 \u0442\u043E\u0447\u0435\u043A \u0441\u0445\u043E\u0434\u0430 \u0442\u0443\u043F\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u044B\u0439 (\u0443\u0433\u043E\u043B \u0443 \u0442\u043E\u0447\u043A\u0438 ${de[c]} \u0440\u0451\u0431\u0435\u0440 \u2014 ${Math.round(s.obtuse.ang)}\xB0). \u0423 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0435\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u043E\u043D \u0432\u0441\u0435\u0433\u0434\u0430 \u043E\u0441\u0442\u0440\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u044B\u0439, \u0438\u043D\u0430\u0447\u0435 \u0443\u0433\u043B\u044B \u043C\u0435\u0436\u0434\u0443 \u0440\u0451\u0431\u0440\u0430\u043C\u0438 \u043D\u0435 \u043F\u0440\u044F\u043C\u044B\u0435. \u041E\u0431\u044B\u0447\u043D\u043E \u044D\u0442\u043E \u0437\u043D\u0430\u0447\u0438\u0442, \u0447\u0442\u043E ${B[c]} \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u0438\u043B\u044C\u043D\u043E \u0438\u043B\u0438 \u0432 \u0434\u0440\u0443\u0433\u0443\u044E \u0441\u0442\u043E\u0440\u043E\u043D\u0443.`,
      });
    }
    if (
      (s.perpErr !== void 0 &&
        Math.abs(s.perpErr) > 3 &&
        !s.perpErrSoft &&
        (s.parFam !== void 0
          ? k.push({
              sev: Math.abs(s.perpErr) > 7 ? 3 : 2,
              kind: "camera",
              fams: [s.parFam],
              title: `${D(B[s.parFam])} \u0440\u0451\u0431\u0440\u0430 \u043D\u0435 \u043F\u0435\u0440\u043F\u0435\u043D\u0434\u0438\u043A\u0443\u043B\u044F\u0440\u043D\u044B \u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0443`,
              text: `${D(B[s.parFam])} \u0440\u0451\u0431\u0440\u0430 \u043F\u0430\u0440\u0430\u043B\u043B\u0435\u043B\u044C\u043D\u044B \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443 \u2014 \u0437\u043D\u0430\u0447\u0438\u0442, \u043E\u043D\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0438\u0434\u0442\u0438 \u043F\u043E\u0434 \u043F\u0440\u044F\u043C\u044B\u043C \u0443\u0433\u043B\u043E\u043C \u043A \u043B\u0438\u043D\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 \u0434\u0432\u0435 \u0434\u0440\u0443\u0433\u0438\u0435 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 (\u0433\u043E\u0440\u0438\u0437\u043E\u043D\u0442\u0443). \u0421\u0435\u0439\u0447\u0430\u0441 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u0435 ${Math.round(Math.abs(s.perpErr))}\xB0.`,
            })
          : s.parFams &&
            k.push({
              sev: 2,
              kind: "camera",
              fams: s.parFams,
              title:
                "\u041F\u0435\u0440\u0435\u0434\u043D\u044F\u044F \u0433\u0440\u0430\u043D\u044C \u0434\u043E\u043B\u0436\u043D\u0430 \u0431\u044B\u0442\u044C \u043F\u0440\u044F\u043C\u043E\u0443\u0433\u043E\u043B\u044C\u043D\u0438\u043A\u043E\u043C",
              text: `${D(B[s.parFams[0]])} \u0438 ${B[s.parFams[1]]} \u0440\u0451\u0431\u0440\u0430 \u043D\u0435 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F, \u0437\u043D\u0430\u0447\u0438\u0442, \u044D\u0442\u0430 \u0433\u0440\u0430\u043D\u044C \u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u043F\u0440\u044F\u043C\u043E \u043D\u0430 \u0442\u0435\u0431\u044F. \u0422\u043E\u0433\u0434\u0430 \u0443\u0433\u043E\u043B \u043C\u0435\u0436\u0434\u0443 \u043D\u0438\u043C\u0438 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C 90\xB0, \u0430 \u0441\u0435\u0439\u0447\u0430\u0441 \u043E\u043D \u043E\u0442\u043B\u0438\u0447\u0430\u0435\u0442\u0441\u044F \u043D\u0430 ${Math.round(Math.abs(s.perpErr))}\xB0.`,
            })),
      i.families.forEach((c) => {
        if (c.status !== "nonconv") return;
        let f = c.perLine.slice().sort((x, z) => Math.abs(z.ang) - Math.abs(x.ang))[0];
        k.push({
          sev: c.maxAbs > 6 ? 2 : 1,
          slight: c.maxAbs <= 4.5,
          kind: "conv",
          fams: [c.k],
          line: f.li,
          title: `${D(B[c.k])} \u0440\u0451\u0431\u0440\u0430 \u043D\u0435 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u043E\u0434\u043D\u0443 \u0442\u043E\u0447\u043A\u0443`,
          text: `\u0421\u0438\u043B\u044C\u043D\u0435\u0435 \u0432\u0441\u0435\u0433\u043E \u0432\u044B\u0431\u0438\u0432\u0430\u0435\u0442\u0441\u044F \u043E\u0434\u043D\u0430 \u043B\u0438\u043D\u0438\u044F: ${et(Math.abs(f.ang))}\xB0 ${f.ang > 0 ? "\u21BB \u043F\u043E \u0447\u0430\u0441\u043E\u0432\u043E\u0439" : "\u21BA \u043F\u0440\u043E\u0442\u0438\u0432 \u0447\u0430\u0441\u043E\u0432\u043E\u0439"} \u043E\u0442 \u043E\u0431\u0449\u0435\u0439 \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430. \u0420\u0430\u0437\u0431\u0440\u043E\u0441 \u043F\u043E \u0441\u0435\u043C\u0435\u0439\u0441\u0442\u0432\u0443 \u2014 ${et(c.rms)}\xB0.`,
        });
      }),
      m === "cube" && i.props && i.props.excess > 0.07 && !i.props.cubeOk)
    ) {
      let gd = i.guide,
        c = gd ? [0, 1, 2].sort((x, z) => Math.abs(Math.log(gd.fam[z])) - Math.abs(Math.log(gd.fam[x])))[0] : i.props.worst,
        f = gd ? gd.fam[c] : i.props.r[c],
        others = [0, 1, 2].filter((x) => x !== c),
        pct = Math.round(Math.abs(f - 1) * 100);
      k.push({
        sev: i.props.excess > 0.2 && (i.props.determined || !(i.props.gap !== void 0 && i.props.gap <= 0.04)) ? 2 : 1,
        kind: "props",
        fams: [c],
        title: f > 1 ? `${D(B[c])} рёбра слишком длинные для куба` : `${D(B[c])} рёбра слишком короткие для куба`,
        text: gd
          ? `У настоящей коробки, которая получается из рисунка, ${B[c]} рёбра ${f > 1 ? "длиннее" : "короче"} ${others.map((x) => de[x]).join(" и ")} в ${et(f > 1 ? f : 1 / f, 2)} раза${pct ? ` (на ${pct}%)` : ""}. ${f > 1 ? "Укороти" : "Продли"} их до зелёных отметок на холсте: там кончались бы рёбра настоящего куба с тем же ближним углом и тем же взглядом.`
          : `Если восстановить по рисунку настоящую коробку, ${B[c]} рёбра у неё в ${et(f > 1 ? f : 1 / f, 2)} раза ${f > 1 ? "длиннее" : "короче"} среднего.`,
      });
    }
    let R = vpReliable && s.cone !== void 0 ? s.cone : i.implied ? i.implied.cone : s.cone;
    i.cone = R;
    if (
      (R > 34 &&
        k.push({
          sev: R > 45 ? 2 : 1,
          kind: "distort",
          title:
            "\u041F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u0430 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0441\u0438\u043B\u044C\u043D\u0430\u044F",
          text: `\u0427\u0442\u043E\u0431\u044B \u0443\u0432\u0438\u0434\u0435\u0442\u044C \u043A\u043E\u0440\u043E\u0431\u043A\u0443 \u0442\u0430\u043A, \u0433\u043B\u0430\u0437 \u0434\u043E\u043B\u0436\u0435\u043D \u0431\u044B\u0442\u044C \u043E\u0447\u0435\u043D\u044C \u0431\u043B\u0438\u0437\u043A\u043E: \u043A\u0440\u0430\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u043D\u0430 ${Math.round(R)}\xB0 \u043E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430 \u0432\u0437\u0433\u043B\u044F\u0434\u0430 (\u043A\u043E\u043C\u0444\u043E\u0440\u0442\u043D\u043E \u0434\u043E 30\xB0). \u0412 \u0442\u0430\u043A\u043E\u043C \u0432\u0438\u0434\u0435 \u043A\u0443\u0431 \u0432\u044B\u0433\u043B\u044F\u0434\u0438\u0442 \u0438\u0441\u043A\u0430\u0436\u0451\u043D\u043D\u044B\u043C. \u041E\u0442\u043E\u0434\u0432\u0438\u043D\u044C \u0442\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u0434\u0430\u043B\u044C\u0448\u0435.`,
        }),
      i.families.forEach((c) => {
        c.vpDist !== void 0 &&
          c.vpDist < 0.9 &&
          R > 28 &&
          c.status !== "diverge" &&
          k.push({
            sev: 1,
            kind: "strong",
            fams: [c.k],
            title: `${D(B[c.k])} \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0440\u0435\u0437\u043A\u043E`,
            text: "\u0422\u043E\u0447\u043A\u0430 \u0441\u0445\u043E\u0434\u0430 \u043F\u043E\u0447\u0442\u0438 \u0443 \u0441\u0430\u043C\u043E\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438. \u0422\u0430\u043A \u0431\u044B\u0432\u0430\u0435\u0442, \u0442\u043E\u043B\u044C\u043A\u043E \u0435\u0441\u043B\u0438 \u0441\u043C\u043E\u0442\u0440\u0435\u0442\u044C \u043D\u0430 \u043D\u0435\u0451 \u0432 \u0443\u043F\u043E\u0440.",
          });
      }),
      i.y && i.y.angles.some((c) => c.deg < 89))
    ) {
      let c = Math.min(...i.y.angles.map((f) => f.deg));
      k.push({
        sev: 1,
        kind: "y",
        title:
          "\u041E\u0441\u0442\u0440\u044B\u0439 \u0443\u0433\u043E\u043B \u0443 \u0431\u043B\u0438\u0436\u043D\u0435\u0439 \u0432\u0435\u0440\u0448\u0438\u043D\u044B",
        text: `\u041E\u0434\u0438\u043D \u0438\u0437 \u0443\u0433\u043B\u043E\u0432 \xABY\xBB \u0443 \u0431\u043B\u0438\u0436\u043D\u0435\u0439 \u0432\u0435\u0440\u0448\u0438\u043D\u044B \u2014 ${Math.round(c)}\xB0. \u041F\u0440\u0438 \u043E\u0431\u044B\u0447\u043D\u043E\u043C \u0432\u0437\u0433\u043B\u044F\u0434\u0435 \u0432\u0441\u0435 \u0442\u0440\u0438 \u0431\u043E\u043B\u044C\u0448\u0435 90\xB0; \u043C\u0435\u043D\u044C\u0448\u0435 \u0431\u044B\u0432\u0430\u0435\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0443 \u043A\u0440\u0430\u044F \u043E\u0447\u0435\u043D\u044C \u0448\u0438\u0440\u043E\u043A\u043E\u0433\u043E \u043A\u0430\u0434\u0440\u0430.`,
      });
    }
    if (
      (i.families.forEach((c) => {
        c.n > 0 &&
          c.n < 3 &&
          d.push({
            kind: "few",
            text: `${D(B[c.k])}: ${c.n === 1 ? "\u043E\u0434\u043D\u043E \u0440\u0435\u0431\u0440\u043E" : "\u0434\u0432\u0430 \u0440\u0435\u0431\u0440\u0430"} \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0438\u0445 \u0441\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u043D\u0435\u043B\u044C\u0437\u044F (\u0447\u0435\u0440\u0435\u0437 \u0434\u0432\u0435 \u043B\u0438\u043D\u0438\u0438 \u0432\u0441\u0435\u0433\u0434\u0430 \u043F\u0440\u043E\u0445\u043E\u0434\u0438\u0442 \u043E\u0431\u0449\u0430\u044F \u0442\u043E\u0447\u043A\u0430). \u0414\u043E\u0440\u0438\u0441\u0443\u0439 \u0435\u0449\u0451 \u0440\u0435\u0431\u0440\u043E \u044D\u0442\u043E\u0433\u043E \u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F, \u0445\u043E\u0442\u044F \u0431\u044B \u043D\u0435\u0432\u0438\u0434\u0438\u043C\u043E\u0435.`,
          });
      }),
      y + S >= 3 &&
        (y === 0 || S === 0) &&
        k.push({
          sev: 0,
          kind: "bias",
          title:
            "\u041E\u0448\u0438\u0431\u043A\u0438 \u0432 \u043E\u0434\u043D\u0443 \u0441\u0442\u043E\u0440\u043E\u043D\u0443",
          text: `\u0412\u0441\u0435 \u0437\u0430\u043C\u0435\u0442\u043D\u044B\u0435 \u043E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0438\u044F \u043F\u043E\u0432\u0451\u0440\u043D\u0443\u0442\u044B ${y ? "\u043F\u0440\u043E\u0442\u0438\u0432 \u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u21BA" : "\u043F\u043E \u0447\u0430\u0441\u043E\u0432\u043E\u0439 \u21BB"}: \u043F\u043E\u0445\u043E\u0436\u0435 \u043D\u0430 \u043F\u0440\u0438\u0432\u044B\u0447\u043A\u0443 \u0440\u0443\u043A\u0438. \u041F\u043E\u043F\u0440\u043E\u0431\u0443\u0439 \u043F\u043E\u0432\u043E\u0440\u0430\u0447\u0438\u0432\u0430\u0442\u044C \u043B\u0438\u0441\u0442 \u0438\u043B\u0438 \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u044C \u043B\u0438\u043D\u0438\u0438 \u043E\u0442 \u043F\u043B\u0435\u0447\u0430.`,
        }),
      i.answer)
    ) {
      let c = i.answer.corners.slice().sort((f, x) => x.d - f.d)[0],
        // p — насколько даже лучшая настоящая коробка (с любыми пропорциями) не совпадает с рисунком
        sevImpl = p > 0.018 ? 2 : p > 0.013 ? 1 : 0,
        sevCorner = c ? (c.d > 0.11 * E ? 2 : c.d > Math.max(9, 0.055 * E) ? 1 : 0) : 0;
      c &&
        Math.max(sevImpl, sevCorner) > 0 &&
        k.push({
          sev: Math.max(sevImpl, sevCorner),
          impl: p,
          kind: "corner",
          label: c.l,
          title:
            "\u0423\u0433\u043E\u043B \u0437\u0430\u043C\u0435\u0442\u043D\u043E \u043D\u0435 \u043D\u0430 \u043C\u0435\u0441\u0442\u0435",
          text: `\u0421\u0430\u043C\u044B\u0439 \u043D\u0435\u0442\u043E\u0447\u043D\u044B\u0439 \u0443\u0433\u043E\u043B \u2014 \u0432 ${Math.round(c.d)} \u043F\u0438\u043A\u0441. \u043E\u0442 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0433\u043E ${m === "cube" ? "\u043A\u0443\u0431\u0430" : "\u043A\u043E\u0440\u043E\u0431\u043A\u0438"}. \u041F\u0443\u043D\u043A\u0442\u0438\u0440 \u043D\u0430 \u0445\u043E\u043B\u0441\u0442\u0435 \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u0442, \u043A\u0443\u0434\u0430 \u0435\u0433\u043E \u0441\u0434\u0432\u0438\u043D\u0443\u0442\u044C.${sevImpl >= 2 ? ` Такую картинку не даёт ни одна настоящая коробка: даже самая похожая расходится с рисунком в среднем на ${Math.round(p * E)} пикс. в углах.` : ""}`,
        });
    }
    return (
      (i.looseFrac = n.looseFrac || 0),
      n.looseCount &&
        k.push({
          sev: i.looseFrac > 0.08 ? 2 : 1,
          kind: "loose",
          title:
            n.looseCount === 1
              ? "\u041E\u0434\u043D\u0430 \u043B\u0438\u043D\u0438\u044F \u043D\u0435 \u0441\u0442\u0430\u043B\u0430 \u0440\u0435\u0431\u0440\u043E\u043C"
              : `${n.looseCount} \u043B\u0438\u043D\u0438\u0439 \u043D\u0435 \u0441\u0442\u0430\u043B\u0438 \u0440\u0451\u0431\u0440\u0430\u043C\u0438`,
          text:
            (i.looseFrac > 0.08
              ? "Проверка неполная: эти линии в оценке не участвуют, поэтому балл может быть завышен. "
              : "") + "\u0421\u0435\u0440\u044B\u0435 \u043B\u0438\u043D\u0438\u0438 \u043D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u0440\u0438\u0432\u044F\u0437\u0430\u0442\u044C \u043A \u0443\u0433\u043B\u0430\u043C \u043A\u043E\u0440\u043E\u0431\u043A\u0438. \u041E\u0431\u044B\u0447\u043D\u043E \u044D\u0442\u043E \u0440\u0435\u0431\u0440\u043E, \u043A\u043E\u0442\u043E\u0440\u043E\u0435 \u043D\u0435 \u0434\u043E\u0445\u043E\u0434\u0438\u0442 \u0434\u043E \u0443\u0433\u043B\u0430, \u0438\u043B\u0438 \u043E\u0434\u043D\u0430 \u043B\u0438\u043D\u0438\u044F, \u043F\u0440\u043E\u0432\u0435\u0434\u0451\u043D\u043D\u0430\u044F \u0447\u0435\u0440\u0435\u0437 \u0434\u0432\u0430 \u0440\u0435\u0431\u0440\u0430 \u0431\u0435\u0437 \u0438\u0437\u043B\u043E\u043C\u0430.",
        }),
      k.sort((c, f) => f.sev - c.sev),
      $.forEach((c) => {
        c.status === "ok" &&
          d.push({
            kind: "ok",
            text: `${D(B[c.k])} \u0440\u0451\u0431\u0440\u0430 \u0441\u0445\u043E\u0434\u044F\u0442\u0441\u044F \u0432 \u043E\u0434\u043D\u0443 \u0442\u043E\u0447\u043A\u0443 (\u0440\u0430\u0437\u0431\u0440\u043E\u0441 ${et(c.rms)}\xB0)`,
          });
      }),
      m === "cube" &&
        i.props &&
        ((i.props.excess <= 0.07 && i.props.determined) || i.props.cubeOk) &&
        d.push({
          kind: "ok",
          text: "\u041F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 \u043A\u0430\u043A \u0443 \u043A\u0443\u0431\u0430",
        }),
      R !== void 0 &&
        R <= 34 &&
        !s.impossible &&
        d.push({
          kind: "ok",
          text: `\u0422\u043E\u0447\u043A\u0438 \u0441\u0445\u043E\u0434\u0430 \u0441\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u044B: \u0442\u0430\u043A\u043E\u0439 \u0432\u0438\u0434 \u0434\u0430\u0451\u0442 \u043D\u0430\u0441\u0442\u043E\u044F\u0449\u0430\u044F \u043A\u0430\u043C\u0435\u0440\u0430 (\u043A\u0440\u0430\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0438 \u0432 ${Math.round(R)}\xB0 \u043E\u0442 \u0446\u0435\u043D\u0442\u0440\u0430 \u0432\u0437\u0433\u043B\u044F\u0434\u0430)`,
        }),
      (i.score = ge(i, m, E)),
      i
    );
  }
  function propGuide(t, M, n0, E) {
    // сторона куба — по среднему из трёх направлений (медиана): обычно два направления нарисованы
    // верно, и мерка подсказывает, что поправить только в третьем
    let side = M.D.slice().sort((a, b) => a - b)[1],
      ref = M.D.indexOf(side),
      Xn = M.X[n0],
      Y = [...Array(8)].map((_, k) =>
        [0, 1, 2].map((q) => Xn[q] + [0, 1, 2].reduce((a, j) => a + M.R[q][j] * side * (((k >> j) & 1) - ((n0 >> j) & 1)), 0)),
      );
    if (Y.some((y) => !(y[2] > 0.02 * Xn[2]))) return null;
    let P = Y.map((y) => [M.c[0] + (M.f * y[0]) / y[2], M.c[1] + (M.f * y[1]) / y[2]]),
      obsN = t.obsV.find((v) => v.l === n0),
      // совмещаем ближний угол мерки с нарисованным
      sh = obsN ? [obsN.p[0] - P[n0][0], obsN.p[1] - P[n0][1]] : [0, 0];
    P = P.map((p) => [p[0] + sh[0], p[1] + sh[1]]);
    let fam = M.D.map((d) => d / side),
      // меньше ~6% рука не различает — такие расхождения не показываем
      tol = Math.max(6, 0.06 * E),
      corners = t.obsV
        .filter((v) => v.l !== n0)
        .map((v) => {
          let q = P[v.l],
            d = Math.hypot(q[0] - v.p[0], q[1] - v.p[1]);
          return { l: v.l, p: v.p, q, d, off: d > tol };
        }),
      // три ребра из ближнего угла: где должен быть их конец вдоль нарисованной линии
      near = [0, 1, 2].map((j) => {
        let l2 = n0 ^ lt[j],
          o = t.obsV.find((v) => v.l === l2),
          A = obsN ? obsN.p : P[n0],
          q = P[l2],
          dir = [q[0] - A[0], q[1] - A[1]],
          L = Math.hypot(...dir) || 1;
        // конец ребра: дальний угол, а если он не собран — дальний конец нарисованной линии этого ребра
        let endP = o ? o.p : null;
        if (!endP) {
          let ln = (t.obsL || []).find((q) => (q.la === n0 && q.lb === l2) || (q.la === l2 && q.lb === n0));
          ln && (endP = Math.hypot(ln.a[0] - A[0], ln.a[1] - A[1]) > Math.hypot(ln.b[0] - A[0], ln.b[1] - A[1]) ? ln.a : ln.b);
        }
        if (!endP) return { k: j, l: l2, q, have: !1 };
        let cur = ((endP[0] - A[0]) * dir[0] + (endP[1] - A[1]) * dir[1]) / L;
        return { k: j, l: l2, q, end: endP, ratio: cur / L, pct: Math.round((cur / L - 1) * 100), have: !0, off: Math.abs(cur - L) > tol && Math.abs(cur / L - 1) > 0.06 };
      });
    return { near: n0, P, fam, ref, corners, edges: near, tol, any: corners.some((c) => c.off) };
  }
  function Mt(t, e, n) {
    return vt((100 * (n - t)) / (n - e), 0, 100);
  }
  function ge(t, e, n) {
    let r = [];
    if (
      (t.convRms !== null &&
        t.convRms !== void 0 &&
        r.push({
          key: "conv",
          name: "\u0421\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u044C \u0440\u0451\u0431\u0435\u0440",
          val: Mt(t.convRms, 0.8, 6),
          w: 0.3,
        }),
      t.implied &&
        r.push({
          key: "cons",
          name: "\u0421\u043E\u0433\u043B\u0430\u0441\u043E\u0432\u0430\u043D\u043D\u043E\u0441\u0442\u044C \u043F\u0435\u0440\u0441\u043F\u0435\u043A\u0442\u0438\u0432\u044B",
          val: Mt(t.implied.rel, 0.012, 0.08),
          w: 0.2,
        }),
      e === "cube" &&
        t.props &&
        r.push({
          key: "props",
          name: "\u041F\u0440\u043E\u043F\u043E\u0440\u0446\u0438\u0438 \u043A\u0443\u0431\u0430",
          // рисунок объясняется кубом — пропорции верные: 90–100 по тому, насколько куб хуже коробки
          val: t.props.cubeOk ? Mt(t.props.gap, 0, 0.25) : Mt(t.props.excess, 0.04, 0.45),
          w: 0.2,
        }),
      t.answer &&
        r.push({
          key: "answer",
          name:
            e === "cube"
              ? "\u0411\u043B\u0438\u0437\u043E\u0441\u0442\u044C \u043A \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u043C\u0443 \u043A\u0443\u0431\u0443"
              : "\u0411\u043B\u0438\u0437\u043E\u0441\u0442\u044C \u043A \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E\u0439 \u043A\u043E\u0440\u043E\u0431\u043A\u0435",
          val: Mt(t.answer.rel, 0.015, 0.12),
          w: 0.3,
        }),
      !r.length)
    )
      return null;
    let a = r.reduce((h, v) => h + v.w, 0),
      o = r.reduce((h, v) => h + v.val * v.w, 0) / a;
    (o = 0.75 * o + 0.25 * Math.min(...r.map((h) => h.val))),
      t.families.some((h) => h.status === "diverge" && !h.weakDiverge)
        ? (o = Math.min(o, 45))
        : t.families.some((h) => h.status === "diverge") && (o = Math.min(o, 68)),
      t.camera && t.camera.impossible && (o = Math.min(o, 55));
    let partial = (t.looseFrac || 0) > 0.08;
    partial && (o = Math.min(o, 70));
    let m = t.cone;
    m > 34 && (o -= Math.min(20, (m - 34) * 1.2)),
      (o = Math.round(vt(o, 0, 100))),
      r.forEach((h) => (h.val = Math.round(h.val)));
    let b =
      o >= 90
        ? "\u043E\u0442\u043B\u0438\u0447\u043D\u043E"
        : o >= 75
          ? "\u0445\u043E\u0440\u043E\u0448\u043E"
          : o >= 60
            ? "\u043D\u0435\u043F\u043B\u043E\u0445\u043E"
            : "\u043D\u0430\u0434\u043E \u043F\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C";
    return partial && (b = "проверка неполная"), { total: o, grade: b, parts: r, partial };
  }
  function Wt(t, e, n) {
    let r = t
      .map((d, i) => {
        let u = d.fits.free;
        if (!u || !u.cov) return null;
        let y = [6, 7, 8].map((M) => [6, 7, 8].map((g) => u.cov[M][g])),
          S = d.size,
          $ = [Math.log(u.f), u.c[0], u.c[1]],
          l = [
            [y[0][0], y[0][1] * S, y[0][2] * S],
            [y[1][0] * S, y[1][1] * S * S, y[1][2] * S * S],
            [y[2][0] * S, y[2][1] * S * S, y[2][2] * S * S],
          ];
        return (
          (l[0][0] += 0.0036),
          (l[1][1] += (0.03 * u.f) ** 2),
          (l[2][2] += (0.03 * u.f) ** 2),
          { i, x: $, C: l, Ci: Yt(l), f: u.f }
        );
      })
      .filter(Boolean);
    if (r.length < 2) return null;
    let a = [0, 1, 2].map((d) => xe(r.map((i) => i.x[d]))),
      o = (d, i) => {
        let u = d.x.map((y, S) => y - i[S]);
        return Math.sqrt(
          Math.max(
            0,
            u.reduce((y, S, $) => y + S * u.reduce((l, M, g) => l + d.Ci[$][g] * M, 0), 0),
          ),
        );
      };
    for (let d = 0; d < 12; d++) {
      let i = [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0],
        ],
        u = [0, 0, 0];
      r.forEach((S) => {
        let $ = o(S, a),
          l = 1 / (1 + ($ * $) / 4);
        for (let M = 0; M < 3; M++) {
          u[M] += l * S.Ci[M].reduce((g, s, p) => g + s * S.x[p], 0);
          for (let g = 0; g < 3; g++) i[M][g] += l * S.Ci[M][g];
        }
      });
      let y = Yt(i);
      if (!y) break;
      a = [0, 1, 2].map((S) => y[S].reduce(($, l, M) => $ + l * u[M], 0));
    }
    let m = Math.exp(a[0]),
      b = [a[1], a[2]],
      h = { f: m, c: b, issues: [] };
    r.forEach((d) => {
      let i = o(d, a),
        u = d.x[0] - a[0],
        y = Math.hypot(d.x[1] - b[0], d.x[2] - b[1]) / m,
        S = i > 3 && (Math.abs(u) > 0.25 || y > 0.2);
      h.issues.push({ box: d.i, d: i, fRatio: Math.exp(u), dc: y, odd: S });
    });
    let v = h.issues.filter((d) => !d.odd).map((d) => t[d.box]),
      E = { f: m, c: b };
    if (v.length >= 2) {
      let d = Rt(v, n);
      d && (E = { f: d.f, c: d.c });
    }
    h.issues.forEach((d) => {
      let i = t[d.box],
        u = i.fits.free,
        y = H(i.obs, {
          c0: n.c0,
          page: Math.hypot(n.page.w, n.page.h),
          size: i.size,
          box: !0,
          camera: "free",
          cam: E,
          vps: i.vps.map((S) => S && S.v),
        });
      (d.fixedRel = y ? y.rms / i.size : 1),
        (d.ownRel = u.rms / i.size),
        (d.fixedFit = y),
        d.odd && d.fixedRel < Math.max(0.02, 2 * d.ownRel) && (d.odd = !1);
    });
    let k = h.issues.filter((d) => !d.odd).map((d) => t[d.box]);
    if (k.length >= 2) {
      let d = Rt(k, n);
      d && ((h.fit = d), (h.f = d.f), (h.c = d.c));
    }
    return (h.horizon = Me(t, h)), h;
  }
  function xe(t) {
    let e = t.slice().sort((n, r) => n - r);
    return e[e.length >> 1];
  }
  function Yt(t) {
    let [e, n, r] = t[0],
      [a, o, m] = t[1],
      [b, h, v] = t[2],
      E = o * v - m * h,
      k = -(a * v - m * b),
      d = a * h - o * b,
      i = e * E + n * k + r * d;
    return Math.abs(i) < 1e-300
      ? null
      : [
          [E / i, -(n * v - r * h) / i, (n * m - r * o) / i],
          [k / i, (e * v - r * b) / i, -(e * m - r * a) / i],
          [d / i, -(e * h - n * b) / i, (e * o - n * a) / i],
        ];
  }
  function Me(t, e) {
    if (!e.fit) return null;
    let n = e.fit.boxes.filter(Boolean).map((r) => [0, 1, 2].map((a) => [r.R[0][a], r.R[1][a], r.R[2][a]]));
    if (n.length < 2) return null;
    for (let r = 0; r < 3; r++) {
      let a = n[0][r],
        o = n.map((v) =>
          v.findIndex((E) => Math.abs(E[0] * a[0] + E[1] * a[1] + E[2] * a[2]) > Math.cos(6 / O)),
        );
      if (o.some((v) => v < 0)) continue;
      let m = e.f,
        b = e.c,
        h = a;
      return {
        n: [h[0], h[1], h[2]],
        f: m,
        c: b,
        line: [h[0] / m, h[1] / m, h[2] - (h[0] * b[0] + h[1] * b[1]) / m],
        upFam: o,
      };
    }
    return null;
  }
  function te(t, e = {}) {
    let n = zt(),
      m = [],
      b = [];
    t.forEach((i, u) => {
      if (!i.pts || i.pts.length < 2) return;
      let y = Ft(i.pts);
      if (y.curve) {
        b.push(u);
        return;
      }
      y.segs.forEach((S) => m.push({ ...S, stroke: u, hidden: !!i.hidden }));
    });
    let v = analyzeSegs(m, b, e);
    // Повторный разбор: возможно, два ребра слились в одну линию (пологий излом, угол на продолжении
    // соседнего ребра, или в ракурсе «углом к зрителю» рёбра от ближнего и невидимого угла легли на
    // одну прямую). Признаки: часть линий не стала рёбрами или ни одна настоящая коробка не подходит.
    // Разрезаем подозрительные линии и разбираем заново; разрез оставляем, только если он объясняет
    // рисунок заметно лучше. Число попыток фиксировано, чтобы результат не зависел от скорости компьютера.
    // «Пересчитать с нуля» (deep): порог ниже, попыток и вариантов больше
    let deep = !!e.deep,
      want = (x) => (deep ? unexplainedFrac(x) > 0.015 || fitBadness(x) > 0.012 : needsRetry(x));
    if (v.lines.length >= 7 && v.lines.length <= (deep ? 30 : 18) && want(v)) {
      let attempts = 0;
      // предварительный результат сразу, уточнённый — следом
      e.onPartial && ((v.ms = zt() - n), e.onPartial(v));
      for (let round = 0; round < (deep ? 5 : 3) && want(v); round++) {
        let improved = !1;
        for (let cand of cutCandidates(m, v.lines).slice(0, deep ? 8 : 4)) {
          if (attempts++ >= (e.maxRetries ?? (deep ? 8 : 4))) break;
          // повторные разборы — с обычным набором масштабов, иначе «с нуля» слишком долго
          let v2 = analyzeSegs(cand.m, b, { ...e, deep: !1 });
          v2.dropped = (v.dropped || 0) + (cand.drop || 0);
          if (v2.boxes.length >= v.boxes.length && parseQuality(v2) < parseQuality(v) - (deep ? 0.006 : 0.015)) {
            (v = v2), (m = cand.m), (improved = !0);
            break;
          }
        }
        if (!improved) break;
      }
    }
    return (v.ms = zt() - n), v;
  }
  // Насколько плохо даже лучшая настоящая коробка повторяет рисунок (среднее по коробкам).
  function fitBadness(v) {
    let r = v.boxes.map((x) => (x.diag && x.diag.implied ? x.diag.implied.rel : 0.2));
    return r.length ? r.reduce((g, s) => g + s, 0) / r.length : 0.2;
  }
  function needsRetry(v) {
    return unexplainedFrac(v) > 0.04 || fitBadness(v) > 0.03;
  }
  // Меньше — лучше: неразобранные линии плюс несогласованность с настоящей коробкой.
  function parseQuality(v) {
    return unexplainedFrac(v) + Math.min(0.25, fitBadness(v));
  }
  // Доля длины линий, которые не удалось сделать рёбрами коробки.
  function unexplainedFrac(v) {
    // отброшенные при повторном разборе обрывки считаются неразобранными: выбросить линию «просто так» не выгодно
    let dr = v.dropped || 0,
      tot = v.lines.reduce((g, s) => g + s.len, 0) + dr || 1;
    return (v.loose.reduce((g, s) => g + v.lines[s].len, 0) + dr) / tot;
  }
  // Отрезок, ориентированный от первой точки к последней (как в разбиении штриха).
  function mkSeg(pts, base) {
    let l = kt(pts);
    let g = pts[0];
    (g[0] - l.c[0]) * l.d[0] + (g[1] - l.c[1]) * l.d[1] > 0 &&
      (l = { ...l, d: [-l.d[0], -l.d[1]], a: l.b, b: l.a, t0: -l.t1, t1: -l.t0 });
    return { ...base, line: l, len: l.len, pts };
  }
  // Две линии нельзя сливать, если между ними проведён разрез (части одного разреза по разные стороны).
  function cutConflict(segs, A, Bm) {
    for (let i of A)
      for (let c of segs[i].cut || [])
        for (let j of Bm) for (let d of segs[j].cut || []) if (c.id === d.id && c.side !== d.side) return !0;
    return !1;
  }
  var cutSeq = 0;
  // Разрезает отрезок по индексу точки; обе части помнят разрез и не сольются обратно.
  function splitSeg(s, k, id) {
    let P = s.pts,
      A = P.slice(0, k + 1),
      Bq = P.slice(k),
      la = wt(A),
      lb = wt(Bq),
      X = ot(la.c, la.d, lb.c, lb.d),
      corner = X && F(la.d, lb.d) > 12 ? [X[0], X[1]] : P[k],
      { linkNext: ln, linkPrev: lp, cornerEnd: ce0, cornerStart: cs0, ...rest } = s,
      cut = s.cut || [],
      s1 = mkSeg(A, { ...rest, cut: [...cut, { id, side: 0 }], linkNext: !0, cornerEnd: corner }),
      s2 = mkSeg(Bq, { ...rest, cut: [...cut, { id, side: 1 }], linkPrev: !0, cornerStart: corner });
    return lp && (s1.linkPrev = !0), cs0 && (s1.cornerStart = cs0), ln && (s2.linkNext = !0), ce0 && (s2.cornerEnd = ce0), [s1, s2];
  }
  // Разрез линии L в точке с параметром t0 (вдоль L): режем отрезки, которые через неё проходят,
  // остальным отрезкам линии помечаем сторону.
  function cutLineAt(m, L, t0) {
    let id = ++cutSeq,
      repl = new Map(),
      any = !1;
    for (let i of L.members) {
      let s = m[i],
        ts = s.pts.map((p) => ct(L, p)),
        lo = Math.min(...ts),
        hi = Math.max(...ts),
        mg = Math.max(4, 0.08 * (hi - lo));
      if (t0 > lo + mg && t0 < hi - mg && s.pts.length >= 6) {
        let k = 1,
          bd = 1 / 0;
        ts.forEach((tv, j) => {
          let dd = Math.abs(tv - t0);
          j > 1 && j < ts.length - 2 && dd < bd && ((bd = dd), (k = j));
        });
        // сторона куска — по положению вдоль L, а не по порядку точек в штрихе
        let parts = splitSeg(s, k, id).map((q) => {
          let mt = q.pts.reduce((g, p) => g + ct(L, p), 0) / q.pts.length;
          return { ...q, cut: [...(s.cut || []), { id, side: mt < t0 ? 0 : 1 }] };
        });
        repl.set(i, parts), (any = !0);
      } else {
        let side = (lo + hi) / 2 < t0 ? 0 : 1;
        repl.set(i, [{ ...s, cut: [...(s.cut || []), { id, side }] }]);
      }
    }
    // разрез имеет смысл, если что-то разрезано или линия собрана из кусков с обеих сторон
    let sides = new Set([...repl.values()].flat().flatMap((s) => (s.cut || []).filter((c) => c.id === id).map((c) => c.side)));
    if (!any && sides.size < 2) return null;
    let out = [];
    m.forEach((s, i) => (repl.has(i) ? out.push(...repl.get(i)) : out.push(s)));
    return out;
  }
  // «Расклеить» линию по штрихам: группы штрихов, идущие друг за другом (а не поверх друг друга),
  // больше не сливаются. Штрихи не режутся — важно, когда два ребра перекрываются на участке.
  function unmergeLine(m, L, t0) {
    if (L.members.length < 2) return null;
    let id = ++cutSeq,
      span = (i) => {
        let ts = m[i].pts.map((p) => ct(L, p));
        return [Math.min(...ts), Math.max(...ts)];
      },
      mem = L.members.map((i) => ({ i, sp: span(i) })),
      sides = mem.map(({ sp }) => ((sp[0] + sp[1]) / 2 < t0 ? 0 : 1));
    if (new Set(sides).size < 2) return null;
    // сторона 0 и сторона 1 не должны лежать друг на друге почти целиком (это обводка)
    let lo = mem.filter((q, k) => !sides[k]),
      hi = mem.filter((q, k) => sides[k]),
      a = [Math.min(...lo.map((q) => q.sp[0])), Math.max(...lo.map((q) => q.sp[1]))],
      b = [Math.min(...hi.map((q) => q.sp[0])), Math.max(...hi.map((q) => q.sp[1]))],
      ov = Math.min(a[1], b[1]) - Math.max(a[0], b[0]);
    if (ov > 0.5 * Math.min(a[1] - a[0], b[1] - b[0])) return null;
    let side = new Map(mem.map((q, k) => [q.i, sides[k]]));
    return m.map((s, i) => (side.has(i) ? { ...s, cut: [...(s.cut || []), { id, side: side.get(i) }] } : s));
  }
  // Кандидаты на разрез: Т-стыки (конец одной линии упирается в середину другой) и пологие изломы.
  function cutCandidates(m, lines) {
    let all = m.flatMap((s) => s.pts),
      diag = N(all).diag || 1,
      tol = Math.max(8, 0.02 * diag),
      out = [],
      seen = [];
    lines.forEach((L, li) => {
      if (L.len < 0.08 * diag) return;
      lines.forEach((M2, mi) => {
        if (mi === li || F(L.d, M2.d) < 15) return;
        for (let E of [M2.a, M2.b]) {
          if (Et(L, E) > tol) continue;
          let t0 = ct(L, E),
            fr = (t0 - L.t0) / (L.len || 1);
          if (fr < 0.12 || fr > 0.88 || seen.some((q) => q.li === li && Math.abs(q.t - t0) < tol)) continue;
          seen.push({ li, t: t0 });
          let m2 = cutLineAt(m, L, t0),
            m3 = unmergeLine(m, L, t0);
          m2 && out.push({ m: m2, score: 1e4 + L.len * Math.min(fr, 1 - fr) });
          m3 && out.push({ m: m3, score: 1e4 + L.len * Math.min(fr, 1 - fr) + 1 });
        }
      });
    });
    // короткий обрывок (крючок, хвост штриха), который мешает собрать углы
    let lens = lines.map((L) => L.len).sort((a, b) => a - b),
      med = lens[lens.length >> 1] || 1;
    lines.forEach((L) => {
      if (L.len > 0.22 * med) return;
      let gone = new Set(L.members);
      out.push({ m: m.filter((_, i) => !gone.has(i)), drop: L.len, score: 5e3 + (0.22 * med - L.len) });
    });
    m.forEach((s, i) => {
      let P = s.pts;
      if (!P || P.length < 12 || s.len < 0.06 * diag) return;
      let sse = (Q) => {
          let l = wt(Q);
          return l.rms * l.rms * Q.length;
        },
        whole = sse(P),
        best = null;
      for (let k = 4; k <= P.length - 5; k++) {
        let c = sse(P.slice(0, k + 1)) + sse(P.slice(k));
        (!best || c < best.c) && (best = { k, c });
      }
      if (!best) return;
      let la = wt(P.slice(0, best.k + 1)),
        lb = wt(P.slice(best.k)),
        ang = F(la.d, lb.d);
      if (ang < 4 || Math.min(la.len, lb.len) < 0.12 * (la.len + lb.len) || best.c > 0.35 * whole) return;
      out.push({ m: m.slice(0, i).concat(splitSeg(s, best.k, ++cutSeq), m.slice(i + 1)), score: ang * Math.min(la.len, lb.len) });
    });
    return out.sort((a, b) => b.score - a.score);
  }
  function analyzeSegs(m, b, e) {
    let r = e.target || "cube",
      a = e.page || { w: 1600, h: 1e3 },
      o = e.center || [a.w / 2, a.h / 2];
    let h = Tt(m),
      v = { segs: m, lines: h, curves: b, boxes: [], loose: [], ms: 0, target: r };
    if (h.length < 3) return (v.error = "few-lines"), v;
    let E = N(h.flatMap((i) => [i.a, i.b])).diag,
      k = null;
    for (let i of e.deep ? [1, 0.6, 1.6, 0.8, 1.25, 2.2] : [1, 0.6, 1.6]) {
      let u = Dt(h, m, i),
        y = Xt(u).filter((g) => g.length >= 3),
        S = [];
      for (let g of y) {
        let s = Ut(g, u, h).slice(0, 4),
          p = null;
        for (let w of s) {
          Jt(w, u, h);
          let A = be(w, u, h);
          if (!A) continue;
          let R = N(A.obsV.map((x) => x.p).concat(A.lineIds.flatMap((x) => [h[x].a, h[x].b]))).diag || E,
            c = H(A.obs, {
              box: !0,
              camera: "free",
              c0: o,
              page: Math.hypot(a.w, a.h),
              size: R,
              vps: A.vps.map((x) => x && x.v),
            });
          if (!c) continue;
          let f =
            c.cost / Math.max(1, A.obs.V.length + A.obs.L.length) +
            (A.nExplained < 7 ? (7 - A.nExplained) * 2 : 0);
          (!p || f < p.q) && (p = { q: f, B: A, F: c, rd: w, bs: R });
        }
        p && S.push(p);
      }
      let $ = new Set(S.flatMap((g) => g.B.lineIds)),
        l =
          h.filter((g, s) => !$.has(s)).reduce((g, s) => g + s.len, 0) /
          (h.reduce((g, s) => g + s.len, 0) || 1),
        M = S.reduce((g, s) => g + s.q, 0) + 40 * l - 5 * S.length;
      (!k || M < k.q) && (k = { q: M, boxes: S, G: u, scale: i });
    }
    v.graph = k.G;
    let d = new Set();
    for (let i of k.boxes) {
      let { B: u, F: y, bs: S } = i;
      u.lineIds.forEach((p) => d.add(p));
      let $ = { c0: o, page: Math.hypot(a.w, a.h), size: S, vps: u.vps.map((p) => p && p.v) },
        l = H(u.obs, { ...$, box: !0, camera: "free", uncertainty: !0 }) || y,
        M = Zt(u, $, !1, !1, l),
        g = Zt(u, $, !0, !0, l),
        s = { ...u, size: S, fits: { free: l, cube: M, box: g } };
      v.boxes.push(s);
    }
    return (
      (v.loose = h.map((i, u) => u).filter((i) => !d.has(i))),
      v.boxes.forEach((i, u) => {
        i.diag = Kt(i, h, {
          target: r,
          c0: o,
          page: a,
          looseCount: u === 0 ? v.loose.length : 0,
          looseFrac: u === 0 ? unexplainedFrac(v) : 0,
        });
      }),
      v.boxes.length || ((v.error = "no-box"), (v.fallback = ye(h, o))),
      v.boxes.length > 1 && (v.scene = Wt(v.boxes, h, { target: r, c0: o, page: a })),
      v
    );
  }
  var zt = () => (typeof performance < "u" ? performance.now() : Date.now());
  function Zt(t, e, n, r, seed) {
    let a = { ...e, box: n, camera: "plausible", loss: "cauchy" },
      // свободная подгонка — дополнительная стартовая точка: без неё оптимизация иногда
      // застревает в худшем локальном минимуме (особенно на маленьких рисунках)
      o = H(t.obs, seed && seed.p ? { ...a, starts: [{ R0: seed.R0, p: seed.p.slice(0, n ? 11 : 9) }] } : a);
    if (!o || o.rms / e.size < 0.018 || t.obs.V.length < 6)
      return (
        r &&
          o &&
          (o =
            H(t.obs, {
              ...a,
              starts: [{ R0: o.R0, p: o.p }],
              startsOnly: !0,
              maxTop: 1,
              iters: 30,
              uncertainty: !0,
            }) || o),
        o
      );
    for (let m of t.obs.V) {
      let b = {
          ...t.obs,
          V: t.obs.V.map((E) => (E === m ? { ...E, w: 0 } : E)),
          L: t.obs.L.map((E) => (E.la === m.l || E.lb === m.l ? { ...E, w: 0.1 } : E)),
        },
        h = H(b, { ...a, loss: "huber", maxTop: 2, iters: 60 });
      if (!h) continue;
      let v = H(t.obs, { ...a, starts: [{ R0: h.R0, p: h.p }], startsOnly: !0, maxTop: 1, iters: 60 });
      v && v.cost < o.cost && (o = v);
    }
    return (
      r &&
        o &&
        (o =
          H(t.obs, {
            ...a,
            starts: [{ R0: o.R0, p: o.p }],
            startsOnly: !0,
            maxTop: 1,
            iters: 30,
            uncertainty: !0,
          }) || o),
      o
    );
  }
  function be(t, e, n) {
    let r = [],
      a = new Array(8).fill(-1);
    for (let [l, M] of t.lab) M >= 0 && (r.push({ l: M, p: e.V[l].p, v: l }), (a[M] = l));
    if (r.length < 4) return null;
    let o = [],
      m = new Map(),
      b = [],
      h = new Map();
    for (let [l, M] of t.fam) {
      let g = e.E[l],
        s,
        p;
      if (g.ok && t.lab.get(g.u) >= 0 && t.lab.get(g.v) >= 0) (s = t.lab.get(g.u)), (p = t.lab.get(g.v));
      else {
        let A = (t.dangling || []).find((R) => R.line === l);
        if (!A) continue;
        (s = A.from), (p = A.to);
      }
      if (at(s, p) !== M) continue;
      let w = n[l];
      o.push({ la: s, lb: p, a: w.a, b: w.b, len: w.len, line: l }), m.set(l, M), b.push(l), h.set(l, [s, p]);
    }
    let v = new Map();
    for (let [l, [M, g]] of h) {
      let s = Math.min(M, g) + "-" + Math.max(M, g),
        p = !!n[l].hidden,
        w = v.get(s);
      v.set(s, { hidden: w ? w.hidden && p : p, lines: [...(w ? w.lines : []), l] });
    }
    let E = [...v.values()].filter((l) => !l.hidden).length,
      k = [],
      d = [];
    K.forEach((l, M) => {
      let g = [0, 1, 2, 3].map((s) => {
        let p = l.v[s],
          w = l.v[(s + 1) % 4];
        return v.get(Math.min(p, w) + "-" + Math.max(p, w));
      });
      g.some((s) => s && s.hidden) ? d.push(M) : E <= 10 && g.every((s) => s && !s.hidden) && k.push(M);
    });
    let i = [[], [], []];
    for (let [l, M] of m) i[M].push(n[l]);
    let u = b.flatMap((l) => [n[l].a, n[l].b]),
      y = N(u),
      S = { o: y.c, s: y.diag || 1 },
      $ = i.map((l) => (l.length >= 2 ? At(l, S) : null));
    return {
      obs: { V: r, L: o, vis: k, hid: d },
      obsV: r,
      obsL: o,
      fam: m,
      lineIds: b,
      edgeOf: h,
      drawn: v,
      vps: $,
      famLines: i,
      norm: S,
      vOfLabel: a,
      nExplained: b.length,
      solid: E,
      transparent: E >= 11,
      reading: t,
    };
  }
  function ye(t, e) {
    if (t.length < 3) return null;
    let n = t.map((h) => {
        let v = Math.atan2(h.d[1], h.d[0]);
        return [Math.cos(2 * v), Math.sin(2 * v)];
      }),
      r = [n[0]];
    for (; r.length < Math.min(3, t.length); ) {
      let h = 0,
        v = -1;
      n.forEach((E, k) => {
        let d = Math.min(...r.map((i) => Math.hypot(E[0] - i[0], E[1] - i[1])));
        d > v && ((v = d), (h = k));
      }),
        r.push(n[h]);
    }
    let a = new Array(t.length).fill(0);
    for (let h = 0; h < 25; h++)
      n.forEach((v, E) => {
        let k = 0,
          d = 1e9;
        r.forEach((i, u) => {
          let y = Math.hypot(v[0] - i[0], v[1] - i[1]);
          y < d && ((d = y), (k = u));
        }),
          (a[E] = k);
      }),
        r.forEach((v, E) => {
          let k = 0,
            d = 0;
          n.forEach((u, y) => {
            a[y] === E && ((k += u[0]), (d += u[1]));
          });
          let i = Math.hypot(k, d);
          i && (r[E] = [k / i, d / i]);
        });
    let o = N(t.flatMap((h) => [h.a, h.b])),
      m = { o: o.c, s: o.diag || 1 },
      b = [0, 1, 2].map((h) => {
        let v = t.map((E, k) => k).filter((E) => a[E] === h);
        return {
          ids: v,
          vp:
            v.length >= 2
              ? At(
                  v.map((E) => t[E]),
                  m,
                )
              : null,
        };
      });
    return { fam: a, fams: b };
  }
  var ee = [],
    ve = [
      [0, 1, 2],
      [0, 2, 1],
      [1, 0, 2],
      [1, 2, 0],
      [2, 0, 1],
      [2, 1, 0],
    ];
  for (let t of ve)
    for (let e = 0; e < 8; e++)
      ee.push((n) => {
        let r = 0;
        for (let a = 0; a < 3; a++) n & (1 << a) && (r |= 1 << t[a]);
        return r ^ e;
      });
  function we(t, e) {
    let n = null;
    for (let m of ee) {
      let b = 0;
      for (let h of t.obsV) {
        let v = e.P[m(h.l)];
        b += (v[0] - h.p[0]) ** 2 + (v[1] - h.p[1]) ** 2;
      }
      (!n || b < n.c) && (n = { c: b, s: m });
    }
    let r = t.obsV.map((m) => {
        let b = e.P[n.s(m.l)];
        return {
          l: m.l,
          p: m.p,
          q: b,
          d: Math.hypot(b[0] - m.p[0], b[1] - m.p[1]),
          given: e.given.includes(n.s(m.l)),
        };
      }),
      a = r.filter((m) => !m.given),
      // пока новых углов нет, сравнивать не с чем (раньше тут выходило «0 пикс.» и 100 баллов)
      o = a.length ? Math.sqrt(a.reduce((m, b) => m + b.d * b.d, 0) / a.length) : null;
    return { corners: r, rms: o, nNew: a.length, map: [...Array(8)].map((m, b) => n.s(b)) };
  }
  function ke(t, e) {
    let n = {
      ms: t.ms,
      error: t.error,
      curves: t.curves,
      loose: t.loose,
      target: t.target,
      lines: t.lines.map((r) => ({ a: r.a, b: r.b, c: r.c, d: r.d, len: r.len, hidden: !!r.hidden })),
      boxes: t.boxes.map((r) => ({
        lineIds: r.lineIds,
        fam: [...r.fam],
        edgeOf: [...r.edgeOf],
        obsV: r.obsV.map((a) => ({ l: a.l, p: a.p })),
        vis: r.obs.vis,
        transparent: r.transparent,
        size: r.size,
        vps: r.vps.map((a) =>
          a
            ? {
                pt: a.pt,
                v: a.v,
                dirInf: a.dirInf,
                rms: a.rms,
                maxAbs: a.maxAbs,
                spread: a.spread,
                res: a.res,
              }
            : null,
        ),
        fits: Object.fromEntries(
          Object.entries(r.fits).map(([a, o]) => [
            a,
            o
              ? {
                  P: o.P,
                  X: o.X,
                  R: o.R,
                  f: o.f,
                  c: o.c,
                  D: o.D,
                  vis: o.vis,
                  vps: o.vps,
                  cone: o.cone,
                  rms: o.rms,
                  vRes: o.vRes,
                }
              : null,
          ]),
        ),
        diag: r.diag,
      })),
      scene: t.scene
        ? {
            f: t.scene.f,
            c: t.scene.c,
            horizon: t.scene.horizon,
            issues: t.scene.issues.map(({ fixedFit: r, ...a }) => a),
          }
        : null,
      fallback: t.fallback || null,
    };
    return e && n.boxes.length && (n.truth = we(t.boxes[0], e)), n;
  }
  function ne(t, e, n) {
    return ke(te(t, e), n);
  }
  self.__internals = { diag: Kt, buildGraph: Dt, cutCandidates, analyzeSegs, parseQuality, analyze: te, segment: Ft, mergeLines: Tt, fit: H, fitConstrained: Zt };
  self.onmessage = (t) => {
    let { id: e, strokes: n, opt: r, truth: a } = t.data;
    try {
      let onPartial = (v) => self.postMessage({ id: e, result: ke(v, a), partial: !0 });
      self.postMessage({ id: e, result: ne(n, { ...r, onPartial }, a) });
    } catch (o) {
      self.postMessage({ id: e, error: String((o && o.stack) || o) });
    }
  };
})();
