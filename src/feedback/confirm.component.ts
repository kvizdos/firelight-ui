import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "../modal/modal.component";
import "../buttons/button.component";

export function Confirm(data: ConfirmInterface) {
  window.dispatchEvent(new CustomEvent("fl-confirm", { detail: data }));
}

export interface ConfirmInterface {
  title: string;
  description: string;
  proceedButton?: string;
  cancelButton?: string;
}

@customElement("confirm-component")
export class ConfirmComponent extends LitElement {
  static styles = [
    css`
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

      #buttons {
        display: flex;
        gap: 2rem;
        width: 100%;
        flex-wrap: wrap;
        align-items: center;
      }
    `,
  ];

  @property() open = false;

  @state() promptTitle: string = "";

  @state() promptDescription: string = "";

  @state() proceedText: string = "Confirm";

  @state() cancelText: string = "Cancel";

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("fl-confirm", this.openAlert);
  }
  disconnectedCallback() {
    window.removeEventListener("fl-confirm", this.openAlert);
    super.disconnectedCallback();
  }

  openAlert = (e: Event) => {
    let { detail } = e as CustomEvent<ConfirmInterface>;

    this.promptTitle = detail.title;
    this.promptDescription = detail.description;
    this.proceedText = detail.proceedButton || this.proceedText;
    this.cancelText = detail.cancelButton || this.cancelText;
    this.open = true;
  };

  close() {
    this.reset();
  }

  reset() {
    this.open = false;
    this.promptTitle = "";
    this.promptDescription = "";
    this.proceedText = "Confirm";
    this.cancelText = "Cancel";
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

  render() {
    return html`<modal-component
      .open=${this.open}
      .modaltitle="${this.promptTitle}"
      @close=${this.close}
    >
      <div id="feedback">
        <div>
          <p>${this.promptDescription}</p>
        </div>

        <div id="buttons">
          <button-component class="big plain" @fl-click=${this.close}
            >${this.cancelText}</button-component
          >
          <button-component
            class="big"
            @fl-click=${this.close}
            style="flex-grow: 1; min-width: 12rem"
            >${this.proceedText}</button-component
          >
        </div>
      </div>
    </modal-component>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "confirm-component": ConfirmComponent;
  }
}
