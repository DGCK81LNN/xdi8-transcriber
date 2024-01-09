import { PropTrie, sortByFunc } from "../utils"
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
    note:
      matchStack.length === 1
        ? matchStack[0].n || ""
        : Array.from(
            new Set(
              matchStack
                .filter(({ n }) => n)
                .map(({ x, n }) => n && `${alphaFilter(x)} — ${n}`)
            )
          ).join("\n"),
    exceptional: matchStack.some(({ xh }) => xh === "-"),
    legacy: matchStack.some(({ hh, xh }) => hh === "-" && xh === "-"),
  }
}

function getWordRe(ziSeparator: string) {
  // If separator is space we will just treat each character as a separate word,
  // and then remove redundant spaces in the end.
  if (!ziSeparator || ziSeparator === " ") return /[0-9A-Za-z]+/g

  const sepRe = escapeRegExp(ziSeparator)
  return new RegExp(`[0-9A-Za-z]+(?:${sepRe}[0-9A-Za-z]+)*`, "g")
}

function sortAlternations(alts: Alternation[]) {
  return sortByFunc(alts, ({ exceptional, legacy }) => {
    if (legacy) return 3
    if (exceptional) return 2
    return 0
  })
}

/**
 * If `nextEntry` were appended to `matchStack`, will it become part of a
 * consecutive range of entries that has the same spelling as another
 * consecutive range of entries (the two ranges do not overlap) with a different
 * hanzi form?
 */
function violatesSameHanziRule(matchStack: DictEntry[], nextEntry: DictEntry) {
  const stack = [...matchStack, nextEntry]
  let newX = ""
  let newH = ""
  for (let newStart = matchStack.length; newStart > 0; newStart--) {
    newX = stack[newStart].x + newX
    newH = stack[newStart].h + newH
    for (let oldEnd = newStart - 1; oldEnd >= 0; oldEnd--) {
      let oldX = ""
      let oldH = ""
      for (let oldStart = oldEnd; oldStart >= 0; oldStart--) {
        oldX = stack[oldStart].x + oldX
        oldH = stack[oldStart].h + oldH
        if (oldX === newX && oldH !== newH) return true
        if (oldX.length >= newX.length) break
        if (oldX !== newX.slice(-oldX.length)) break
      }
    }
  }
  return false
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

    const re = getWordRe(ziSeparator)

    let prevI = 0
    for (const { [0]: match, index: i } of input.matchAll(re)) {
      if (i! > prevI) append(input.slice(prevI, i))
      handleWord(match, this)
      prevI = i! + match.length
    }
    if (prevI < input.length) append(input.slice(prevI))

    if (ziSeparator === " ") return result.filter(seg => seg !== " ")
    return result

    function append(segment: TranscribeResultSegment) {
      if (
        typeof segment === "string" &&
        typeof result[result.length - 1] === "string"
      )
        result.push((result.pop() as string) + segment)
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

          append(
            sortAlternations(
              matches.map(match => ({
                content: [{ x: char, h: match.h, v: match.h }],
                note: match.n || "",
                exceptional: match.xh === "-",
                legacy: match.hh === "-" && match.xh === "-",
              }))
            )
          )
        })

      const matchSums: Alternation[] = []
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
        if (violatesSameHanziRule(matchStack, next.value)) {
          attempts++
          continue
        }

        matchStack.push(match)
        const i = item.i + match.x.length
        if (i >= word.length) {
          matchSums.push(getMatchSum(matchStack, alphaFilter))
          matchStack.pop()
          attempts++
          continue
        }

        stack.push({
          i,
          M: this_.trie.search(word.slice(i)),
        })
      } while (stack.length && attempts <= 100)

      if (matchSums.length === 0) append(word)
      else if (matchSums.length === 1) matchSums[0].content.forEach(append)
      else append(sortAlternations(matchSums))
    }
  }
}
