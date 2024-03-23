import {
  HanziToXdi8Transcriber,
  Xdi8ToHanziTranscriber,
  chatToXdPUA,
  xdPUAToChat,
} from "../../package/src"
import type {
  TranscribedSegment,
  TranscribeResult,
  Alternation,
} from "../../package/src"

export type Format = "hanzi" | "chat" | "xdpua"
export interface TranscribeOptions {
  ziSeparator?: string
}

export type Alternations = Alternation[] & { selectedIndex: number }
type Intermediate = TranscribeResult | string
export { TranscribedSegment, Alternation }
export type VisualResultSegment = string | TranscribedSegment | Alternations
export type VisualResult = VisualResultSegment[] | string

const h2x = new HanziToXdi8Transcriber()
const x2h = new Xdi8ToHanziTranscriber()

const from: Record<
  Format,
  (inp: string, opt?: TranscribeOptions) => Intermediate
> = {
  chat: inp => inp,
  xdpua: xdPUAToChat,
  hanzi: (inp, opt) => {
    const segments = h2x.transcribe(inp, opt)
    return segments.map(segment => {
      if (Array.isArray(segment))
        return Object.assign(segment, { selectedIndex: 0 })
      return segment
    })
  },
}

function alphaTransformer(
  filter: (text: string) => string
): (med: Intermediate) => Intermediate {
  return (med: Intermediate) => {
    if (typeof med === "string") return filter(med)
    return med.map(seg => {
      if (typeof seg === "string") return seg
      if (Array.isArray(seg))
        return seg.map(alt =>
          Object.assign({}, alt, {
            content: into.xdpua(alt.content),
          })
        )
      return Object.assign({}, seg, { v: filter(seg.v) })
    })
  }
}

const into: Record<
  Format,
  (med: Intermediate, opt?: TranscribeOptions) => Intermediate
> = {
  chat: med => med,
  xdpua: alphaTransformer(chatToXdPUA),
  hanzi: (med, opt) => {
    if (typeof med !== "string")
      throw new Error("内部错误：无法将 TranscribeResult 转写成 hanzi")
    return x2h.transcribe(med, opt)
  },
}

function toResult(med: Intermediate): VisualResult {
  if (typeof med === "string") return med
  return med.map(seg => {
    if (typeof seg === "string") return seg
    if (Array.isArray(seg))
      return Object.assign(
        seg.map(alt =>
          Object.assign({}, alt, {
            content: toResult(alt.content),
          })
        ),
        { selectedIndex: 0 }
      )
    return { ...seg, x: chatToXdPUA(seg.x) }
  })
}

export function transcribe(
  input: string,
  ft: Format,
  tt: Format,
  opt?: TranscribeOptions
) {
  return toResult(into[tt](from[ft](input, opt), opt))
}

export function toPlainResult(res: VisualResult): string {
  if (typeof res === "string") return res
  return res
    .map(seg => {
      if (typeof seg === "string") return seg
      if (Array.isArray(seg))
        return toPlainResult(seg[seg.selectedIndex].content)
      return seg.v
    })
    .join("")
}
