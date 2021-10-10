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

export function isInRange(line: number, column: number) {
  const halfLength = LENGTH / 2;
  if (line + column <= halfLength + 2) return false;
  if (line + column >= halfLength * 3) return false;
  if (line <= column - halfLength) return false;
  if (line >= column + halfLength) return false;
  return true;
}

export function isAllInRange(
  line: number,
  column: number,
  width: number,
  height: number
) {
  return (
    isInRange(line, column) &&
    isInRange(line + height, column) &&
    isInRange(line, column + width) &&
    isInRange(line + height, column + width)
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

export function formatRect(rect: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  const { x, y, w, h } = rect;
  let [realX, realY, realW, realH] = [x, y, w, h];
  if (w < 0) {
    realX += w;
    realW = -w;
  }
  if (h < 0) {
    realY += h;
    realH = -h;
  }
  return { x: realX, y: realY, w: realW, h: realH };
}

export function mapRectToCell(rect: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  let { x, y, w, h } = formatRect(rect);
  const initCo = Math.floor(x / 30);
  const initLi = Math.floor(y / 30);
  const curCo = Math.ceil((x + w) / 30);
  const curLi = Math.ceil((y + h) / 30);
  x = initCo * 30;
  y = initLi * 30;
  w = (curCo - initCo) * 30;
  h = (curLi - initLi) * 30;
  return { x, y, w, h };
}
