import { ThemeColor, ThemeType } from '@/types/theme';
import { isInRange } from '@/utils/chessboard';
import { LENGTH } from '@/utils/config';
import React, { MouseEventHandler, useEffect, useRef } from 'react';
import styles from './index.less';

interface MiniMapProps {
  forwardedRef: React.LegacyRef<HTMLCanvasElement>;
  show: boolean;
  theme: ThemeType;
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
    ctx.moveTo(0, 58 * 2 + 1);
    ctx.lineTo(58 * 2 + 1, 0);
    ctx.lineTo(58 * 2 + 2, 0);
    ctx.lineTo(116 * 2, 57 * 2 + 1);
    ctx.lineTo(116 * 2, 57 * 2 + 2);
    ctx.lineTo(57 * 2 + 2, 116 * 2);
    ctx.lineTo(57 * 2 + 1, 116 * 2);
    ctx.lineTo(0, 58 * 2 + 2);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = ThemeColor[theme]['--background-lighter'];
    for (let i = 1; i <= LENGTH; i++) {
      for (let j = 1; j <= LENGTH; j++) {
        if (!isInRange(i, j)) continue;
        ctx.fillRect((j - 1) * 2, (i - 1) * 2, 2, 2);
      }
    }
  }, [theme]);

  return (
    <div
      className={styles.wrapper}
      style={{
        transform: `translateX(${show ? 0 : 'calc(100% + 2rem)'})`,
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
        <canvas
          ref={baseRef}
          width={232}
          height={232}
          className={styles.map}
        ></canvas>
        <canvas
          ref={forwardedRef}
          width={232}
          height={232}
          className={styles.map}
        ></canvas>
        <div
          className={styles.focus}
          style={{
            width: focusWidth * 174,
            height: focusHeight * 174,
            transform: `translate(${focusLeft * 174}px,${focusTop * 174}px)`,
          }}
        ></div>
      </div>
    </div>
  );
}
