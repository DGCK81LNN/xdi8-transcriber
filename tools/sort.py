#!/usr/bin/env python3

import sys

ALPHABET = "!bpmwjqxynzDsrHNldtgkh45vF7BcfuaoeEAYL62T83V1i"

def xdi8_key(word: str) -> int:
  return [n for n in (ALPHABET.find(c) for c in word) if n != -1]

def main():
  if len(sys.argv) < 2:
    print("no file specified", file=sys.stderr)
    sys.exit(2)

  fn = sys.argv[1]
  with open(fn, encoding='utf-8') as f:
    lines = f.readlines()

  def sort_key(line: str) -> tuple:
    parts = line.rstrip('\n').split('\t')
    if len(parts) >= 2:
      x = parts[1]
      h = parts[0]
    else:
      x = parts[0] if parts else ''
      h = ''
    return (xdi8_key(x), x, h)

  lines.sort(key=sort_key)

  with open(fn, 'w', encoding='utf-8') as f:
    f.writelines(lines)


if __name__ == '__main__':
  main()
