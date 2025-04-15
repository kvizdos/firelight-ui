import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { range } from "lit/directives/range.js";
import { map } from "lit/directives/map.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

@customElement("step-progress")
export class StepProgressComponent extends LitElement {
  // @property() defaultHour = 12;

  @property() numberOfSteps = 5;

  @property() currentStep = 2;

  @property() currentStepProgress = 0.85;

  @property() progressStyle: "numeric" | "flow" = "numeric";

  increment() {
    this.currentStep++;
    this.currentStepProgress = 0;
  }

  decrement() {
    this.currentStep--;
    this.currentStepProgress = 1;
  }

  increaseProgressBy(amount: number) {
    this.currentStepProgress = Math.max(
      Math.min(this.currentStepProgress + amount, 1),
      0,
    );
  }

  static styles = [
    css`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;

        --step-color: var(--primary-500, #5370f1);
        --future-step-color: var(--primary-100, #e2e7fd);
      }

      #step-progress {
        display: flex;
        align-items: center;
        gap: 0.35rem;
      }

      div.indicator {
        font-size: 1rem;
        font-weight: bold;
        color: #333;
        height: 2rem;
        aspect-ratio: 1/1;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--future-step-color);
        color: var(--step-color);
        font-variant-numeric: tabular-nums;
        position: relative;
        transition: 200ms;
        transition-delay: 190ms;
      }

      div.indicator.seen {
        background-color: var(--step-color);
        color: #fff;
        border: 5px solid var(--step-color);
      }

      #step-progress.flow div.indicator:not(.seen) {
        color: transparent;
        stroke: transparent;
        background-color: unset;
        border: 5px solid var(--future-step-color);
      }

      #step-progress.flow div.indicator.seen {
        stroke: #fff;
      }

      .step {
        display: inline-flex;
        width: 100%;
        content: " ";
        background-color: var(--future-step-color);
        border-radius: 1rem;
        font-size: 0.65rem;
        overflow: hidden;
      }

      .step .step-inner {
        --progress: 0px;
        width: var(--progress);
        border-radius: 1rem;
        background-color: var(--step-color);
        transition: 200ms;
      }
    `,
  ];

  render() {
    return html` <div
      id="step-progress"
      class=${classMap({
        flow: this.progressStyle === "flow",
        numeric: this.progressStyle === "flow",
      })}
    >
      ${map(
        range(0, this.numberOfSteps),
        (index: number) => html`
          <div
            class=${classMap({
              seen: index <= this.currentStep,
              indicator: true,
            })}
          >
            <p>
              ${this.progressStyle === "numeric"
                ? index + 1
                : html`<svg
                    width="15.75"
                    height="12"
                    viewBox="0 0 21 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 9.5L7 14.5L19.5 2"
                      stroke-width="4"
                      stroke-linejoin="round"
                    />
                  </svg>`}
            </p>
          </div>
          ${index !== this.numberOfSteps - 1
            ? html`
                <div
                  class=${classMap({
                    step: true,
                    seen: index <= this.currentStep,
                  })}
                >
                  <div
                    class="step-inner"
                    style=${styleMap({
                      "--progress":
                        index < this.currentStep
                          ? `100%`
                          : index === this.currentStep
                            ? `${this.currentStepProgress * 100}%`
                            : "0%",
                    })}
                  >
                    &nbsp;
                  </div>
                </div>
              `
            : html``}
        `,
      )}
    </div>`;
  }
}
