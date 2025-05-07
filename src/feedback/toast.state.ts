import { State, property } from "@lit-app/state";
import { Toast } from "./toast.component";

class ToastState extends State {
  @property({ type: Array }) toasts: Toast[] = [];

  private globalId = 0;

  pushToast(toast: Toast) {
    const duration =
      toast.duration !== undefined
        ? toast.duration
        : toast.danger
          ? 8000
          : 2500;
    const id = this.globalId++;
    toast.id = id;

    this.toasts = [...this.toasts, toast];

    if (!toast.persist) {
      setTimeout(() => this.removeToastById(id), duration);
    }
  }

  removeToastById(id: number) {
    const toast = this.toasts.find((t) => t.id === id);
    if (!toast) return;

    toast.removing = true;
    this.toasts = [...this.toasts];

    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
    }, 200);
  }
}

export const toastState = new ToastState();
