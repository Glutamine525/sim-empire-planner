import { SimpleBuilding } from '@/types/building';
import { ActionType } from '..';

export const insertSpecialBuilding = (targetSpecial: SimpleBuilding) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.InsertSpecialBuilding, targetSpecial });
  };
};

export const deleteSpecialBuilding = (targetSpecial: SimpleBuilding) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.DeleteSpecialBuilding, targetSpecial });
  };
};

export const swapSpecialBuilding = (dragIndex: number, dropIndex: number) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.SwapSpecialBuilding, dragIndex, dropIndex });
  };
};

export const changePanelTab = (tab: string) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangePanelTab, tab });
  };
};
