import { combineReducers } from 'redux';
import App from './app';
import Chessboard from './chessboard';
import LeftMenu from './left-menu';
import Panel from './panel';
import TopMenu from './top-menu';

const reducers = combineReducers({
  App,
  TopMenu,
  LeftMenu,
  Chessboard,
  Panel,
});

export default reducers;
