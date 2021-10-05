import { ActionType } from '@/actions';
import { InitLeftMenuState, LeftMenuAction } from '@/types/state';

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
