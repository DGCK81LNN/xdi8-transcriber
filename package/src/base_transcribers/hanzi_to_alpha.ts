import type { DictEntry, Transcriber, TranscribeResultSegment } from "../types"
import { bisectLookUp, getPropComparer, hhMatches, multiSubst } from "../utils"

export class HanziToAlphaTranscriber implements Transcriber {
  public readonly dict: DictEntry[]
  public readonly subst: Record<string, string>

  constructor(data: { dict: DictEntry[]; subst: Record<string, string> }) {
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
        result[result.length - 1] += segment
      else result.push(segment)
    }

    function handleChar(char: string, this_: HanziToAlphaTranscriber) {
      let matches = bisectLookUp(this_.dict, "h", char)
      if (matches.length === 0) {
        if (ziSeparator) {
          const isWord = /[0-9A-Za-z]/.test(char)
          if (isWord && prevSegmentIsWord) append(ziSeparator)
          prevSegmentIsWord = isWord
        }
        return append(char)
      }

      if (ziSeparator) {
        if (prevSegmentIsWord) append(ziSeparator)
        prevSegmentIsWord = true
      }

      if (matches.length === 1) {
        const x = matches[0].x
        return append({ h: char, x, v: x })
      }

      // Reorder the matches
      {
        const regularMatches: DictEntry[] = []
        const topMatches: DictEntry[] = []
        const bottomMatches: DictEntry[] = []
        for (const match of matches) {
          if (!match.hh) regularMatches.push(match)
          else if (match.hh !== "-" && hhMatches(input, i, char, match.hh))
            topMatches.push(match)
          else bottomMatches.push(match)
        }
        matches = topMatches.concat(regularMatches, bottomMatches)
      }

      append(
        matches.map(match => ({
          content: [{ h: char, x: match.x, v: match.x }],
          note: match.n || "",
        }))
      )
    }
  }
}
