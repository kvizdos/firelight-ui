import { query } from "@lit-app/state";
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { DebounceFetchController } from "../controllers/debounce.controller";
import {
  CachedTrieSearch,
  Trie,
  TrieInsert,
  TrieSearch,
} from "../datatypes/trie";

@customElement("search-component")
export class SearchComponent extends LitElement {
  static styles = css``;

  private searchDebouncer = new DebounceFetchController<string[]>(
    this,
    (query) => [
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&format=json&origin=*`,
      {
        cache: "no-cache",
      },
    ],
    (query, data) => {
      TrieInsert<string>(this.trie, query, data[1]);
      if (data[1].length === 0) {
        return;
      } else {
        this.results = this.sortResults(query, data[1]);
      }
    },
    200,
  );

  @state() private results: string[] = [];

  @state() private trie = new Trie<string>();

  private sortResults(query: string, results: string[]): string[] {
    const cleaned = query.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

    return results
      .map((res) => {
        const cleanedRes = res.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

        let score = 0;
        if (cleanedRes === cleaned) score = 100;
        else if (cleanedRes.startsWith(cleaned)) score = 90;
        else if (cleanedRes.includes(cleaned)) score = 70;
        else score = 0;

        return { res, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ res }) => res);
  }

  private getResults(query: string, skipRequest: boolean = false) {
    if (this.searchDebouncer.inFlight) {
      console.log("Search in flight");
      if (!skipRequest) {
        this.searchDebouncer.run(query);
      }
      return;
    }

    let { results: trieResults, exactMatch } = CachedTrieSearch(
      this.trie,
      query,
    );

    this.results = this.sortResults(query, trieResults);

    if (!exactMatch && !skipRequest) {
      console.log("Searching");
      this.searchDebouncer.run(query);
    } else {
      console.log("cached!");
    }
  }

  render() {
    return html`<div>
      <input
        placeholder="search"
        @input=${(e: InputEvent) =>
          this.getResults((e.target as HTMLInputElement).value)}
      />

      <p>Results:</p>
      ${this.results.map(
        (r) =>
          html`<div>
            <p>${r}</p>
            <hr />
          </div>`,
      )}
    </div>`;
  }
}
