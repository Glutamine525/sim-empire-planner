import { ThemeColor, ThemeType } from '@/types/theme';
import { isInRange } from '@/utils/chessboard';
import { LENGTH } from '@/utils/config';
import React, { MouseEventHandler, useEffect, useRef } from 'react';
import styles from './index.less';

export const MINI_MAP_SIZE = LENGTH * 2;

export const MINI_MAP_RATIO = 4;

interface MiniMapProps {
  forwardedRef: React.LegacyRef<HTMLCanvasElement>;
  show: boolean;
  theme: ThemeType;
  rotated: boolean;
  focusWidth: number;
  focusHeight: number;
  focusTop: number;
  focusLeft: number;
  onMouseDown: MouseEventHandler<HTMLDivElement>;
  onMouseMove: MouseEventHandler<HTMLDivElement>;
  onMouseUp: MouseEventHandler<HTMLDivElement>;
}

export default function MiniMap(props: MiniMapProps) {
  const {
    forwardedRef,
    show,
    theme,
    rotated,
    focusWidth,
    focusHeight,
    focusTop,
    focusLeft,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = props;

  const baseRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas: any = baseRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(0, 58 * 4 + 1);
    ctx.lineTo(58 * 4 + 1, 0);
    ctx.lineTo(58 * 4 + 4, 0);
    ctx.lineTo(116 * 4, 57 * 4 + 1);
    ctx.lineTo(116 * 4, 57 * 4 + 4);
    ctx.lineTo(57 * 4 + 4, 116 * 4);
    ctx.lineTo(57 * 4 + 1, 116 * 4);
    ctx.lineTo(0, 58 * 4 + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = ThemeColor[theme]['--background-lighter'];
    for (let i = 1; i <= LENGTH; i++) {
      for (let j = 1; j <= LENGTH; j++) {
        if (!isInRange(i, j)) continue;
        ctx.fillRect((j - 1) * 4, (i - 1) * 4, 4, 4);
      }
    }
  }, [theme]);

  return (
    <div
      className={styles.wrapper}
      style={{
        opacity: show ? '0.9' : '0',
        visibility: show ? 'visible' : 'hidden',
      }}
    >
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <div
        className={styles.container}
        onMouseDownCapture={onMouseDown}
        onMouseMoveCapture={onMouseMove}
        onMouseUpCapture={onMouseUp}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: rotated ? 'rotate(45deg)' : 'none',
            transformOrigin: 'center',
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          <canvas
            ref={baseRef}
            width={LENGTH * MINI_MAP_RATIO}
            height={LENGTH * MINI_MAP_RATIO}
            className={styles.map}
          ></canvas>
          <canvas
            ref={forwardedRef}
            width={LENGTH * MINI_MAP_RATIO}
            height={LENGTH * MINI_MAP_RATIO}
            className={styles.map}
          ></canvas>
        </div>
        <div
          className={styles.focus}
          style={{
            width: focusWidth * MINI_MAP_SIZE,
            height: focusHeight * MINI_MAP_SIZE,
            transform: `translate(${focusLeft * MINI_MAP_SIZE}px,${
              focusTop * MINI_MAP_SIZE
            }px)`,
          }}
        ></div>
      </div>
    </div>
  );
}
