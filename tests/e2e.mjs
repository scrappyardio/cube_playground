// Браузерная проверка собранного index.html: node tests/e2e.mjs
// Рисует мышью, поворачивает лист, проверяет анализ, отмену, сохранение и запасной режим без Worker.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs";
import { makeCase } from "../bench/cases.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = path.resolve(new URL("..", import.meta.url).pathname);
const url = "file://" + path.join(root, "index.html");
const shots = process.env.SHOTS || "";
let failed = 0;
const ok = (cond, msg) => {
  console.log((cond ? "  ✓ " : "  ✗ ") + msg);
  if (!cond) failed++;
};

async function openPage(browser, { noWorker = false, viewport = { width: 1400, height: 900 }, storage } = {}) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => m.type() === "error" && !/fonts\.(googleapis|gstatic)/.test(m.text()) && errors.push("console: " + m.text()));
  page.on("requestfailed", () => {}); // шрифты офлайн не грузятся — это нормально
  if (noWorker) await page.addInitScript(() => { delete window.Worker; });
  await page.goto(url);
  // стартовое состояние записываем один раз и перезагружаем страницу
  if (storage !== undefined) {
    await page.evaluate((s) => { localStorage.clear(); s && localStorage.setItem("perspective-checker.v1", s); }, storage);
    await page.reload();
  }
  await page.waitForFunction(() => window.perspectiveChecker);
  return { ctx, page, errors };
}

const status = (page) => page.locator("#status").textContent();
async function waitAnalysis(page) {
  await page.waitForFunction(() => !window.perspectiveChecker.state.busy && !window.perspectiveChecker.state.stale, null, { timeout: 30000 });
}
// Рисует штрих мышью по точкам листа (через текущее преобразование вида).
async function drawStroke(page, pts) {
  const box = await page.locator("#cv").boundingBox();
  const scr = await page.evaluate((pts) => pts.map((p) => window.perspectiveChecker.toS(p)), pts);
  await page.mouse.move(box.x + scr[0][0], box.y + scr[0][1]);
  await page.mouse.down();
  for (let i = 1; i < scr.length; i++) await page.mouse.move(box.x + scr[i][0], box.y + scr[i][1]);
  await page.mouse.up();
}

const browser = await chromium.launch();
try {
  // 1. Пример и начальная загрузка
  console.log("Загрузка и пример");
  let { ctx, page, errors } = await openPage(browser, { storage: "" });
  await page.click("#exampleBtn");
  await waitAnalysis(page);
  ok(/1 коробка/.test(await status(page)), "пример разобран: " + (await status(page)));
  ok((await page.locator(".issue").count()) > 0, "в примере найдены ошибки");
  if (shots) await page.screenshot({ path: path.join(shots, "1-example.png") });

  // 2. Рисуем правильный куб мышью
  console.log("Рисование куба мышью");
  await page.click("#clear");
  const c = makeCase("ok_cube", 3);
  for (const s of c.strokes) await drawStroke(page, s.pts.filter((_, i, a) => i % 2 === 0 || i === a.length - 1));
  await waitAnalysis(page);
  const rep = await page.locator("#report").innerText();
  const score = await page.evaluate(() => window.perspectiveChecker.state.result?.boxes[0]?.diag.score?.total);
  ok(score >= 90, `правильный куб: балл ${score}`);
  ok(!/грубо|ошибка/i.test(await page.locator(".issues .sevtag").allInnerTexts().then((a) => a.join(" "))), "у правильного куба нет ошибок");
  ok(/Сходимость/.test(rep), "отчёт показан");

  // 3. Поворот листа
  console.log("Поворот листа");
  const before = await page.evaluate(() => ({ v: { ...window.perspectiveChecker.state.view }, n: window.perspectiveChecker.state.strokes.length }));
  const center = await page.evaluate(() => { const r = document.getElementById("cv").getBoundingClientRect(); return [r.width / 2, r.height / 2]; });
  const pageAtCenter0 = await page.evaluate((c) => { const v = window.perspectiveChecker.state.view, a = -v.a; const x = (c[0] - v.ox) / v.s, y = (c[1] - v.oy) / v.s; return [Math.cos(a) * x - Math.sin(a) * y, Math.sin(a) * x + Math.cos(a) * y]; }, center);
  await page.keyboard.press("r");
  await page.waitForTimeout(400);
  let st = await page.evaluate(() => ({ a: window.perspectiveChecker.state.view.a, rot: window.perspectiveChecker.state.rot, s: window.perspectiveChecker.state.view.s }));
  ok(Math.abs(st.a - Math.PI / 2) < 1e-9 && st.rot === 1, `R поворачивает на 90° (угол ${(st.a * 180 / Math.PI).toFixed(1)}°)`);
  ok(Math.abs(st.s - before.v.s) < 1e-9, "масштаб при повороте не меняется");
  const scrOfCenterPage = await page.evaluate((p) => window.perspectiveChecker.toS(p), pageAtCenter0);
  ok(Math.hypot(scrOfCenterPage[0] - center[0], scrOfCenterPage[1] - center[1]) < 0.5, "поворот вокруг центра экрана");
  ok((await page.locator("#rotLabel").textContent()) === "90°", "на кнопке видно 90°");
  // Направление: точка правее центра листа после поворота по часовой оказывается ниже центра экрана
  const dir = await page.evaluate((p) => { const a = window.perspectiveChecker.toS(p), b = window.perspectiveChecker.toS([p[0] + 100, p[1]]); return [b[0] - a[0], b[1] - a[1]]; }, pageAtCenter0);
  ok(Math.abs(dir[0]) < 1e-6 && dir[1] > 0, "поворот по часовой стрелке");
  // Разбор не зависит от поворота вида
  ok((await page.evaluate(() => window.perspectiveChecker.state.result?.boxes[0]?.diag.score?.total)) === score, "оценка после поворота та же");
  if (shots) await page.screenshot({ path: path.join(shots, "2-rotated-90.png") });

  // 4. Рисуем после поворота: экранные точки должны попасть в правильные координаты листа
  console.log("Рисование на повёрнутом листе");
  const box = await page.locator("#cv").boundingBox();
  const A = [center[0] - 120, center[1] - 60], B = [center[0] + 80, center[1] + 90];
  await page.click("#toolLine");
  await page.mouse.move(box.x + A[0], box.y + A[1]);
  await page.mouse.down();
  await page.mouse.move(box.x + B[0], box.y + B[1], { steps: 8 });
  await page.mouse.up();
  const last = await page.evaluate(() => { const s = window.perspectiveChecker.state.strokes; return s[s.length - 1].pts; });
  const backA = await page.evaluate((p) => window.perspectiveChecker.toS(p), last[0]);
  const backB = await page.evaluate((p) => window.perspectiveChecker.toS(p), last[last.length - 1]);
  ok(Math.hypot(backA[0] - A[0], backA[1] - A[1]) < 0.6 && Math.hypot(backB[0] - B[0], backB[1] - B[1]) < 0.6, "линия на повёрнутом листе ложится точно под курсор");
  await page.keyboard.press("Control+z");
  await waitAnalysis(page);
  ok((await page.evaluate(() => window.perspectiveChecker.state.strokes.length)) === before.n, "отмена убирает линию");

  // 5. Ещё повороты, Shift+R, кнопка
  for (let i = 0; i < 3; i++) await page.keyboard.press("r");
  await page.waitForTimeout(400);
  st = await page.evaluate(() => ({ a: window.perspectiveChecker.state.view.a, rot: window.perspectiveChecker.state.rot }));
  ok(st.rot === 0 && Math.abs(Math.cos(st.a) - 1) < 1e-9, "4×R возвращает лист в исходное положение");
  ok((await page.locator("#rotLabel").textContent()) === "", "подпись угла пропала");
  await page.keyboard.press("Shift+R");
  await page.waitForTimeout(400);
  st = await page.evaluate(() => window.perspectiveChecker.state.rot);
  ok(st === 3, "Shift+R поворачивает против часовой (270°)");
  await page.click("#rotSheet");
  await page.waitForTimeout(400);
  ok((await page.evaluate(() => window.perspectiveChecker.state.rot)) === 0, "кнопка ↻ поворачивает лист");
  // поворот в русской раскладке (физическая клавиша R)
  await page.keyboard.press("KeyR");
  await page.waitForTimeout(400);
  ok((await page.evaluate(() => window.perspectiveChecker.state.rot)) === 1, "клавиша R работает по коду клавиши");

  // 6. Лучи теперь на T
  const rays0 = await page.evaluate(() => window.perspectiveChecker.state.layers.rays);
  await page.keyboard.press("t");
  ok((await page.evaluate(() => window.perspectiveChecker.state.layers.rays)) === !rays0, "T переключает лучи к точкам схода");
  await page.keyboard.press("t");

  // 7. «Вписать лист» на повёрнутом листе: лист целиком на экране
  await page.keyboard.press("f");
  await page.waitForTimeout(100);
  const fit = await page.evaluate(() => {
    const r = document.getElementById("cv").getBoundingClientRect();
    const cs = [[0, 0], [1600, 0], [1600, 1000], [0, 1000]].map((p) => window.perspectiveChecker.toS(p));
    return cs.every((q) => q[0] >= 0 && q[1] >= 0 && q[0] <= r.width && q[1] <= r.height);
  });
  ok(fit, "F вписывает повёрнутый лист в экран");
  if (shots) await page.screenshot({ path: path.join(shots, "3-rotated-fit.png") });

  // 8. Быстрое рисование: старые разборы отменяются, итог приходит
  console.log("Быстрые штрихи подряд");
  await page.click("#toolPen");
  for (let i = 0; i < 6; i++) await drawStroke(page, [[300 + i * 40, 200], [320 + i * 40, 600]]);
  await waitAnalysis(page);
  ok(/линий/.test(await status(page)), "после серии штрихов разбор пришёл: " + (await status(page)));
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();

  // 9. Поворот сохраняется после перезагрузки
  console.log("Сохранение");
  ({ ctx, page, errors } = await openPage(browser, { storage: JSON.stringify({ free: c.strokes.map((s) => ({ pts: s.pts, hidden: !!s.hidden })), target: "cube", layers: {}, rot: 1 }) }));
  await waitAnalysis(page);
  ok((await page.evaluate(() => window.perspectiveChecker.state.rot)) === 1, "поворот восстановлен после перезагрузки");
  ok((await page.evaluate(() => window.perspectiveChecker.state.result?.boxes[0]?.diag.score?.total)) >= 90, "рисунок восстановлен и разобран");
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();

  // 9б. Рисунок, где два ребра слились в линию: сначала предварительный ответ, потом уточнённый
  console.log("Повторный разбор слившихся рёбер");
  const c2 = makeCase("bad_corner_inner", 11);
  ({ ctx, page, errors } = await openPage(browser, { storage: JSON.stringify({ free: c2.strokes.map((s) => ({ pts: s.pts, hidden: !!s.hidden })), target: "cube", layers: {} }) }));
  const sawPartial = page.waitForFunction(() => /уточняю/.test(document.getElementById("status").textContent), null, { timeout: 15000 }).then(() => true, () => false);
  await waitAnalysis(page);
  ok(await sawPartial, "сначала показан предварительный разбор («уточняю…»)");
  const fin = await page.evaluate(() => { const r = window.perspectiveChecker.state.result; return { loose: r.loose.length, sev: Math.max(0, ...r.boxes[0].diag.issues.map((i) => i.sev)) }; });
  ok(fin.loose === 0 && fin.sev >= 2, `после уточнения все линии стали рёбрами, ошибка найдена (неразобрано ${fin.loose})`);
  ok(!/уточняю/.test(await status(page)), "итоговый статус без «уточняю»");
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();

  // 9в. Образец для срисовки: не влияет на проверку
  console.log("Образец для срисовки");
  ({ ctx, page, errors } = await openPage(browser, { storage: JSON.stringify({ free: c.strokes.map((s) => ({ pts: s.pts, hidden: !!s.hidden })), target: "cube", layers: {} }) }));
  await waitAnalysis(page);
  const res0 = await page.evaluate(() => { window.__res0 = window.perspectiveChecker.state.result; return window.perspectiveChecker.state.result.boxes[0].diag.score.total; });
  ok(await page.locator("#ref").isHidden(), "образец по умолчанию скрыт");
  await page.click("#refToggle");
  ok(await page.locator("#ref").isVisible(), "кнопка «Образец» показывает окошко");
  await page.fill("#refSeed", "42");
  await page.locator("#refSeed").press("Enter");
  const P42 = await page.evaluate(() => JSON.stringify(window.perspectiveChecker.refBox().P));
  const ink = await page.evaluate(() => { const cv = document.getElementById("refCv"), d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 3; i < d.length; i += 4) d[i] > 0 && n++; return n; });
  ok(ink > 300, `образец нарисован (${ink} пикс.)`);
  await page.click("#refNext");
  ok((await page.inputValue("#refSeed")) === "43", "▶ даёт следующий seed");
  const P43 = await page.evaluate(() => JSON.stringify(window.perspectiveChecker.refBox().P));
  ok(P43 !== P42, "другой seed — другой куб");
  await page.click("#refPrev");
  ok((await page.evaluate(() => JSON.stringify(window.perspectiveChecker.refBox().P))) === P42, "тот же seed — тот же куб");
  await page.click("#refRand");
  ok(+(await page.inputValue("#refSeed")) >= 1, "🎲 даёт случайный seed");
  await page.fill("#refSeed", "42");
  await page.locator("#refSeed").press("Enter");
  await page.locator("#refSeed").focus();
  await page.keyboard.type("r");
  ok((await page.evaluate(() => window.perspectiveChecker.state.rot)) === 0, "буквы в поле seed не поворачивают лист");
  await page.click("#refCv");
  ok(await page.locator("#ref.big").isVisible(), "щелчок по образцу увеличивает его");
  await page.waitForTimeout(300);
  ok(await page.evaluate(() => window.perspectiveChecker.state.result === window.__res0 && !window.perspectiveChecker.state.busy), "смена образца не запускает и не меняет проверку");
  ok((await page.evaluate(() => window.perspectiveChecker.state.result.boxes[0].diag.score.total)) === res0, "оценка рисунка та же");
  await page.click("#tBox");
  await waitAnalysis(page);
  ok(/коробка/.test(await page.locator("#refKind").textContent()), "в режиме «Коробка» образец — коробка");
  const Pbox = await page.evaluate(() => window.perspectiveChecker.refBox().D.map((x) => +x.toFixed(3)));
  ok(Pbox.some((x) => Math.abs(x - 1) > 0.05), "у образца-коробки не кубические пропорции: " + Pbox.join(", "));
  await page.click("#tCube");
  await waitAnalysis(page);
  if (shots) await page.screenshot({ path: path.join(shots, "6-reference.png") });
  await page.reload();
  await page.waitForFunction(() => window.perspectiveChecker);
  const afterReload = await page.evaluate(() => [JSON.stringify(window.perspectiveChecker.state.ref), localStorage.getItem("perspective-checker.v1")?.slice(-120)]);
  ok((await page.locator("#ref").isVisible()) && (await page.inputValue("#refSeed")) === "42", "образец и seed сохраняются после перезагрузки " + afterReload.join(" | "));
  ok((await page.evaluate(() => JSON.stringify(window.perspectiveChecker.refBox().P))) === P42, "после перезагрузки тот же куб");
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();

  // 9г. Мерка пропорций
  console.log("Мерка пропорций");
  const cp = makeCase("bad_props", 1);
  ({ ctx, page, errors } = await openPage(browser, { storage: JSON.stringify({ free: cp.strokes.map((s) => ({ pts: s.pts, hidden: !!s.hidden })), target: "cube", layers: {} }) }));
  await waitAnalysis(page);
  const gd = await page.evaluate(() => { const g = window.perspectiveChecker.state.result.boxes[0].diag.guide; return { show: g.show, off: g.edges.filter((e) => e.off).map((e) => g.fam[e.k]) }; });
  ok(gd.show && gd.off.length === 1 && gd.off[0] > 1.2, `вытянутый куб: мерка указывает одно вытянутое направление (×${gd.off.map((x) => x.toFixed(2)).join(", ")})`);
  ok((await page.locator(".faces .face").count()) === 3, "в отчёте три развёрнутые грани");
  ok(/длиннее нужного .* укороти/.test(await page.locator(".fix").innerText()), "в отчёте сказано, что укоротить: " + (await page.locator(".fix").innerText()).slice(0, 70));
  ok((await page.evaluate(() => window.perspectiveChecker.state.layers.guide)) === true, "мерка включена по умолчанию");
  const pix = async () => page.evaluate(() => { const cv = document.getElementById("cv"), d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) d[i + 1] > d[i] + 40 && d[i + 1] > d[i + 2] + 10 && n++; return n; });
  const green1 = await pix();
  await page.keyboard.press("g");
  await page.waitForTimeout(150);
  const green0 = await pix();
  ok(green1 > green0 + 50, `G убирает зелёные отметки с холста (${green1} → ${green0} пикс.)`);
  await page.keyboard.press("g");
  await page.keyboard.press("r");
  await page.waitForTimeout(400);
  ok((await pix()) > green0 + 50, "отметки видны и на повёрнутом листе");
  if (shots) await page.screenshot({ path: path.join(shots, "8-guide.png") });
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();
  ({ ctx, page, errors } = await openPage(browser, { storage: JSON.stringify({ free: c.strokes.map((s) => ({ pts: s.pts, hidden: !!s.hidden })), target: "cube", layers: {} }) }));
  await waitAnalysis(page);
  ok(!(await page.evaluate(() => window.perspectiveChecker.state.result.boxes[0].diag.guide.show)), "у правильного куба мерка ничего не показывает");
  ok(/одной длины/.test(await page.locator(".fix").innerText()), "в отчёте: все направления одной длины");
  // кнопка «Проверить пропорции»: отметки на рёбрах даже у правильного куба
  const gpx = async () => page.evaluate(() => { const cv = document.getElementById("cv"), d = cv.getContext("2d").getImageData(0, 0, cv.width, cv.height).data; let n = 0; for (let i = 0; i < d.length; i += 4) d[i + 1] > d[i] + 40 && d[i + 1] > d[i + 2] + 10 && n++; return n; });
  const greenBefore = await gpx();
  await page.click("#propBtn");
  await page.waitForTimeout(150);
  const marks = await page.evaluate(() => window.perspectiveChecker.state.result.boxes[0].diag.guide.edges.filter((e) => e.have).length);
  ok((await page.locator("#propBtn").getAttribute("aria-pressed")) === "true" && (await gpx()) > greenBefore + 50 && marks === 3, `«Проверить пропорции» показывает отметки на трёх рёбрах (${marks})`);
  await page.click("#ansBtn");
  ok((await page.evaluate(() => window.perspectiveChecker.state.layers.answer)) && (await page.locator("#lAnswer").getAttribute("aria-pressed")) === "true", "«Правильный куб» — отдельная кнопка, связана со слоем");
  await page.click("#tBox");
  ok(await page.locator("#propBtn").isDisabled(), "в режиме «Коробка» проверка пропорций недоступна");
  await ctx.close();

  // 9д. Режим «по грани»: пока куб не дорисован, оценки нет (раньше было 100 за каждую линию)
  console.log("Режим «Достроить по грани»");
  ({ ctx, page, errors } = await openPage(browser, { storage: "" }));
  await page.click("#mFace");
  await page.waitForTimeout(300);
  const fv = await page.evaluate(() => { const f = window.perspectiveChecker.state.face; return { P: f.B.P, labels: f.labels }; });
  const other = [0, 1, 2, 3, 4, 5, 6, 7].find((k) => !fv.labels.includes(k) && fv.labels.some((l) => [1, 2, 4].includes(l ^ k)));
  const from = fv.labels.find((l) => [1, 2, 4].includes(l ^ other));
  await page.click("#toolLine");
  await drawStroke(page, [fv.P[from], fv.P[other]]);
  await waitAnalysis(page);
  const rep1 = await page.locator("#report").innerText();
  ok(/Дорисуй куб/i.test(rep1) && !/Почти точно|ошибка/i.test(rep1), "после одной линии — «Дорисуй куб», а не 100: " + rep1.slice(0, 160).replace(/\n/g, " / "));
  // дорисовываем остальные рёбра точно по ответу — оценка высокая
  const key = (a, b) => [a, b].sort().join("-");
  const gset = new Set(fv.labels.map((l, i) => key(l, fv.labels[(i + 1) % 4])));
  for (let a = 0; a < 8; a++) for (const d of [1, 2, 4]) { const b = a ^ d; if (a < b && !gset.has(key(a, b)) && !(a === from && b === other) && !(b === from && a === other)) await drawStroke(page, [fv.P[a], fv.P[b]]); }
  await waitAnalysis(page);
  const rep2 = await page.locator("#report").innerText();
  const ring = await page.locator(".scorecard .ring text").textContent();
  ok(+ring >= 90, `точно дорисованный куб: ${ring} баллов`);
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();

  // 9е. Журнал прогресса и «Пересчитать с нуля»
  console.log("Журнал прогресса");
  ({ ctx, page, errors } = await openPage(browser, { storage: JSON.stringify({ free: c.strokes.map((s) => ({ pts: s.pts, hidden: !!s.hidden })), target: "cube", layers: {} }) }));
  await waitAnalysis(page);
  ok(await page.locator("#saveJ").isEnabled(), "кнопка «В журнал» доступна после разбора");
  await page.click("#saveJ");
  await page.waitForFunction(() => /Сохранено/.test(document.getElementById("jNote").textContent));
  ok((await page.locator("#saveJ").textContent()) === "Уже в журнале" && (await page.locator("#saveJ").isDisabled()), "повторно тот же рисунок не сохраняется");
  ok((await page.locator("#jCount").textContent()) === "1", "счётчик журнала: 1");
  await page.click("#journalBtn");
  ok((await page.locator(".jcard").count()) === 1, "в журнале одна запись");
  const th = await page.evaluate(() => { const sv = document.querySelector(".jthumb svg"); return { pl: sv.querySelectorAll("polyline").length, ln: sv.querySelectorAll("line").length }; });
  ok(th.pl === c.strokes.length && th.ln === 12, `миниатюра: рисунок (${th.pl} штрихов) и правильный куб (${th.ln} рёбер)`);
  ok(/Последние 1: средний балл 1\d\d|Последние 1: средний балл \d\d/.test(await page.locator("#jStats").innerText()), "статистика показана: " + (await page.locator("#jStats").innerText()).split("\n")[0]);
  await page.keyboard.press("r");
  ok((await page.evaluate(() => window.perspectiveChecker.state.rot)) === 0, "клавиши рисования не срабатывают, пока открыт журнал");
  await page.uncheck("#jAnswer");
  ok((await page.evaluate(() => document.querySelector(".jthumb svg").querySelectorAll("line").length)) === 0, "правильный куб на миниатюре можно скрыть");
  await page.check("#jAnswer");
  // экспорт
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#jExport")]);
  const exported = JSON.parse(fs.readFileSync(await dl.path(), "utf8"));
  ok(exported.entries.length === 1 && exported.entries[0].s.length === c.strokes.length && typeof exported.entries[0].score === "number", "журнал скачивается файлом JSON");
  // импорт: та же запись (дубликат) + новая
  const extra = { ...exported.entries[0], id: "jimported-1", t: exported.entries[0].t - 86400000, score: 64, grade: "неплохо" };
  const tmp = path.join(shots || "/tmp", "journal-import.json");
  fs.writeFileSync(tmp, JSON.stringify({ entries: [exported.entries[0], extra] }));
  await page.setInputFiles("#jImport", tmp);
  await page.waitForFunction(() => document.querySelectorAll(".jcard").length === 2);
  ok(/добавлено записей: 1/.test(await page.locator("#jNote").textContent()), "импорт добавил только новую запись");
  await page.click("#jClose");
  // перезагрузка: журнал на месте
  await page.reload();
  await waitAnalysis(page);
  ok((await page.locator("#jCount").textContent()) === "2", "журнал сохраняется после перезагрузки");
  // рисуем ещё штрих — снова можно сохранить; потом возвращаем сохранённый рисунок на лист
  await page.click("#toolLine");
  await drawStroke(page, [[300, 150], [380, 150]]);
  await waitAnalysis(page);
  ok(await page.locator("#saveJ").isEnabled(), "после изменения рисунка снова можно сохранить");
  await page.click("#journalBtn");
  await page.locator('.jcard button[data-act="load"]').first().click();
  await waitAnalysis(page);
  ok((await page.evaluate(() => window.perspectiveChecker.state.strokes.length)) === exported.entries[0].s.length, "«На лист» возвращает сохранённый рисунок");
  // удаление в два нажатия
  await page.click("#journalBtn");
  const del = page.locator(".jcard button.del").last();
  await del.click();
  ok((await page.locator(".jcard").count()) === 2 && /Точно/.test(await del.textContent()), "первое нажатие «Удалить» только спрашивает");
  await del.click();
  await page.waitForFunction(() => document.querySelectorAll(".jcard").length === 1);
  ok((await page.locator("#jCount").textContent()) === "1", "второе нажатие удаляет запись");
  if (shots) await page.screenshot({ path: path.join(shots, "9-journal.png") });
  await page.click("#jClose");
  // пересчитать с нуля
  const sc0 = await page.evaluate(() => window.perspectiveChecker.state.result.boxes[0].diag.score.total);
  await page.click("#recalc");
  await waitAnalysis(page);
  ok(/пересчитано с нуля/.test(await status(page)), "«Пересчитать с нуля» разбирает заново: " + (await status(page)));
  ok((await page.evaluate(() => window.perspectiveChecker.state.result.boxes[0].diag.score.total)) === sc0, "у правильного куба оценка после пересчёта та же");
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();

  // 10. Без Web Worker анализ идёт в основном потоке тем же кодом
  console.log("Запасной режим без Worker");
  ({ ctx, page, errors } = await openPage(browser, { noWorker: true, storage: "" }));
  await page.click("#exampleBtn");
  await waitAnalysis(page);
  ok(/1 коробка/.test(await status(page)), "пример разобран без Worker: " + (await status(page)));
  ok(errors.length === 0, "ошибок в консоли нет" + (errors.length ? ": " + errors.join(" | ") : ""));
  await ctx.close();

  // 11. Узкий экран (телефон) и режим «Достроить по грани»
  console.log("Телефон и режим грани");
  ({ ctx, page, errors } = await openPage(browser, { viewport: { width: 390, height: 844 }, storage: "" }));
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  ok(sw <= 390, `нет горизонтальной прокрутки (ширина ${sw})`);
  await page.click("#refToggle");
  const sw2 = await page.evaluate(() => document.documentElement.scrollWidth);
  ok(sw2 <= 390 && (await page.locator("#ref").isVisible()), `образец на телефоне без прокрутки вбок (ширина ${sw2})`);
  if (shots) await page.screenshot({ path: path.join(shots, "7-phone-ref.png") });
  await page.click("#mFace");
  await page.waitForTimeout(300);
  await page.keyboard.press("r");
  await page.click("#hintBtn");
  await page.click("#hintBtn");
  await page.waitForTimeout(400);
  ok(errors.length === 0, "режим грани с поворотом без ошибок" + (errors.length ? ": " + errors.join(" | ") : ""));
  if (shots) await page.screenshot({ path: path.join(shots, "4-phone-face.png") });
  await ctx.close();
} finally {
  await browser.close();
}
console.log(failed ? `\nПРОВАЛЕНО: ${failed}` : "\nВсе проверки пройдены");
process.exitCode = failed ? 1 : 0;
