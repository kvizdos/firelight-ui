import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("popup-menu")
export class PopupMenu extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-block;
      --width: 14rem;
    }

    #trigger {
      all: unset;
      cursor: pointer;
      display: inline-block;
    }

    #dropdown {
      position: absolute;
      top: 100%;
      margin-top: 0.65rem;
      width: var(--width);
      padding: 1.15rem;
      background-color: #fff;
      border-top: 2px solid var(--primary-700, #1448e1);
      border-right: 1px solid var(--gray-100, #eaeaea);
      border-left: 1px solid var(--gray-100, #eaeaea);
      border-bottom: 1px solid var(--gray-100, #eaeaea);
      border-radius: 0 0 0 0.85rem;
      box-shadow:
        0 4px 12px rgba(0, 0, 0, 0.1),
        0 2px 4px rgba(0, 0, 0, 0.06);
      transition: 200ms ease;
      opacity: 1;
      z-index: 999;
    }

    #dropdown.closed {
      transform: scale3d(0.9, 0.9, 0.9);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    #contentarea {
      width: 100%;
    }

    :host([location-horizontal="left"]) #dropdown {
      left: 0;
      right: auto;
    }

    :host([location-horizontal="right"]) #dropdown {
      left: auto;
      right: 0;
    }

    :host([location-vertical="top"]) #dropdown {
      top: auto;
      bottom: 100%;
      margin-top: 0;
      margin-bottom: 1rem;
      border-top: 1px solid var(--gray-100, #eaeaea);
      border-bottom: 2px solid var(--primary-700, #1448e1);
      border-radius: 0.85rem 0 0 0;
    }

    :host([location-vertical="top"][location-horizontal="left"]) #dropdown {
      border-radius: 0 0.85rem 0 0;
    }

    :host([location-vertical="bottom"][location-horizontal="left"]) #dropdown {
      border-radius: 0 0 0.85rem 0;
    }
  `;

  @property({ type: Boolean }) open = false;

  @property({ type: Boolean }) hasContentArea = false;

  @property({ reflect: true, attribute: "location-vertical" })
  vertical: "top" | "bottom" = "top";

  @property({ reflect: true, attribute: "location-horizontal" })
  horizontal: "left" | "right" = "right";

  @query("#dropdown") dropdown!: HTMLDivElement;

  toggle() {
    this.open = !this.open;
  }

  close() {
    this.open = false;
  }

  connectedCallback(): void {
    super.connectedCallback();
    window.addEventListener("click", this._onOutsideClick);
    window.addEventListener("keydown", this._onEscape);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener("click", this._onOutsideClick);
    window.removeEventListener("keydown", this._onEscape);
  }

  private _onOutsideClick = (e: MouseEvent) => {
    if (!e.composedPath().includes(this)) {
      this.close();
    }
  };

  private _onEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.close();
    }
  };

  render() {
    return html`
      <div id="trigger" @click=${this.toggle}>
        <slot name="trigger"></slot>
      </div>
      <div
        id="contentarea"
        style="display: ${this.hasContentArea ? "inherit" : "none"}"
      >
        <slot name="contentarea"></slot>
      </div>
      <div id="dropdown" class=${classMap({ closed: !this.open })}>
        <slot></slot>
      </div>
    `;
  }
}
