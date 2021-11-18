import { oneOf } from 'prop-types';
import React from 'react';
import { ReactComponent as HorizontalLightSvg } from './img/logo-horizontal-light.svg';
import { ReactComponent as PillLightSvg } from './img/logo-pill-light.svg';
import { ReactComponent as SymbolLightSvg } from './img/logo-symbol-light.svg';
import { ReactComponent as SquareLightSvg } from './img/logo-square-light.svg';
import { ReactComponent as HorizontalDarkSvg } from './img/logo-horizontal-dark.svg';
import { ReactComponent as PillDarkSvg } from './img/logo-pill-dark.svg';
import { ReactComponent as SymbolDarkSvg } from './img/logo-symbol-dark.svg';
import { ReactComponent as SquareDarkSvg } from './img/logo-square-dark.svg';

const logos = {
  light: {
    horizontal: HorizontalLightSvg,
    pill: PillLightSvg,
    square: SquareLightSvg,
    symbol: SymbolLightSvg,
  },
  dark: {
    horizontal: HorizontalDarkSvg,
    pill: PillDarkSvg,
    square: SquareDarkSvg,
    symbol: SymbolDarkSvg,
  },
};

const Logo = (
  {
    shape,
    theme,
    width,
    height,
    style,
  },
) => {
  const Component = logos[theme][shape];
  return (
    <Component
      width={width}
      height={height}
      style={style}
    />
  );
};

Logo.defaultProps = {
  shape: 'symbol',
  theme: 'light',
};

Logo.propTypes = {
  shape: oneOf(['horizontal', 'pill', 'square', 'symbol']),
  theme: oneOf(['light', 'dark']),
  width: Number,
  height: Number,
  style: Object,
};

export default Logo;
