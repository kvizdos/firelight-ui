export interface AlertInterface {
  title: string;
  description?: string;
  acknowledgeText?: string;
}

export function Alert(data: AlertInterface) {
  window.dispatchEvent(new CustomEvent("fl-alert", { detail: data }));
}

export interface ConfirmInterface {
  title: string;
  description: string;
  proceedButton?: string;
  cancelButton?: string;
}

export function Confirm(data: ConfirmInterface) {
  window.dispatchEvent(new CustomEvent("fl-confirm", { detail: data }));
}

export type PromptType =
  | "text"
  | "number"
  | "decimal"
  | "tel"
  | "textarea"
  | "date";

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
