import type { DictEntry, Transcriber, TranscribeResultSegment } from "../types"
import {
  bisectLookUp,
  getPropComparer,
  hhMatches,
  makeTranscribedSegment,
  multiSubst,
  sortByFunc,
} from "../utils"

export class HanziToAlphaTranscriber implements Transcriber {
  public readonly dict: readonly DictEntry[]
  public readonly subst: Record<string, string>

  constructor(data: {
    dict: readonly DictEntry[]
    subst: Record<string, string>
  }) {
    this.dict = data.dict.slice().sort(/*@__INLINE__*/ getPropComparer("h"))
    this.subst = data.subst
  }

  transcribe(
    input: string,
    {
      ziSeparator = "",
    }: {
      ziSeparator?: string
    } = {}
  ) {
    input = multiSubst(input, this.subst)

    const result: TranscribeResultSegment[] = []
    let i = 0
    let prevSegmentIsWord = false
    let needSpace = false
    for (const char of input) {
      handleChar(char, this)
      i += char.length
    }
    return result

    function append(segment: TranscribeResultSegment) {
      if (
        typeof segment === "string" &&
        typeof result[result.length - 1] === "string"
      )
        result.push((result.pop() as string) + segment)
      else result.push(segment)
    }

    function handleChar(char: string, this_: HanziToAlphaTranscriber) {
      let matches = bisectLookUp(this_.dict, "h", char)
      if (matches.length === 0) {
        needSpace = /\w/.test(char)
        if (prevSegmentIsWord && needSpace) append(" ")
        prevSegmentIsWord = false

        return append(char)
      }

      if (prevSegmentIsWord)
        ziSeparator && append({ h: "", x: "", v: ziSeparator })
      else if (needSpace) append(" ")
      prevSegmentIsWord = true

      if (matches.length === 1)
        return append(makeTranscribedSegment(matches[0], "x"))

      sortByFunc(matches, ({ hh, xh }) => {
        if (hh === "-") return xh === "-" ? 3 : 2
        if (hh) return hhMatches(input, i, char, hh) ? -1 : 1
        return 0
      })

      append(
        matches.map(match => ({
          content: [makeTranscribedSegment(match, "x")],
          note: match.n || "",
          exceptional: match.hh === "-",
          legacy: match.hh === "-" && match.xh === "-",
        }))
      )
    }
  }
}
