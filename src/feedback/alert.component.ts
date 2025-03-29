import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import "../modal/modal.component";
import "../buttons/button.component";

export function Alert(data: AlertInterface) {
  window.dispatchEvent(new CustomEvent("fl-alert", { detail: data }));
}

export interface AlertInterface {
  title: string;
  description?: string;
  acknowledgeText?: string;
}

@customElement("alert-component")
export class AlertComponent extends LitElement {
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
    `,
  ];

  @property() open = false;

  @state() promptTitle: string = "";

  @state() promptDescription?: string = undefined;

  @state() acknowledge?: string = undefined;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("fl-alert", this.openAlert);
  }
  disconnectedCallback() {
    window.removeEventListener("fl-alert", this.openAlert);
    super.disconnectedCallback();
  }

  openAlert = (e: Event) => {
    let { detail } = e as CustomEvent<AlertInterface>;

    this.promptTitle = detail.title;
    this.promptDescription = detail.description;
    this.acknowledge = detail.acknowledgeText;
    this.open = true;
  };

  close() {
    this.reset();
  }

  reset() {
    this.open = false;
    this.promptTitle = "";
    this.promptDescription = "";
    this.acknowledge = undefined;
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
          ${this.promptDescription !== undefined
            ? html` <p>${this.promptDescription}</p> `
            : undefined}
        </div>

        <button-component class="big" @fl-click=${this.close}
          >${this.acknowledge ? this.acknowledge : "OK"}</button-component
        >
      </div>
    </modal-component>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "alert-component": AlertComponent;
  }
}
