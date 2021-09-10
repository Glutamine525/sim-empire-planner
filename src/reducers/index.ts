import { combineReducers } from 'redux';
import Chessboard from './chessboard';
import LeftMenu from './left-menu';
import TopMenu from './top-menu';

const reducers = combineReducers({
  TopMenu,
  LeftMenu,
  Chessboard,
});

export default reducers;
