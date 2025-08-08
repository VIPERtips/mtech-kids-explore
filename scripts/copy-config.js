const fs = require("fs");
const path = require("path");

const from = path.resolve(__dirname, "../config.json");
const to = path.resolve(__dirname, "../dist/config.json");

fs.copyFileSync(from, to);

console.log("✔️  config.json copied to dist/");
