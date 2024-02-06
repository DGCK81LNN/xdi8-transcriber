const fsPromises = require("fs/promises")
const { build } = require("esbuild")
const { umdWrapper } = require("esbuild-plugin-umd-wrapper")
const path = require("path")

process.cwd(path.resolve(path.dirname(process.argv[1]), ".."))

async function main() {
  await build({
    entryPoints: ["src/index.ts"],
    format: "cjs",
    bundle: true,
    outfile: "lib/index.js",
    logLevel: "info",
    globalName: "xdi8Transcriber",
    plugins: [
      umdWrapper({
        libraryName: "xdi8Transcriber",
      }),
    ],
  })

  await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    bundle: true,
    outfile: "lib/index.mjs",
    logLevel: "info",
  })

  // copy data to lib
  await Promise.all([
    fsPromises.copyFile("src/data.json", "lib/data.json"),
    fsPromises.copyFile("src/data.json.d.ts", "lib/data.json.d.ts"),
  ])
}

main()
