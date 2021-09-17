import { OperationType } from '@/types/operation';
import { isInBuildingRange } from '@/utils/chessboard';
import React from 'react';
import styles from './index.less';

interface RangeProps {
  show: boolean;
  size: number;
  line: number;
  column: number;
  width: number;
  height: number;
  color: string;
  operation: OperationType;
}

export default function Range(props: RangeProps) {
  const { show, size, line, column, width, height, color, operation } = props;

  return (
    <div
      className={styles.container}
      style={{
        display: show && size ? 'flex' : 'none',
        transform: `translate(${(column - size - 1) * 3}rem, ${
          (line - size - 1) * 3
        }rem)`,
        transition:
          operation === OperationType.Placing
            ? 'transform 30ms ease-in-out'
            : '',
      }}
    >
      {Array(size * 2 + height)
        .fill(0)
        .map((_, i) => {
          return (
            <div key={i} className={styles.row}>
              {Array(size * 2 + width)
                .fill(0)
                .map((_, j) => {
                  const borderStyle = isInBuildingRange(
                    i - size,
                    j - size,
                    0,
                    0,
                    width,
                    height,
                    size
                  );
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`${styles.cell} ${
                        borderStyle && styles[borderStyle]
                      }`}
                      style={{
                        background: borderStyle ? color + '6f' : 'transparent',
                        borderColor: color,
                      }}
                    ></div>
                  );
                })}
            </div>
          );
        })}
    </div>
  );
}
