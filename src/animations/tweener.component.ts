import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("tweener-component")
export class TweenerComponent extends LitElement {
  static styles = css`
    :host {
      --transition: 600ms;
    }
    :host(.badged) #number {
      padding: 0.5rem 1.25rem 0.5rem 1rem;
      border-radius: 1rem;
      transition: background-color var(--transition);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
    }

    span {
      font-variant-numeric: tabular-nums;
    }

    :host(.badged) #number.negative {
      background-color: #d35437;
      color: #ffe7e7;
    }

    :host(.badged) #number.positive {
      background-color: rgb(24 157 74);
      color: #e9fff0;
    }

    :host(.badged) svg {
      padding: 0;
      margin-right: 0.25rem;
      transition:
        fill var(--transition),
        transform calc(var(--transition) / 2);
    }

    :host(.badged) #number.negative svg {
      transform: rotate(180deg);
      fill: #fadddd;
    }

    :host(.badged) #number.positive svg {
      fill: #d3fdd7;
    }

    :host(.badged) span#percentage {
      opacity: 0.8;
      font-size: 0.85rem;
    }

    :host(:not(.badged)) svg {
      display: none;
    }
  `;

  // Define a reactive property
  @property({
    type: Number,
    hasChanged(value, oldValue) {
      return value !== oldValue;
    },
  })
  currentNumber = 0;

  @property({ type: Boolean }) percentageGain = false;

  @state() onNumber = 0;

  @state() wantsNumber = -100;

  firstUpdated() {
    this.animateNumber(0, this.currentNumber);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (
      changedProperties.has("currentNumber") &&
      changedProperties.get("currentNumber") !== undefined
    ) {
      const oldValue = changedProperties.get("currentNumber") as number;
      this.animateNumber(oldValue, this.currentNumber);
    }
  }

  // Render the component's template
  render() {
    return html`
      <div
        id="number"
        class="${this.wantsNumber > 0 ? "positive" : "negative"}"
      >
        <svg
          width="10"
          height="20"
          viewBox="0 0 108 175"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M68.7669 164.961V50.9009L84.4307 66.5647C88.3359 70.4699 94.6676 70.4699 98.5728 66.5647L104.604 60.5333C108.509 56.6281 108.509 50.2964 104.604 46.3912L61.1419 2.92893C59.1118 0.898805 56.426 -0.075966 53.7661 0.00461449C51.1066 -0.0757464 48.4211 0.899035 46.3912 2.92896L2.92893 46.3912C-0.976313 50.2964 -0.976308 56.6281 2.92893 60.5333L8.96029 66.5647C12.8655 70.4699 19.1972 70.4699 23.1024 66.5647L40.2373 49.4298V164.961C40.2373 170.483 44.7144 174.961 50.2373 174.961H58.7669C64.2897 174.961 68.7669 170.483 68.7669 164.961Z"
          />
        </svg>
        <span>
          ${Number.isNaN(this.onNumber)
            ? 0
            : Math.max(this.onNumber, 0).toFixed(0)}</span
        >
        ${this.percentageGain ? html`<span id="percentage">%</span>` : html``}
      </div>
    `;
  }

  animateNumber(start: number, end: number) {
    this.wantsNumber = end;
    const duration = 200; // Animation duration in ms

    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const currentNumber = Math.round(start + (end - start) * progress);

      this.onNumber = currentNumber;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  set(to: number) {
    this.animateNumber(this.onNumber, to);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "tweener-component": TweenerComponent;
  }
}
