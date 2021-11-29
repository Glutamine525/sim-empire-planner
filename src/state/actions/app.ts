import { ThemeType } from '@/types/theme';

import { ActionType } from '.';

export const changeIsLoading = (isLoading: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: ActionType.ChangeIsLoading,
      isLoading,
    });
  };
};

export const changeTheme = (theme: ThemeType) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeTheme, theme });
  };
};
