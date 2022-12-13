#!/usr/bin/env ruby

# @param str [String]
def fix_pinyin(str)
  str = str.dup
  str.gsub!(/((?:[bpmfdtnlgkhjqxrzcsyw]|[zcs]h)?[aoeiuv]{1,2}(?:n|ng)?|er)([1-4])/) do |f|
    s = $1
    t = $2.to_i - 1
    s.sub!("a") { %w[ā á ǎ à][t] } ||
    s.sub!("o") { %w[ō ó ǒ ò][t] } ||
    s.sub!("e") { %w[ē é ě è][t] } ||
    s.sub!(/[iu](?![iu])/) { |g| { "i" => %w[ī í ǐ ì], "u" => %w[ū ú ǔ ù] }[g][t] } ||
    s.sub!("v") { %w[ǖ ǘ ǚ ǜ][t] }
    puts "#{f}\t#{s}"
    s
  end
  str
end

# @type [String]
s = if ARGV[0] && !ARGV[0].empty?
  File.read(ARGV[0])
else
  STDIN.read
end
lines = s.split("\n")

lines.map!.each_with_index do |line, i|
  cells = line.split("\t", -1)
  cells[2] = fix_pinyin(cells[2]) if cells[2]
  cells.join("\t")
end

if ARGV[1] && !ARGV[1].empty?
  File.write(ARGV[1], lines.join("\n"))
else
  STDOUT.write(lines.join("\n"))
end
