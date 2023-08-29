import * as fs from "node:fs"

const versions = []

for (const name of fs.readdirSync(".")) {
  if (name.match(/^\d{6}\.tsv$/)) versions.push(name.slice(0, 6))
}
versions.sort()

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

const entries = Object.entries(table)
/** @type {Map<Record<string, string[]>, number>} */
const m = new Map()
for (const [, xs] of entries) {
  m.set(
    xs,
    new Set(
      Object.values(xs)
        .sort()
        .map(xa => xa.join(","))
    ).size
  )
}

entries.sort(([ha, a], [hb, b]) => m.get(b) - m.get(a))

process.stdout.write(`x\tn\t${versions.join("\t")}\n`)
for (const [h, xs] of entries) {
  process.stdout.write(
    `${h}\t${m.get(xs)}\t${versions
      .map(v => (xs[v] || ["-"]).join(","))
      .join("\t")}\n`
  )
}
