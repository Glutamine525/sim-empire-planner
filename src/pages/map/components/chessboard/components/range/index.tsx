import { OperationType } from '@/types/operation';
import { isInBuildingRange } from '@/utils/chessboard';
import React, { useEffect, useState } from 'react';
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

  const [cells, setCells] = useState([] as any);

  useEffect(() => {
    const realSize = size && size < 4 ? 4 : size;
    let result = [] as any;
    for (let i = 0; i < realSize * 2 + height; i++) {
      result[i] = [];
      for (let j = 0; j < realSize * 2 + width; j++) {
        if (
          isInBuildingRange(
            i - realSize,
            j - realSize,
            0,
            0,
            width,
            height,
            realSize
          )
        ) {
          result[i][j] = { t: true, r: true, b: true, l: true };
          if (i - 1 > -1 && result[i - 1][j]) {
            result[i - 1][j].b = false;
            result[i][j].t = false;
          }
          if (j - 1 > -1 && result[i][j - 1]) {
            result[i][j - 1].r = false;
            result[i][j].l = false;
          }
        } else result[i][j] = false;
      }
    }
    setCells(result);
  }, [size, width, height]);

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
      {cells.map((row: any, i: number) => {
        return (
          <div key={i} className={styles.row}>
            {row.map((cell: any, j: number) => {
              return (
                <div
                  key={`${i}-${j}`}
                  className={styles.cell}
                  style={{
                    background: cell ? color + '6f' : 'transparent',
                    borderColor: color,
                    borderTopStyle: cell.t ? 'solid' : 'none',
                    borderRightStyle: cell.r ? 'solid' : 'none',
                    borderBottomStyle: cell.b ? 'solid' : 'none',
                    borderLeftStyle: cell.l ? 'solid' : 'none',
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
