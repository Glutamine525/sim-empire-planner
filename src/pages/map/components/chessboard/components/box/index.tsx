import { OperationType } from '@/types/operation';
import { formatRect, mapRectToCell } from '@/utils/chessboard';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface BoxProps {
  boxRect: { x: number; y: number; w: number; h: number };
  show: boolean;
  operation: OperationType;
  showButton: boolean;
  onClickMove: any;
  onClickDelete: any;
}

export default function Box(props: BoxProps) {
  const {
    boxRect: { x, y, w, h },
    show,
    operation,
    showButton,
    onClickMove,
    onClickDelete,
  } = props;

  const [showRoadHelper, setShowRoadHelper] = useState(false);
  const [config, setConfig] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [style, setStyle] = useState({
    background: 'black',
    borderStyle: 'none',
    borderColor: 'black',
  });

  useEffect(() => {
    let { x: realX, y: realY, w: realW, h: realH } = formatRect({ x, y, w, h });
    if (operation === OperationType.Placing) {
      const data = mapRectToCell({ x, y, w, h });
      [realX, realY, realW, realH] = [data.x, data.y, data.w, data.h];
      if (realW > 30 && realH > 30) {
        [realX, realY, realW, realH] = [
          Math.floor(x / 30) * 30,
          Math.floor(y / 30) * 30,
          30,
          30,
        ];
      }
      setShowRoadHelper(true);
    }
    setConfig({ x: realX, y: realY, w: realW, h: realH });
  }, [x, y, w, h]); // eslint-disable-line

  useEffect(() => {
    switch (operation) {
      case OperationType.Placing:
        setStyle({
          background: 'var(--ant-success-color-outline)',
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
          show &&
          (operation !== OperationType.Placing ||
            (showRoadHelper && operation === OperationType.Placing))
            ? 'block'
            : 'none',
        transform: `translate(${config.x}px, ${config.y}px)`,
        width: config.w,
        height: config.h,
      }}
    >
      <div
        id="box-delete"
        className={`${styles['icon-button']} ${styles.delete}`}
        style={{
          display:
            showButton && operation === OperationType.Delete ? 'block' : 'none',
          top: '-4.8rem',
          left: Math.abs(w) / 2 - 21,
        }}
        onClick={onClickDelete}
      >
        <span id="box-delete-text" className={styles['icon-font']}>
          &#xe625;
        </span>
      </div>
      <div
        id="box-select-down"
        className={`${styles['icon-button']} ${styles.select}`}
        onClick={onClickMove}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          bottom: '-4.8rem',
          left: Math.abs(w) / 2 - 21,
        }}
      >
        <span id="box-select-down-text" className={styles['icon-font']}>
          &#xe621;
        </span>
      </div>
      <div
        id="box-select-up"
        className={`${styles['icon-button']} ${styles.select}`}
        onClick={onClickMove}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          top: '-4.8rem',
          left: Math.abs(w) / 2 - 21,
        }}
      >
        <span id="box-select-up-text" className={styles['icon-font']}>
          &#xe622;
        </span>
      </div>
      <div
        id="box-select-left"
        className={`${styles['icon-button']} ${styles.select}`}
        onClick={onClickMove}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          top: Math.abs(h) / 2 - 21,
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
        onClick={onClickMove}
        style={{
          display:
            showButton && operation === OperationType.Select ? 'block' : 'none',
          top: Math.abs(h) / 2 - 21,
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
