export interface DictEntry {
  /** Hanzi. */
  h: string
  /** Shidinn (in Chat Alphabet). */
  x: string
  /** Notes. */
  n?: string
  /**
   * Hanzi hints. May be a space-separated list of patterns or a single `-`.
   */
  hh?: string
  /**
   * Shidinn hints. Always equal to `"-"` if present.
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
}
export type TranscribeResultSegment =
  | string
  | TranscribedSegment
  | Alternation[]
export type TranscribeResult = TranscribeResultSegment[]
