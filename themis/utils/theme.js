import { LIGHT, DARK, DARK_DIMMED } from "../src/pages/Content/constants";

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
    if (colorTheme === DARK_DIMMED) {
      extensionTheme = DARK_DIMMED;
    }
  } else if (colorMode === "auto") {
    const html = document.querySelector('[data-color-mode]');
    const githubTheme = getComputedStyle(html);
    const githubBgColor = githubTheme.backgroundColor;
    if (githubBgColor === "rgb(13, 17, 23)") {
      extensionTheme = DARK;
    } else if (githubBgColor === "rgb(34, 39, 46)") {
      extensionTheme = DARK_DIMMED;
    }
  }
  return extensionTheme;
  // returns light | dark_dimmed | dark
}

export const getThemeClass = (theme) => {
  const THEME_CLASS = {
    light: "",
    dark: "theme--dark",
    dark_dimmed: "theme--dark-dimmed"
  }
  return THEME_CLASS[theme];
}

export const getActiveThemeClass = () => {
  return getThemeClass(getActiveTheme());
}