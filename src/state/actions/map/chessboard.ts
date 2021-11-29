import { Building } from '@/types/building';

import { ActionType } from '..';

export const resetCounter = () => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ResetCouter });
  };
};

export const placeOrDeleteBuilding = (buildings: Building[], diff: number) => {
  return (dispatch: any) => {
    dispatch({
      type: ActionType.PlaceOrDeleteBuilding,
      buildings,
      diff,
    });
  };
};

export const changeCopiedBuilding = (building: Building) => {
  return (dispatch: any) => {
    dispatch({
      type: ActionType.ChangeCopiedBuilding,
      copiedBuilding: building,
    });
  };
};
