import concatReducers from '@/utils/concat-reducers';
import { combineReducers } from 'redux';
import { MapAction } from '..';
import App from './app';
import Chessboard from './map/chessboard';
import LeftMenu from './map/left-menu';
import Panel from './map/panel';
import TopMenu from './map/top-menu';

const reducers = combineReducers({
  app: App,
  map: concatReducers([TopMenu, LeftMenu, Chessboard, Panel]) as (
    state: MapAction | undefined,
    action: MapAction
  ) => MapAction,
});

export default reducers;
