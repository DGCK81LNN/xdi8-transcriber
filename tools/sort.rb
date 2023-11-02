#!/usr/bin/env ruby

@table="!bpmwjqxynzDsrHNldtgkh45vF7BcfuaoeEAYL62T83V1i"

def stn(x)
  x.each_char.map { |l| "%02d" % @table.index(l) }.join("")
end

fn = ARGV[0]
if !fn
  STDERR.puts("no file specified")
  exit(2)
end

lines = File.readlines(fn)
lines.sort_by! { |line| stn(line.chomp.split("\t")[1]) }
File.write(fn, lines.join)
