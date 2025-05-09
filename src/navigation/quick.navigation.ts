import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { NavigationItem, PageComponentInterface } from "./navigation.types";

@customElement("quick-nav")
export class QuickNavComponent extends LitElement {
  static styles = css`
    :host {
      --hover: var(--quick-nav-hover, var(--gray-50, #f8f8f8));
      --active: var(--quick-nav-active, var(--primary-600, #1a5cf4));
      --focus: var(--quick-nav-focus, var(--primary-500, #327eff));
      --border-radius: 0.5rem;
    }

    nav {
      display: flex;
      gap: 0.25rem;
      position: relative;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
      scrollbar-width: none; /* Firefox */
      padding: 2px; /* add horizontal padding */
      scroll-padding: 0 0.5rem; /* ensure focused items aren't flush with edges */
    }

    nav::-webkit-scrollbar {
      display: none; /* Chrome/Safari */
    }

    nav button {
      background: unset;
      border: 0;
      padding: 0.5rem 1rem;
      font-size: 1rem;
      transition: background-color 200ms;
      cursor: pointer;
      border-radius: var(--border-radius);
      position: relative;
      min-width: max-content;
      white-space: nowrap;
      flex-shrink: 0;
    }

    nav button:not(.selected):hover {
      background-color: var(--hover);
    }

    nav button:focus-visible {
      background-color: var(--hover);
      outline: 2px solid var(--focus);
    }

    nav button::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      height: 2px;
      background: var(--active);
      width: 0%;
      transition: width 200ms ease;
    }

    nav button.selected::after {
      width: 100%;
    }
  `;

  @property() pages: NavigationItem<any>[] = [
    {
      URLKey: "account",
      Name: "Account",
      TemplateLiteral: html`<p>Hello, Account page</p>`,
    },
    {
      URLKey: "security",
      Name: "Security",
      TemplateLiteral: html`<p>Hello, Security page</p>`,
    },
    {
      URLKey: "demo",
      Name: "Demo",
      TemplateLiteral: html`<p>Hello, Demo page</p>`,
    },
  ];

  @property() defaultPageKey = "demo";

  @state() selected = "";

  @state() activePageComponent:
    | PageComponentInterface
    | TemplateResult
    | undefined = undefined;

  private async setSelected(page: NavigationItem<any>, push = true) {
    this.selected = page.URLKey;
    if (push) {
      history.pushState({ key: page.URLKey }, "", `#${page.URLKey}`);
    }
    if (page.PageComponent !== undefined) {
      const pageComponent = new page.PageComponent() as PageComponentInterface;

      if (page.LoadProps !== undefined) {
        const props = page.LoadProps();
        pageComponent.setProps(props);
      }

      if (pageComponent.OnPageLoad) {
        await pageComponent.OnPageLoad();
      }

      this.activePageComponent = pageComponent;
      return;
    }
    this.activePageComponent =
      page.TemplateLiteral ?? html`<p>Page is missing it's definition.</p.>`;
  }

  firstUpdated() {
    const initialKey = location.hash?.replace("#", "") || this.defaultPageKey;
    let initialPage = this.pages.find((p) => p.URLKey === initialKey);
    if (!initialPage) {
      initialPage = this.pages.find((p) => p.URLKey === this.defaultPageKey);
    }
    if (initialPage) {
      this.setSelected(initialPage, false).then(() => {
        this.updateComplete.then(() => {
          const selectedBtn = this.renderRoot.querySelector("button.selected");
          selectedBtn?.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        });
      });
    } else {
      console.warn("Page key not found: ", this.defaultPageKey);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("popstate", this.listenForNavChanges.bind(this));
  }

  disconnectedCallback() {
    super.connectedCallback();
    window.removeEventListener("popstate", this.listenForNavChanges.bind(this));
  }

  listenForNavChanges() {
    const key = location.hash.replace("#", "") || this.defaultPageKey;
    const page = this.pages.find((p) => p.URLKey === key);
    if (page) {
      this.setSelected(page, false);
      this.updateComplete.then(() => {
        const selectedBtn = this.renderRoot.querySelector("button.selected");
        selectedBtn?.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      });
    }
  }

  render() {
    return html`<nav>
        ${this.pages.map(
          (item) =>
            html`<button
              class=${classMap({ selected: this.selected === item.URLKey })}
              @click=${() => this.setSelected(item)}
            >
              ${item.Name}
            </button>`,
        )}
      </nav>
      <section>
        ${this.activePageComponent !== undefined
          ? this.activePageComponent
          : ""}
      </section>`;
  }
}
