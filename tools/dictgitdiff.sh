#!/usr/bin/env bash

git diff "$@" > "$0.tmp"
grep -P "^[ +-]($(grep -Po '(?<=^[+-])[^+-](?=\t)' "$0.tmp" | uniq | paste -sd'|'))" "$0.tmp"
rm "$0.tmp"
