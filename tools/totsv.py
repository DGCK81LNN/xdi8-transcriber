#!/usr/bin/env python3
from datetime import datetime
import openpyxl
from os import path
import re
import sys

if len(sys.argv) < 2:
  print("Usage: python totsv.py <希顶字表.xlsx>")
  sys.exit(2)

xls_path = sys.argv[1]
wb = openpyxl.load_workbook(xls_path)
sheet = wb.worksheets[0]

m = re.search(r"((?<=20)|(?<!\d))2\d[01]\d[0-3]\d(?!\d)", xls_path)
date = m.group(0) if m else datetime.now().strftime("%y%m%d")
out_path = f"{path.dirname(xls_path) or path.curdir}{path.sep}{date}.tsv"

headers = [cell.value for cell in sheet[1]]
h_col = headers.index("汉字")
x_col = headers.index("希顶") if "希顶" in headers else headers.index("希顶语")
xmfix_col = headers.index("修正主音节") if "修正主音节" in headers else None

with open(out_path, 'wb') as f:
  for row in sheet.iter_rows(min_row=2, values_only=True):
    h, x = row[h_col], row[x_col]
    if not h or not x: continue
    if xmfix_col is not None and row[xmfix_col]:
      x_inferred = x
      match = re.search(r".*([dtl]1s|[457BDFHNbcdfghj-np-tv-z][iu]?[12368AELTVYaeo])", x)
      if match: x_inferred = x[:match.end()] + "'" + x[match.end():]
      x_explicit = x.replace(row[xmfix_col], row[xmfix_col] + "'")
      if x_inferred != x_explicit: x = x_explicit
    f.write(f"{h}\t{x}\n".encode("utf-8"))

print(f"{out_path} written")
