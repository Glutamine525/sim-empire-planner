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
  counter: CounterType;
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
  counter: {
    OridinaryHouse: 0,
    HighEndHouse: 0,
    Barn: 0,
    Warehouse: 0,
    Agriculture: 0,
    Industry: 0,
    General: 0,
  },
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

export const InitState: TopMenuAction & LeftMenuAction = {
  ...InitTopMenuState,
  ...InitLeftMenuState,
};
