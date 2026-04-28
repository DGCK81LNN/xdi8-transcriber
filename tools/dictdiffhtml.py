#!/usr/bin/env python3

import sys
import html

print("""<meta charset=utf-8>
<table style='font-family:consolas,monospace,sans-serif'>
<tr><th><th>汉字<th>希顶<th>备注<th>汉希提示<th>希汉提示""", end='')

for line in sys.stdin:
  line = line.rstrip('\n')
  if line.startswith(' '):
    print(f"<tr><td><td>{html.escape(line[1:]).replace('\t', '<td>')}", end='')
  elif line.startswith('+'):
    rest = html.escape(line[1:]).replace('\t', '<td>')
    print(f'<tr style="color:green"><td>+<td>{rest}', end='')
  elif line.startswith('-'):
    rest = html.escape(line[1:]).replace('\t', '<td>')
    print(f'<tr style="color:red"><td>-<td>{rest}', end='')
  else:
    # pass through lines that don't match the expected format
    print(html.escape(line), end='')
