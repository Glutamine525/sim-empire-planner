import { ActionType } from '@/state/action-creators';
import { Building } from '@/types/building';
import { OperationType } from '@/types/operation';

export interface LeftMenuAction {
  type: ActionType;
  operation: OperationType;
  operationSub: string;
  buildingConfig: Building;
  isImportingData: boolean;
}

export const InitLeftMenuState: LeftMenuAction = {
  type: ActionType.Empty,
  operation: OperationType.Empty,
  operationSub: '',
  buildingConfig: {} as Building,
  isImportingData: false,
};

const LeftMenu = (state = InitLeftMenuState, action: LeftMenuAction) => {
  switch (action.type) {
    case ActionType.ChangeOperation:
      return {
        ...state,
        operation: action.operation,
        operationSub: action.operationSub,
        buildingConfig: action.buildingConfig,
      };
    case ActionType.ChangeIsImportingData:
      return {
        ...state,
        isImportingData: action.isImportingData,
      };
    default:
      return state;
  }
};

export default LeftMenu;
