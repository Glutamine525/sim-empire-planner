import { CivilType } from '@/types/civil';
import { ThemeType } from '@/types/theme';
import { ActionType } from '..';

export const changeIsPanelActive = (isPanelActive: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeIsPanelActive, isPanelActive });
  };
};

export const changeMapType = (mapType: number) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeMapType, mapType });
  };
};

export const changeCivil = (civil: CivilType) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeCivil, civil });
  };
};

export const changeNoWood = (isNoWood: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeNoWood, isNoWood });
  };
};

export const changeTheme = (theme: ThemeType) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeTheme, theme });
  };
};

export const changeMiniMap = (showMiniMap: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeMiniMap, showMiniMap });
  };
};

export const changeRotateMap = (isMapRotated: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeRotateMap, isMapRotated });
  };
};
