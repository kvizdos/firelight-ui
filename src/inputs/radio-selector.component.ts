import { LitElement, html, css } from "lit";
import { state, customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import "./radio-input.component";
import { RadioSelectorType } from "./radio-selector.types";

@customElement("radio-selector")
export class RadioSelectorComponent extends LitElement {
  @property() default: string = "";

  @state() activeChoice: string = "";
  @property() choices: RadioSelectorType[] = [
    {
      key: "small",
      title: "Small",
      description: "Small T-Shirt Size",
    },
    {
      key: "medium",
      title: "Medium",
      description: "Medium T-Shirt Size",
    },
    {
      key: "large",
      title: "Large",
      description: "A big big t shirt",
    },
  ];

  get value() {
    return this.activeChoice;
  }

  set value(to: string) {
    this.activeChoice = to;
  }

  static styles = [
    css`
      #container {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .choice {
        cursor: pointer;
      }
      .choice div {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      p {
        margin: 0;
        padding: 0;
      }

      .choice p#title {
        font-weight: 600;
        font-size: 1rem;
      }
      .choice p#description {
        margin-top: 0.1rem;
        font-size: 0.85rem;
        margin-left: calc(20px + 0.5rem);
      }
    `,
  ];

  handleClick(choice: RadioSelectorType) {
    this.activeChoice = choice.key;
    const event = new CustomEvent("selected", {
      detail: {
        key: choice.key,
      },
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`<div id="container">
      ${repeat(
        this.choices,
        (c) => c.key,
        (choice) =>
          html`<div
            class="choice"
            @click=${() => {
              this.handleClick(choice);
            }}
          >
            <div>
              <radio-input
                .label=${`${choice.key}: ${choice.description}`}
                .enabled=${this.activeChoice === choice.key ||
                (this.activeChoice === "" && this.default === choice.key)}
              ></radio-input>
              <p id="title">${choice.title}</p>
            </div>
            ${choice.description
              ? html`<p id="description">${choice.description}</p>`
              : ""}
          </div>`,
      )}
    </div>`;
  }
}
