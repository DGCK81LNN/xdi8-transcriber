#!/usr/bin/env node
const fs = require("fs")
const { pinyin } = require("pinyin-pro")
const readline = require("readline")

const [, , fileName, search, exclude] = process.argv
const rl = readline.createInterface({
  input: fs.createReadStream(fileName),
  terminal: false,
})

/** @type {[string, number, string][]} */
let data = []

rl.on("line", line => {
  const [word, num] = line.split(" ")
  if (!word.includes(search)) return
  const info = pinyin(word, { type: "all", toneType: "num" })

  const syllable =
    info.find(({ origin, pinyin }) => origin === search && pinyin !== exclude)
  if (!syllable) return
  data.push([
    syllable.pinyin,
    word,
    +num,
  ])
})

rl.on("close", () => {
  data.sort(([, , a], [, , b]) => b - a)
  data = data.filter(
    ([p, w], i) =>
      !data
        .slice(0, i)
        .some(([pp, ww]) => ww.length > 1 && pp === p && w.includes(ww))
  )
  console.log(`${data.length} result(s)`)
  fs.writeFileSync("#search-results.tsv", data.map(l => l.join("\t")).join("\n") + "\n")
})
