import { LitElement, html, css } from "lit";
import { state, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";

export interface Toast {
  id: number | string;
  text: string;
  danger: boolean;
  duration: number;
  persist?: boolean;
  removing?: boolean;
  actionText?: string;
  onClick?: () => void;
}

let globalId = 0;

@customElement("toast-component")
export class ToastComponent extends LitElement {
  @state() toasts: Toast[] = [];

  static styles = [
    css`
      #root {
        z-index: 100000000;
        position: fixed;
        bottom: 2rem;
        left: 0;
        display: flex;
        flex-direction: column-reverse;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        box-sizing: border-box;
      }

      .toast {
        box-sizing: border-box;
        --progress-color: var(--primary-300);
        --progress-background: var(--primary-100);
        --toast-height: 0.25rem;
        width: calc(100% - 4rem);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.25rem;
        padding: 0.5rem 1rem;
        border-radius: 0.25rem;
        background-color: #fff;
        border: 1px solid var(--primary-200);
        color: var(--primary-800);
        box-shadow: rgba(0, 0, 0, 0.05) 0px 3px 8px;
        position: relative;
        overflow: hidden;
        padding-bottom: calc(var(--toast-height) + 0.5rem);
        animation: slideIn 200ms ease-out;
      }

      .progress-bar {
        position: absolute;
        bottom: 0;
        left: 0;
        height: var(--toast-height);
        width: 100%;
        background-color: var(--progress-color);
      }

      .toast::before {
        content: " ";
        position: absolute;
        bottom: 0;
        left: 0;
        height: var(--toast-height);
        width: 100%;
        background-color: var(--progress-background);
      }

      .danger {
        --progress-background: var(--danger-200);
        --progress-color: var(--danger-400);
        background-color: var(--danger-50);
        border: 1px solid var(--danger-200);
        color: var(--danger-800);
      }

      .toast.slide-out {
        animation: slideOut 200ms ease-in forwards;
      }

      .close-btn {
        background: transparent;
        border: none;
        font-weight: bold;
        cursor: pointer;
        color: inherit;
        font-size: 1rem;
      }

      .action-btn {
        background: none;
        border: none;
        color: var(--primary-600);
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;
      }

      .toast.danger .action-btn {
        color: var(--danger-600);
      }

      @media (min-width: 680px) {
        .toast {
          width: fit-content;
          min-width: 12rem;
          justify-content: center;
        }
      }

      @keyframes slideOut {
        from {
          transform: translateY(0);
          opacity: 1;
        }
        to {
          transform: translateY(2rem);
          opacity: 0;
        }
      }

      @keyframes shrink {
        from {
          width: 100%;
        }
        to {
          width: 0%;
        }
      }

      @keyframes slideIn {
        from {
          transform: translateY(2rem);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
  ];

  constructor() {
    super();

    window.addEventListener("close-toast", (e: Event) => {
      const id = (e as CustomEvent).detail.id;
      this.removeToastById(id);
    });

    window.addEventListener("do-toast", (e: Event) => {
      const {
        id: customID,
        text,
        danger,
        persist,
        actionText,
        onClick,
        duration: customDuration,
      } = (e as CustomEvent).detail;

      const duration =
        customDuration !== undefined ? customDuration : danger ? 8000 : 2500;
      const id = customID ?? globalId++;

      const toast: Toast = {
        id,
        text,
        danger,
        duration,
        persist,
        actionText,
        onClick,
      };

      this.toasts = [...this.toasts, toast];

      if (!persist) {
        setTimeout(() => this.removeToastById(id), duration);
      }
    });
  }

  private removeToastById(id: number | string) {
    const toast = this.toasts.find((t) => t.id === id);
    if (!toast) return;

    toast.removing = true;
    this.toasts = [...this.toasts];

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    }, 200);
  }

  render() {
    return html`<div id="root">
      ${repeat(
        this.toasts,
        (t) => t.id,
        (toast) => html`
          <div
            class=${classMap({
              toast: true,
              danger: toast.danger,
              "slide-out": toast.removing ?? false,
            })}
            style="--toast-duration: ${toast.duration}ms"
          >
            ${toast.text}
            ${toast.actionText && toast.onClick
              ? html`<button
                  class="action-btn"
                  @click=${() => {
                    toast.onClick?.();
                    this.removeToastById(toast.id);
                  }}
                >
                  ${toast.actionText}
                </button>`
              : null}
            ${toast.persist && toast.onClick === undefined
              ? html`<button
                  class="close-btn"
                  @click=${() => this.removeToastById(toast.id)}
                >
                  &times;
                </button>`
              : null}

            <div
              class="progress-bar"
              style=${toast.persist
                ? "display: none"
                : `animation: shrink ${toast.duration}ms linear forwards`}
            ></div>
          </div>
        `,
      )}
    </div>`;
  }
}

export function NotifyToast(opts: {
  id: string;
  text: string;
  danger?: boolean;
  persist?: boolean;
  actionText?: string;
  onClick?: () => void;
  duration?: number;
}) {
  window.dispatchEvent(
    new CustomEvent("do-toast", {
      detail: {
        id: opts.id,
        text: opts.text,
        danger: opts.danger ?? false,
        persist: opts.persist ?? false,
        actionText: opts.actionText,
        onClick: opts.onClick,
        duration: opts.duration,
      },
    }),
  );
}

export function DismissToast(id: number | string) {
  window.dispatchEvent(
    new CustomEvent("close-toast", {
      detail: { id },
    }),
  );
}
