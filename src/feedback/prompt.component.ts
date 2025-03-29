import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { createRef, ref } from "lit/directives/ref.js";
import { ifDefined } from "lit-html/directives/if-defined.js";

import "../modal/modal.component";
import "../buttons/button.component";
import { inputStyles } from "../styles/inputs.style";

export type PromptType =
  | "text"
  | "number"
  | "decimal"
  | "tel"
  | "textarea"
  | "date";

export async function Prompt(data: PromptInterface): Promise<PromptResponse> {
  const id = crypto.randomUUID();
  data.id = id;

  return new Promise((resolve) => {
    // Add an event listener that only runs once
    window.addEventListener(
      `fl-response-${data.id}`,
      (e: Event) => {
        const responseEvent = e as CustomEvent<PromptResponse>;
        resolve(responseEvent.detail);
      },
      { once: true },
    );

    // Dispatch the prompt event
    window.dispatchEvent(new CustomEvent("fl-prompt", { detail: data }));
  });
}

export interface PromptInterface {
  id: string;
  title: string;
  description: string;
  type: PromptType;
  pattern?: string;
  patternError?: string;
}

export interface PromptResponse {
  id: string;
  value?: string;
  canceled?: boolean;
}

@customElement("prompt-component")
export class PromptComponent extends LitElement {
  static styles = [
    css`
      :host {
        --transition: 600ms;
      }

      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }

      #feedback {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        gap: 1rem;
      }

      #feedback > div {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      #feedback > div > p {
        margin-bottom: 0.75rem;
      }

      p.error {
        margin-top: 1rem;
        color: var(--danger-600, #e01e47);
      }
    `,
    inputStyles,
  ];

  @property() open = false;

  @state() promptID: string = "";

  @state() promptType: PromptType = "text";

  @state() promptTitle: string = "";

  @state() promptDescription: string = "";

  @state() promptValue: string = "";

  @state() promptPattern?: string = "";

  @state() promptPatternError?: string = "";

  inputRef = createRef();

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("fl-prompt", this.openPrompt);
  }
  disconnectedCallback() {
    window.removeEventListener("fl-prompt", this.openPrompt);
    super.disconnectedCallback();
  }

  openPrompt = (e: Event) => {
    let { detail } = e as CustomEvent<PromptInterface>;

    this.promptID = detail.id;
    this.promptType = detail.type;
    this.promptTitle = detail.title;
    this.promptDescription = detail.description;
    this.promptPattern = detail.pattern;
    this.promptPatternError = detail.patternError;
    this.open = true;
  };

  handleChange(e: InputEvent) {
    this.promptValue = (e.target as HTMLInputElement).value;
  }

  submitPrompt() {
    window.dispatchEvent(
      new CustomEvent(`fl-response-${this.promptID}`, {
        detail: {
          id: this.promptID,
          value: this.promptValue,
        } as PromptResponse,
      }),
    );
    this.close();
  }

  close(canceled?: boolean) {
    if (canceled) {
      window.dispatchEvent(
        new CustomEvent(`fl-response-${this.promptID}`, {
          detail: {
            canceled: true,
          } as PromptResponse,
        }),
      );
    }
    this.reset();
  }

  reset() {
    this.open = false;
    this.promptType = "text";
    this.promptTitle = "";
    this.promptDescription = "";
    this.promptID = "";
    this.promptValue = "";
    this.promptPattern = "";
    this.promptPatternError = "";
    (this.shadowRoot?.getElementById("input") as HTMLInputElement).value = "";
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (
      changedProperties.has("open") &&
      !this.open &&
      changedProperties.get("open") !== this.open
    ) {
      this.reset();
    }
  }

  getInputMode() {
    switch (this.promptType) {
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

  render() {
    return html`<modal-component
      .open=${this.open}
      .modaltitle="${this.promptTitle}"
      @close=${this.close}
    >
      <div id="feedback">
        <div>
          ${this.promptDescription !== ""
            ? html` <p>${this.promptDescription}</p> `
            : undefined}
          ${this.promptType === "textarea"
            ? html` <textarea
                id="input"
                @input=${this.handleChange}
                placeholder="type something"
                style="flex-grow: 1;"
              ></textarea>`
            : html`
                <input
                  ${ref(this.inputRef)}
                  pattern=${ifDefined(this.promptPattern || undefined)}
                  step="${this.promptType === "decimal" ? "0.01" : ""}"
                  type="${this.promptType === "decimal"
                    ? "number"
                    : this.promptType}"
                  inputmode="${this.getInputMode()}"
                  id="input"
                  @input=${this.handleChange}
                  placeholder="type something"
                />
                ${this.promptPatternError &&
                !(this.inputRef.value! as HTMLInputElement)?.validity?.valid
                  ? html` <p class="error">${this.promptPatternError}</p>`
                  : ""}
              `}
        </div>

        <button-component
          class="big"
          @fl-click=${this.submitPrompt}
          .disabled=${this.promptValue.length === 0 ||
          ((this.inputRef.value as HTMLInputElement)?.validity !== undefined &&
            !(this.inputRef.value as HTMLInputElement)?.validity?.valid)}
          >Submit</button-component
        >
      </div>
    </modal-component>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "prompt-component": PromptComponent;
  }
}
