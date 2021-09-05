import { BuildingChina } from './building-china';
import { BuildingPersian } from './building-persian';
import { CivilType } from './civil';

export const Building: { [key in CivilType]: any } = {
  中国: BuildingChina,
  波斯: BuildingPersian,
  埃及: undefined,
  希腊: undefined,
  阿兹特克: undefined,
  自定义: undefined,
};
