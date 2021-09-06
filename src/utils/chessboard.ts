import { Building } from '@/types/building';
import { LENGTH } from './config';

export function isInRange(li: number, co: number) {
  let halfLength = LENGTH / 2;
  if (li + co <= halfLength + 2) return false;
  if (li + co >= halfLength * 3) return false;
  if (li <= co - halfLength) return false;
  if (li >= co + halfLength) return false;
  return true;
}

export function getBuildingKey(building: Building) {
  const { Line, Column, Width, Height } = building;
  return `${Line}-${Column}-${Width}` + (Width === Height ? '' : `-${Height}`);
}
