import { $length } from './config';

export function isInRange(li: number, co: number) {
  let halfLength = $length / 2;
  if (li + co <= halfLength + 2) return false;
  if (li + co >= halfLength * 3) return false;
  if (li <= co - halfLength) return false;
  if (li >= co + halfLength) return false;
  return true;
}
