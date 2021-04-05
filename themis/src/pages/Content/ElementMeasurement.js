import $ from 'cash-dom';
class ElementMeasurement {
  constructor(elem) {
    this._element = elem;
  }

  _getElementDimensions() {
    const computedStyle = window.getComputedStyle(this._element);

    return {
      elementHeight: this._element.clientHeight,
      elementWidth: this._element.clientWidth,
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
    } = this._getElementDimensions();
    elementPadding = parseFloat(elementPadding);
    elementBorderWidth = parseFloat(elementBorderWidth);

    const height = elementHeight + 2 * elementBorderWidth;
    const width = elementWidth + 2 * elementBorderWidth;
    const padding = elementPadding;
    const borderWidth = elementBorderWidth;

    return {
      height: `${height}px`,
      width: `${width}px`,
      padding: `${padding}px`,
      borderWidth: `${borderWidth}px`,
      lineHeight: elementLineHeight,
    };
  }
}

export default ElementMeasurement;
