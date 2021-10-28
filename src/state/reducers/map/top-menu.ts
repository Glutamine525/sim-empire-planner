import { ActionType } from '@/state/actions';
import { CivilType } from '@/types/civil';
import { setMiniMapInStorage } from '@/utils/storage';

export interface TopMenuAction {
  type: ActionType;
  isPanelActive: boolean;
  mapType: number;
  civil: CivilType;
  isNoWood: boolean;
  showMiniMap: boolean;
  isMapRotated: boolean;
}

export const InitTopMenuState: TopMenuAction = {
  type: ActionType.Empty,
  isPanelActive: false,
  mapType: 5,
  civil: CivilType.China,
  isNoWood: false,
  showMiniMap: true,
  isMapRotated: false,
};

const TopMenu = (state = InitTopMenuState, action: TopMenuAction) => {
  switch (action.type) {
    case ActionType.ChangeIsPanelActive:
      let chessboard = document.getElementById('chessboard-wrapper');
      if (!action.isPanelActive) {
        chessboard!.style.display = 'block';
      } else {
        setTimeout(() => {
          chessboard!.style.display = 'none';
        }, 300);
      }
      return { ...state, isPanelActive: action.isPanelActive };
    case ActionType.ChangeMapType:
      return { ...state, mapType: action.mapType };
    case ActionType.ChangeCivil:
      return { ...state, civil: action.civil };
    case ActionType.ChangeNoWood:
      return { ...state, isNoWood: action.isNoWood };
    case ActionType.ChangeMiniMap:
      setMiniMapInStorage(action.showMiniMap);
      return { ...state, showMiniMap: action.showMiniMap };
    case ActionType.ChangeRotateMap:
      return { ...state, isMapRotated: action.isMapRotated };
    default:
      return state;
  }
};

export default TopMenu;
