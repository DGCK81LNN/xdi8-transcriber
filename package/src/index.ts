import {
  AlphaToHanziTranscriber,
  HanziToAlphaTranscriber,
} from "./base_transcribers"
import { chatToXdPUA } from "./encoding"
import type { Data, DictEntry } from "./types"

import _data from "./data.json" with { type: "json" }
export const data: Data = _data

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

export * from "./encoding"
export * from "./base_transcribers"
export type * from "./types"
