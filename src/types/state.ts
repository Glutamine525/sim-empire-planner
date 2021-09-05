import { CivilType } from './civil';
import { OperationType } from './operation';
import { ThemeType } from './theme';

export const InitState = {
  isHamActive: false,
  mapType: 5,
  civil: 'China' as CivilType,
  isNoWood: false,
  theme: 'Light' as ThemeType,
  showMiniMap: true,
  isMapRotated: false,
  operation: 'Empty' as OperationType,
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
