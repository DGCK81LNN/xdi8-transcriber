import data from "../data/bundle.json"
import {
  HanziToAlphaTranscriber,
  AlphaToHanziTranscriber,
} from "./base_transcribers"
import { chatToXdPUA, xdPUAToChat } from "./encoding"

export {
  data,
  HanziToAlphaTranscriber,
  AlphaToHanziTranscriber,
  chatToXdPUA,
  xdPUAToChat,
}

export * from "./types"

export class HanziToXdi8Transcriber extends HanziToAlphaTranscriber {
  constructor(dictData = data) {
    super(dictData)
  }
}

export class Xdi8ToHanziTranscriber extends AlphaToHanziTranscriber {
  constructor(dictData = data) {
    super(dictData)
  }

  transcribe(
    input: string,
    {
      ziSeparator = "",
      alphaFilter = chatToXdPUA,
    }: {
      ziSeparator?: string
      alphaFilter?: (x: string) => string
    } = {}
  ) {
    return super.transcribe(input, { ziSeparator, alphaFilter })
  }
}
