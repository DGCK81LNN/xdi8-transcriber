const { expect } = require("earljs")
const { chatToXdPUA, xdPUAToChat } = require("../src/encoding")

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
})
