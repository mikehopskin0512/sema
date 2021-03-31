import $ from 'cash-dom';

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
    this._elementToMimic = textAreaElement;
    this._container = null;
    this._canvas = null;
    this._content = null;

    this._render = this._render.bind(this);
    this._addHandlers = this._addHandlers.bind(this);

    if (typeof getTokensToHighlight === 'function') {
      this._getTokensToHighlight = getTokensToHighlight;
      this._addHandlers();
      this._render();
    } else {
      console.error('valid getTokensToHighlight object not provided');
    }
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
    this._container = document.createElement('div');
    this._container.className = MIRROR_CONTAINER_CLASS;

    this._canvas = document.createElement('div');
    this._canvas.className = MIRROR_CANVAS_CLASS;

    this._content = document.createElement('div');
    this._content.className = MIRROR_CONTENT_CLASS;

    $(this._elementToMimic).before(this._container);
    this._container.appendChild(this._canvas);
    this._canvas.appendChild(this._content);
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

  _onInput(event) {
    const value = this._elementToMimic.val();
    console.log('Inputted');

    const boundaries = { indexes: [1, 3] };

    this._renderMarks(boundaries);
  }

  _onScroll() {
    console.log('scrolled');
  }

  _onClick() {
    console.log('clicked');
  }

  _renderMarks(boundaries) {
    const input = this._elementToMimic.val();

    $(this._content).html('it <mark>si<mark> something');
  }

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
