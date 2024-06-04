const { readFile, writeFile } = require("fs/promises")
const { resolve: pr } = require("path")

async function main() {
  const dictPath = pr(__dirname, "../data/dict.tsv")

  const tsv = await readFile(dictPath, "utf-8")
  const dict = tsv.trimEnd().split("\n").map(l => l.split("\t"))

  const tonggui = await readFile(pr(__dirname, "../data/通规.txt"), "utf-8")

  /** @type {Record<string, { h: string, n: string, hh: string, xh: string, line: number, preferred: boolean }[]>} */
  const record = {}
  dict.forEach(([h, x, n, hh, xh], line) => {
    if (h.startsWith(";") || (hh === "-" && xh === "-")) return
    if (xh && xh !== "-")
      throw new Error(`Invalid xh ${JSON.stringify(xh)} on line ${line}`)
    if (!record[x]) {
      record[x] = []
    }
    record[x].push({ h, n, hh, xh, line })
  })

  for (const [x, entries] of Object.entries(record)) {
    if (entries.length < 2) continue
    let noXhN = 0
    for (const e of entries) if (!e.xh) noXhN += 1
    if (noXhN === 1) continue
    for (const e of entries) {
      let preferred = tonggui.includes(e.h)
      e.preferred = preferred
    }
    if (!entries.every(e => !e.preferred))
      for (const e of entries) if (!e.preferred) dict[e.line][4] = "-"
    console.log(
      x +
        "\t" +
        entries
          .map(e => `${e.preferred ? "\x1b[32m" : "\x1b[31m"}${e.h}\x1b[m`)
          .join(" ")
    )
  }

  await writeFile(dictPath, dict.map(l => l.join("\t")).join("\n") + "\n")
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
