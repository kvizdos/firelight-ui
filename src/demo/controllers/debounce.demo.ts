import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { DebounceFetchController } from "../../controllers/debounce.controller";

@customElement("debounce-demo")
export class DEMO_Debounce extends LitElement {
  static styles = css``;

  private searchDebouncer = new DebounceFetchController<string[]>(
    this,
    (query) => [
      `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&format=json&origin=*`,
      {
        cache: "no-cache",
      },
    ],
    (_, data) => {
      this.results = data[1];
    },
    100,
  );

  @state() results: string[] = [];

  firstUpdated() {
    this.searchDebouncer.run("tes");
    setTimeout(() => this.searchDebouncer.run("testi"), 350); // Should abort "tes"
  }

  render() {
    return html`<div>
      <p>
        Search something (recommended to slowdown to 3G and look at the network
        tab!)
      </p>

      <input
        placeholder="search"
        @input=${(e: InputEvent) =>
          this.searchDebouncer.run((e.target as HTMLInputElement).value)}
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
