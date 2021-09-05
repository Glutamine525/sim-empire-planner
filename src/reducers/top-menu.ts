import { ActionType } from '@/types/action';
import { CivilType } from '@/types/civil';
import { CounterType } from '@/types/couter';
import { OperationType } from '@/types/operation';
import { InitTopMenuState } from '@/types/state';
import { ThemeType } from '@/types/theme';

interface TopMenuAction {
  type: ActionType;
  isHamActive?: boolean;
  mapType?: number;
  civil?: CivilType;
  isNoWood?: boolean;
  theme?: ThemeType;
  showMiniMap?: boolean;
  isMapRotated?: boolean;
  operation?: OperationType;
  counter?: CounterType;
}

const TopMenu = (state = InitTopMenuState, action: TopMenuAction) => {
  switch (action.type) {
    case ActionType.ClickHamButton:
      return { ...state, isHamActive: action.isHamActive };
    case ActionType.ChangeMapType:
      return { ...state, mapType: action.mapType };
    case ActionType.ChangeCivil:
      return { ...state, civil: action.civil };
    case ActionType.ChangeNoWood:
      return { ...state, isNoWood: action.isNoWood };
    case ActionType.ChangeTheme:
      return { ...state, theme: action.theme };
    case ActionType.ChangeMiniMap:
      return { ...state, showMiniMap: action.showMiniMap };
    case ActionType.RotateMap:
      return { ...state, isMapRotated: action.isMapRotated };
    case ActionType.ChangeOperation:
      return { ...state, operation: action.operation };
    case ActionType.ChangeCounter:
      return { ...state, counter: action.counter };
    default:
      return state;
  }
};

export default TopMenu;
