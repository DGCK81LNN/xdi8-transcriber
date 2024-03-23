#!/usr/bin/env bash

function highlight {
  if [ -t 1 ]; then
    if   python -c "import pygments"  &> /dev/null; then exec python -m pygments -l diff
    elif rougify --version            &> /dev/null; then exec rougify            -l diff
    fi
  fi
  exec cat
}

git diff "$@" > "$0.tmp"
grep -P "^[ +-]($(grep -Po '(?<=^[+-])[^+-](?=\t)' "$0.tmp" | sort -u | paste -sd'|'))" "$0.tmp" | highlight
rm "$0.tmp"
