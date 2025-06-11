import { ReactiveController, ReactiveControllerHost } from "lit";
export class DebounceFetchController<T> implements ReactiveController {
  private timer: number | null = null;
  private readonly delay: number;
  private readonly leading: boolean;
  private hasFired = false;
  private readonly host: ReactiveControllerHost;
  private currentAbortController: AbortController | null = null;

  public inFlight = false;

  constructor(
    host: ReactiveControllerHost,
    private getFetchRequest: (
      query: string,
    ) => RequestInfo | [RequestInfo, RequestInit?],
    private onResult: (query: string, result: T[]) => void,
    delay: number,
    { leading = false } = {},
  ) {
    this.delay = delay;
    this.leading = leading;
    this.host = host;
    this.inFlight = false;
    host.addController(this);
  }

  run(query: string) {
    if (this.timer) clearTimeout(this.timer);

    const triggerFetch = () => {
      if (this.currentAbortController) {
        this.currentAbortController.abort();
      }

      this.inFlight = true;
      this.currentAbortController = new AbortController();

      const req = this.getFetchRequest(query);
      const url = Array.isArray(req) ? req[0] : req;
      const options = Array.isArray(req)
        ? { ...req[1], signal: this.currentAbortController.signal }
        : { signal: this.currentAbortController.signal };

      fetch(url, options)
        .then((res) => res.json())
        .then((data) => this.onResult(query, data))
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("Fetch error:", err);
          }
        })
        .finally(() => {
          this.inFlight = false;
        });
    };

    if (this.leading && !this.hasFired) {
      triggerFetch();
      this.hasFired = true;
    }

    this.timer = window.setTimeout(() => {
      if (!this.leading) triggerFetch();
      this.hasFired = false;
    }, this.delay);
  }

  hostDisconnected() {
    if (this.timer) clearTimeout(this.timer);
    if (this.currentAbortController) this.currentAbortController.abort();
  }
}
