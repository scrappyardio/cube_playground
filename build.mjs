// Собирает index.html: вставляет src/worker.js и src/app.js в src/shell.html.
import fs from "node:fs";
const shell = fs.readFileSync("src/shell.html", "utf8");
const worker = fs.readFileSync("src/worker.js", "utf8");
const app = fs.readFileSync("src/app.js", "utf8");
const esc = (s) => s.replace(/<\/script/gi, "<\\/script");
const out = shell
  .replace("<!--WORKER-->", () => `<script type="text/js-worker" id="worker-src">${esc(worker)}</script>`)
  .replace("<!--APP-->", () => `<script>${esc(app)}</script>`);
fs.writeFileSync("index.html", out);
// Версия для публикации артефактом: без обёртки документа (её добавляет сервис публикации).
const body = out.slice(out.indexOf("<body>") + 6, out.lastIndexOf("</body>"));
fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/artifact.html", body.trim() + "\n");
console.log(`index.html: ${(out.length / 1024).toFixed(1)} KB`);
