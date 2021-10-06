import { BorderStyleType, Building } from '@/types/building';
import { LENGTH } from './config';
import { getBuildingImage } from './screenshot';

export function getRoadImageBuffer(): {
  [key: string]: Promise<HTMLImageElement>;
} {
  const h = [BorderStyleType.Solid, BorderStyleType.None];
  const v = [
    BorderStyleType.Solid,
    BorderStyleType.None,
    BorderStyleType.Dashed,
  ];
  let building = {
    Text: '',
    Color: '',
    FontSize: '',
    Background: '',
    BorderWidth: '0.1',
    BorderColor: '#000000',
    Width: 1,
    Height: 1,
    IsRoad: true,
  } as any;
  let styles = {} as { [key: string]: Promise<HTMLImageElement> };
  for (let l of h) {
    for (let r of h) {
      for (let t of v) {
        for (let b of v) {
          building.BorderTStyle = t;
          building.BorderRStyle = r;
          building.BorderBStyle = b;
          building.BorderLStyle = l;
          styles[`${t} ${r} ${b} ${l}`] = getBuildingImage(building);
        }
      }
    }
  }
  return styles;
}

export function isInRange(li: number, co: number) {
  const halfLength = LENGTH / 2;
  if (li + co <= halfLength + 2) return false;
  if (li + co >= halfLength * 3) return false;
  if (li <= co - halfLength) return false;
  if (li >= co + halfLength) return false;
  return true;
}

export function isAllInRange(li: number, co: number, w: number, h: number) {
  return (
    isInRange(li, co) &&
    isInRange(li + h, co) &&
    isInRange(li, co + w) &&
    isInRange(li + h, co + w)
  );
}

export function isInBuildingRange(
  li: number,
  co: number,
  originLi: number,
  originCo: number,
  width: number,
  height: number,
  range: number
) {
  let diff = range - 4;
  li -= originLi;
  co -= originCo;
  if (li + co + range + diff < 0) return false;
  if (li + co > range + diff + width + height - 2) return false;
  if (li < co - (range + diff + width - 1)) return false;
  if (li > co + (range + diff + height - 1)) return false;
  return true;
}

export function getBuildingKey(
  building: Building,
  line: number,
  column: number
) {
  const { Width, Height } = building;
  return `${line}-${column}-${Width}` + (Width === Height ? '' : `-${Height}`);
}

export function parseBuildingKey(key: string) {
  let data = key.split('-').map(v => +v);
  if (data.length === 3) data.push(data[2]);
  return data;
}

export function showMarker(building: Building) {
  return !(
    building.IsRoad ||
    building.IsBarrier ||
    building.IsProtection ||
    building.IsWonder ||
    building.IsDecoration
  );
}
