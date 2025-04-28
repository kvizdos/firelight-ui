import { LitElement, html, css, TemplateResult } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "../progress/stepper.component";
import { inputStyles } from "../styles/inputs.style";
import "../buttons/button.component";
import "../inputs/checkbox.component";
import "../inputs/time-picker.component";
import {
  MultistepForm,
  MultistepFormQuestion,
  MultistepFormStage,
  MultistepFormValues,
} from "./multistep-form.types";
import { map } from "lit/directives/map.js";
import { repeat } from "lit/directives/repeat.js";
import { ifRegexDefined } from "../directives/pattern-regex.directive";
import { emailRegex } from "../regex/email.pattern";
import { createRef, ref, Ref } from "lit/directives/ref.js";
import { StepProgressComponent } from "../progress/stepper.component";

@customElement("multistep-form")
export class MultistepFormComponent extends LitElement {
  @state() private currentStage = 0;

  @state() private values: MultistepFormValues = {};

  @state() private fieldValidity: Record<string, boolean> = {};

  @state() private callbackLoading: Boolean = false;

  progressRef: Ref<StepProgressComponent> = createRef();

  @property() form: MultistepForm = {
    stages: [],
  };

  static styles = [
    inputStyles,
    css`
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      #container {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 1rem;
      }

      #progress-container > step-progress {
        width: 100%;
        font-size: 24px;
      }

      #progress-container > hr {
        margin-top: 1rem;
        width: 100%;
        border: none;
        border-top: 1px solid var(--gray-100, #e4e4e4);
      }

      #header h1 {
        font-size: 1.5rem;
        color: rgb(46 46 46);
      }

      #header p {
        font-size: 1rem;
        color: #454545;
        font-weight: 300;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        line-height: 1.35rem;
      }

      button-component {
        margin-top: 1rem;
      }

      .disclaimer {
        font-weight: 300;
        font-size: 0.85rem;
      }

      #back-button {
        border: 0;
        background-color: unset;
        cursor: pointer;
        color: var(--primary-800, #007bff);
        text-align: left;
      }
    `,
  ];

  getInputMode(type: string) {
    switch (type) {
      case "number":
        return "numeric";
      case "decimal":
        return "decimal";
      case "tel":
        return "tel";
      default:
        return "text";
    }
  }

  with(stage: number, callback: (stage: MultistepFormStage) => TemplateResult) {
    return callback(this.form.stages[stage]);
  }

  onInput(
    e: InputEvent | CustomEvent,
    stageID: string,
    question: MultistepFormQuestion,
  ) {
    if (question.type === "checkbox") {
      const { status } = (e as CustomEvent<{ status: boolean }>).detail;

      // Save the value
      this.values = {
        ...this.values,
        [stageID]: {
          ...this.values[stageID],
          [question.id]: status,
        },
      };

      return;
    }

    const inputElement = e.target as HTMLInputElement;

    if (
      question.type === "tel" &&
      inputElement.value.length === 10 &&
      !inputElement.value.includes("(")
    ) {
      inputElement.value = `(${inputElement.value.slice(0, 3)}) ${inputElement.value.slice(3, 6)}-${inputElement.value.slice(6)}`;
    }

    if (
      question.type === "tel" &&
      inputElement.value.length === 11 &&
      !inputElement.value.includes("(") &&
      inputElement.value[0] === "1"
    ) {
      inputElement.value = `(${inputElement.value.slice(1, 4)}) ${inputElement.value.slice(4, 7)}-${inputElement.value.slice(7)}`;
    }

    const key = `${stageID}:${question.id}`;
    const isValidNow = inputElement.validity.valid;
    const wasValidBefore = this.fieldValidity[key] ?? false;

    // Check for validity *change*
    if (isValidNow !== wasValidBefore) {
      const stage = this.form.stages.find((s) => s.id === stageID);
      const numQuestions = stage?.questions.length ?? 1;
      const inc = 1 / numQuestions;

      this.progressRef.value!.increaseProgressBy(isValidNow ? inc : -inc);
      this.fieldValidity = {
        ...this.fieldValidity,
        [key]: isValidNow,
      };
    }

    // Save the value
    this.values = {
      ...this.values,
      [stageID]: {
        ...this.values[stageID],
        [question.id]: inputElement.value,
      },
    };
  }

  isStageComplete(stage: MultistepFormStage): boolean {
    const stageValues = this.values[stage.id] ?? {};
    return stage.questions.every((q) => {
      if (!q.required) {
        return true;
      }

      const value = stageValues[q.id]?.toString().trim();
      const input = this.renderRoot.querySelector(
        `#${q.id}`,
      ) as HTMLInputElement;

      console.table({
        qid: q.id,
        type: q.type,
        value: value,
        input: input?.value,
      });

      if (input?.value.length > 0) {
        if (input?.validity.valid && !!value) {
          return true;
        }

        return false;
      } else {
        if (
          q.type === "hour-picker" &&
          input !== undefined &&
          this.values[stage.id]?.[q.id] === undefined
        ) {
          this.values = {
            ...this.values,
            [stage.id]: {
              ...this.values[stage.id],
              [q.id]: "12",
            },
          };
          const key = `${stage.id}:${q.id}`;
          this.fieldValidity[key] = true;

          setTimeout(() => {
            this.progressRef.value!.increaseProgressBy(
              1 / this.form.stages[this.currentStage].questions.length,
            );
          }, 50);
        }
      }

      return !!value;
    });
  }

  render() {
    return html`
      <div id="container">
        <div id="progress-container">
          <step-progress
            size="0.75rem"
            numberOfSteps=${this.form.stages.length}
            .currentStep=${this.currentStage}
            ${ref(this.progressRef)}
          ></step-progress>

          <!-- <hr /> -->
        </div>

        ${this.with(
          this.currentStage,
          (stage: MultistepFormStage) => html`
            <div id="header">
              <h1>${stage.title}</h1>
              ${stage.description !== undefined
                ? html`<p>${stage.description}</p>`
                : html``}
            </div>

            ${repeat(
              stage.questions,
              (q) => `${stage.id}:${q.id}`,
              (question) => {
                if (question.type === "checkbox") {
                  return html` <div class="checkbox-container">
                    <checkbox-component
                      .checked=${this.values[stage.id]?.[question.id] ?? false}
                      id="${question.id}"
                      @checked=${(e: InputEvent) =>
                        this.onInput(e, stage.id, question)}
                    ></checkbox-component>
                    <p>${question.label}</p>
                  </div>`;
                }

                if (question.type === "hour-picker") {
                  return html` <div class="input-container">
                    <label for="${question.id}">${question.label}</label>

                    <time-picker-component
                      id="${question.id}"
                      .defaultTo=${this.values[stage.id]?.[question.id] ?? "12"}
                      class="wide"
                      .forceMinutes=${true}
                      @fl-input=${(e: InputEvent) =>
                        this.onInput(e, stage.id, question)}
                    ></time-picker-component>
                  </div>`;
                }

                return html`
                  <div class="input-container">
                    <label for="${question.id}">${question.label}</label>
                    ${question.description !== undefined
                      ? html`<p>${question.description}</p>`
                      : html``}
                    <input
                      required
                      inputmode="${this.getInputMode(question.type)}"
                      type="${question.type}"
                      id="${question.id}"
                      autocomplete=${question.autocomplete ?? "nope"}
                      placeholder="${question.placeholder}"
                      pattern=${ifRegexDefined(question.pattern)}
                      .value=${this.values?.[stage.id]?.[question.id] ?? ""}
                      @input=${(e: InputEvent) =>
                        this.onInput(e, stage.id, question)}
                    />
                    ${question.validityErrorMsg !== undefined
                      ? html`<p id="error">${question.validityErrorMsg}</p>`
                      : html``}
                  </div>
                `;
              },
            )}
          `,
        )}

        <button-component
          class="big"
          .expectLoad=${this.form.stages[this.currentStage].continueCallback !==
          undefined}
          .disabled=${!this.isStageComplete(
            this.form.stages[this.currentStage],
          )}
          .loading=${this.callbackLoading}
          @fl-click=${async () => {
            const cb = this.form.stages[this.currentStage].continueCallback;
            if (cb !== undefined) {
              try {
                this.callbackLoading = true;
                await cb(this.values);
              } catch (e) {
                console.error(e);
                alert("Something went wrong!");
              } finally {
                this.callbackLoading = false;
              }
            } else {
              this.currentStage++;
              this.progressRef.value!.increment();
            }
          }}
          >${this.form.stages[this.currentStage].continueButtonText ??
          "Continue"}</button-component
        >

        ${this.with(this.currentStage, (stage: MultistepFormStage) =>
          stage.disclaimer
            ? html`<p class="disclaimer">${stage.disclaimer}</p>`
            : html``,
        )}
        ${this.currentStage > 0
          ? html`
              <button
                id="back-button"
                @click=${() => {
                  this.currentStage--;
                }}
              >
                Go Back
              </button>
            `
          : html``}
      </div>
    `;
  }
}
