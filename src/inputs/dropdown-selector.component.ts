import { LitElement, html, css, TemplateResult } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { inputStyles } from "../styles/inputs.style";
import { classMap } from "lit/directives/class-map.js";

interface DropdownItem {
  key: string;
  label: string;
  ui_key?: string;
  default: boolean;
}

@customElement("dropdown-selector")
export class DropdownSelectorComponent extends LitElement {
  @state() private showScrollGradient = true;

  @property() placeholder: string = "";

  @property() items: DropdownItem[] = [
    {
      key: "Test",
      default: true,
      label: "Test",
    },
    {
      key: "Test 2",
      default: false,
      label: "Test",
    },
    {
      key: "A Third",
      default: false,
      label: "Test",
    },
  ];
  @property() renderFunction: (item: DropdownItem) => TemplateResult = (item) =>
    html` <p style="margin: 0;">${item.ui_key ?? item.key}</p>`;

  @state() private open = false;
  @state() private selected?: DropdownItem;
  @state() private focusedIndex: number | null = null;
  @state() private query: string = "";

  static formAssociated = true;

  private internals: ElementInternals = this.attachInternals();

  get value() {
    return this.selected?.key ?? "";
  }

  checkValidity() {
    return this.internals.checkValidity();
  }

  reportValidity() {
    return this.internals.reportValidity();
  }

  private toggleDropdown() {
    this.open = !this.open;
  }

  private handleKeydown(e: KeyboardEvent) {
    if (!this.open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      this.open = true;
      this.focusedIndex = 0;
      e.preventDefault();
      return;
    }

    if (this.open) {
      if (e.key === "ArrowDown") {
        this.focusedIndex = (this.focusedIndex ?? -1) + 1;
        if (this.focusedIndex >= this.items.length) this.focusedIndex = 0;
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        this.focusedIndex = (this.focusedIndex ?? this.items.length) - 1;
        if (this.focusedIndex < 0) this.focusedIndex = this.items.length - 1;
        e.preventDefault();
      } else if (e.key === "Enter") {
        if (this.focusedIndex != null) {
          this.selectItem(this.items[this.focusedIndex]);
        }
        e.preventDefault();
      } else if (e.key === "Escape") {
        this.open = false;
        e.preventDefault();
      }
    }
  }

  private selectItem(item: DropdownItem) {
    this.selected = item;
    this.query = item.ui_key ?? item.key; // <-- update input value
    this.open = false;
    this.internals.setFormValue(this.value);
    this.dispatchEvent(
      new CustomEvent("fl-pick", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  get filteredItems(): DropdownItem[] {
    const q = this.query.toLowerCase().trim();

    // Show all items by default (e.g., when the input value equals the selected item)
    if (
      !this.open ||
      q === (this.selected?.ui_key ?? this.selected?.key ?? "").toLowerCase()
    ) {
      return this.items;
    }

    return this.items.filter((item) =>
      (item.ui_key ?? item.key).toLowerCase().includes(q),
    );
  }

  private handleDropdownScroll(e: Event) {
    const el = e.target as HTMLElement;
    const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

    this.showScrollGradient = !isAtBottom;
  }

  static styles = [
    css`
      :host {
        display: inline-block;
        position: relative;
        width: 100%;
      }
      #container {
        display: flex;
      }
      .dropdown {
        position: absolute;
        background: white;
        border: 1px solid var(--dropdown-border, var(--gray-200, #cecece));
        width: 100%;
        z-index: 9;
        top: 100%;
        box-sizing: border-box;
        border-radius: 0rem 0rem 0.5rem 0.5rem;
        overflow: scroll;
        max-height: 14rem;
      }
      .scrollArea {
        box-sizing: border-box;
        position: absolute;
        bottom: -14rem;
        width: 100%;
        height: 5px;
        z-index: 11;
        height: 30px;
        background: linear-gradient(to bottom, rgba(255, 255, 255, 0), white);
        pointer-events: none;
        border-left: 1px solid var(--dropdown-border, var(--gray-200, #cecece));
        border-right: 1px solid var(--dropdown-border, var(--gray-200, #cecece));
        border-bottom: 1px solid
          var(--dropdown-border, var(--gray-200, #cecece));

        border-radius: 0rem 0rem 0.5rem 0.5rem;
      }
      input.open {
        border-radius: 0.5rem 0.5rem 0rem 0rem;
      }
      button {
        display: block;
        width: 100%;
        text-align: left;
        padding: 0.85em;
        font-size: 1rem;
        border: none;
        background: none;
        cursor: pointer;
      }
      button:not(:last-of-type) {
        border-bottom: 1px solid #cecece;
      }
      button:hover {
        background: #eee;
      }
    `,
    inputStyles,
  ];

  firstUpdated() {
    const defaultItem = this.items.find((item) => item.default);
    if (defaultItem) {
      this.selected = defaultItem;
      this.query = defaultItem.ui_key ?? defaultItem.key ?? "";
      this.internals.setFormValue(this.value);
      this.dispatchEvent(
        new CustomEvent("fl-pick", {
          detail: { value: this.value },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return html`
      <div id="container">
        <input
          readonly
          placeholder="${this.placeholder}"
          autocomplete="off"
          id="dropdown-input"
          class=${classMap({ open: this.open })}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded=${this.open}
          aria-controls="dropdown-list"
          aria-activedescendant=${ifDefined(
            this.open && this.focusedIndex != null
              ? `option-${this.focusedIndex}`
              : undefined,
          )}
          .value=${this.query}
          @input=${(e: Event) => {
            this.query = (e.target as HTMLInputElement).value;
            this.open = true;
          }}
          @click=${this.toggleDropdown}
          @keydown=${this.handleKeydown}
        />

        <div
          class="scrollArea"
          ?hidden=${!this.open || !this.showScrollGradient}
        ></div>

        <div
          id="dropdown-list"
          class="dropdown"
          role="listbox"
          ?hidden=${!this.open}
          @scroll=${this.handleDropdownScroll}
        >
          ${this.filteredItems.map(
            (item, i) => html`
              <button
                aria-label="${item.label}"
                id="option-${i}"
                role="option"
                aria-selected=${this.selected?.key === item.key}
                @click=${() => this.selectItem(item)}
              >
                ${this.renderFunction(item)}
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}
