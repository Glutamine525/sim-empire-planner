import { ActionType } from '@/types/action';
import { CivilType } from '@/types/civil';
import { CounterType } from '@/types/couter';
import { OperationType } from '@/types/operation';
import { ThemeType } from '@/types/theme';

export const clickHamButton = (isHamActive: boolean) => {
  return {
    type: ActionType.ClickHamButton,
    isHamActive,
  };
};

export const changeMapType = (mapType: number) => {
  return {
    type: ActionType.ChangeMapType,
    mapType,
  };
};

export const changeCivil = (civil: CivilType) => {
  return {
    type: ActionType.ChangeCivil,
    civil,
  };
};

export const changeNoWood = (isNoWood: boolean) => {
  return {
    type: ActionType.ChangeNoWood,
    isNoWood,
  };
};

export const changeTheme = (theme: ThemeType) => {
  return {
    type: ActionType.ChangeTheme,
    theme,
  };
};

export const changeMiniMap = (showMiniMap: boolean) => {
  return {
    type: ActionType.ChangeMiniMap,
    showMiniMap,
  };
};

export const rotateMap = (isMapRotated: boolean) => {
  return {
    type: ActionType.RotateMap,
    isMapRotated,
  };
};

export const changeOperation = (operation: OperationType) => {
  return {
    type: ActionType.ChangeOperation,
    operation,
  };
};

export const changeCounter = (counter: CounterType) => {
  return {
    type: ActionType.ChangeCounter,
    counter,
  };
};
