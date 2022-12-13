const xdi8ChatAlphabet = " bpmwjqxynzDsrHNldtgkh45vF7BcfuaoeEAYL62T83V1i"

export function chatToXdPUA(text: string) {
  return text.replace(/([\^~⇧⇩]?)([a-zABDEFHLNTVY1-8])/g, (_, cs, ltr) => {
    const ord = xdi8ChatAlphabet.indexOf(ltr)
    const cas = { "^": 0, "~": 2, "⇧": 0, "⇩": 2 }[String(cs)] ?? 1
    return String.fromCharCode(
      0xe020 + (ord & 15) + cas * 16 + (ord >> 4) * 48
    )
  })
}

export function xdPUAToChat(text: string) {
  return text.replace(
    /[\ue021-\ue02f\ue031-\ue03f\ue041-\ue08d\ue090-\ue09d\ue0a0-\ue0ad]/g,
    function (chr) {
      const cc = chr.charCodeAt(0)
      const row = (cc - 0xe020) >> 4
      const cas = row % 3
      const ord = (cc & 15) + (~~(row / 3) * 16)
      return ["⇧", "", "⇩"][cas] + xdi8ChatAlphabet[ord]
    }
  )
}
