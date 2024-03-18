/**
 * A prefix tree used for scanning alphabetic text without zi separators.
 */
export class PropTrie<
  O extends { [k in P]: string },
  P extends string | number | symbol
> {
  public readonly root: TrieNode<O> = [] as O[] as TrieNode<O>
  /**
   * @param items Elements to insert into the tree.
   * @param prop The property on the elements to index on.
   */
  constructor(items: readonly O[], prop: P) {
    items.forEach(item => {
      const key = item[prop]
      let node = this.root

      for (let i = 0, l = key.length; i < l; i++) {
        const prop = `_${key[i]}` as const
        if (prop in node) node = node[prop]
        else node = node[prop] = [] as O[] as TrieNode<O>
      }
      node.push(item)
    })
  }

  *search(str: string) {
    let i = 0
    let node = this.root
    let stack: TrieNode<O>[] = [node]
    while (i < str.length && `_${str[i]}` in node) {
      node = node[`_${str[i++]}`]
      stack.push(node)
    }
    while (stack.length) yield* stack.pop()!
  }
}

export interface TrieNodeMixin<O> {
  [s: `_${string}`]: TrieNode<O>
}
export type TrieNode<O> = Array<O> & TrieNodeMixin<O>
