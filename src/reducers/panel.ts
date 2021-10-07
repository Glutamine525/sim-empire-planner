import { ActionType } from '@/actions';
import { InitPanelState, PanelAction } from '@/types/state';

const Panel = (state = InitPanelState, action: PanelAction) => {
  const { specials } = state;

  switch (action.type) {
    case ActionType.ChangePanelTab:
      return {
        ...state,
        tab: action.tab,
      };
    case ActionType.InsertSpecialBuilding:
      return {
        ...state,
        specials: [...specials, action.targetSpecial],
      };
    case ActionType.DeleteSpecialBuilding:
      return {
        ...state,
        specials: specials.filter(v => v.name !== action.targetSpecial.name),
      };
    case ActionType.SwapSpecialBuilding:
      [specials[action.dragIndex], specials[action.dropIndex]] = [
        specials[action.dropIndex],
        specials[action.dragIndex],
      ];
      return {
        ...state,
        specials,
      };
    default:
      return state;
  }
};

export default Panel;
