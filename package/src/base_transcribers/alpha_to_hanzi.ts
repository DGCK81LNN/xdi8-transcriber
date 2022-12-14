import { PropTrie } from "../utils"
import type {
  Alternation,
  DictEntry,
  Transcriber,
  TranscribeResultSegment,
} from "../types"
import { bisectLookUp, getPropComparer, escapeRegExp } from "../utils"

interface StackItem {
  /** Start position of the char in the word. */
  i: number
  /** Iterator of matching entries. */
  M: Iterator<DictEntry, void>
}

function getMatchSum(
  matchStack: DictEntry[],
  _alphaFilter?: ((x: string) => string) | null | undefined
): Alternation {
  const alphaFilter = _alphaFilter ?? (x => x)
  return {
    content: matchStack.map(({ x, h }) => ({ x, h, v: h })),
    note: matchStack
      .map(({ x, n }) => n && `${alphaFilter(x)} — ${n}`)
      .filter(n => n)
      .join("\n"),
  }
}

export class AlphaToHanziTranscriber implements Transcriber {
  public readonly dict: DictEntry[]
  public readonly trie: PropTrie<DictEntry, "x">

  constructor(data: { dict: DictEntry[] }) {
    this.dict = data.dict.slice().sort(/*@__INLINE__*/ getPropComparer("x"))
    this.trie = new PropTrie(this.dict, "x")
  }

  transcribe(
    input: string,
    {
      ziSeparator = "",
      alphaFilter,
    }: {
      ziSeparator?: string
      alphaFilter?: ((x: string) => string) | null | undefined
    } = {}
  ) {
    const result: TranscribeResultSegment[] = []

    const sepRe = ziSeparator && escapeRegExp(ziSeparator)
    const re = ziSeparator
      ? new RegExp(`[0-9A-Za-z]+(?:${sepRe}[0-9A-Za-z]+)*`, "g")
      : /[0-9A-Za-z]+/g

    let prevI = 0
    for (const { [0]: match, index: i } of input.matchAll(re)) {
      if (i! > prevI) append(input.slice(prevI, i))
      handleWord(match, this)
      prevI = i! + match.length
    }
    if (prevI < input.length) append(input.slice(prevI))

    return result

    function append(segment: TranscribeResultSegment) {
      if (
        typeof segment === "string" &&
        typeof result[result.length - 1] === "string"
      )
        result[result.length - 1] += segment
      else result.push(segment)
    }

    function handleWord(word: string, this_: AlphaToHanziTranscriber) {
      if (ziSeparator)
        return word.split(ziSeparator).forEach(char => {
          let matches = bisectLookUp(this_.dict, "x", char)
          if (matches.length === 0) return append(char)
          if (matches.length === 1) {
            const h = matches[0].h
            return append({ x: char, h, v: h })
          }

          // Reorder the matches
          {
            const regularMatches: DictEntry[] = []
            const bottomMatches: DictEntry[] = []
            for (const match of matches) {
              if (match.xh === "-") bottomMatches.push(match)
              else regularMatches.push(match)
            }
            matches = regularMatches.concat(bottomMatches)
          }

          append(
            matches.map(match => ({
              content: [{ x: char, h: match.h, v: match.h }],
              note: match.n || "",
            }))
          )
        })

      const regularMatchSums: Alternation[] = []
      const bottomMatchSums: Alternation[] = []
      let attempts = 0
      const stack: StackItem[] = [
        {
          i: 0,
          M: this_.trie.search(word),
        },
      ]
      const matchStack: DictEntry[] = []
      do {
        const item = stack[stack.length - 1]
        const next = item.M.next()
        if (next.done === true) {
          matchStack.pop()
          stack.pop()
          attempts++
          continue
        }
        const match = next.value
        matchStack.push(match)
        const i = item.i + match.x.length
        if (i >= word.length) {
          const category = matchStack.some(m => m.xh === "-")
            ? bottomMatchSums
            : regularMatchSums
          category.push(getMatchSum(matchStack, alphaFilter))
          matchStack.pop()
          attempts++
          continue
        }

        stack.push({
          i,
          M: this_.trie.search(word.slice(i)),
        })
      } while (stack.length && attempts <= 100)

      const matchSums = regularMatchSums.concat(bottomMatchSums)
      if (matchSums.length === 0) append(word)
      else if (matchSums.length === 1) matchSums[0].content.forEach(append)
      else append(matchSums)
    }
  }
}
