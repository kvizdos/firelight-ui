import { LitElement, html, css } from "lit";
import { state, customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("radio-input")
export class RadioInputComponent extends LitElement {
  @property() width: number = 20;
  @property() enabled: boolean = false;
  @property() label: string = "Click to check";
  @property() userSelectable: boolean = true;

  static styles = [
    css`
      :host {
        --using-border: var(--fl-checkbox-border, var(--gray-400, #989898));
        --using-background: var(
          --fl-checkbox-unchecked-background,
          var(--gray-50, #f8f8f8)
        );
        --inner: transparent;
        height: 20px;
      }

      button {
        height: var(--height, 20px);
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        width: fit-content;
        background: 0;
        border: 0;
        border-radius: 100%;
      }

      svg {
        transition: 250ms;
      }

      :host(.emulate-hover) button svg,
      button:hover svg,
      button:focus-visible svg {
        transition: 250ms;
        --using-border: var(
          --fl-checkbox-border-hover,
          var(--primary-400, #59a2ff)
        );
        --inner: var(--using-border);
        cursor: pointer;
      }

      svg.active circle#outer {
        --using-border: var(
          --fl-checkbox-border-active,
          var(--primary-600, #1a5cf4)
        );
        --using-background: #fff;
      }

      svg.active circle#inner {
        --inner: var(--fl-checkbox-border-active, var(--primary-600, #1a5cf4));
      }

      svg circle#outer {
        fill: var(--using-background);
        stroke: var(--using-border);
        transition:
          fill 250ms,
          stroke 250ms;
      }

      svg circle#inner {
        fill: var(--inner);
        transition: fill 250ms;
      }

      svg circle#outer {
        fill: var(--using-background);
        stroke: var(--using-border);
      }
      svg circle#inner {
        fill: var(--inner);
      }
    `,
  ];

  handleClick() {
    this.enabled = !this.enabled;
    const event = new CustomEvent("checked", {
      detail: {
        status: this.enabled,
      },
    });
    this.dispatchEvent(event);
  }

  get value() {
    return this.enabled ? "true" : "false";
  }

  set value(to: string) {
    if (to === "true") {
      this.enabled = true;
      return;
    }

    this.enabled = false;
  }

  render() {
    return html`<button
      @click=${this.handleClick}
      aria-label="${this.label}"
      style="height: ${this.width}px;"
      ?disabled=${!this.userSelectable}
    >
      <svg
        width="${this.width}"
        height="${this.width}"
        class=${classMap({
          active: this.enabled,
        })}
      >
        <circle
          id="outer"
          cx="${this.width / 2}"
          cy="${this.width / 2}"
          r="${this.width / 2 - 1}"
          stroke-width="2"
        />
        <circle
          id="inner"
          cx="${this.width / 2}"
          cy="${this.width / 2}"
          r="${this.width / 4 - 1}"
        />
      </svg>
    </button>`;
  }
}
