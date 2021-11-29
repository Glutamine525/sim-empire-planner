import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import reducers from './reducers';
import { AppAction } from './reducers/app';
import { ChessboardAction } from './reducers/map/chessboard';
import { LeftMenuAction } from './reducers/map/left-menu';
import { PanelAction } from './reducers/map/panel';
import { TopMenuAction } from './reducers/map/top-menu';

const store = createStore(reducers, {}, applyMiddleware(thunk));

export default store;

// export type MapState = {
//   topMenu: TopMenuAction;
//   leftMenu: LeftMenuAction;
//   chessboard: ChessboardAction;
//   panel: PanelAction;
// };

export type MapAction = TopMenuAction &
  LeftMenuAction &
  ChessboardAction &
  PanelAction;

export type State = {
  app: AppAction;
  map: MapAction;
};
