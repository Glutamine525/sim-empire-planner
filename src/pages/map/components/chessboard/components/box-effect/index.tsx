import { OperationType } from '@/types/operation';
import { parseBuildingKey } from '@/utils/chessboard';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

interface BoxEffectProps {
  operation: OperationType;
  boxBuffer: Set<string>;
}

export default function BoxEffect(props: BoxEffectProps) {
  const { operation, boxBuffer } = props;

  const [boxShadow, setBoxShadow] = useState('var(--ant-success-color-hover)');
  const [showMask, setShowMask] = useState(false);

  useEffect(() => {
    const color =
      operation === OperationType.Select
        ? 'var(--ant-primary-color-hover)'
        : operation === OperationType.Delete
        ? 'var(--ant-error-color-hover)'
        : 'var(--ant-success-color-hover)';
    setBoxShadow(color);
    if (operation === OperationType.Empty) setShowMask(true);
    else setShowMask(false);
  }, [operation]);

  return (
    <div className={styles['box-effect']}>
      {Array.from(boxBuffer).map(v => {
        const [line, column, width, height] = parseBuildingKey(v);
        return (
          <div
            key={`box-effect-${v}`}
            className={`${styles.cell} ${showMask ? styles.mask : ''}`}
            style={{
              top: `${(line - 1) * 3}rem`,
              left: `${(column - 1) * 3}rem`,
              width: `${width * 3}rem`,
              height: `${height * 3}rem`,
              boxShadow: `inset 0 0 1rem 0.5rem ${boxShadow}`,
            }}
          ></div>
        );
      })}
    </div>
  );
}
