import $ from 'cash-dom';

import ElementMeasurement from './ElementMeasurement';

const MIRROR_CONTAINER_CLASS = 'sema-mirror';
const MIRROR_CANVAS_CLASS = 'sema-mirror-canvas';
const MIRROR_CONTENT_CLASS = 'sema-mirror-content';

class Mirror {
  /**
   *
   * @param {HTML textarea} textAreaElement
   * @param {function()} getTokensToHighlight
   */
  constructor(textAreaElement, getTokensToHighlight) {
    const id = $(textAreaElement).attr('id');
    if (!id) {
      console.error('Element doesnot have any ID attribute');
      return;
    }
    if (typeof getTokensToHighlight !== 'function') {
      console.error('valid getTokensToHighlight function not provided');
      return;
    }

    this._render = this._render.bind(this);
    this._addHandlers = this._addHandlers.bind(this);
    this._onInput = this._onInput.bind(this);

    // making sure to have raw DOM element
    this._elementToMimic = document.getElementById(id);
    this._elementMeasurement = new ElementMeasurement(textAreaElement);
    this._container = null;
    this._canvas = null;
    this._content = null;

    this._getTokensToHighlight = getTokensToHighlight;
    this._addHandlers();
    this._render();
    // set inital text on the mirror div
    this._onInput();
  }

  _render() {
    /*
        <div class="sema-mirror">
            <div class="sema-highlighter">
                <canvas>
                </canvas>
            </div>
            <div class="sema-mirror-canvas">
                <div class="sema-mirror-content">
                    it si something
                </div>
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
      this._container.className = MIRROR_CONTAINER_CLASS;

      this._canvas = document.createElement('div');
      this._canvas.className = MIRROR_CANVAS_CLASS;

      this._content = document.createElement('div');
      this._content.className = MIRROR_CONTENT_CLASS;

      this._container.appendChild(this._canvas);
      this._canvas.appendChild(this._content);

      $(this._elementToMimic).before(this._container);
    }

    this._content.style.height = height;
    this._content.style.width = width;
    this._content.style.padding = padding;
    this._content.style.borderWidth = borderWidth;
    this._content.style.lineHeight = lineHeight;
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
    console.log(value);

    this._content.textContent = value;

    // const boundaries = { indexes: [1, 3] };

    // this._renderMarks(boundaries);
  }

  _onScroll() {
    console.log('scrolled');
  }

  _onClick() {
    console.log('clicked');
  }

  // _renderMarks(boundaries) {
  //   const input = this._elementToMimic.val();

  //   $(this._content).html('it <mark>si<mark> something');
  // }

  destroy() {
    this._elementToMimic.removeEventListener('input', this._onInput),
      this._elementToMimic.removeEventListener('scroll', this._onScroll),
      this._elementToMimic.removeEventListener('click', this._onClick),
      //   this._renderInterval && this._renderInterval.destroy(),
      this._container && this._container.remove(),
      this._elementToMimicResizeObserver &&
        this._elementToMimicResizeObserver.disconnect(),
      this._domMeasurement.clearCache();
  }
}

export default Mirror;
