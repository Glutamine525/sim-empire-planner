import { ActionType } from '@/types/action';
import { InitAppState, AppAction } from '@/types/state';

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
