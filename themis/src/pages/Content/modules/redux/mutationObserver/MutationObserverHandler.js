export default class MutationObserverHandler {
  constructor() {
    this.observer = null;
  }

  observe(payload, onObserverEvent) {
    const {
      selector, config, onMutationEvent,
    } = payload;

    if (!this.observer) {
      this.observer = {};

      this.observer = new MutationObserver((mutations) => {
        onObserverEvent({ mutations, onMutationEvent });
      });
    }

    const target = document.querySelector(selector);
    if (target) {
      this.observer.observe(target, config);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
