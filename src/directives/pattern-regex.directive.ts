import { directive, Directive } from "lit/directive.js";
import { ifDefined } from "lit-html/directives/if-defined.js";

export const ifRegexDefined = directive(
  class extends Directive {
    render(value: string | RegExp | undefined | null) {
      if (value instanceof RegExp) {
        return value.source;
      }
      return ifDefined(value);
    }
  },
);
