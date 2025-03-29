import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("button-component")
export class ButtonComponent extends LitElement {
  static styles = css`
    :host {
      --button-bg: var(--fl-button-bg, var(--primary-500, #327eff));
      --button-text: var(--fl-button-text, #fff);
      --border-radius: 0.5rem;
      --padding: 0.5rem 1rem;
      --weight: 500;
    }

    :host(.pill) {
      --border-radius: 5rem;
      --padding: 0.5rem 1.15rem;
    }

    :host(.big) {
      --padding: 0.85rem;
      --weight: 600;
    }

    button {
      background-color: var(--button-bg);
      color: var(--button-text);
      border: 0;
      padding: var(--padding);
      border-radius: var(--border-radius);
      cursor: pointer;
      font-weight: var(--weight);
      transition: 200ms;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }

    :host(.big) button {
      width: 100%;
    }

    :host(.plain) button {
      background-color: unset;
      color: var(--button-bg);
      padding: 0;
    }

    button.loading {
      gap: 0.5rem;
    }

    button[disabled] {
      --button-bg: var(--fl-button-bg-disabled, var(--primary-100, #d9eaff));
      --button-text: var(
        --fl-button-text-disabled,
        var(--primary-500, #327eff)
      );
      cursor: not-allowed;
    }

    :host(.plain) button[disabled] {
      color: var(--fl-button-plain-disabled, var(--primary-400, #59a2ff));
    }

    button:not([disabled]):hover {
      --button-bg: var(--fl-button-bg-hover, var(--primary-600, #1a5cf4));
    }

    button:not([disabled]):active {
      --button-bg: var(--fl-button-bg-active, var(--primary-800, #173ab6));
      transition: 50ms;
    }

    svg {
      width: 0;
      height: 12px;
    }

    button.loading svg {
      width: 12px;
    }

    svg path {
      transform-origin: center;
      animation: spin 1200ms linear infinite;
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `;

  @property() disabled: boolean = false;

  @property() expectLoad: boolean = false;

  @property() loading: boolean = false;

  @property() loadingText: string = "";

  render() {
    return html`<button
      ?disabled=${this.disabled || this.loading}
      class=${classMap({
        loading: this.loading,
      })}
      @click=${() => {
        this.dispatchEvent(new Event("fl-click"));
      }}
    >
      ${this.expectLoad
        ? html`
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M50 88.5C42.3854 88.5 34.9418 86.242 28.6105 82.0116C22.2793 77.7811 17.3446 71.7683 14.4306 64.7333C11.5167 57.6984 10.7542 49.9573 12.2398 42.489C13.7253 35.0208 17.3921 28.1607 22.7764 22.7764C28.1607 17.3921 35.0208 13.7253 42.489 12.2398C49.9573 10.7542 57.6984 11.5167 64.7333 14.4306C71.7683 17.3446 77.7811 22.2793 82.0116 28.6105C86.242 34.9418 88.5 42.3854 88.5 50"
                stroke="var(--fl-button-loader-loop, var(--primary-300, #8ec4ff))"
                stroke-width="15"
              />
              <path
                id="spinner"
                d="M88.5 50C88.5 55.0559 87.5042 60.0623 85.5694 64.7333C83.6346 69.4043 80.7987 73.6486 77.2236 77.2236C73.6486 80.7987 69.4043 83.6346 64.7333 85.5694C60.0623 87.5042 55.0559 88.5 50 88.5"
                stroke="var(--fl-button-loader-spinner, var(--primary-600, #1a5cf4))"
                stroke-width="15"
              />
            </svg>
          `
        : html``}
      ${this.loading && this.loadingText !== ""
        ? this.loadingText
        : html`<slot></slot>`}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "button-component": ButtonComponent;
  }
}
