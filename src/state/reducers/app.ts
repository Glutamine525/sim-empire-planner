import { ThemeType } from '@/types/theme';
import { setThemeInStorage } from '@/utils/storage';
import { ActionType } from '../actions';

export interface AppAction {
  type: ActionType;
  isLoading: boolean;
  theme: ThemeType;
}

export const InitAppState: AppAction = {
  type: ActionType.Empty,
  isLoading: true,
  theme: ThemeType.Light,
};

const App = (state = InitAppState, action: AppAction) => {
  switch (action.type) {
    case ActionType.ChangeIsLoading:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case ActionType.ChangeTheme:
      setThemeInStorage(action.theme);
      return { ...state, theme: action.theme };
    default:
      return state;
  }
};

export default App;
