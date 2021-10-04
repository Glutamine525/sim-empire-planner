import { ActionType } from '@/types/action';
import { Building } from '@/types/building';
import { CivilType } from '@/types/civil';
import { OperationType } from '@/types/operation';
import { ThemeType } from '@/types/theme';
import { setMiniMapInStorage, setThemeInStorage } from '@/utils/storage';

export const changeIsLoading = (isLoading: boolean) => {
  return {
    type: ActionType.ChangeIsLoading,
    isLoading,
  };
};

export const changeHamButton = (isHamActive: boolean) => {
  return {
    type: ActionType.ChangeHamButton,
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
  setThemeInStorage(theme);
  return {
    type: ActionType.ChangeTheme,
    theme,
  };
};

export const changeMiniMap = (showMiniMap: boolean) => {
  setMiniMapInStorage(showMiniMap);
  return {
    type: ActionType.ChangeMiniMap,
    showMiniMap,
  };
};

export const changeRotateMap = (isMapRotated: boolean) => {
  return {
    type: ActionType.RotateMap,
    isMapRotated,
  };
};

export const changeOperation = (
  operation: OperationType,
  operationSub: string,
  buildingConfig: Building
) => {
  return {
    type: ActionType.ChangeOperation,
    operation,
    operationSub,
    buildingConfig,
  };
};

export const resetCounter = () => {
  return { type: ActionType.ResetCouter };
};

export const placeOrDeleteBuilding = (building: Building, diff: number) => {
  return {
    type: ActionType.PlaceOrDeleteBuilding,
    building,
    diff,
  };
};

export const setCopiedBuilding = (building: Building) => {
  return {
    type: ActionType.SetCopiedBuilding,
    copiedBuilding: building,
  };
};
