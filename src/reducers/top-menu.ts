import { ActionType } from '@/types/action';
import { InitTopMenuState, TopMenuAction } from '@/types/state';

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
    case ActionType.ChangeCounter:
      return { ...state, counter: action.counter };
    default:
      return state;
  }
};

export default TopMenu;
