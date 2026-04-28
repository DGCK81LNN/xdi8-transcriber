import data from "./data.json" with { type: "json" }
import { DictEntry } from "./types"
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
  constructor(
    dictData: {
      dict: readonly DictEntry[]
      subst: Record<string, string>
    } = data,
  ) {
    super(dictData)
  }
}

export class Xdi8ToHanziTranscriber extends AlphaToHanziTranscriber {
  constructor(dictData: { dict: readonly DictEntry[] } = data) {
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
    } = {},
  ) {
    return super.transcribe(input, { ziSeparator, alphaFilter })
  }
}
