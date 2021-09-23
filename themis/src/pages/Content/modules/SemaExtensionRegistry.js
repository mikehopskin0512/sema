import $ from 'cash-dom';
import ReactDOM from 'react-dom';
import { SEMA_REMINDER_ROOT_ID, SEMA_TEXTAREA_IDENTIFIER } from '../constants';
import { getSemaIds } from './content-util';

class SemaExtensionRegistry {
  constructor() {
    this.eventListeners = new Set();
    this.elementEventListener = new Set();
    this.githubTextareaIds = new Set();
    this.additionalCleanupFunctions = new Set();
    this.startExtensionCheck();
  }

  startExtensionCheck() {
    const interval = setInterval(() => {
      const isExtensionDisabled = !chrome.runtime.id;
      if (isExtensionDisabled) {
        this.clear();
        clearInterval(interval);
      }
    }, 1000);
  }

  registerEventListener(event, eventHandler, capture) {
    document.addEventListener(event, eventHandler, capture);
    this.eventListeners.add({ event, eventHandler, capture });
  }

  registerElementEventListener(element, event, eventHandler) {
    $(element).on(event, eventHandler);
    this.elementEventListener.add({ element, event, eventHandler });
  }

  registerGithubTextarea(githubId) {
    this.githubTextareaIds.add(githubId);
  }

  removeAllListeners() {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.eventListeners) {
      const { event, eventHandler, capture } = item;
      document.removeEventListener(event, eventHandler, capture);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const item of this.elementEventListener) {
      const { element, event, eventHandler } = item;
      $(element).off(event, eventHandler);
    }
  }

  removeAllSemaElements() {
    // eslint-disable-next-line no-restricted-syntax
    for (const textareaId of this.githubTextareaIds) {
      const textarea = document.getElementById(textareaId);
      const { semabarContainerId, semaSearchContainerId, semaMirror } = getSemaIds(textareaId);

      const semabarContainerNode = document.getElementById(semabarContainerId);
      const semaSearchContainerNode = document.getElementById(semaSearchContainerId);
      const semaMirrorNode = document.getElementById(semaMirror);

      ReactDOM.unmountComponentAtNode(semabarContainerNode);
      ReactDOM.unmountComponentAtNode(semaSearchContainerNode);

      semabarContainerNode.remove();
      semaSearchContainerNode.remove();
      semaMirrorNode.remove();

      $(textarea).removeAttr(SEMA_TEXTAREA_IDENTIFIER);

      const semaMarkdownIcon = $(textarea)
        .parent()
        .siblings('label')
        .children('.tooltipped.tooltipped-nw')[1];

      $(semaMarkdownIcon).remove();

      $(`#${SEMA_REMINDER_ROOT_ID}`).remove();
    }
  }

  addAdditional(fn) {
    this.additionalCleanupFunctions.add(fn);
  }

  clearAdditional() {
    // eslint-disable-next-line no-restricted-syntax
    for (const fn of this.additionalCleanupFunctions) {
      fn();
    }
  }

  clear() {
    this.clearAdditional();
    this.removeAllListeners();
    this.removeAllSemaElements();
  }
}

export default SemaExtensionRegistry;
