const xdi8ChatAlphabet = " bpmwjqxynzDsrHNldtgkh45vF7BcfuaoeEAYL62T83V1i"

export function chatToXdPUA(text: string) {
  return text.replace(
    /([\^~⇧⇩]?)([a-zABDEFHLNTVY1-8])/g,
    (_, cs: string, ltr: string) => {
      const ord = xdi8ChatAlphabet.indexOf(ltr)
      const cas = { "^": 0, "~": 2, "⇧": 0, "⇩": 2 }[String(cs)] ?? 1
      return String.fromCharCode(
        0xe020 + (ord & 15) + cas * 16 + (ord >> 4) * 48,
      )
    },
  )
}

export function xdPUAToChat(text: string) {
  return text.replace(
    /[\ue021-\ue02f\ue031-\ue03f\ue041-\ue08d\ue090-\ue09d\ue0a0-\ue0ad]/g,
    function (chr) {
      const cc = chr.charCodeAt(0)
      const row = (cc - 0xe020) >> 4
      const cas = row % 3
      const ord = (cc & 15) + ~~(row / 3) * 16
      return ["⇧", "", "⇩"][cas] + xdi8ChatAlphabet[ord]
    },
  )
}

/**
 * Infer the start (inclusive) and end (exclusive) indices of the main syllable
 * in the given Shidinn word.
 *
 * Use this to find the main syllable of Shidinn words when the `xm` field in
 * `TranscribedSegment` does not provide an override.
 *
 * Returns `undefined` when the main syllable cannot be inferred from spelling.
 *
 * @param x Shidinn word
 */
export function inferMainSyllablePosition(
  x: string,
): [start: number, end: number] | undefined {
  const reg =
    /^([1-8ABDEFHLNTVYa-z]*)([dtl]1s|[457BDFHNbcdfghj-np-tv-z][iu]?[12368AELTVYaeo])/
  const m = reg.exec(x)
  if (m) {
    return [m.index + m[1].length, m.index + m[0].length]
  }
}
