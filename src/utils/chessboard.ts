import { Building } from '@/types/building';
import { LENGTH } from './config';

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
  if (li + range === 0 && range === 4) return 'single-top';
  if (co + range === 0 && range === 4) return 'single-left';
  if (co + 1 === range + width && range === 4) return 'single-right';
  if (li + 1 === range + height && range === 4) return 'single-bottom';
  if (li + co + range + diff === 0) return 'top-left';
  if (li + co === range + diff + width + height - 2) return 'bottom-right';
  if (li === co - (range + diff + width - 1)) return 'top-right';
  if (li === co + (range + diff + height - 1)) return 'bottom-left';
  if (li + range === 0) return 'top';
  if (co + range === 0) return 'left';
  if (co + 1 === range + width) return 'right';
  if (li + 1 === range + height) return 'bottom';
  return 'center';
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
