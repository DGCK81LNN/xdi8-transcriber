export interface DictEntry {
  /** Hanzi. */
  h: string
  /** Shidinn (in Chat Alphabet). */
  x: string
  /** Notes. */
  n?: string
  /**
   * Hanzi hints. May be a space-separated list of patterns or a single `-`.
   * Useful for differentiating different senses of the same hanzi.
   *
   * `-` means that when converting from hanzi to shidinn, the entry is
   * considered "exceptional" and should not be selected by default wherever
   * possible.
   *
   * An entry whose `hh` and `xh` are both `"-"` is a "legacy" spelling.
   */
  hh?: string
  /**
   * Shidinn hints. Always equal to `"-"` if present, which means that when
   * converting from shidinn to hanzi, the entry is considered "exceptional" and
   * should not be selected by default wherever possible. Used to mark
   * traditional variants of common hanzi.
   *
   * An entry whose `hh` and `xh` are both `"-"` is a "legacy" spelling.
   */
  xh?: "-"
}
export interface Data {
  dict: DictEntry[]
  subst: Record<string, string>
}

export interface Transcriber {
  transcribe(input: string, ...args: unknown[]): TranscribeResult
}

export interface Alternation {
  content: TranscribedSegment[]
  note?: string
  /** True if this alternation involves an exceptional dict entry. */
  exceptional?: boolean
  /** True if this alternation involves a legacy spelling. */
  legacy?: boolean
}
/**
 * `h` and `x` must be either both empty or both non-empty. When they are empty,
 * the segment should be shown in plain-text output only and not visualized.
 */
export interface TranscribedSegment {
  /** Hanzi form of the word or character, for visualizing. May be empty. */
  h: string
  /** Shidinn form of the word or character, for visualizing. May be empty. */
  x: string
  /** Plain-text output of this segment. */
  v: string
  /** True if this segment involves a legacy spelling. */
  legacy?: boolean
}
export type TranscribeResultSegment =
  | string
  | TranscribedSegment
  | Alternation[]
export type TranscribeResult = TranscribeResultSegment[]
