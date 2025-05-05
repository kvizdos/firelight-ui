import { Ref } from "lit/directives/ref";

export type MultistepFormValues = Record<
  string,
  Record<string, string | boolean>
>;

export interface MultistepFormQuestion {
  id: string;
  label: string;
  description?: string;
  placeholder?: string;
  required?: boolean;
  validityErrorMsg?: string;
  pattern?: string | RegExp;
  type:
    | "text"
    | "email"
    | "tel"
    | "select"
    | "radio"
    | "checkbox"
    | "checkbox"
    | "hour-picker"
    | "timezone";
  autocomplete?: string;
}

export interface MultistepFormStage {
  id: string;
  title: string;
  description?: string;
  disclaimer?: string;
  questions: MultistepFormQuestion[];
  continueButtonText?: string;
  continueCallback?: (values: MultistepFormValues) => Promise<void>;
}

export interface MultistepForm {
  stages: MultistepFormStage[];
}
