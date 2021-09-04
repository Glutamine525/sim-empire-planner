import { ThemeType } from '@/types/theme';

export const changeDisplay = (theme: ThemeType) => {
  return {
    type: 'CHANGE_DISPLAY_THEME',
    theme,
  };
};
