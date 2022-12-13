import { data } from "./data"
import {
  HanziToAlphaTranscriber,
  AlphaToHanziTranscriber,
} from "./base_transcribers"
import { chatToXdPUA, xdPUAToChat } from "./encoding"

export {
  HanziToAlphaTranscriber,
  AlphaToHanziTranscriber,
  chatToXdPUA,
  xdPUAToChat,
}

export * from "./types"

export class HanziToXdi8Transcriber extends HanziToAlphaTranscriber {
  constructor() {
    super(data)
  }
}

export class Xdi8ToHanziTranscriber extends AlphaToHanziTranscriber {
  constructor() {
    super(data)
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
