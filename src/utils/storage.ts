import { ThemeType } from '@/types/theme';

const THEME_KEY = 'theme';

const MINI_MAP_KEY = 'mini_map';

export function setThemeInStorage(theme: ThemeType) {
  localStorage.setItem(THEME_KEY, theme);
}

export function getThemeInStorage() {
  return localStorage.getItem(THEME_KEY);
}

export function setMiniMapInStorage(show: boolean) {
  localStorage.setItem(MINI_MAP_KEY, String(show));
}

export function getMiniMapInStorage() {
  return localStorage.getItem(MINI_MAP_KEY);
}
