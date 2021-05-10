import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import $ from 'cash-dom';
import { debounce, isEqual } from 'lodash';

import ElementMeasurement from './ElementMeasurement';
import GlobalSearchBar from './GlobalSearchbar.jsx';

const SHADOW_ROOT_CLASS = 'sema-shadow-root';
const MIRROR_CLASS = 'sema-mirror';
const MIRROR_CONTENT_CLASS = 'sema-mirror-content';
const HIGHLIGHTER_CLASS = 'sema-highlighter';
const HIGHLIGHTER_CONTENT_CLASS = 'sema-highlighter-content';

const UPDATE_HIGHLIGHT_INTERVAL_MS = 250;

class Mirror {
  /**
   *
   * @param {HTML textarea} textAreaElement
   * @param {function()} getTokenAlerts
   * @param {object} options { onMouseoverHighlight, store }
   */
  constructor(textAreaElement, getTokenAlerts, options) {
    const id = $(textAreaElement).attr('id');
    if (!id) {
      console.error('Element doesnot have any ID attribute');
      return;
    }
    if (typeof getTokenAlerts !== 'function') {
      console.error('valid getTokenAlerts function not provided');
      return;
    }

    this._render = this._render.bind(this);
    this._addHandlers = this._addHandlers.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onScroll = this._onScroll.bind(this);
    // this._onClick = this._onClick.bind(this);
    this._onHover = this._onHover.bind(this);
    this._onMousePartial = this._onMousePartial.bind(this);

    this._updateHighlights = debounce(
      this._updateHighlights.bind(this),
      UPDATE_HIGHLIGHT_INTERVAL_MS
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
  }

  _render() {
    /*
        <div class="sema-shadow-root">
          <div>
            <ReactDOM/>
          </div>
          <div class="sema-mirror">
              <div class="sema-mirror-content">
                  it si something
              </div>
          </div>
          <div class="sema-highlight">
            <div class="sema-highlighter-content"></div>
            <div class="sema-highlighter-content"></div>
          </div>
        </div>
        <textarea>
            it si something
        </textarea>
      
      */
    const {
      height,
      width,
      padding,
      borderWidth,
      lineHeight,
    } = this._elementMeasurement.getMirrorDimensions();

    if (!this._container) {
      this._container = document.createElement('div');
      this._container.className = SHADOW_ROOT_CLASS;

      this._searchRoot = document.createElement('div');
      this._searchRoot.style.zIndex = 2147483647;
      // Render global searchbar
      ReactDOM.render(
        <Provider store={this._store}>
          <GlobalSearchBar
            mirror={this}
            commentBox={this._elementToMimic}
            activeElementId={$(this._elementToMimic).attr('id')}
          />
        </Provider>,
        this._searchRoot
      );

      this._mirror = document.createElement('div');
      this._mirror.className = MIRROR_CLASS;

      this._highlighter = document.createElement('div');
      this._highlighter.className = HIGHLIGHTER_CLASS;

      this._mirrorContent = document.createElement('div');
      this._mirrorContent.className = MIRROR_CONTENT_CLASS;

      this._container.appendChild(this._searchRoot);
      this._container.appendChild(this._highlighter);
      this._container.appendChild(this._mirror);

      this._mirror.appendChild(this._mirrorContent);

      $(this._elementToMimic).before(this._container);
    }

    this._mirrorContent.style.height = height;
    this._mirrorContent.style.width = width;
    this._mirrorContent.style.padding = padding;
    this._mirrorContent.style.borderWidth = borderWidth;
    this._mirrorContent.style.lineHeight = lineHeight;

    this._highlighter.style.height = height;
    this._highlighter.style.width = width;
    this._highlighter.style.padding = padding;
    this._highlighter.style.borderWidth = borderWidth;
  }

  _addHandlers() {
    $(this._elementToMimic).on('scroll', this._onScroll);
    // TODO: have a dedicated click event once this is confirmed from business
    $(this._elementToMimic).on('click', this._onHover);
    $(this._elementToMimic).on('input', this._onInput);
    // $(this._elementToMimic).on('mousemove', this._onHover);
    $(this._elementToMimic).on('mouseup mousedown', this._onMousePartial);

    if (window.ResizeObserver) {
      this._elementToMimicResizeObserver = new window.ResizeObserver(
        this._render
      );
      this._elementToMimicResizeObserver.observe(this._elementToMimic);
    }

    // this._renderInterval = setAnimationFrameInterval(
    //     this._render,
    //     config.RENDER_INTERVAL
  }

  _onInput() {
    const value = this._elementToMimic.value;
    this._mirrorContent.textContent = value;
    this._updateHighlights();
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
    }
  }

  _onHover(event) {
    if (!this._isMouseDown) {
      const { offsetX, offsetY } = event;

      const highlight = this._highlights.find((highlight) => {
        const { top, left, width, height } = highlight;
        if (
          offsetX >= left &&
          offsetX <= left + width &&
          offsetY >= top &&
          offsetY <= top + height
        ) {
          return highlight;
        }
      });

      if (highlight) {
        const { top, left, height, id } = highlight;
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
              top: top + height,
              left: left,
            },
          });
        }
      } else {
        // close modal
      }
    }
  }

  // TODO: do things to make re-render of highlights faster onchange
  _onScroll(event) {
    // scroll mirror too
    // update highlights
    const {
      target: { scrollTop },
    } = event;

    this._mirrorContent.scrollTop = scrollTop;
    this._updateHighlights();
  }

  // _onClick() {
  //   console.log('clicked');
  // }

  _updateHighlights() {
    const value = this._mirrorContent.textContent;
    const alerts = this._getTokenAlerts(value);

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

      const { top, left, height, width } = range.getClientRects()[0];

      const {
        top: baseElementTop,
        left: baseElementLeft,
      } = this._elementMeasurement.getElementViewportPosition();

      const extraWidth = 4;
      const extraTop = 2;

      this._highlights.push({
        id: alert.id,
        top: top - baseElementTop + extraTop,
        left: left - baseElementLeft - extraWidth / 2,
        width: width + 6,
        height,
      });
    });

    this._highlights.forEach((highlight) => this._createHighlights(highlight));
  }

  _createHighlights(highlight) {
    const { top, left, width, height } = highlight;

    const highlighterContent = document.createElement('div');
    highlighterContent.className = HIGHLIGHTER_CONTENT_CLASS;
    highlighterContent.style.top = `${top}px`;
    highlighterContent.style.left = `${left}px`;
    highlighterContent.style.width = `${width}px`;
    highlighterContent.style.height = `${height}px`;
    this._highlighter.appendChild(highlighterContent);
  }

  _removeExistingHighlights() {
    $(this._highlighter).children(`.${HIGHLIGHTER_CONTENT_CLASS}`).remove();
  }

  // TODO: implement this
  destroy() {
    $(this._elementToMimic).off('input', this._onInput),
      $(this._elementToMimic).off('scroll', this._onScroll),
      // $(this._elementToMimic).off('click', this._onClick),
      $(this._elementToMimic).off('mousemove', this._hover);
    $(this._elementToMimic).off('mouseup mousedown', this._onMousePartial);
    //   this._renderInterval && this._renderInterval.destroy(),
    this._container && this._container.remove(),
      this._elementToMimicResizeObserver &&
        this._elementToMimicResizeObserver.disconnect(),
      this._elementMeasurement.clearCache();
  }
}

export default Mirror;
