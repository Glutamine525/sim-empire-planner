import { OperationType } from '@/types/operation';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface BoxProps {
  DragConfig: { initX: number; initY: number; curX: number; curY: number };
  Show: boolean;
  Operation: OperationType;
}

export default function Box(props: BoxProps) {
  const {
    DragConfig: { initX, initY, curX, curY },
    Show,
    Operation,
  } = props;

  const [showRoadHelper, setShowRoadHelper] = useState(false);
  const [config, setConfig] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [style, setStyle] = useState({
    background: 'black',
    borderStyle: 'none',
    borderColor: 'black',
  });

  useEffect(() => {
    let x = initX < curX ? initX : curX;
    let y = initY < curY ? initY : curY;
    let width = Math.abs(initX - curX);
    let height = Math.abs(initY - curY);
    if (Operation === OperationType.Placing) {
      let [startX, endX] = initX < curX ? [initX, curX] : [curX, initX];
      let [startY, endY] = initY < curY ? [initY, curY] : [curY, initY];
      startX = Math.floor(startX / 30) * 30;
      startY = Math.floor(startY / 30) * 30;
      endX = Math.floor(endX / 30) * 30;
      endY = Math.floor(endY / 30) * 30;
      [x, y] = [startX, startY];
      if (startX === endX) {
        width = 30;
        height = endY - startY + 30;
        setShowRoadHelper(true);
      } else if (startY === endY) {
        height = 30;
        width = endX - startX + 30;
        setShowRoadHelper(true);
      } else setShowRoadHelper(false);
    }
    setConfig({ x, y, width, height });
  }, [initX, initY, curX, curY]);

  useEffect(() => {
    switch (Operation) {
      case OperationType.Placing:
        setStyle({
          background: 'var(--ant-primary-color-outline)',
          borderStyle: 'none',
          borderColor: 'none',
        });
        break;
      case OperationType.Select:
        setStyle({
          background: 'var(--ant-primary-color-outline)',
          borderStyle: 'dashed',
          borderColor: 'var(--ant-primary-color-hover)',
        });
        break;
      case OperationType.Delete:
        setStyle({
          background: 'var(--ant-error-color-outline)',
          borderStyle: 'dashed',
          borderColor: 'var(--ant-error-color-hover)',
        });
        break;
      default:
        break;
    }
  }, [Operation]);

  return (
    <div
      className={styles.container}
      style={{
        ...style,
        display:
          (Show && Operation !== OperationType.Placing) ||
          (Show && showRoadHelper && Operation === OperationType.Placing)
            ? 'block'
            : 'none',
        transform: `translate(${config.x}px, ${config.y}px)`,
        width: config.width,
        height: config.height,
      }}
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}
