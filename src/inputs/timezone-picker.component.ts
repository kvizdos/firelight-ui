import { LitElement, html, css } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import "./dropdown-selector.component";
import { createRef, ref, Ref } from "lit/directives/ref.js";
import { DropdownSelectorComponent } from "./dropdown-selector.component";

interface TimezoneOption {
  ui_key: string;
  key: string;
  default: boolean;
  label: string;
  does_not_adjust?: string;
}

@customElement("timezone-picker")
export class TimezonePickerComponent extends LitElement {
  static formAssociated = true;

  private pickerRef: Ref<DropdownSelectorComponent> = createRef();

  @state() selected: string = "";

  @state() ui_selected: string = "";

  @property() forceSelected: string = "";

  private getOptions(): TimezoneOption[] {
    const tz =
      this.forceSelected || Intl.DateTimeFormat().resolvedOptions().timeZone;

    const raw: TimezoneOption[] = [
      {
        ui_key: "Eastern Time",
        key: "America/New_York",
        default: tz === "America/New_York",
        label: "Eastern Time (Automatically adjusts for Daylight Saving)",
      },
      {
        ui_key: "Central Time",
        key: "America/Chicago",
        default: tz === "America/Chicago",
        label: "Central Time (Automatically adjusts for Daylight Saving)",
      },
      {
        ui_key: "Mountain Time",
        key: "America/Denver",
        default: tz === "America/Denver",
        label: "Mountain Time (Automatically adjusts for Daylight Saving)",
      },
      {
        ui_key: "Arizona Time (No DST)",
        key: "America/Phoenix",
        does_not_adjust: "No daylight savings time",
        default: tz === "America/Phoenix",
        label: "Arizona Time (No daylight savings time)",
      },
      {
        ui_key: "Pacific Time",
        key: "America/Los_Angeles",
        default: tz === "America/Los_Angeles",
        label: "Pacific Time (Automatically adjusts for Daylight Saving)",
      },
      {
        ui_key: "Alaska Time",
        key: "America/Anchorage",
        default: tz === "America/Anchorage",
        label: "Alaska Time (Automatically adjusts for Daylight Saving)",
      },
      {
        ui_key: "Hawaii Time",
        key: "Pacific/Honolulu",
        does_not_adjust: "No daylight savings time",
        default: tz === "Pacific/Honolulu",
        label: "Hawaii Time (No daylight savings time)",
      },
    ];

    return raw.sort((a, b) => {
      if (a.key === Intl.DateTimeFormat().resolvedOptions().timeZone) return -1;
      if (b.key === Intl.DateTimeFormat().resolvedOptions().timeZone) return 1;
      return 0;
    });
  }

  @state() private get options() {
    return this.getOptions();
  }

  private renderOption(option: TimezoneOption) {
    return html`<div>
      <div
        style="display: flex; justify-content: space-between; gap: 2rem; margin-bottom: 0.15rem;"
      >
        <p style="margin: 0; font-weight: 600;">
          ${option.ui_key}
          ${Intl.DateTimeFormat().resolvedOptions().timeZone === option.key
            ? html`(Your device timezone)`
            : ""}
        </p>
        <p style="margin: 0; text-wrap: nowrap;">
          ${new Intl.DateTimeFormat([], {
            timeZone: option.key,
            hour12: true,
            timeStyle: "short",
          }).format(new Date())}
        </p>
      </div>
      <p style="margin: 0; font-size: 0.85rem; color: #525252;">
        ${new Intl.DateTimeFormat([], {
          timeZone: option.key,
          timeZoneName: "shortOffset", // or 'longOffset'
        })
          .formatToParts(new Date())
          .find((p) => p.type === "timeZoneName")?.value}
        &bull;
        ${option.does_not_adjust
          ? option.does_not_adjust
          : "Automatically adjusts for daylight saving"}
      </p>
    </div>`;
  }
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
    return this.selected;
  }

  set value(value: string) {
    const found = this.getOptions().filter((opt) => opt.key === value)[0];
    if (found === undefined) {
      throw new Error("Unknown timezone");
    }

    this.selected = value;
    this.ui_selected = found.ui_key;
    this.pickerRef.value!.value = value;
  }

  dispatchInput(e: CustomEvent<{ value: string }>) {
    this.selected = e.detail.value;
    this.ui_selected = this.options.filter(
      (opt) => opt.key === e.detail.value,
    )[0].ui_key;
    this.dispatchEvent(
      new CustomEvent("fl-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("keydown", this.handleHotkey);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("keydown", this.handleHotkey);
  }

  private handleHotkey = (e: KeyboardEvent) => {
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const key = e.key.toLowerCase();
      const tz = this.options.filter((opt) =>
        opt.ui_key.toLowerCase().startsWith(key),
      );
      if (tz.length > 0) {
        this.value = tz[0].key;
        this.dispatchEvent(
          new CustomEvent("fl-input", {
            detail: { value: this.value },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  };

  static styles = [
    css`
      :host {
        width: 100%;
      }
    `,
  ];

  render() {
    return html` <dropdown-selector
      ${ref(this.pickerRef)}
      .items=${this.options}
      .renderFunction=${this.renderOption}
      .placeholder=${this.ui_selected || "Enter your Timezone"}
      @fl-pick=${this.dispatchInput}
    ></dropdown-selector>`;
  }
}
