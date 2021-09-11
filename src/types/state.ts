import { ActionType } from './action';
import { Building } from './building';
import { CivilType } from './civil';
import { CounterType } from './couter';
import { OperationType } from './operation';
import { ThemeType } from './theme';

export interface TopMenuAction {
  type: ActionType;
  isHamActive: boolean;
  mapType: number;
  civil: CivilType;
  isNoWood: boolean;
  theme: ThemeType;
  showMiniMap: boolean;
  isMapRotated: boolean;
}

export const InitTopMenuState: TopMenuAction = {
  type: ActionType.Empty,
  isHamActive: false,
  mapType: 5,
  civil: CivilType.China,
  isNoWood: false,
  theme: ThemeType.Light,
  showMiniMap: true,
  isMapRotated: false,
};

export interface LeftMenuAction {
  type: ActionType;
  operation: OperationType;
  operationSub: string;
  buildingConfig: Building;
}

export const InitLeftMenuState: LeftMenuAction = {
  type: ActionType.Empty,
  operation: OperationType.Empty,
  operationSub: '',
  buildingConfig: {} as any,
};

export interface ChessboardAction {
  type: ActionType;
  building: Building;
  diff: number;
  copiedBuilding: Building;
  counter: CounterType;
}

export const InitChessboardState: ChessboardAction = {
  type: ActionType.Empty,
  building: {} as Building,
  diff: 1,
  copiedBuilding: {} as Building,
  counter: {
    OridinaryHouse: 0,
    HighEndHouse: 0,
    Barn: 0,
    Warehouse: 0,
    Agriculture: 0,
    Industry: 0,
    General: 0,
    Total: 0,
    Road: 0,
  },
};

export const InitState: TopMenuAction & LeftMenuAction & ChessboardAction = {
  ...InitTopMenuState,
  ...InitLeftMenuState,
  ...InitChessboardState,
};
