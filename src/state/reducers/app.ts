import { ActionType } from '../action-creators';

export interface AppAction {
  type: ActionType;
  isLoading: boolean;
}

export const InitAppState: AppAction = {
  type: ActionType.Empty,
  isLoading: true,
};

const App = (state = InitAppState, action: AppAction) => {
  switch (action.type) {
    case ActionType.ChangeIsLoading:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    default:
      return state;
  }
};

export default App;
