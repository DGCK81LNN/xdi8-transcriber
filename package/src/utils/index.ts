export function compare<T extends string | number>(a: T, b: T) {
  return a > b ? 1 : a < b ? -1 : 0
}

export function reverseCompare<T extends string | number>(a: T, b: T) {
  return a > b ? -1 : a < b ? 1 : 0
}

export function getPropComparer<
  P extends string | number | symbol,
  V extends string | number
>(
  prop: P,
  comp: (a: V, b: V) => number = compare
): (a: { [prop in P]: V }, b: { [prop in P]: V }) => number {
  return (a, b) => /*@__INLINE__*/ comp(a[prop], b[prop])
}

export function multiSubst(str: string, map: Record<string, string>) {
  const keys = Object.getOwnPropertyNames(map).sort(
    /*@__INLINE__*/
    getPropComparer("length", reverseCompare)
  )
  let res = []
  let i = 0
  while (i < str.length) {
    const match = keys.find(key => str.startsWith(key, i))
    if (match === undefined) {
      res.push(str[i++])
      continue
    }
    res.push(map[match])
    i += match.length
  }
  return res.join("")
}

/**
 * @param arr An array of objects sorted by `prop`.
 * @param prop The property to look in.
 * @param search The string to search for.
 * @returns An array of objects from `arr` whose `prop` are equal to `search`.
 */
export function bisectLookUp<
  O extends { [prop in P]: string },
  P extends string | number | symbol
>(arr: O[], prop: P, search: string) {
  const lenMinusOne = arr.length - 1

  // Find one matching element
  // Possible position range of matching value(s): first <= x <= last
  let first = 0
  let last = lenMinusOne
  let pos: number | undefined = undefined
  while (first <= last) {
    let mid = (first + last) >> 1
    if (search === arr[mid][prop]) {
      pos = mid
      break
    }
    if (search > arr[mid][prop]) first = mid + 1
    else if (search < arr[mid][prop]) last = mid - 1
    else throw new TypeError("bisectLookUp: value not comparable")
  }
  if (pos === undefined) return []

  // Extend the range to include all matching elements
  // Range of all matching value(s): start <= x < end
  let start = pos
  let end = pos + 1
  while (start > first && search === arr[start - 1][prop]) start--
  while (end <= last && search === arr[end][prop]) end++
  const results = arr.slice(start, end)
  return results
}

/**
 * Test if one of the given hanzi hints (./data.json.d.ts:`DictEntry.hh`) match the current character.
 * @param input The input string.
 * @param i The position of the current character in `input`.
 * @param char The current character.
 * @param hh Hanzi hints.
 * @returns True if one of the hints match the current character, false otherwise.
 */
export function hhMatches(input: string, i: number, char: string, hh: string) {
  for (const hint of hh.split(" ")) {
    const hintSubst = hint.replace(/~/g, char)
    const hintLen = hintSubst.length
    let hintI = 0
    for (const hintChar of hint) {
      if (hintChar === "~") {
        if (input.substring(i - hintI, i - hintI + hintLen) === hintSubst)
          return true
        hintI += char.length
      } else {
        hintI += hintChar.length
      }
    }
  }
  return false
}

export function escapeRegExp(source: string) {
  return source.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
}

export { PropTrie } from "./prop_trie"
