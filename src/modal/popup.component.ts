import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("popup-menu")
export class PopupMenu extends LitElement {
  static styles = css`
    :host {
      position: relative;
      display: inline-block;
      --width: 14rem;
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

    #dropdown * {
      box-sizing: border-box;
      margin: 0;
    }

    /* Horizontal alignment relative to trigger */
    :host([location-horizontal="left"]) #dropdown {
      left: 0;
      right: auto;
    }

    :host([location-horizontal="right"]) #dropdown {
      left: auto;
      right: 0;
    }

    /* Top placement override */
    :host([location-vertical="top"]) #dropdown {
      top: auto;
      bottom: 100%;
      margin-top: 0;
      margin-bottom: 1rem;

      border-top: 1px solid var(--gray-100, #eaeaea);
      border-bottom: 2px solid var(--primary-700, #1448e1);
      border-radius: 0.85rem 0 0 0;
    }

    /* Corner radius logic for all combinations */
    :host([location-vertical="top"][location-horizontal="left"]) #dropdown {
      border-radius: 0 0.85rem 0 0;
    }

    :host([location-vertical="bottom"][location-horizontal="left"]) #dropdown {
      border-radius: 0 0 0.85rem 0;
    }
  `;
  @property({ type: Boolean }) open = false;

  @property({ reflect: true, attribute: "location-vertical" })
  vertical: "top" | "bottom" = "top";

  @property({ reflect: true, attribute: "location-horizontal" })
  horizontal: "left" | "right" = "right";

  private handleClickOutside = (e: MouseEvent) => {
    if (!this.shadowRoot?.host.contains(e.target as Node)) {
      this.open = false;
      window.removeEventListener("click", this.handleClickOutside);
      window.removeEventListener("keydown", this.handleEscape);
    }
  };

  private handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") this.open = false;
  };

  updated(changed: Map<string, unknown>) {
    if (changed.has("open")) {
      if (this.open) {
        window.addEventListener("click", this.handleClickOutside);
        window.addEventListener("keydown", this.handleEscape);
      } else {
        window.removeEventListener("click", this.handleClickOutside);
        window.removeEventListener("keydown", this.handleEscape);
      }
    }
  }

  private attachTriggerClick(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedElements({ flatten: true });

    if (nodes.length) {
      const el = nodes[0];
      el.removeEventListener("click", this.toggleOpen); // avoid duplicates
      el.addEventListener("click", this.toggleOpen);
    }
  }

  private toggleOpen = () => {
    this.open = !this.open;
  };

  render() {
    return html`
      <slot name="trigger" @slotchange=${this.attachTriggerClick}></slot>
      <div id="dropdown" class=${classMap({ closed: !this.open })}>
        <slot></slot>
      </div>
    `;
  }
}
