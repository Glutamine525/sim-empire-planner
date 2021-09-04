import { ThemeType } from '@/types/theme';

interface TopMenuAction {
  type: string;
  theme: ThemeType;
}

const TopMenu = (state = { theme: 'Dark' }, action: TopMenuAction) => {
  switch (action.type) {
    case 'CHANGE_DISPLAY_THEME':
      return { theme: action.theme };
    default:
      return state;
  }
};

export default TopMenu;
