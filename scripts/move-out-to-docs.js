// scripts/move-out-to-docs.js
const fs = require("fs");
const path = require("path");
const fse = require("fs-extra");

const outDir = path.join(__dirname, "../out");
const docsDir = path.join(__dirname, "../docs");

if (fs.existsSync(docsDir)) {
  fs.rmSync(docsDir, { recursive: true });
}

fse.copySync(outDir, docsDir);
fs.writeFileSync(path.join(docsDir, ".nojekyll"), "");

console.log("✔ Moved /out to /docs and added .nojekyll");