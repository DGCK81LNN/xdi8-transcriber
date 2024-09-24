#!/usr/bin/env ruby

@table="!bpmwjqxynzDsrHNldtgkh45vF7BcfuaoeEAYL62T83V1i"

def stn(x)
  x.each_char.map { |l| @table.index(l) }
end

fn = ARGV[0]
if !fn
  STDERR.puts("no file specified")
  exit(2)
end

lines = File.readlines(fn)
lines.sort_by! do |line|
  h, x = line.chomp.split("\t")
  [stn(x), h]
end
File.write(fn, lines.join)
