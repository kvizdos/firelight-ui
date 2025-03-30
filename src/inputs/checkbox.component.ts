import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("checkbox-component")
export class CheckboxComponent extends LitElement {
  @property({ type: Boolean }) userSelectable = true;
  @property({ type: Number }) size = 24;
  @property({ type: Number }) _stroke = 2;
  @property({ type: String }) uid = "";
  @property({ type: Boolean }) checked = false;
  @property({ type: Boolean }) danger = false;
  @property({ type: Boolean }) handleTabOutside = false;

  static styles = [
    css`
      :host {
        height: 26px;
      }
    `,
  ];

  handleClick() {
    if (!this.userSelectable) return;
    this.checked = !this.checked;
    const event = new CustomEvent("checked", {
      detail: {
        status: this.checked,
        uid: this.uid,
      },
    });
    this.dispatchEvent(event);
  }

  handleKeydown(e: KeyboardEvent) {
    if (e.key === " " || e.key === "Enter") {
      this.handleClick();
    }
  }

  render() {
    return html`<svg
      tabindex="${this.handleTabOutside ? "-1" : "0"}"
      width="${this.size + this._stroke}"
      height="${this.size + this._stroke}"
      viewBox="0 0 ${this.size + this._stroke} ${this.size + this._stroke}"
      fill="none"
      @keydown=${this.handleKeydown}
      class="${this.checked ? "checked" : ""}${this.userSelectable
        ? " selectable"
        : ""}${this.danger ? " danger" : ""}"
      xmlns="http://www.w3.org/2000/svg"
      @click=${this.handleClick}
    >
      <style>
        svg.selectable {
          cursor: pointer;
        }
        svg:focus {
          outline: 0;
        }
        svg:focus-visible {
          outline: 2px solid
            var(--fl-checkbox-focus, var(--primary-400, #59a2ff));
          border-radius: 0.25rem;
        }
        svg rect {
          transition: 200ms;
        }
        svg.danger rect#box {
          fill: var(--fl-checkbox-danger, var(--danger-700, #b8123a));
          stroke: var(--fl-checkbox-danger, var(--danger-700, #b8123a));
        }
        svg.danger rect:not(#box) {
          fill: white;
        }
        svg:not(.danger).checked rect#box {
          fill: var(--fl-checkbox-active-bg, var(--primary-700, #1448e1));
        }
        svg.checked rect:not(#box) {
          fill: white;
        }
        svg.checked rect#right {
          height: ${this.size / 2 + 2}px;
          x: ${this.size / 2 + 2}px;
        }
        svg.checked rect#left {
          height: ${this.size / 4 + 1}px;
          x: ${this.size / 2 - 6}px;
          y: ${this.size / 2 - 4}px;
        }
        svg rect#box {
          transition: 200ms;
        }
        svg.selectable:hover rect#box {
          fill: var(
            --fl-checkbox-hover-bg,
            var(--primary-400, #59a2ff)
          ); /* Change color on hover */
          stroke: var(--fl-checkbox-hover-bg, var(--primary-400, #59a2ff));
          transition: 200ms;
        }
        svg.selectable.checked:hover rect:not(#box) {
          fill: #d9d9d9; /* Change color on hover */
        }

        svg.selectable.danger:hover rect#box {
          fill: var(--fl-checkbox-danger-hover, var(--danger-600, #e01e47));
          stroke: var(--fl-checkbox-danger-hover, var(--danger-600, #e01e47));
        }
      </style>
      <rect
        x="2"
        y="2"
        width="${this.size - this._stroke}"
        height="${this.size - this._stroke}"
        rx="4"
        fill="white"
        stroke="var(--fl-checkbox-active-bg, var(--primary-700, #1448e1))"
        stroke-width="${this._stroke}"
        id="box"
      />

      <rect
        x="${this.size / 2 - 0}"
        y="${this.size / 6}"
        width="4"
        height="${this.size - 8}"
        rx="1"
        fill="#D9D9D9"
        id="right"
        transform="rotate(45 ${this.size / 2} ${this.size / 2})"
      />

      <rect
        x="${this.size / 2 - 2}"
        y="${this.size / 6 + 2}"
        width="4"
        height="${this.size - 8}"
        rx="1"
        id="left"
        fill="#D9D9D9"
        transform="rotate(-45 ${this.size / 2} ${this.size / 2})"
      />
    </svg> `;
  }
}
