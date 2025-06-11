export class TrieNode<T> {
  children: Map<string, TrieNode<T>>;
  isEndOfWord: boolean;
  results: T[];

  constructor() {
    this.children = new Map();
    this.isEndOfWord = false;
    this.results = [];
  }
}

export class Trie<T> {
  root: TrieNode<T>;

  constructor() {
    this.root = new TrieNode();
  }
}

export function TrieInsert<T>(trie: Trie<T>, word: string, value: T[]) {
  let node = trie.root;

  for (const char of word) {
    if (!node.children.has(char)) {
      node.children.set(char, new TrieNode());
    }
    node = node.children.get(char)!;
  }
  node.isEndOfWord = true;
  node.results.push(...value);
}

export function TrieSearch<T>(trie: Trie<T>, prefix: string): T[] {
  let node = trie.root;

  for (const char of prefix) {
    if (!node.children.has(char)) {
      return [];
    }
    node = node.children.get(char)!;
  }

  return node.results;
}

export function CachedTrieSearch<T>(
  trie: Trie<T>,
  prefix: string,
): { exactMatch: boolean; results: T[] } {
  let node = trie.root;
  let lastValidNode: TrieNode<T> | null = null;

  for (const char of prefix) {
    if (!node.children.has(char)) {
      return {
        exactMatch: false,
        results: lastValidNode?.results ?? [],
      };
    }
    node = node.children.get(char)!;
    if (node.results.length > 0) {
      lastValidNode = node;
    }
  }

  return {
    exactMatch: node.isEndOfWord,
    results:
      node.results.length > 0 ? node.results : (lastValidNode?.results ?? []),
  };
}

function TrieDemo<T>() {
  const x = new Trie<string>();
  TrieInsert(x, "mine", ["minecraft", "mineral"]);
  TrieInsert(x, "minecraft", ["minecraft"]);

  const demos = ["mine", "miner", "minecraf", "minecraft", "minecrafts"];

  let cached: string[] = [];
  for (let s of demos) {
    const result = TrieSearch(x, s);

    if (result.length === 0) {
      console.log(s, cached, "(cache hit)");
      continue;
    }

    cached = result;
    console.log(s, cached);
  }
}

declare global {
  interface Window {
    TrieDemo: typeof TrieDemo;
  }
}

// Expose to global scope for console use
window.TrieDemo = TrieDemo;
