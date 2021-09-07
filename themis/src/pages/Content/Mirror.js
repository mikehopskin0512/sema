/* eslint-disable no-underscore-dangle */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import $ from 'cash-dom';
import { debounce, isEqual } from 'lodash';
import ElementMeasurement from './ElementMeasurement';
import GlobalSearchBar from './GlobalSearchbar';
import { getActiveThemeClass } from '../../../utils/theme';
import { IS_HIGHLIGHTS_ACTIVE } from './constants';
import { checkSubmitButton, getSemaIds } from './modules/content-util';

const SHADOW_ROOT_CLASS = 'sema-shadow-root';
const MIRROR_CLASS = 'sema-mirror';
const MIRROR_CONTENT_CLASS = 'sema-mirror-content';

const HIGHLIGHTER_CLASS = 'sema-highlighter';
const HIGHLIGHTER_INTERMEDIATE = 'sema-highlighter-intermediate';
const HIGHLIGHTER_CONTAINER = 'sema-highlighter-container';
const HIGHLIGHTER_CONTENT = 'sema-highlighter-content';

const UPDATE_HIGHLIGHT_INTERVAL_MS = 250;

class Mirror {
  /**
   *
   * @param {HTML textarea} textAreaElement
   * @param {function()} getTokenAlerts
   * @param {object} options { onMouseoverHighlight, store, onTextPaste }
   */
  constructor(textAreaElement, getTokenAlerts, options) {
    const id = $(textAreaElement).attr('id');
    if (!id) {
      // eslint-disable-next-line no-console
      console.error('Element doesnot have any ID attribute');
      return;
    }
    if (typeof getTokenAlerts !== 'function') {
      // eslint-disable-next-line no-console
      console.error('valid getTokenAlerts function not provided');
      return;
    }

    this._render = this._render.bind(this);
    this._addHandlers = this._addHandlers.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._getHighlightByPosition = this._getHighlightByPosition.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onHover = this._onHover.bind(this);
    this._onTextPaste = options.onTextPaste.bind(this);
    this._onMousePartial = this._onMousePartial.bind(this);

    this._updateHighlights = debounce(
      this._updateHighlights.bind(this),
      UPDATE_HIGHLIGHT_INTERVAL_MS,
    );

    // making sure to have raw DOM element
    this._elementToMimic = document.getElementById(id);
    this._elementMeasurement = new ElementMeasurement(this._elementToMimic);
    this._container = null;
    this._highlighter = null;
    this._highlighterContent = null;
    this._mirror = null;
    this._mirrorContent = null;
    this._ranges = {};
    this._highlights = [];
    this._onMouseoverHighlight = options?.onMouseoverHighlight;
    this._store = options?.store;
    this._currentShownHighlight = null;
    // when github window is resized the mouseover event should be ignored
    // mouse is pressed to resize.
    // so dont do mouseover actions will it is not released
    this._isMouseDown = false;

    this._getTokenAlerts = getTokenAlerts;
    this._addHandlers();
    this._render();
    // set inital text on the mirror div
    this._onInput();

    /**
     * TODO:
     * each text element will have its own subscription
     * performance degradation? Try to use single subscription, or perform side-effect
     */
    this._unsubscribe = this._store.subscribe(() => {
      if (!this._elementToMimic.value.trim()) {
        this._mirrorContent.textContent = '';
        this._updateHighlights();
      }
      const state = this._store.getState();
      if (state.user.isLoggedIn) {
        this._highlighter.style.display = 'block';
      } else {
        this._highlighter.style.display = 'none';
      }
    });
  }

  _render() {
    const {
      height,
      width,
      padding,
      borderWidth,
      lineHeight,
      scrollYHeight,
    } = this._elementMeasurement.getMirrorDimensions();

    if (!this._container) {
      this._container = document.createElement('div');

      this._container.className = `${SHADOW_ROOT_CLASS} ${getActiveThemeClass()}`;

      this._searchRoot = document.createElement('div');
      this._searchRoot.style.zIndex = 2147483647;
      // Render global searchbar
      ReactDOM.render(
        // eslint-disable-next-line react/jsx-filename-extension
        <Provider store={this._store}>
          <GlobalSearchBar
            mirror={this}
            commentBox={this._elementToMimic}
            activeElementId={$(this._elementToMimic).attr('id')}
          />
        </Provider>,
        this._searchRoot,
      );

      this._mirror = document.createElement('div');
      this._mirror.className = MIRROR_CLASS;

      this._highlighter = document.createElement('div');
      this._highlighter.className = HIGHLIGHTER_CLASS;

      this._highlighterIntermediate = document.createElement('div');
      this._highlighterIntermediate.className = HIGHLIGHTER_INTERMEDIATE;

      this._highlighterContainer = document.createElement('div');
      this._highlighterContainer.className = HIGHLIGHTER_CONTAINER;

      this._mirrorContent = document.createElement('div');
      this._mirrorContent.className = MIRROR_CONTENT_CLASS;

      this._container.appendChild(this._searchRoot);
      this._container.appendChild(this._highlighter);
      this._container.appendChild(this._mirror);

      this._mirror.appendChild(this._mirrorContent);

      this._highlighter.appendChild(this._highlighterIntermediate);
      this._highlighterIntermediate.appendChild(this._highlighterContainer);

      $(this._elementToMimic).before(this._container);
    }

    this._mirror.style.height = height;

    this._mirrorContent.style.height = scrollYHeight;
    this._mirrorContent.style.width = width;
    this._mirrorContent.style.padding = padding;
    this._mirrorContent.style.borderWidth = borderWidth;
    this._mirrorContent.style.lineHeight = lineHeight;

    this._highlighterIntermediate.style.height = height;
    this._highlighterIntermediate.style.width = width;

    this._highlighterContainer.style.height = scrollYHeight;
    this._highlighterContainer.style.width = width;

    const { scrollTop } = this._elementToMimic;
    this._mirror.scrollTop = scrollTop;
    this._highlighterContainer.style.top = `-${scrollTop}px`;
  }

  _addHandlers() {
    $(this._elementToMimic).on('scroll', this._onScroll);
    // TODO: have a dedicated click event once this is confirmed from business
    $(this._elementToMimic).on('input', this._onInput);
    $(this._elementToMimic).on('change', this._onInput);
    if (IS_HIGHLIGHTS_ACTIVE) {
      $(this._elementToMimic).on('mousemove', this._onHover);
      $(this._elementToMimic).on('click', this._onClick);
    }
    $(this._elementToMimic).on('mouseup mousedown', this._onMousePartial);
    $(this._elementToMimic).on('paste', this._onTextPaste);

    if (window.ResizeObserver) {
      this._elementToMimicResizeObserver = new window.ResizeObserver(
        this._render,
      );
      this._elementToMimicResizeObserver.observe(this._elementToMimic);
    }

    // this._renderInterval = setAnimationFrameInterval(
    //     this._render,
    //     config.RENDER_INTERVAL
  }

  _onInput() {
    const { value } = this._elementToMimic;
    this._mirrorContent.textContent = value;
    this._updateHighlights();

    const textareaId = this._elementToMimic.id;
    const { semabarContainerId } = getSemaIds(textareaId);
    /**
     * check for the button's behaviour
     * after github's own validation
     * has taken place for the textarea
     */
    // TODO: perform it as a side-effect to an action?
    setTimeout(() => {
      checkSubmitButton(semabarContainerId);
    }, 0);
  }

  _onMousePartial(event) {
    const { type } = event;
    switch (type) {
      case 'mousedown':
        this._isMouseDown = true;
        break;
      case 'mouseup':
        this._isMouseDown = false;
        break;
      default:
        this._isMouseDown = false;
    }
  }

  _getHighlightByPosition(offsetX, offsetY) {
    const { scrollTop } = this._elementToMimic;
    return this._highlights.find((highlight) => {
      const {
        top, left, width, height,
      } = highlight;

      const actualY = offsetY + scrollTop;

      return (
        offsetX >= left
        && offsetX <= left + width
        && actualY >= top
        && actualY <= top + height
      );
    });
  }

  _onHover(event) {
    const { offsetX, offsetY } = event;
    const isHighlight = this._getHighlightByPosition(offsetX, offsetY);
    this._elementToMimic.style.cursor = isHighlight ? 'pointer' : 'text';
  }

  _onClick(event) {
    if (!this._isMouseDown) {
      const { scrollTop } = this._elementToMimic;
      const { offsetX, offsetY } = event;
      const highlight = this._getHighlightByPosition(offsetX, offsetY);

      if (highlight) {
        const {
          top, left, height, id,
        } = highlight;
        const store = this._store.getState();
        const isModalOpen = store.globalSemaSearch.isOpen;
        if (!isModalOpen && this._currentShownHighlight) {
          this._currentShownHighlight = null;
        }
        if (!isEqual(this._currentShownHighlight, highlight)) {
          this._currentShownHighlight = highlight;
          this._onMouseoverHighlight({
            data: this._ranges[id].token,
            position: {
              top: top + height - scrollTop,
              left,
            },
          });
        }
      } else {
        // close modal
      }
    }
  }

  // TODO: do things to make re-render of highlights faster onchange
  _onScroll() {
    this._render();
  }

  _updateHighlights() {
    if (!IS_HIGHLIGHTS_ACTIVE) {
      return;
    }
    const value = this._mirrorContent.textContent;
    const alerts = this._getTokenAlerts(value);

    const scrolled = this._elementToMimic.scrollTop;

    Object.keys(this._ranges).forEach((k) => this._ranges[k].detach());
    this._ranges = {};
    this._highlights = [];
    this._removeExistingHighlights();

    const node = this._mirrorContent.firstChild;

    alerts.forEach((alert) => {
      const range = document.createRange();
      range.setStart(node, alert.startOffset);
      range.setEnd(node, alert.endOffset);

      this._ranges[alert.id] = range;
      this._ranges[alert.id].token = alert.token;

      const {
        top, left, height, width,
      } = range.getClientRects()[0];

      /**
       * The amount of scrolling that has been done of the viewport area
       * (or any other scrollable element) is taken into account when computing the rectangles.
       */
      const disregardScrollTop = top + scrolled;

      const {
        top: baseElementTop,
        left: baseElementLeft,
      } = this._elementMeasurement.getElementViewportPosition();

      const extraLeft = 2;
      const extraTop = 2;
      const goodWidth = 10;

      this._highlights.push({
        id: alert.id,
        top: disregardScrollTop - baseElementTop + extraTop,
        left: left - baseElementLeft - extraLeft / 2,
        width: width + goodWidth,
        height,
      });
    });

    this._highlights.forEach((highlight) => this._createHighlights(highlight));
  }

  _createHighlights(highlight) {
    const {
      top, left, width, height,
    } = highlight;

    const highlighterContent = document.createElement('div');
    highlighterContent.className = HIGHLIGHTER_CONTENT;
    highlighterContent.style.top = `${top}px`;
    highlighterContent.style.left = `${left}px`;
    highlighterContent.style.width = `${width}px`;
    highlighterContent.style.height = `${height}px`;
    this._highlighterContainer.appendChild(highlighterContent);
  }

  _removeExistingHighlights() {
    $(this._highlighterContainer).children(`.${HIGHLIGHTER_CONTENT}`).remove();
  }

  // TODO: implement this
  destroy() {
    $(this._elementToMimic).off('input', this._onInput);
    $(this._elementToMimic).off('paste', this._onTextPaste);
    $(this._elementToMimic).off('scroll', this._onScroll);
    // $(this._elementToMimic).off('click', this._onClick),
    $(this._elementToMimic).off('mousemove', this._hover);
    $(this._elementToMimic).off('mouseup mousedown', this._onMousePartial);
    //   this._renderInterval && this._renderInterval.destroy(),
    if (this._container) {
      this._container.remove();
    }

    if (this._elementToMimicResizeObserver) {
      this._elementToMimicResizeObserver.disconnect();
    }

    this._elementMeasurement.clearCache();
    this._unsubscribe();
  }
}

export default Mirror;
