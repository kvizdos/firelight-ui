import { LitElement, html, css } from "lit";
import { property, customElement } from "lit/decorators.js";
import JSConfetti from "js-confetti";

@customElement("confetti-handler-component")
export class ConfettiComponent extends LitElement {
  @property({ type: Object }) confetti: JSConfetti = new JSConfetti();

  static styles = [
    css`
      :host {
        position: absolut e;
        top: 0;
        left: 0;
        height: 100dvh;
        width: 100dvw;
      }
    `,
  ];

  firstUpdated() {
    // const confettiElement = this.shadowRoot!.getElementById('my-canvas');

    this.addEventListener("confetti", () => {
      this.confetti.addConfetti({
        confettiColors: ["#fecf11", "#eeb604", "#8967f0", "#4c2ea5"],
      });
    });
  }

  render() {
    return html`<div>
      <slot></slot>
    </div>`;
  }
}
