export function* wordSplitPossibilities<T>(
  word: string,
  matchSubWord: (wordSegment: string) => Iterator<[length: number, data: T]>,
  options?: {
    maxAttempts?: number | null
    validateStack?: ((matchStack: T[]) => boolean) | null
  }
) {
  const maxAttempts = options?.maxAttempts ?? 100
  let attempts = 0
  const validateStack = options?.validateStack

  const stack: [index: number, matches: ReturnType<typeof matchSubWord>][] = [
    [0, matchSubWord(word)],
  ]
  const matchStack: T[] = []

  do {
    const [index, matches] = stack[stack.length - 1]
    const next = matches.next()
    if (next.done) {
      matchStack.pop()
      stack.pop()
      attempts++
      continue
    }

    const [matchLength, matchData] = next.value
    matchStack.push(matchData)

    if (validateStack && !validateStack(matchStack)) {
      matchStack.pop()
      attempts++
      continue
    }

    const nextIndex = index + matchLength
    if (nextIndex === word.length) {
      yield matchStack.slice(0)
      matchStack.pop()
      attempts++
      continue
    }

    stack.push([nextIndex, matchSubWord(word.slice(nextIndex))])
  } while (stack.length && attempts <= maxAttempts)
}
