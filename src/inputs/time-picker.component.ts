import { LitElement, html, css } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { createRef, ref, Ref } from "lit/directives/ref.js";

export interface TimePickerInput {
  hour: number;
  minutes: number;
  amPm: string;
  style24: string;
}

@customElement("time-picker-component")
export class TimePickerComponent extends LitElement {
  @property() defaultHour = 12;

  @property() defaultMinutes = 0;

  @property() defaultAmPm = "PM";

  @property() forceMinutes = false;

  @property() forceHours = false;

  @property() defaultTo = "";

  @property() minutesStep = 1;

  @state() selectedTime = {
    hour: 12,
    minutes: 0,
    amPm: "PM",
  };

  static formAssociated = true;

  private internals: ElementInternals = this.attachInternals();

  get validity() {
    return this.internals.validity;
  }

  get validationMessage() {
    return this.internals.validationMessage;
  }

  checkValidity() {
    return this.internals.checkValidity();
  }

  reportValidity() {
    return this.internals.reportValidity();
  }

  get value() {
    const currHour = this.selectedTime.hour;
    const amPM = this.selectedTime.amPm;
    if (currHour === 12) {
      if (amPM === "PM") {
        return `12`;
      } else {
        return `0`;
      }
    }

    return `${currHour + (amPM === "PM" ? 12 : 0)}`;
  }

  set value(to: string) {
    const v = +to;
    this.selectedTime.hour = v % 12;
    this.selectedTime.minutes = 0;
    this.selectedTime.amPm = v === 12 ? "PM" : v > 12 ? "PM" : "AM";
    this.defaultHour = v % 12;
  }

  private hoursRef: Ref<HTMLInputElement> = createRef();

  private minutesRef: Ref<HTMLInputElement> = createRef();

  private amPMRef: Ref<HTMLInputElement> = createRef();

  firstUpdated() {
    if (this.defaultTo !== "") {
      const setHoursTo = +this.defaultTo;

      if (setHoursTo == 12) {
        this.hoursRef.value!.value = `12`;
        this.minutesRef.value!.value = `00`;
        this.amPMRef.value!.value = `PM`;
        this.selectedTime = {
          minutes: 0,
          hour: 12,
          amPm: "PM",
        };
        return;
      }

      if (setHoursTo == 0) {
        this.hoursRef.value!.value = `12`;
        this.minutesRef.value!.value = `00`;
        this.amPMRef.value!.value = `AM`;
        this.selectedTime = {
          minutes: 0,
          hour: 0,
          amPm: "AM",
        };
        return;
      }

      if (setHoursTo > 12) {
        this.selectedTime = {
          ...this.selectedTime,
          amPm: "PM",
        };
      } else {
        this.selectedTime = {
          ...this.selectedTime,
          amPm: "AM",
        };
      }

      this.selectedTime = {
        ...this.selectedTime,
        minutes: 0,
        hour: setHoursTo % 12,
      };
      this.hoursRef.value!.value = `${+this.defaultTo % 12}`;
    }
  }

  dispatchInput() {
    this.dispatchEvent(
      new CustomEvent("fl-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  static styles = [
    css`
      :host(.wide) {
        width: 100%;
      }
      :host(.wide) div {
        width: 100%;
      }
      * {
        font-size: 1rem;
      }
      div {
        display: inline-flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        border-radius: 0.5rem;
        border: 1px solid var(--gray-300, #ccc);
        font-size: 1rem;
        overflow: hidden;
      }

      p {
        margin: 0;
      }

      div input {
        min-width: 2ch;
      }

      div input:first-of-type {
        padding-left: 0.85rem;
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

      div select {
        margin-right: 0.85rem;
        cursor: pointer;
        -webkit-appearance: none;
      }

      div :focus {
        outline: none;
        text-decoration: underline;
      }

      div:has(:focus-visible) {
        outline: 2px solid
          var(--time-picker-focus-color, var(--primary-color, #007bff));
      }

      :host(.wide) input {
        width: fit-content;
      }

      input#hours {
        text-align: right;
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
        ${ref(this.hoursRef)}
        type="number"
        min="1"
        max="12"
        step="1"
        maxlength="2"
        inputmode="numeric"
        id="hours"
        placeholder="H"
        value="${this.defaultHour > 12
          ? this.defaultHour - 12
          : this.defaultHour}"
        ?disabled=${this.forceHours}
        @input=${(e: InputEvent) => {
          const target = e.target as HTMLInputElement;
          if (parseInt(target.value) > 12) {
            target.value = "12";
          }
          const value = parseInt(target.value, 10);

          if (!isNaN(value) && value >= 1 && value <= 12) {
            this.selectedTime = {
              ...this.selectedTime,
              hour: value,
            };
            this.internals.setValidity({});
            this.dispatchInput();
            return;
          }

          if (!isNaN(value) && value <= 0) {
            this.selectedTime = {
              ...this.selectedTime,
              hour: 1,
            };
            this.hoursRef.value!.value = "1";
            this.dispatchInput();
            return;
          }
        }}
      />
      <p>:</p>
      <input
        ${ref(this.minutesRef)}
        type="number"
        min="0"
        max="59"
        maxlength="2"
        id="minutes"
        inputmode="numeric"
        step="${this.minutesStep}"
        value="${`0${this.defaultMinutes}`.slice(-2)}"
        ?disabled=${this.forceMinutes}
      />
      <select
        ${ref(this.amPMRef)}
        ?disabled=${this.forceHours}
        @change=${(e: Event) => {
          const target = e.target as HTMLSelectElement;
          const value = target.value;
          if (value === "AM" || value === "PM") {
            this.selectedTime = {
              ...this.selectedTime,
              amPm: value,
            };
            this.dispatchInput();
          }
        }}
      >
        ${this.forceHours
          ? html` <option>${this.defaultHour > 12 ? "PM" : "AM"}</option> `
          : html`
              <option ?selected=${this.selectedTime.amPm === this.defaultAmPm}>
                ${this.defaultAmPm}
              </option>
              <option ?selected=${this.selectedTime.amPm !== this.defaultAmPm}>
                ${this.defaultAmPm === "AM" ? "PM" : "AM"}
              </option>
            `}
      </select>
    </div>`;
  }
}
