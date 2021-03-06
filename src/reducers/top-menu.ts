import { ActionType } from '@/actions';
import { InitTopMenuState, TopMenuAction } from '@/types/state';

const TopMenu = (state = InitTopMenuState, action: TopMenuAction) => {
  switch (action.type) {
    case ActionType.ChangeHamButton:
      let chessboard = document.getElementById('chessboard-wrapper-outer');
      if (!action.isHamActive) {
        chessboard!.style.display = 'block';
      } else {
        setTimeout(() => {
          chessboard!.style.display = 'none';
        }, 300);
      }
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
    default:
      return state;
  }
};

export default TopMenu;
