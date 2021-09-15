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
    if (Operation == OperationType.Placing) {
      x = Math.floor(x / 30) * 30;
      y = Math.floor(y / 30) * 30;
      //TODO
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
        display: Show ? 'block' : 'none',
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
