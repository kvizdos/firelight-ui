import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("modal-component")
export class ModalComponent extends LitElement {
  static styles = css`
    * {
      box-sizing: border-box;
      padding: 0;
      margin: 0;
    }
    :host {
      position: absolute;
    }
    :host > div {
      position: fixed;
      top: 0;
      left: 0;

      --backdrop: rgba(17, 17, 17, 0.5);

      --width: 100vw;
      --width: 100dvw;

      --height: 100vh;
      --height: 100dvh;

      width: var(--width);
      height: var(--height);

      display: flex;
      align-items: center;
      justify-content: center;

      z-index: 10000;
    }

    #backdrop {
      position: fixed;
      top: 0;
      left: 0;

      width: var(--width);
      height: var(--height);

      background-color: var(--backdrop);
    }

    #content {
      --wantedWidth: 4rem;
      position: fixed;
      z-index: 10001;
      flex-grow: 1;
      top: 0;
      left: 0;
      width: var(--width);
      height: var(--height);
      background-color: #fefefe;
      padding: 2rem;
      border-radius: 0.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    #content #header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    #content #header p {
      font-weight: 600;
      font-size: 1.25rem;
    }

    #content #header button {
      background: unset;
      border: 0;
      font-size: 1.15rem;
      cursor: pointer;
      color: var(--gray-600, #656565);
    }

    @media (min-width: 650px) {
      #content {
        position: relative;
        max-width: var(--wantedWidth);
        height: fit-content;
      }
    }
  `;

  @property({ type: Boolean }) open: boolean = false;

  @property({ type: String }) wantedWidth: string = "24rem";

  @property() modaltitle = "Needs Title";

  private lastFocus: HTMLElement | null = null;

  close() {
    this.dispatchEvent(new CustomEvent("close"));
    if (this.lastFocus) {
      this.lastFocus.focus();
    }
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.open) {
      this.close();
    }
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this._handleKeyDown);
  }

  disconnectedCallback() {
    window.removeEventListener("keydown", this._handleKeyDown);
    super.disconnectedCallback();
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (
      changedProperties.has("open") &&
      this.open &&
      changedProperties.get("open") !== this.open
    ) {
      const contentEl = this.shadowRoot?.getElementById("content");
      if (contentEl) {
        this.lastFocus = document.activeElement as HTMLElement;
        contentEl.focus();
      }
    }

    if (
      changedProperties.has("open") &&
      !this.open &&
      changedProperties.get("open") !== this.open
    ) {
      if (this.lastFocus) {
        this.lastFocus.focus();
      }
    }
  }

  render() {
    if (!this.open) return html``;

    return html`
      <div>
        <div id="backdrop" @click=${this.close}></div>
        <div
          id="content"
          tabindex="-1"
          style="--wantedWidth: ${this.wantedWidth}"
        >
          <div id="header">
            <p>${this.modaltitle}</p>

            <button
              @click=${this.close}
              aria-label="close modal"
              title="Close modal"
            >
              &times;
            </button>
          </div>

          <slot><p>Please fill slot.</p></slot>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "modal-component": ModalComponent;
  }
}
