/// <reference types="node" />

const fs = require("fs")
const path = require("path")
const readline = require("readline")

const dir = path.dirname(process.argv[1])
function pr(p) {
  return path.resolve(dir, p)
}

const startTime = Date.now()
const outStream = fs.createWriteStream(pr("../src/data.json"))

const convertPromise = new Promise(resolve => {
  const inStream = fs.createReadStream(pr("../../data/dict.tsv"))
  const rl = readline.createInterface({
    input: inStream,
    terminal: false,
  })

  let paused = false
  function print(str) {
    const queuing = !outStream.write(str)
    if (queuing && !paused) {
      inStream.pause()
      paused = true
    }
  }
  outStream.on("drain", () => {
    inStream.resume()
    paused = false
  })

  print('{"dict":[')

  let first = true
  rl.on("line", line => {
    let [h, x, n, hh, xh] = line.split("\t")
    if (h[0] === ";") return
    n = n || undefined
    hh = hh || undefined
    xh = xh || undefined
    print((first ? "" : ",") + JSON.stringify({ h, x, n, hh, xh }))
    first = false
  })

  rl.on("close", () => {
    print("],")
    resolve()
  })
})

const miscPromise = fs.promises.readFile(pr("../../data/misc.json")).then(b => {
  return JSON.stringify(JSON.parse(b.toString()))
})

Promise.all([convertPromise, miscPromise])
  .then(([, miscData]) => {
    outStream.write(miscData.slice(1))

    if (outStream.writableNeedDrain)
      return new Promise(res => outStream.once("drain", () => res()))
  })
  .then(() => {
    outStream.close()
    const kb = (outStream.bytesWritten / 1024).toFixed(1)
    const ms = (Date.now() - startTime).toFixed(0)
    process.stderr.write(`src/data.json ${kb}kb\ndone in ${ms}ms\n`)
  })
