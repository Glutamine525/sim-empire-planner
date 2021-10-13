import {
  buildingCanvasRef,
  markerCanvasRef,
  miniMapCanvasRef,
} from '@/pages/map/components/chessboard';
import { MINI_MAP_RATIO } from '@/pages/map/components/chessboard/components/mini-map';
import { Building } from '@/types/building';
import { RefObject } from 'react';
import { RATIO } from './screenshot';

export function getContext(canvasRef: RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current!;
  return canvas.getContext('2d')!;
}

export function clearCanvas(canvasRef: RefObject<HTMLCanvasElement>) {
  const canvas = canvasRef.current!;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function fillRect(
  canvasRef: RefObject<HTMLCanvasElement>,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string
) {
  const ctx = getContext(canvasRef);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function drawMiniMap(line: number, column: number, building: Building) {
  const { Background, Width, Height } = building;
  fillRect(
    miniMapCanvasRef,
    MINI_MAP_RATIO * (column - 1),
    MINI_MAP_RATIO * (line - 1),
    MINI_MAP_RATIO * Width,
    MINI_MAP_RATIO * Height,
    Background
  );
}

export function drawBuilding(
  line: number,
  column: number,
  image: HTMLImageElement
) {
  getContext(buildingCanvasRef).drawImage(
    image,
    (column - 1) * 30 * RATIO,
    (line - 1) * 30 * RATIO
  );
}

export function drawMarker(
  line: number,
  column: number,
  image: HTMLImageElement
) {
  getContext(markerCanvasRef).drawImage(
    image,
    (column - 1) * 30 * RATIO,
    (line - 1) * 30 * RATIO
  );
}
