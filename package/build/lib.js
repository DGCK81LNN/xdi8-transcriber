const fsPromises = require("fs/promises")
const { build } = require("esbuild")
const path = require("path")

process.cwd(path.resolve(path.dirname(process.argv[1]), ".."))

async function main() {
  await build({
    entryPoints: ["src/index.ts"],
    format: "cjs",
    bundle: true,
    outfile: "lib/index.js",
    logLevel: "info",
    external: ["*.json"],
  })

  await build({
    entryPoints: ["src/index.ts"],
    format: "esm",
    bundle: true,
    outfile: "lib/index.mjs",
    logLevel: "info",
    external: ["*.json"],
    plugins: [
      // add import attributes to json imports for ESM build
      // adding this in the TypeScript source broke the site build, so we add it here instead
      {
        name: "json-import-attributes",
        setup(build) {
          build.onLoad({ filter: /\.ts$/ }, async args => {
            const source = await fsPromises.readFile(args.path, "utf8")
            const contents = source.replace(
              /^import \w+ from (['"])[^'"]+\.json\1(?=;?$)/gm,
              s => s + ' with { type: "json" }',
            )
            return {
              contents,
              loader: "ts",
            }
          })
        },
      },
    ],
  })

  await build({
    entryPoints: ["src/index.ts"],
    format: "iife",
    bundle: true,
    minify: true,
    charset: "utf8",
    outfile: "dist/index.min.js",
    logLevel: "info",
    globalName: "xdi8Transcriber",
  })

  // copy data to lib
  await Promise.all([
    fsPromises.copyFile("src/data.json", "lib/data.json"),
    //fsPromises.copyFile("src/data.json.d.ts", "lib/data.json.d.ts"),
  ])
}

main()
