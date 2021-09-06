import { combineReducers } from 'redux';
import LeftMenu from './left-menu';
import TopMenu from './top-menu';

const reducers = combineReducers({
  TopMenu,
  LeftMenu,
});

export default reducers;
