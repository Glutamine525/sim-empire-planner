import * as MapChessboardActionCreators from './map/chessboard';
import * as MapLeftMenuActionCreators from './map/left-menu';
import * as MapPanelActionCreators from './map/panel';
import * as MapTopMenuActionCreators from './map/top-menu';

export enum ActionType {
  Empty,
  ChangeIsLoading,
  ChangeIsPanelActive,
  ChangeMapType,
  ChangeCivil,
  ChangeNoWood,
  ChangeTheme,
  ChangeMiniMap,
  ChangeRotateMap,
  ChangeOperation,
  ResetCouter,
  ChangeCounter,
  PlaceOrDeleteBuilding,
  ChangeCopiedBuilding,
  ChangeIsImportingData,
  InsertSpecialBuilding,
  DeleteSpecialBuilding,
  SwapSpecialBuilding,
  ChangePanelTab,
}

export * as AppActionCreators from './app';

export const MapActionCreators = {
  ...MapTopMenuActionCreators,
  ...MapLeftMenuActionCreators,
  ...MapChessboardActionCreators,
  ...MapPanelActionCreators,
};
