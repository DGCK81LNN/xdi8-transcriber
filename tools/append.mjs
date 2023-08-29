import * as fs from "node:fs"

const versions = []
for (const name of fs.readdirSync(".")) {
  if (name.match(/^\d{6}\.tsv$/)) versions.push(name.slice(0, 6))
}
versions.sort()
/** @type {string} */
const latest = versions.at(-1)

/** @type {Record<string, Record<string, string[]>>} */
const table = []
for (const version of versions) {
  const tsv = fs
    .readFileSync(`${version}.tsv`)
    .toString()
    .replace(/\r/g, "")
    .replace(/\n$/, "")
  for (const line of tsv.split("\n")) {
    const [h, x] = line.split("\t")
    if (!table[h]) table[h] = {}
    if (!table[h][version]) table[h][version] = []
    table[h][version].push(x)
  }
}

/** @type {Record<string, { x: string, n: string, hh: string, xh: string }[]>} */
const dictTable = {}
const dictTsv = fs.readFileSync(process.argv[2]).toString()
for (const line of dictTsv.replace(/\r/g, "").replace(/\n$/, "").split("\n")) {
  if (line[0] === ";") continue
  const [h, x, n, hh, xh] = line.split("\t")
  if (!dictTable[h]) dictTable[h] = []
  dictTable[h].push({ x, n, hh, xh })
}

const entries = Object.entries(table)
for (const [h, xs] of entries) {
  for (const x of new Set(Object.values(xs).reverse().flat(1))) {
    if (!dictTable[h]) dictTable[h] = []
    if (!dictTable[h].some(e => e.x === x)) dictTable[h].push({ x })
  }
  for (const e of dictTable[h]) {
    const { x } = e
    if (table[h][latest] && !table[h][latest].includes(x)) {
      if (e.hh && e.hh !== "-")
        console.warn(`Removing hanzi hint for entry ${h} — ${x}, was: ${e.hh}`)
      e.hh = "-"
      e.n = (e.n || "") + (e.n ? "，" : "") + "旧拼写"
    }
  }
  dictTable[h].sort(
    (a, b) => (a.n?.includes("旧拼写") || 0) - (b.n?.includes("旧拼写") || 0)
  )
}

const f = fs.openSync(process.argv[2], "w")
fs.writeSync(f, ";汉字\t;希顶\t备注\t汉希提示\t希汉提示\n")
for (const [h, val] of Object.entries(dictTable)) {
  for (const e of val) {
    fs.writeSync(f, `${[h, e.x, e.n, e.hh, e.xh].join("\t")}\n`)
  }
}
fs.closeSync(f)
