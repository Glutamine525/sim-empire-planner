import { Building } from '@/types/building';
import { OperationType } from '@/types/operation';

import { ActionType } from '..';

export const changeOperation = (
  operation: OperationType,
  operationSub: string,
  buildingConfig: Building
) => {
  return (dispatch: any) => {
    dispatch({
      type: ActionType.ChangeOperation,
      operation,
      operationSub,
      buildingConfig,
    });
  };
};

export const changeIsImportingData = (isImportingData: boolean) => {
  return (dispatch: any) => {
    dispatch({ type: ActionType.ChangeIsImportingData, isImportingData });
  };
};
