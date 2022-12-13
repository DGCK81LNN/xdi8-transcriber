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
export interface TranscribedSegment {
  h: string
  x: string
  v: string
}
export type TranscribeResultSegment =
  | string
  | TranscribedSegment
  | Alternation[]
export type TranscribeResult = TranscribeResultSegment[]
