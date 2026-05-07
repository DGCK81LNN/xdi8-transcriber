import { expect } from "earl"
import {
  chatToXdPUA,
  xdPUAToChat,
  inferMainSyllablePosition,
} from "../src/encoding"

describe("encoding", function () {
  describe("chatToXdPUA", function () {
    it("converts SCA to XdPUA encoding", function () {
      expect(chatToXdPUA("^xdi8~aho")).toEqual("")
    })
  })
  describe("xdPUAToChat", function () {
    it("converts XdPUA encoding SCA", function () {
      expect(xdPUAToChat(" ")).toEqual("⇧yy8i⇩xho ⇧kD3H")
    })
  })

  describe("inferMainSyllablePosition", function () {
    it("infers the main syllable position from spelling", function () {
      expect(inferMainSyllablePosition("da")).toEqual([0, 2])
      expect(inferMainSyllablePosition("xd8")).toEqual([1, 3])
      expect(inferMainSyllablePosition("4oquV")).toEqual([2, 5])
      expect(inferMainSyllablePosition("ht1s")).toEqual([1, 4])
    })
  })
})
