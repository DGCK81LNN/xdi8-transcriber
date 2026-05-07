const { readFile, writeFile } = require("fs/promises")
const { resolve: pr } = require("path")

const unihanCache = Object.create(null)
async function unihanLookup(file, cp, prop) {
  const props = Array.isArray(prop) ? prop : [prop]

  if (typeof cp === "string") {
    const cp0 = cp.codePointAt(0)
    if (cp.length === 1 + +(cp0 > 0xffff)) cp = cp0
    else if (!cp.startsWith("U+")) cp = "U+" + cp
  }
  if (typeof cp === "number") cp = "U+" + cp.toString(16).padStart(4, "0")
  cp = cp.toUpperCase()

  const fileUpper = file.toUpperCase()
  const data = unihanCache[fileUpper] = await (
    unihanCache[fileUpper] ??= readFile(pr(__dirname, `../data/Unihan/Unihan_${file}.txt`), "utf-8")
  )

  const re = new RegExp(String.raw`^${RegExp.escape(cp)}\t(${props.map(RegExp.escape).join("|")})\t(.+)`, "gm")
  const matches = data.matchAll(re)
  if (Array.isArray(prop)) {
    const dict = {}
    for (const [, prop, value] of matches) dict[prop] = value
    return dict
  } else {
    return matches.next().value?.[2]
  }
}
async function getSimplifiedVariant(char) {
  char = char.codePointAt(0)
  const variants = await unihanLookup("Variants", char, "kSimplifiedVariant")
  if (!variants) return
  const v = variants.split(" ").find(v => !v.includes("<"))
  if (!v) return
  const cp = parseInt(v.slice(2), 16)
  if (cp !== char) return String.fromCodePoint(cp)
}

async function main() {
  const dictPath = pr(__dirname, "../data/dict.tsv")

  const tsv = await readFile(dictPath, "utf-8")
  const dict = tsv.trimEnd().split("\n").map(l => l.split("\t"))

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
    if (entries.every(e => e.xh === "-")) {
      entries.forEach(e => dict[e.line][4] = "")
      if (entries.length === 1) {
        console.log(x + "\t" + entries[0].h)
        continue
      }
    } else if (entries.length === 1) continue

    let noXhN = 0
    for (const e of entries) if (!e.xh) noXhN += 1
    if (noXhN === 1) continue

    for (const e of entries) {
      const simplified = await getSimplifiedVariant(e.h)
      let preferred = !(simplified && entries.some(e2 => e2.h === simplified))
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
