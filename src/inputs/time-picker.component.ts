import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("time-picker-component")
export class TimePickerComponent extends LitElement {
  @property() defaultHour = 12;

  @property() defaultMinutes = 0;

  @property() defaultAmPm = "PM";

  @property() forceMinutes = false;

  @property() forceHours = false;

  @property() minutesStep = 1;

  static styles = [
    css`
      * {
        font-size: 1rem;
      }
      div {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid #ccc;
        border-radius: 4px;
        background-color: #fff;
      }

      p {
        margin: 0;
      }

      div input {
        min-width: 3ch;
      }

      div input:disabled {
        background-color: #fff;
        color: var(--time-picker-disabled-text-color, var(--gray-600, #656565));
      }

      div select {
        min-width: 8ch;
      }

      div input,
      div select {
        padding: 8px;
        border: 0;
        /* background-color: #fff; */
        width: 100%;
      }

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        /* display: none; <- Crashes Chrome on hover */
        -webkit-appearance: none;
        margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
      }

      input[type="number"] {
        -moz-appearance: textfield; /* Firefox */
      }
    `,
  ];

  render() {
    return html`<div>
      <input
        type="number"
        min="1"
        max="12"
        step="1"
        maxlength="2"
        inputmode="numeric"
        id="hours"
        value="${this.defaultHour > 12
          ? this.defaultHour - 12
          : this.defaultHour}"
        ?disabled=${this.forceHours}
      />
      <p>:</p>
      <input
        type="number"
        min="0"
        max="59"
        id="minutes"
        inputmode="numeric"
        step="${this.minutesStep}"
        value="${`0${this.defaultMinutes}`.slice(-2)}"
        ?disabled=${this.forceMinutes}
      />
      <select ?disabled=${this.forceHours}>
        ${this.forceHours
          ? html` <option>${this.defaultHour > 12 ? "PM" : "AM"}</option> `
          : html`
              <option>${this.defaultAmPm}</option>
              <option>${this.defaultAmPm === "AM" ? "PM" : "AM"}</option>
            `}
      </select>
    </div>`;
  }
}
