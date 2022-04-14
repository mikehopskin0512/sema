import {
  COLOR_MODES,
  SEMA_ICON_ANCHOR_DARK,
  SEMA_ICON_ANCHOR_DARK_DIMMED,
  SEMA_ICON_ANCHOR_DARK_HIGH_CONTRAST,
  SEMA_ICON_ANCHOR_LIGHT,
  THEMES,
  THEMES_BACKGROUNDS,
} from '../src/pages/Content/constants';

const getDocAttribute = (atrName) => document.documentElement.getAttribute(atrName);

const isDayTime = () => {
  const hours = (new Date()).getHours()
  return hours > 6 && hours < 20;
}

const getAutoThemeVariant = () => {
  let themeValue;
  const doc = document.querySelector('[data-color-mode]');
  const githubTheme = getComputedStyle(doc);
  const githubBgColor = githubTheme.backgroundColor;
  const lightColorTheme = getDocAttribute('data-light-theme');

  switch (githubBgColor) {
  case THEMES_BACKGROUNDS.LIGHT:
    themeValue = lightColorTheme === THEMES.LIGHT ? THEMES.LIGHT : THEMES.LIGHT_HIGH_CONTRAST;
    break;
  case THEMES_BACKGROUNDS.DARK:
    themeValue = THEMES.DARK;
    break;
  case THEMES_BACKGROUNDS.DARK_DIMMED:
    themeValue = THEMES.DARK_DIMMED;
    break;
  case THEMES_BACKGROUNDS.DARK_HIGH_CONTRAST:
    themeValue = THEMES.DARK_HIGH_CONTRAST;
    break;
  default:
    themeValue = isDayTime ? THEMES.LIGHT : THEMES.DARK;
    break;
  }

  return themeValue;
};

export const getActiveTheme = () => {
  let currentColorTheme;

  const colorMode = getDocAttribute('data-color-mode');
  const lightColorTheme = getDocAttribute('data-light-theme');
  const darkColorTheme = getDocAttribute('data-dark-theme');

  if (colorMode === COLOR_MODES.AUTO) {
    return getAutoThemeVariant();
  }

  currentColorTheme = colorMode === COLOR_MODES.DARK ? darkColorTheme : lightColorTheme;

  return currentColorTheme;
};

export const getThemeClass = (theme) => {
  const THEME_CLASS = {
    light: 'theme--light',
    light_high_contrast: 'theme--light_high_contrast',
    dark: 'theme--dark',
    dark_dimmed: 'theme--dark-dimmed',
    dark_high_contrast: 'theme--dark-high-contrast',
  };
  return THEME_CLASS[theme];
};

export const getActiveThemeClass = () => getThemeClass(getActiveTheme());

export const getSemaIconTheme = (extensionTheme) => {
  let SEMA_ICON;

  switch (extensionTheme) {
  case THEMES.DARK:
    SEMA_ICON = SEMA_ICON_ANCHOR_DARK;
    break;
  case THEMES.DARK_DIMMED:
    SEMA_ICON = SEMA_ICON_ANCHOR_DARK_DIMMED;
    break;
  case THEMES.DARK_HIGH_CONTRAST:
    SEMA_ICON = SEMA_ICON_ANCHOR_DARK_HIGH_CONTRAST;
    break;
  default:
    SEMA_ICON = SEMA_ICON_ANCHOR_LIGHT;
    break;
  }
  return SEMA_ICON;
};
