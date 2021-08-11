import { LIGHT, DARK, DARK_DIMMED, DARK_HIGH_CONTRAST, SEMA_ICON_ANCHOR_LIGHT, SEMA_ICON_ANCHOR_DARK, SEMA_ICON_ANCHOR_DARK_DIMMED, SEMA_ICON_ANCHOR_DARK_HIGH_CONTRAST } from "../src/pages/Content/constants";

export const getActiveTheme = () => {
  let extensionTheme = LIGHT;
  const colorMode = document.documentElement.getAttribute(
    'data-color-mode'
  );
  let colorTheme = document.documentElement.getAttribute(
    'data-light-theme'
  );
  if (colorMode === DARK) {
    extensionTheme = DARK;
    colorTheme = document.documentElement.getAttribute('data-dark-theme');
    switch (colorTheme) {
      case DARK_DIMMED:
        extensionTheme = DARK_DIMMED;
        break;
      case DARK_HIGH_CONTRAST:
        extensionTheme = DARK_HIGH_CONTRAST;
        break;
      default:
        break;
    }
  } else if (colorMode === "auto") {
    const html = document.querySelector('[data-color-mode]');
    const githubTheme = getComputedStyle(html);
    const githubBgColor = githubTheme.backgroundColor;
    switch (githubBgColor) {
      case "rgb(13, 17, 23)":
        extensionTheme = DARK;
        break;
      case "rgb(34, 39, 46)":
        extensionTheme = DARK_DIMMED;
        break;
      case "rgb(10, 12, 16)":
        extensionTheme = DARK_HIGH_CONTRAST;
        break;
      default:
        break;
    }
  }
  return extensionTheme;
  // returns light | dark_dimmed | dark | dark_high_contrast
}

export const getThemeClass = (theme) => {
  const THEME_CLASS = {
    light: "",
    dark: "theme--dark",
    dark_dimmed: "theme--dark-dimmed",
    dark_high_contrast: "theme--dark-high-contrast"
  }
  return THEME_CLASS[theme];
}

export const getActiveThemeClass = () => {
  return getThemeClass(getActiveTheme());
}

export const getSemaIconTheme = (extensionTheme) => {
  let SEMA_ICON = SEMA_ICON_ANCHOR_LIGHT;

  switch (extensionTheme) {
    case DARK:
      SEMA_ICON = SEMA_ICON_ANCHOR_DARK;
      break;
    case DARK_DIMMED:
      SEMA_ICON = SEMA_ICON_ANCHOR_DARK_DIMMED;
      break;
    case DARK_HIGH_CONTRAST:
      SEMA_ICON = SEMA_ICON_ANCHOR_DARK_HIGH_CONTRAST;
      break;
    default:
      SEMA_ICON = SEMA_ICON_ANCHOR_LIGHT;
      break;
  }
  return SEMA_ICON;
};