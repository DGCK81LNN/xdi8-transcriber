import { expect } from "earl"
import { range, sampleSize } from "lodash"
import {
  PropTrie,
  bisectLookUp,
  compare,
  escapeRegExp,
  getPropComparer,
  hhMatches,
  multiSubst,
  reverseCompare,
} from "../src/utils"

describe("utils", function () {
  describe("compare", function () {
    it("compares two values", function () {
      expect(["a", "8", "B"].sort(compare)).toEqual(["8", "B", "a"])
      expect(compare("a", "a")).toEqual(0)
    })
  })

  describe("reverseCompare", function () {
    it("reverse compares two values", function () {
      expect(["a", "8", "B"].sort(reverseCompare)).toEqual(["a", "B", "8"])
      expect(reverseCompare("a", "a")).toEqual(0)
    })
  })

  describe("getPropComparer", function () {
    it("compares two objects by a specific prop", function () {
      const objs = [
        { p: "a", q: "y" },
        { p: "8", q: "y" },
        { p: "B", q: "z" },
      ]
      const expected = [objs[1], objs[2], objs[0]]
      expect(objs.slice().sort(getPropComparer("p"))).toEqual(expected)
      expect(getPropComparer("q")(objs[0], objs[0])).toEqual(0)
    })
  })

  describe("multiSubst", function () {
    it("performs substitutions greedily", function () {
      expect(multiSubst("aaaaa", { a: "1", aaa: "2" })).toEqual("211")
    })
  })

  describe("bisectLookUp", function () {
    it("finds all objects in the dict with matchng prop", function () {
      const objs: { key: string }[] = []
      const lens: Record<string, number> = {}
      for (let i = 0; i < 100; ++i) {
        const key = String(i)
        lens[key] = Math.random() >= 0.2 ? 1 : Math.random() >= 0.2 ? 2 : 3
        for (let i = 0; i < lens[key]; i++) objs.push({ key })
      }
      objs.sort(getPropComparer("key"))
      for (const num of sampleSize(range(100), 10)) {
        const key = String(num)
        expect(bisectLookUp(objs, "key", key)).toHaveLength(lens[key])
      }
    })
  })

  describe("hhMatches", function () {
    it("checks if a specific char in text matches the hanzi hint", function () {
      expect(hhMatches("谷物", 0, "谷", "~物 稻~ 五~")).toEqual(true)
      expect(hhMatches("稻谷", 1, "谷", "~物 稻~ 五~")).toEqual(true)
      expect(hhMatches("谷底", 0, "谷", "~物 稻~ 五~")).toEqual(false)
      expect(hhMatches("山谷", 1, "谷", "~物 稻~ 五~")).toEqual(false)
      // reduplication
      expect(hhMatches("浩浩汤汤", 2, "汤", "浩浩~~")).toEqual(true)
      expect(hhMatches("浩浩汤汤", 3, "汤", "浩浩~~")).toEqual(true)
      // non-BMP characters
      const a = "\u{1fffe}"
      const b = "\u{1ffff}"
      const c = "\u{2fffe}"
      expect(hhMatches(`${a}${b}`, 0, a, `~${b}`)).toEqual(true)
      expect(hhMatches(`${a}${b}`, 2, b, `${a}~`)).toEqual(true)
      expect(hhMatches(`${a}${c}`, 0, a, `~${b}`)).toEqual(false)
      expect(hhMatches(`${c}${b}`, 2, b, `${a}~`)).toEqual(false)
    })
  })

  describe("escapeRegExp", function () {
    it("escapes special chars for regexp", function () {
      const s = "|\\{}()[]^$+*?.-"
      expect(new RegExp(`^${escapeRegExp(s)}$`).test(s)).toEqual(true)
    })
  })

  describe("PropTrie", function () {
    it("finds all objects in the trie with matchng prop", function () {
      const objs: { key: string }[] = []
      for (let i = 0; i < 100; ++i) {
        const key = String(i)
        objs.push({ key })
      }
      const trie = new PropTrie(objs, "key")
      expect([...trie.search("001")]).toEqual([{ key: "0" }])
      expect([...trie.search("123")]).toEqual([{ key: "12" }, { key: "1" }])
    })
  })
})
