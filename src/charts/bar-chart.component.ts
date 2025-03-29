import { LitElement, html, css, PropertyValues } from "lit";
import { property, state, customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import "../animations/tweener.component";

export interface ChartAxis {
  Label: string;
  Color: string;
}

const DEFAULT_CHART: BarChart = {
  Style: "normal",
  WideContainerColumns: 30,
  SmallContainerColumns: 14,
  WideContainerGap: "0.25rem",
  SmallContainerGap: "0.25rem",
  Axes: [
    { Label: "", Color: "transparent" },
    { Label: "", Color: "transparent" },
    { Label: "", Color: "transparent" },
    { Label: "", Color: "transparent" },
    { Label: "", Color: "transparent" },
    { Label: "", Color: "transparent" },
  ],
  XAxis: [],
  Points: [],
};

export interface BarChart {
  Style: "100-percent" | "normal";
  WideContainerColumns: number;
  SmallContainerColumns: number;
  WideContainerGap: string;
  SmallContainerGap: string;
  XAxis: string[]; // [ "date1", "date2", "date3", ... ]
  Points: number[][]; // [ [p1, p2, p3], [p1, p2, p3] ]
  Axes: ChartAxis[]; // [ { label: "Checked In", color: "GREEN" }, { label: "Assisted", color: "ORANGE" }, { label: "Missed", color: "RED" } ]
}

@customElement("bar-chart-component")
export class BarChartComponent extends LitElement {
  @state() hoveringPoint: number[] = [];

  @state() hoveringKey: string = "";

  @state() maxPoint: number = -1;

  @state() minPoint: number = Infinity;

  @state() viewingLegendKey: number = -1;

  @state() loaded: boolean = false;

  @property({ type: String }) height: string = "8rem";

  @property({ type: Object }) chart: BarChart = DEFAULT_CHART;

  static styles = [
    css`
      * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
      }
      #root {
        --gray-600: #656565;
        --gray-100: #eaeaea;
        container-type: inline-size;
      }
      #axis {
        display: flex;
        justify-content: space-between;
        font-size: 0.85rem;
        color: var(--gray-600);
        margin-top: 0.5rem;
      }
      #array {
        --height: 8rem;
        --desktop-columns: 30;
        --mobile-gap: 0.5rem;
        --desktop-gap: 0.25rem;
        --columns: var(--desktop-columns);
        display: grid;
        grid-template-columns: repeat(var(--columns), 1fr);
        height: var(--height);
        grid-gap: var(--mobile-gap);
        transition: opacity 200ms;
      }
      #array.loading {
        opacity: 0;
        transition: opacity 100ms;
      }

      #array:has(.day:not(.nodata):hover) .day:not(.nodata):not(:hover) {
        opacity: 0.5;
        transition: 200ms;
      }

      .day {
        transition: 400ms;
        width: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      tweener-component {
        transition: 200ms;
      }
      tweener-component[data-has-value="false"] {
        transition: 200ms;
        opacity: 0;
        width: 0;
      }

      .day .unit.empty + .unit:not(.empty) {
        border-radius: 0.25rem 0.25rem 0rem 0rem;
      }

      .day .unit:not(.empty) {
        --color: var(--gray-100);
        background-color: var(--color);
        transition: 60ms;
      }

      #legend {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.65rem;
      }

      #legend #xAxis {
        font-size: 0.85rem;
      }

      #legend div {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      #legend div button {
        border: 0;
        background: unset;
        cursor: pointer;
      }

      #legend .key {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: 200ms;
      }

      #legend .key.notactive {
        opacity: 0.5;
        transition: 200ms;
      }

      #legend .key .bullet {
        margin: 0;
        width: 14px;
        height: 14px;
        border-radius: 2rem;
        background-color: var(--color);
      }

      #legend .key p {
        font-weight: 600;
        font-size: 0.85rem;
        display: flex;
        gap: 0.25rem;
      }
      #legend .key p span {
        color: var(--gray-600);
        font-weight: 400;
      }

      @container (inline-size < 500px) {
        #root #array .day.mobileHide {
          display: none;
        }
        #root #array {
          --mobile-columns: 14;
          --columns: var(--mobile-columns);
          /* grid-template-columns: repeat(14, 1fr); */
        }

        #legend {
          flex-direction: column-reverse;
          gap: 0.5rem;
          align-items: flex-start;
        }

        #legend #xAxis {
          font-weight: 600;
        }
      }

      @container (inline-size >= 500px) {
        #array {
          gap: 0rem;
        }

        #array .day:not(:last-of-type) {
          padding-right: var(--desktop-gap);
        }
        #array .day:not(:first-of-type) {
          padding-left: var(--desktop-gap);
        }
      }
    `,
  ];

  calculateMaxPoint(specificPointOnly?: number) {
    if (specificPointOnly !== undefined) {
      this.minPoint = Infinity;
      this.maxPoint = -1;
    }
    this.chart.Points.forEach((points, index) => {
      const total = points.reduce((cum, point, currentIndex) => {
        if (
          specificPointOnly !== undefined &&
          currentIndex !== specificPointOnly
        ) {
          return cum;
        }
        return cum + point;
      }, 0);

      if (index === 0) {
        this.minPoint = total;
      }
      if (total > this.maxPoint) {
        this.maxPoint = total;
      }
    });
  }

  hoverDate(hoverIndex: number | undefined) {
    if (hoverIndex === undefined) {
      this.hoveringPoint = this.chart.Points[this.chart.Points.length - 1];
      this.hoveringKey = this.chart.XAxis[this.chart.XAxis.length - 1];
      return;
    }
    this.hoveringPoint = this.chart.Points[hoverIndex!];
    this.hoveringKey = this.chart.XAxis[hoverIndex!];
  }

  firstUpdated() {
    this.hoveringPoint = new Array(this.chart.Axes.length).fill(-1);
    if (this.chart.Points.length > 0) {
      setTimeout(() => {
        this.hoverDate(undefined);
        this.calculateMaxPoint();
        if (this.minPoint === this.maxPoint) {
          this.minPoint = this.maxPoint;
        }
        this.loaded = true;
      }, 50);
    }
  }

  protected updated(_changedProperties: PropertyValues): void {
    if (
      _changedProperties.has("chart") &&
      _changedProperties.get("chart") !== undefined
    ) {
      // Chart has been updated from the parent.
      if (this.chart.Style === "normal") {
        this.hoverDate(undefined);
        this.calculateMaxPoint();
        if (this.minPoint === this.maxPoint) {
          this.minPoint = this.maxPoint;
        }
      }
      setTimeout(() => {
        this.loaded = true;
      }, 50);
    }
  }

  render() {
    return html`<div class="widget" id="root">
      <div id="legend">
        <div>
          ${this.chart.Axes.map(
            (axie, i) => html`
              <button
                class="${classMap({
                  key: true,
                  notactive:
                    this.viewingLegendKey !== -1 && this.viewingLegendKey !== i,
                })}"
                @click=${() => {
                  if (this.viewingLegendKey === i) {
                    this.viewingLegendKey = -1;
                    this.calculateMaxPoint();
                    return;
                  }

                  this.viewingLegendKey = i;
                  this.calculateMaxPoint(this.viewingLegendKey);
                }}
              >
                <div class="bullet" style="--color: ${axie.Color}">&nbsp;</div>
                <p>
                  <tweener-component
                    data-has-value=${this.hoveringPoint !== undefined &&
                    this.loaded}
                    .currentNumber=${this.hoveringPoint === undefined ||
                    Number.isNaN(this.hoveringPoint[i])
                      ? 0
                      : this.hoveringPoint[i]}
                  ></tweener-component>
                  <span>${axie.Label}</span>
                </p>
              </button>
            `,
          )}
        </div>

        <p id="xAxis">${this.hoveringKey}</p>
      </div>
      <div
        id="array"
        class=${classMap({
          loading: this.loaded ? false : true,
          [`style-${this.chart.Style}`]: true,
        })}
        style="--mobile-columns: ${this.chart
          .SmallContainerColumns}; --desktop-columns: ${this.chart
          .WideContainerColumns}; --mobile-gap: ${this.chart
          .SmallContainerGap}; --desktop-gap: ${this.chart
          .WideContainerGap}; --height: ${this.height}"
        @mouseleave=${() => {
          this.hoverDate(undefined);
        }}
      >
        ${new Array(this.chart.WideContainerColumns - this.chart.XAxis.length)
          .fill(0)
          .map(
            (_, index) =>
              html` <div
                class="day ${index <
                this.chart.WideContainerColumns -
                  this.chart.SmallContainerColumns
                  ? "mobileHide"
                  : ""}"
                @focus=${() => {
                  this.hoverDate(undefined);
                }}
                @mouseover=${() => {
                  this.hoverDate(undefined);
                }}
              >
                ${this.chart.Style === "normal" &&
                this.minPoint !== Infinity &&
                this.maxPoint !== 0
                  ? html`
                      <div
                        class="unit empty"
                        style="flex: ${this.maxPoint -
                        this.minPoint *
                          ((index + 1) /
                            (this.chart.WideContainerColumns -
                              this.chart.XAxis.length))} 1 0"
                      ></div>

                      <div
                        class="unit nodata"
                        style="flex: ${this.minPoint *
                        ((index + 1) /
                          (this.chart.WideContainerColumns -
                            this.chart.XAxis.length))} 1 0"
                      ></div>
                    `
                  : html` <div class="unit nodata" style="flex-grow: 1"></div>`}
              </div>`,
          )}
        ${this.chart.Points.map(
          (pointsForDay, index) => html`
            <div
              class="day"
              @focus=${() => {
                this.hoverDate(index);
              }}
              @mouseover=${() => {
                this.hoverDate(index);
              }}
            >
              ${this.chart.Style === "normal"
                ? html`
                    <div
                      data-max="${this.maxPoint}"
                      class="unit empty"
                      data-pfd="${pointsForDay[this.viewingLegendKey] ||
                      "unset"}"
                      style="flex: ${this.maxPoint -
                      (this.viewingLegendKey === -1
                        ? pointsForDay.reduce((i, h) => i + h)
                        : pointsForDay[this.viewingLegendKey])} 1 0"
                    ></div>
                  `
                : ""}
              ${pointsForDay.map((point, pointIndex) =>
                point === 0
                  ? undefined
                  : html`<div
                      class="unit"
                      style="${styleMap({
                        flex: `${
                          this.viewingLegendKey === -1
                            ? point
                            : this.viewingLegendKey !== pointIndex
                              ? 0
                              : point
                        } 1 0`,
                        "--color": this.chart.Axes[pointIndex].Color.toString(),
                      })}"
                    ></div>`,
              )}
            </div>
          `,
        )}
      </div>

      <div id="axis"></div>
    </div>`;
  }
}
