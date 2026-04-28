#!/usr/bin/env python3

import sys
import re

_TONE_MAP = {
  'a': ['ā', 'á', 'ǎ', 'à'],
  'o': ['ō', 'ó', 'ǒ', 'ò'],
  'e': ['ē', 'é', 'ě', 'è'],
  'i': ['ī', 'í', 'ǐ', 'ì'],
  'u': ['ū', 'ú', 'ǔ', 'ù'],
  'v': ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
}

def fix_pinyin(s: str) -> str:
  def repl(m: re.Match) -> str:
    syl = m.group(1)
    tone = int(m.group(2)) - 1

    for ch in 'aoe':
      if ch in syl:
        syl = syl.replace(ch, _TONE_MAP[ch][tone], 1)
        break
    else:
      # find i or u not followed by another vowel
      m2 = re.search(r'[iu](?![iu])', syl)
      if m2:
        ch = m2.group(0)
        syl = syl[:m2.start()] + _TONE_MAP[ch][tone] + syl[m2.end():]
      elif 'v' in syl:
        syl = syl.replace('v', _TONE_MAP['v'][tone], 1)

    print(f"{m.group(0)}\t{syl}")
    return syl

  return re.sub(r'((?:[bpmfdtnlgkhjqxrzcsyw]|[zcs]h)?[aoeiuv]{1,2}(?:n|ng)?|er)([1-4])', repl, str(s))


def main():
  src = sys.argv[1] if len(sys.argv) > 1 and sys.argv[1] else None
  dst = sys.argv[2] if len(sys.argv) > 2 and sys.argv[2] else None

  if src:
    with open(src, encoding='utf-8') as f:
      text = f.read()
  else:
    text = sys.stdin.read()

  lines = text.split('\n')
  out_lines = []
  for line in lines:
    cells = line.split('\t')
    if len(cells) > 2 and cells[2]:
      cells[2] = fix_pinyin(cells[2])
    out_lines.append('\t'.join(cells))

  output = '\n'.join(out_lines)
  if dst:
    with open(dst, 'w', encoding='utf-8') as f:
      f.write(output)
  else:
    sys.stdout.write(output)


if __name__ == '__main__':
  main()
