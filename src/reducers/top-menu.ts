import { ActionType } from '@/types/action';
import { CivilType } from '@/types/civil';
import { CounterType } from '@/types/couter';
import { OperationType } from '@/types/operation';
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

const TopMenu = (
  state = {
    isHamActive: false,
    mapType: 5,
    civil: 'China',
    isNoWood: false,
    theme: 'Light',
    showMiniMap: true,
    isMapRotated: false,
    operation: 'Empty',
    counter: {
      OridinaryHouse: 0,
      HighEndHouse: 0,
      Barn: 0,
      Warehouse: 0,
      Agriculture: 0,
      Industry: 0,
      General: 0,
    },
  },
  action: TopMenuAction
) => {
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
