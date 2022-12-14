const { expect } = require("earljs")
const {
  HanziToAlphaTranscriber,
  AlphaToHanziTranscriber,
} = require("../src/base_transcribers")

const OW = expect.objectWith
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
        expect(t.transcribe("灯火")).toEqual(
          /** @type {TR} */ [
            OW({ h: "灯", x: "xdi8" }),
            OW({ h: "火", x: "ho" }),
          ]
        )
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
        expect(t.transcribe("社区")).toEqual(
          /** @type {TR} */ [
            OW({ h: "社", x: "utA" }),
            [
              OW({ content: [OW({ h: "区", x: "46H" })] }),
              OW({ content: [OW({ h: "区", x: "Fi6" })] }),
            ],
          ]
        )
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
        expect(t.transcribe("Ａ"), {
          extraMessage: "Unexpected result for Ａ",
        }).toEqual(
          /** @type {TR} */
          [
            [
              OW({ content: [OW({ h: "Ａ", x: "222" })] }),
              OW({ content: [OW({ h: "Ａ", x: "111" })] }),
              OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            ],
          ]
        )
        expect(t.transcribe("ＡＡ"), {
          extraMessage: "Unexpected result for ＡＡ",
        }).toEqual(
          /** @type {TR} */
          [
            [
              OW({ content: [OW({ h: "Ａ", x: "222" })] }),
              OW({ content: [OW({ h: "Ａ", x: "111" })] }),
              OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            ],
            [
              OW({ content: [OW({ h: "Ａ", x: "333" })] }),
              OW({ content: [OW({ h: "Ａ", x: "222" })] }),
              OW({ content: [OW({ h: "Ａ", x: "111" })] }),
            ],
          ]
        )
        expect(t.transcribe("ＢＡ"), {
          extraMessage: "Unexpected result for ＢＡ",
        }).toEqual(
          /** @type {TR} */
          [
            OW({ h: "Ｂ", x: "444" }),
            [
              OW({ content: [OW({ h: "Ａ", x: "333" })] }),
              OW({ content: [OW({ h: "Ａ", x: "222" })] }),
              OW({ content: [OW({ h: "Ａ", x: "111" })] }),
            ],
          ]
        )
        expect(t.transcribe("ＣＡ"), {
          extraMessage: "Unexpected result for ＣＡ",
        }).toEqual(
          /** @type {TR} */
          [
            OW({ h: "Ｃ", x: "555" }),
            [
              OW({ content: [OW({ h: "Ａ", x: "222" })] }),
              OW({ content: [OW({ h: "Ａ", x: "111" })] }),
              OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            ],
          ]
        )
        expect(t.transcribe("ＡＤ"), {
          extraMessage: "Unexpected result for ＡＤ",
        }).toEqual(
          /** @type {TR} */
          [
            [
              OW({ content: [OW({ h: "Ａ", x: "333" })] }),
              OW({ content: [OW({ h: "Ａ", x: "222" })] }),
              OW({ content: [OW({ h: "Ａ", x: "111" })] }),
            ],
            OW({ h: "Ｄ", x: "666" }),
          ]
        )
        expect(t.transcribe("ＡＥ"), {
          extraMessage: "Unexpected result for ＡＥ",
        }).toEqual(
          /** @type {TR} */
          [
            [
              OW({ content: [OW({ h: "Ａ", x: "222" })] }),
              OW({ content: [OW({ h: "Ａ", x: "111" })] }),
              OW({ content: [OW({ h: "Ａ", x: "333" })] }),
            ],
            OW({ h: "Ｅ", x: "777" }),
          ]
        )
        expect(t.transcribe("Ｆ"), {
          extraMessage: "Unexpected result for Ｆ",
        }).toEqual(
          /** @type {TR} */
          [
            [
              OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
              OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
            ],
          ]
        )
        expect(t.transcribe("ＦＦ"), {
          extraMessage: "Unexpected result for ＦＦ",
        }).toEqual(
          /** @type {TR} */
          [
            [
              OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
              OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
            ],
            [
              OW({ content: [OW({ h: "Ｆ", x: "888" })] }),
              OW({ content: [OW({ h: "Ｆ", x: "999" })] }),
            ],
          ]
        )
        expect(t.transcribe("ＦＦＦ"), {
          extraMessage: "Unexpected result for ＦＦＦ",
        }).toEqual([
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
        expect(t.transcribe("纟火")).toEqual(
          /** @type {TR} */ [OW({ h: "緂", x: "aho" })]
        )
      })

      it("supports adding separators", function () {
        const t = new HanziToAlphaTranscriber({
          dict: [
            { h: "灯", x: "xdi8" },
            { h: "火", x: "ho" },
          ],
          subst: {},
        })
        expect(t.transcribe("灯火", { ziSeparator: "-" })).toEqual(
          /** @type {TR} */ [
            OW({ h: "灯", x: "xdi8" }),
            "-",
            OW({ h: "火", x: "ho" }),
          ]
        )
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

        expect(t.trie).toBeAnObjectWith({
          root: expect.a(Array),
        })
        expect(t.trie.root).toBeAnObjectWith(
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
        expect(t.transcribe("Vnu8AHL")).toEqual(
          /** @type {TR} */ [
            OW({ h: "你", x: "Vnu8" }),
            OW({ h: "好", x: "AHL" }),
          ]
        )
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
        expect(t.transcribe("4YFYq8")).toEqual(
          /** @type {TR} */ [
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
          ]
        )
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
        expect(t.transcribe("1122233")).toEqual(
          /** @type {TR} */ [
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
                content: [
                  OW({ h: "Ａ", x: "112" }),
                  OW({ h: "Ｂ", x: "2233" }),
                ],
              }),
            ],
          ]
        )
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
        expect(t.transcribe("xdi8-aho utA-Fi6", { ziSeparator: "-" })).toEqual(
          /** @type {TR} */ [
            OW({ h: "灯", x: "xdi8" }),
            [
              OW({ content: [OW({ h: "纟火", x: "aho" })] }),
              OW({ content: [OW({ h: "緂", x: "aho" })] }),
            ],
            " ",
            OW({ h: "社", x: "utA" }),
            OW({ h: "区", x: "Fi6" }),
          ]
        )
      })
    })
  })
})
