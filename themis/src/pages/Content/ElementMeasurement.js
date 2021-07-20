class ElementMeasurement {
  constructor(elem) {
    this._element = elem;
  }

  _getElementDimensions() {
    const computedStyle = window.getComputedStyle(this._element);

    return {
      elementHeight: this._element.getBoundingClientRect().height,
      scrollYHeight: this._element.scrollHeight,
      elementWidth: this._element.getBoundingClientRect().width,
      scrollbarWidth: this._element.offsetWidth - this._element.clientWidth,
      elementPadding: computedStyle.getPropertyValue('padding'),
      elementBorderWidth: computedStyle.getPropertyValue('border-width'),
      //   elementMargin: computedStyle.getPropertyValue('margin'),
      elementLineHeight: computedStyle.getPropertyValue('line-height'),
    };
  }

  getMirrorDimensions() {
    let {
      elementHeight,
      elementWidth,
      elementPadding,
      elementBorderWidth,
      elementLineHeight,
      scrollYHeight,
      scrollbarWidth,
    } = this._getElementDimensions();
    elementPadding = parseFloat(elementPadding);
    elementBorderWidth = parseFloat(elementBorderWidth);

    let width = elementWidth;
    const height = elementHeight;
    const padding = elementPadding;
    const borderWidth = elementBorderWidth;

    if (scrollbarWidth > 5) {
      width = width - scrollbarWidth;
    }

    return {
      scrollYHeight: `${scrollYHeight}px`,
      height: `${height}px`,
      width: `${width}px`,
      padding: `${padding}px`,
      borderWidth: `${borderWidth}px`,
      lineHeight: elementLineHeight,
    };
  }

  getElementViewportPosition() {
    const { top, bottom, right, left } = this._element.getBoundingClientRect();
    return {
      top,
      bottom,
      right,
      left,
    };
  }
}

export default ElementMeasurement;
