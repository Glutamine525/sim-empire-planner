import { CivilType } from './civil';
import { OperationType } from './operation';
import { ThemeType } from './theme';

export const InitTopMenuState = {
  isHamActive: false,
  mapType: 5,
  civil: CivilType.China,
  isNoWood: false,
  theme: ThemeType.Light,
  showMiniMap: true,
  isMapRotated: false,
  operation: OperationType.Empty,
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
