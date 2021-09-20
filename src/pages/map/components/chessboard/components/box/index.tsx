import { OperationType } from '@/types/operation';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface BoxProps {
  dragConfig: { initX: number; initY: number; curX: number; curY: number };
  show: boolean;
  operation: OperationType;
  showButton: boolean;
}

export default function Box(props: BoxProps) {
  const {
    dragConfig: { initX, initY, curX, curY },
    show,
    operation,
    showButton,
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
    if (operation === OperationType.Placing) {
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
      } else {
        x = Math.floor(initX / 30) * 30;
        y = Math.floor(initY / 30) * 30;
        [width, height] = [30, 30];
        setShowRoadHelper(true);
      }
    }
    setConfig({ x, y, width, height });
  }, [initX, initY, curX, curY]); // eslint-disable-line

  useEffect(() => {
    switch (operation) {
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
  }, [operation]);

  return (
    <div
      className={styles.container}
      style={{
        ...style,
        display:
          (show && operation !== OperationType.Placing) ||
          (show && showRoadHelper && operation === OperationType.Placing)
            ? 'block'
            : 'none',
        transform: `translate(${config.x}px, ${config.y}px)`,
        width: config.width,
        height: config.height,
      }}
    >
      <div
        id="box-delete"
        className={`${styles['icon-button']} ${styles.delete}`}
        style={{
          display:
            showButton && operation === OperationType.Delete ? 'block' : 'none',
          top: '-4.8rem',
          left: Math.abs(initX - curX) / 2 - 21,
        }}
      >
        <span id="box-delete-text" className={styles['icon-font']}>
          &#xe625;
        </span>
      </div>
      <div
        id="box-select-down"
        className={`${styles['icon-button']} ${styles.select}`}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          bottom: '-4.8rem',
          left: Math.abs(initX - curX) / 2 - 21,
        }}
      >
        <span id="box-select-down-text" className={styles['icon-font']}>
          &#xe621;
        </span>
      </div>
      <div
        id="box-select-up"
        className={`${styles['icon-button']} ${styles.select}`}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          top: '-4.8rem',
          left: Math.abs(initX - curX) / 2 - 21,
        }}
      >
        <span id="box-select-up-text" className={styles['icon-font']}>
          &#xe622;
        </span>
      </div>
      <div
        id="box-select-left"
        className={`${styles['icon-button']} ${styles.select}`}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          top: Math.abs(initY - curY) / 2 - 21,
          left: '-4.8rem',
        }}
      >
        <span id="box-select-left-text" className={styles['icon-font']}>
          &#xe623;
        </span>
      </div>
      <div
        id="box-select-right"
        className={`${styles['icon-button']} ${styles.select}`}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          top: Math.abs(initY - curY) / 2 - 21,
          right: '-4.8rem',
        }}
      >
        <span id="box-select-right-text" className={styles['icon-font']}>
          &#xe624;
        </span>
      </div>
    </div>
  );
}
