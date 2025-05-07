import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { icons } from "./icons";

@customElement("ui-icon")
export class IconComponent extends LitElement {
  static colorways: Record<
    string,
    { primary: string; secondary: string; shadow: string }
  > = {
    primary: {
      primary: "var(--primary-600)",
      secondary: "var(--primary-500, #327eff)",
      shadow: "var(--gray-400, #989898)",
    },
    danger: {
      primary: "var(--danger-600, red)",
      secondary: "var(--danger-500, pink)",
      shadow: "var(--gray-500, #888)",
    },
    // Add more colorways here...
  };

  static styles = css`
    :host {
      display: inline-block;
    }

    svg {
      width: var(--size);
      height: var(--size);
    }

    .hoverable svg * {
      transition: 200ms;
    }

    svg .primary {
      fill: var(--primary);
    }
    .hoverable:not(:hover) svg .primary {
      fill: var(--shadow);
    }

    svg .primary-stroke {
      stroke: var(--primary);
    }
    .hoverable:not(:hover) svg .primary-stroke {
      stroke: var(--shadow);
    }

    svg .secondary {
      fill: var(--secondary);
    }
    .hoverable:not(:hover) svg .secondary {
      fill: var(--shadow);
    }
    svg .secondary-stroke {
      stroke: var(--secondary);
    }
    .hoverable:not(:hover) svg .secondary-stroke {
      stroke: var(--shadow);
    }

    svg .shadow {
      fill: var(--shadow);
    }
    svg .shadow-stroke {
      stroke: var(--shadow);
    }
  `;

  @property() name: string = "";
  @property() size: string = "24px";
  @property({ type: Boolean }) hoverable = false;
  @property() colorway: string = "primary";

  render() {
    const selected =
      IconComponent.colorways[this.colorway] ??
      IconComponent.colorways["primary"];

    return html`
      <div
        class=${classMap({ hoverable: this.hoverable })}
        style="
          --size: ${this.size};
          --primary: ${selected.primary};
          --secondary: ${selected.secondary};
          --shadow: ${selected.shadow};
        "
      >
        ${icons[this.name]}
      </div>
    `;
  }
}
