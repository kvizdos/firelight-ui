import { LitElement, html, css, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./confetti.layout";
import { Router } from "@vaadin/router";
import "../feedback/prompt.component";

interface DropdownItem {
  name: string;
  path: string;
}

interface NavbarItem {
  name: string | TemplateResult;
  path: string;
  dropdown?: DropdownItem[]; // Optional property
}

interface NavbarItems {
  left: NavbarItem[];
  right: NavbarItem[];
}

interface Navbars {
  [role: string]: NavbarItems; // Index signature to allow any string as a key
}

@customElement("dashboard-layout")
export class DashboardLayoutComponent extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        overflow-x: hidden;
      }
      * {
        box-sizing: border-box;
        padding: 0;
        margin: 0;
      }
      #root {
        min-height: 100dvh;
        height: 100%;
        display: flex;
        align-items: center;
        flex-direction: column;
        position: relative;
        background-color: #f3f3fa;
        width: 100vw;
      }

      #navcontainer {
        background-color: rgb(255, 255, 255);
        padding: 0.5rem 1rem;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        gap: 1.25rem;
        display: flex;
        justify-content: center;
        border-bottom: 1px solid var(--gray-200);
        z-index: 1000;
      }

      div#logo {
        font-weight: 500;
        display: flex !important;
        color: var(--primary-600);
        margin: 0.5em 0;
      }

      nav {
        width: 100%;
        max-width: 72rem;
      }

      nav #full {
        width: 100%;
        display: flex;
        gap: 1rem;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
      }

      nav #full div:not(#overview) {
        display: flex;
        align-items: center;
        gap: 1.25rem;
      }

      nav p,
      nav a,
      nav button {
        padding: 0.45rem 1rem;
        border: 0;
      }
      nav a,
      nav button {
        color: var(--primary-800);
        background-color: white;
        border-radius: 0.75rem;
        transition: 200ms;
        font-weight: 500;
        cursor: pointer;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      nav button {
        font-size: 1rem;
        width: 100%;
        text-align: left;
        font-weight: 500;
        white-space: no-wrap;
      }

      nav img {
        width: 3rem;
        aspect-ratio: 1 / 1;
      }

      nav #full a:not(.active),
      nav #full p,
      nav #full span {
        display: none;
      }

      nav #logo * {
        display: inherit !important;
      }

      nav a.active,
      nav button.active {
        background-color: var(--primary-100);
        color: var(--primary-800);
      }

      nav span.settings {
        cursor: pointer;
      }

      nav a:not(.active):hover,
      nav button:not(.active):hover {
        background-color: var(--primary-50);
      }

      #mobile {
        flex-direction: column;
        gap: 0.5rem;
        padding-top: 1rem;
        display: none;
      }

      #mobile.show {
        display: flex;
      }

      #mobile a,
      #mobile p {
        padding: 0.75rem 1rem 0.75rem 1rem;
      }

      #mobile #footer {
        display: flex;
        justify-content: space-between;
      }

      #wrapper {
        margin-top: 69px;
        display: grid;
        gap: 2rem;
        padding: 1rem;
        width: 100%;
      }

      .dropdown {
        position: relative;
      }

      .dropdown > section {
        display: none;
        position: absolute;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        border-radius: 0.75rem;
        padding: 0.25rem;
        z-index: 1001;
        background-color: white;
      }

      .dropdown > section > button {
        text-wrap: nowrap;
      }

      #mobile-ham {
        background-color: #fff;
        border: 0;
        font-size: 1.5rem;
        color: #3d2a7c;
      }

      nav #full .medium-hide {
        display: none;
      }

      #footer {
        color: var(--gray-400);
        font-size: 0.75rem;
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid var(--gray-200);
      }

      .desktop-hide {
        display: inline-block !important;
      }

      #overview {
        display: none;
      }

      @media (min-width: 680px) {
        .dropdown:hover > section {
          display: block;
        }
        .desktop-hide {
          display: none !important;
        }
        nav img {
          width: 3rem;
        }

        nav #full a:not(.active),
        nav #full p,
        nav #full span {
          display: block;
        }

        #mobile-ham,
        #mobile,
        #mobile.show {
          display: none;
        }
      }

      #saving {
        background-color: var(--primary-200);
        border-radius: 2rem;
        color: var(--primary-800);
      }

      @media (min-width: 825px) {
        nav #full .medium-hide {
          display: block;
        }

        :host([wide-content]) main {
          max-width: 65vw;
          max-width: 65dvw;
        }
      }

      @media (min-width: 930px) {
        #wrapper {
          margin-top: 80px;
          padding: 1rem 0;
          grid-template-columns: 1fr minmax(0, 72rem) 1fr;
        }
      }
    `,
  ];

  static navbars: Navbars = {};

  static setNavbars(navbars: Navbars): void {
    DashboardLayoutComponent.navbars = navbars;
  }

  @property() logo: TemplateResult = html`<p>Your Logo</p>`;

  @property({ type: String }) currentRole = "user";

  @property({ type: String }) locale = "en";

  @property({ type: Boolean }) mobileNavOpen = false;

  @property({ type: Boolean }) includeFooter = true;

  constructor() {
    super();

    // window.onbeforeunload = function () {
    //   if (saveState.saving) {
    //     return 'Are you sure you want to leave?';
    //   }
    // };
  }

  removeTrailingSlash(url: string) {
    if (url.endsWith("/")) {
      return url.slice(0, -1);
    }
    return url;
  }

  renderDropdownNavbar(pathInfo: NavbarItem) {
    return html`<section class="dropdown">
      <a
        class="${this.removeTrailingSlash(window.location.pathname) ===
        pathInfo.path
          ? "active"
          : ""}"
        href="${pathInfo.path}"
        >${pathInfo.name}</a
      >
      ${pathInfo.dropdown !== undefined
        ? html`
            <section>
              ${pathInfo.dropdown.map(
                (path) =>
                  html`<button @click=${() => Router.go(path.path)}>
                    ${path.name}
                  </button>`,
              )}
            </section>
          `
        : ""}
    </section>`;
  }

  firstUpdated() {
    this.removeAttribute("unresolved");
  }

  render() {
    return html`<div id="root">
      <prompt-component id="prompt"></prompt-component>

      <div id="navcontainer">
        <nav>
          <div id="full">
            <div>
                <div id="logo">${this.logo}</div>
              ${DashboardLayoutComponent.navbars[this.currentRole]?.left.map(
                (path) => {
                  if (path.dropdown !== undefined) {
                    return this.renderDropdownNavbar(path);
                  }

                  return html`<a
                    class="${this.removeTrailingSlash(
                      window.location.pathname,
                    ) === this.removeTrailingSlash(path.path)
                      ? "active"
                      : ""}"
                    href="${path.path}"
                    >${path.name}</a
                  >`;
                },
              )}
            </div>

            <div>
              <!-- <global-search-component></global-search-component> -->

              ${DashboardLayoutComponent.navbars[this.currentRole]?.right.map(
                (path) => {
                  if (path.dropdown !== undefined) {
                    return this.renderDropdownNavbar(path);
                  }

                  return html`<a
                    class="${this.removeTrailingSlash(
                      window.location.pathname,
                    ) === this.removeTrailingSlash(path.path)
                      ? "active"
                      : ""}"
                    href="${path.path}"
                    >${path.name}</a
                  >`;
                },
              )}
              <button
                id="mobile-ham"
                @click=${() => {
                  this.mobileNavOpen = !this.mobileNavOpen;
                }}
              >
                &#x2630;
              </button>
            </div>
          </div>
          <div id="mobile" class="${this.mobileNavOpen ? "show" : ""}">
            ${DashboardLayoutComponent.navbars[this.currentRole]?.left.map(
              (path) =>
                html`<a
                  class="${window.location.pathname === path.path
                    ? "active"
                    : ""}"
                  href="${path.path}"
                  >${path.name}</a
                >`,
            )}
            ${DashboardLayoutComponent.navbars[this.currentRole]?.right.map(
              (path) =>
                html`<a
                  class="${window.location.pathname === path.path
                    ? "active"
                    : ""}"
                  href="${path.path}"
                  >${path.name}</a
                >`,
            )}
          </div>
        </nav>
      </div>
      <div id="wrapper">
        <slot name="aside"><br></br></slot>
        <main>
          <slot></slot>
        </main>
        <slot name="aside-right"><br></br></slot>
      </div>

      ${this.includeFooter === true ? html` <div id="footer"></div>` : ""}
    </div>`;
  }
}
