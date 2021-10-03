import React, { MouseEventHandler } from 'react';
import styles from './index.less';

interface MiniMapProps {
  show: boolean;
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
    show,
    focusWidth,
    focusHeight,
    focusTop,
    focusLeft,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = props;

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
        <canvas width={232} height={232} className={styles.map}></canvas>
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
