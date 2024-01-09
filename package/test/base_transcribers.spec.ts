import { expect } from "earl"
import {
  HanziToAlphaTranscriber,
  AlphaToHanziTranscriber,
} from "../src/base_transcribers"

const OW = expect.subset
const AO = expect.a(Object)

describe("base_transcribers", function () {
  describe("hanzi_to_alpha", function () {
    describe("HanziToAlphaTranscriber", function () {
      it("sorts the dict upon construction", function () {
        const u4e00 = { h: "一", x: "NV" }
        const u4e01 = { h: "丁", x: "di8" }
        const u4e03 = { h: "七", x: "Ni6H" }
        const u4e07 = { h: "万", x: "w2" }
        const u4e08 = { h: "丈", x: "FiT" }

        const t = new HanziToAlphaTranscriber({
          // sorted by x
          dict: [u4e08, u4e00, u4e03, u4e01, u4e07],
          subst: {},
        })
        expect(t.dict).toEqual([u4e00, u4e01, u4e03, u4e07, u4e08])
      })

      it("returns x as string when there is no ambiguity", function () {
        const t = new HanziToAlphaTranscriber({
          dict: [
            { h: "火", x: "ho" },
            { h: "灯", x: "xdi8" },
          ],
          subst: {},
        })
        expect(t.transcribe("灯火")).toEqual([
          OW({ h: "灯", x: "xdi8" }),
          OW({ h: "火", x: "ho" }),
        ])
      })

      it("handles ambiguity", function () {
        const t = new HanziToAlphaTranscriber({
          dict: [
            { h: "社", x: "utA" },
            { h: "区", x: "46H", n: "ou1" },
            { h: "区", x: "Fi6", n: "qu1" },
          ],
          subst: {},
        })
        expect(t.transcribe("社区")).toEqual([
          OW({ h: "社", x: "utA" }),
          [
            OW({ content: [OW({ h: "区", x: "46H" })] }),
            OW({ content: [OW({ h: "区", x: "Fi6" })] }),
          ],
        ])
      })

      it("reorders alternations according to hints", function () {
        const t = new HanziToAlphaTranscriber({
          dict: [
            { h: "Ａ", x: "111", n: "bottom", hh: "-" },
            { h: "Ａ", x: "222", n: "regular" },
            { h: "Ａ", x: "333", n: "conditional", hh: "Ａ~ Ｂ~ ~Ｄ" },
            { h: "Ｂ", x: "444" },
            { h: "Ｃ", x: "555" },
            { h: "Ｄ", x: "666" },
            { h: "Ｅ", x: "777" },
            { h: "Ｆ", x: "888", n: "reduplication", hh: "~~" },
            { h: "Ｆ", x: "999" },
          ],
          subst: {},
        })
        expect(t.transcribe("Ａ")).toEqual([
          [
            OW({ content: [OW({ h: "Ａ", x: "222" })] }),
            OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            OW({ content: [OW({ h: "Ａ", x: "111" })] }),
          ],
        ])
        expect(t.transcribe("ＡＡ")).toEqual([
          [
            OW({ content: [OW({ h: "Ａ", x: "222" })] }),
            OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            OW({ content: [OW({ h: "Ａ", x: "111" })] }),
          ],
          [
            OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            OW({ content: [OW({ h: "Ａ", x: "222" })] }),
            OW({ content: [OW({ h: "Ａ", x: "111" })] }),
          ],
        ])
        expect(t.transcribe("ＢＡ")).toEqual([
          OW({ h: "Ｂ", x: "444" }),
          [
            OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            OW({ content: [OW({ h: "Ａ", x: "222" })] }),
            OW({ content: [OW({ h: "Ａ", x: "111" })] }),
          ],
        ])
        expect(t.transcribe("ＣＡ")).toEqual([
          OW({ h: "Ｃ", x: "555" }),
          [
            OW({ content: [OW({ h: "Ａ", x: "222" })] }),
            OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            OW({ content: [OW({ h: "Ａ", x: "111" })] }),
          ],
        ])
        expect(t.transcribe("ＡＤ")).toEqual([
          [
            OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            OW({ content: [OW({ h: "Ａ", x: "222" })] }),
            OW({ content: [OW({ h: "Ａ", x: "111" })] }),
          ],
          OW({ h: "Ｄ", x: "666" }),
        ])
        expect(t.transcribe("ＡＥ")).toEqual([
          [
            OW({ content: [OW({ h: "Ａ", x: "222" })] }),
            OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            OW({ content: [OW({ h: "Ａ", x: "111" })] }),
          ],
          OW({ h: "Ｅ", x: "777" }),
        ])
        expect(t.transcribe("Ｆ")).toEqual([
          [
            OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
            OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
          ],
        ])
        expect(t.transcribe("ＦＦ")).toEqual([
          [
            OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
            OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
          ],
          [
            OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
            OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
          ],
        ])
        expect(t.transcribe("ＦＦＦ")).toEqual([
          [
            OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
            OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
          ],
          [
            OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
            OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
          ],
          [
            OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
            OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
          ],
        ])
      })

      it("performs substitution", function () {
        const t = new HanziToAlphaTranscriber({
          subst: { "纟火": "緂" },
          dict: [{ h: "緂", x: "aho" }],
        })
        expect(t.transcribe("纟火")).toEqual([OW({ h: "緂", x: "aho" })])
      })

      it("supports adding separators", function () {
        const t = new HanziToAlphaTranscriber({
          dict: [
            { h: "灯", x: "xdi8" },
            { h: "火", x: "ho" },
          ],
          subst: {},
        })
        expect(t.transcribe("灯火", { ziSeparator: "-" })).toEqual([
          OW({ h: "灯", x: "xdi8" }),
          OW({ v: "-" }),
          OW({ h: "火", x: "ho" }),
        ])
      })

      it("prevents words from running into other alphanumerics", function () {
        const t = new HanziToAlphaTranscriber({
          dict: [{ h: "灯", x: "xdi8" }],
          subst: {},
        })
        expect(t.transcribe("灯1灯A灯,灯")).toEqual([
          OW({ h: "灯", x: "xdi8" }),
          " 1 ",
          OW({ h: "灯", x: "xdi8" }),
          " A ",
          OW({ h: "灯", x: "xdi8" }),
          ",",
          OW({ h: "灯", x: "xdi8" }),
        ])
      })
    })
  })

  describe("alpha_to_hanzi", function () {
    describe("AlphaToHanziTranscriber", function () {
      it("sorts the dict and creates a trie upon construction", function () {
        const _14o = { h: "鄂", x: "14o" }
        const _24i3 = { h: "符", x: "24i3" }
        const _3zA = { h: "珠", x: "3zA" }
        const _AHL = { h: "好", x: "AHL" }
        const _Ba = { h: "瓜", x: "Ba" }
        const _DE = { h: "也", x: "DE" }
        const _afT = { h: "纺", x: "afT" }
        const _bY = { h: "白", x: "bY" }
        const _ccT = { h: "框", x: "ccT" }

        const t = new AlphaToHanziTranscriber({
          // sorted by h
          dict: [_DE, _AHL, _ccT, _3zA, _Ba, _bY, _24i3, _afT, _14o],
        })
        expect(t.dict).toEqual(
          /* prettier-ignore */ [
            _14o, _24i3, _3zA,
            _AHL, _Ba,   _DE,
            _afT, _bY,   _ccT,
          ]
        )

        expect(t.trie).toHaveSubset({ root: expect.a(Array) })
        expect(t.trie.root).toHaveSubset(
          /* prettier-ignore */ {
            _1: AO, _2: AO, _3: AO,
            _A: AO, _B: AO, _D: AO,
            _a: AO, _b: AO, _c: AO,
          }
        )
      })

      it("returns h as string when there is no ambiguity", function () {
        const t = new AlphaToHanziTranscriber({
          dict: [
            { h: "你", x: "Vnu8" },
            { h: "好", x: "AHL" },
          ],
        })
        expect(t.transcribe("Vnu8AHL")).toEqual([
          OW({ h: "你", x: "Vnu8" }),
          OW({ h: "好", x: "AHL" }),
        ])
      })

      it("handles ambiguity", function () {
        const t = new AlphaToHanziTranscriber({
          dict: [
            { h: "艾", x: "4Y" },
            { h: "玉", x: "FY" },
            { h: "青", x: "q8" },
            { h: "爱", x: "4YF" },
            { h: "情", x: "Yq8" },
          ],
        })
        expect(t.transcribe("4YFYq8")).toEqual([
          [
            OW({
              content: [OW({ h: "爱", x: "4YF" }), OW({ h: "情", x: "Yq8" })],
            }),
            OW({
              content: [
                OW({ h: "艾", x: "4Y" }),
                OW({ h: "玉", x: "FY" }),
                OW({ h: "青", x: "q8" }),
              ],
            }),
          ],
        ])
      })

      it("reorders alternations according to hints", function () {
        const t = new AlphaToHanziTranscriber({
          dict: [
            { h: "Ａ", x: "112" },
            { h: "Ｂ", x: "2233", xh: "-" },
            { h: "Ｃ", x: "11" },
            { h: "Ｄ", x: "22" },
            { h: "Ｅ", x: "222" },
            { h: "Ｆ", x: "33" },
          ],
        })
        expect(t.transcribe("1122233")).toEqual([
          [
            OW({
              content: [
                OW({ h: "Ａ", x: "112" }),
                OW({ h: "Ｄ", x: "22" }),
                OW({ h: "Ｆ", x: "33" }),
              ],
            }),
            OW({
              content: [
                OW({ h: "Ｃ", x: "11" }),
                OW({ h: "Ｅ", x: "222" }),
                OW({ h: "Ｆ", x: "33" }),
              ],
            }),
            OW({
              content: [OW({ h: "Ａ", x: "112" }), OW({ h: "Ｂ", x: "2233" })],
            }),
          ],
        ])
      })

      it('obeys the "same-hanzi rule" for reduplicates', function () {
        const t = new AlphaToHanziTranscriber({
          dict: [
            { h: "用", x: "y3" },
            { h: "心", x: "53" },
            { h: "蕊", x: "y353" },
          ],
        })
        expect(t.transcribe("y353y353")).toEqual([
          [
            OW({
              content: [OW({ h: "蕊", x: "y353" }), OW({ h: "蕊", x: "y353" })],
            }),
            OW({
              content: [
                OW({ h: "用", x: "y3" }),
                OW({ h: "心", x: "53" }),
                OW({ h: "用", x: "y3" }),
                OW({ h: "心", x: "53" }),
              ],
            }),
          ],
        ])
      })

      it("supports explicit separators", function () {
        const t = new AlphaToHanziTranscriber({
          dict: [
            { h: "灯", x: "xdi8" },
            { h: "纟火", x: "aho" },
            { h: "緂", x: "aho" },
            { h: "社", x: "utA" },
            { h: "区", x: "Fi6" },
          ],
        })
        expect(t.transcribe("xdi8-aho utA-Fi6", { ziSeparator: "-" })).toEqual([
          OW({ h: "灯", x: "xdi8" }),
          [
            OW({ content: [OW({ h: "纟火", x: "aho" })] }),
            OW({ content: [OW({ h: "緂", x: "aho" })] }),
          ],
          " ",
          OW({ h: "社", x: "utA" }),
          OW({ h: "区", x: "Fi6" }),
        ])
      })

      it("treats spaces contextually when separator is space", function () {
        // namely, it omits a single space between two transcribable characters
        const t = new AlphaToHanziTranscriber({
          dict: [
            { h: "社", x: "utA" },
            { h: "区", x: "Fi6" },
          ],
        })
        expect(t.transcribe("希顶 utA Fi6", { ziSeparator: " " })).toEqual([
          "希顶 ",
          OW({ h: "社", x: "utA" }),
          OW({ h: "区", x: "Fi6" }),
        ])
        // mustn't split words
        expect(t.transcribe("utAFi6", { ziSeparator: " " })).toEqual(["utAFi6"])
      })
    })
  })
})
