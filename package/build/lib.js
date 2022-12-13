const { buildSync } = require("esbuild")
const path = require("path")

process.cwd(path.resolve(path.dirname(process.argv[1]), ".."))

buildSync({
  entryPoints: ["src/index.ts"],
  format: "cjs",
  bundle: true,
  outfile: "lib/index.js",
  logLevel: "info",
})
