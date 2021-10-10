import { ActionType } from '.';

export const changeIsLoading = (isLoading: boolean) => {
  return (dispatch: any) => {
    dispatch({
      type: ActionType.ChangeIsLoading,
      isLoading,
    });
  };
};
