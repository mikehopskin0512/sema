import $ from 'cash-dom';
import { debounce } from 'lodash';

import ElementMeasurement from './ElementMeasurement';

const SHADOW_ROOT_CLASS = 'sema-shadow-root';
const MIRROR_CLASS = 'sema-mirror';
const MIRROR_CONTENT_CLASS = 'sema-mirror-content';
const HIGHLIGHTER_UNDERLINE_CLASS = 'sema-underline';

const UPDATE_UNDERLINE_INTERVAL_MS = 250;

class Mirror {
  /**
   *
   * @param {HTML textarea} textAreaElement
   * @param {function()} getTokenAlerts
   */
  constructor(textAreaElement, getTokenAlerts) {
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
    this._onClick = this._onClick.bind(this);

    this._updateHighlights = debounce(
      this._updateHighlights.bind(this),
      UPDATE_UNDERLINE_INTERVAL_MS
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

    this._getTokenAlerts = getTokenAlerts;
    this._addHandlers();
    this._render();
    // set inital text on the mirror div
    this._onInput();
  }

  _render() {
    /*
        <div class="sema-shadow-root">
          <div class="sema-mirror">
              <div class="sema-mirror-content">
                  it si something
              </div>
          </div>
          <div class="sema-underline"></div>
          <div class="sema-underline"></div>
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

      this._mirror = document.createElement('div');
      this._mirror.className = MIRROR_CLASS;

      this._mirrorContent = document.createElement('div');
      this._mirrorContent.className = MIRROR_CONTENT_CLASS;

      this._container.appendChild(this._mirror);
      this._mirror.appendChild(this._mirrorContent);

      $(this._elementToMimic).before(this._container);
    }

    this._mirrorContent.style.height = height;
    this._mirrorContent.style.width = width;
    this._mirrorContent.style.padding = padding;
    this._mirrorContent.style.borderWidth = borderWidth;
    this._mirrorContent.style.lineHeight = lineHeight;
  }

  _addHandlers() {
    $(this._elementToMimic).on('scroll', this._onScroll);
    $(this._elementToMimic).on('click', this._onClick);
    $(this._elementToMimic).on('input', this._onInput);

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

  _onScroll(event) {
    // scroll mirror too
    // update highlights
    const {
      target: { scrollTop },
    } = event;

    this._mirrorContent.scrollTop = scrollTop;
    this._updateHighlights();
  }

  _onClick() {
    console.log('clicked');
  }

  _updateHighlights() {
    const value = this._mirrorContent.textContent;
    const alerts = this._getTokenAlerts(value);

    Object.keys(this._ranges).forEach((k) => this._ranges[k].detach());
    this._ranges = {};
    this._highlights = [];
    this._removeExistingUnderlines();

    const node = this._mirrorContent.firstChild;

    alerts.forEach((alert) => {
      const range = document.createRange();
      range.setStart(node, alert.startOffset);
      range.setEnd(node, alert.endOffset);

      this._ranges[alert.id] = range;

      const { top, left, height, width } = range.getClientRects()[0];

      const baseElementRect = this._elementToMimic.getBoundingClientRect();

      this._highlights.push({
        top: top - baseElementRect.top + height,
        left: left - baseElementRect.left,
        width: width + 2,
      });
    });

    this._highlights.forEach((highlight) => this._createUnderlines(highlight));
  }

  _createUnderlines(highlight) {
    const { top, left, width } = highlight;

    const underline = document.createElement('div');
    underline.className = HIGHLIGHTER_UNDERLINE_CLASS;
    underline.style.top = `${top}px`;
    underline.style.left = `${left}px`;
    underline.style.width = `${width}px`;
    this._container.appendChild(underline);
  }

  _removeExistingUnderlines() {
    $(this._container).children(`.${HIGHLIGHTER_UNDERLINE_CLASS}`).remove();
  }

  destroy() {
    this._elementToMimic.removeEventListener('input', this._onInput),
      this._elementToMimic.removeEventListener('scroll', this._onScroll),
      this._elementToMimic.removeEventListener('click', this._onClick),
      //   this._renderInterval && this._renderInterval.destroy(),
      this._container && this._container.remove(),
      this._elementToMimicResizeObserver &&
        this._elementToMimicResizeObserver.disconnect(),
      this._elementMeasurement.clearCache();
  }
}

export default Mirror;
