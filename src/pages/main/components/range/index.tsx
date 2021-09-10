import { OperationType } from '@/types/operation';
import { isInBuildingRange } from '@/utils/chessboard';
import React from 'react';
import styles from './index.less';

interface RangeProps {
  Size: number;
  Line: number;
  Column: number;
  Width: number;
  Height: number;
  Color: string;
  Operation: OperationType;
}

export default function Range(props: RangeProps) {
  const { Size, Line, Column, Width, Height, Color, Operation } = props;

  return (
    <div
      className={styles.container}
      style={{
        transform: `translate(${(Column - Size - 1) * 3}rem, ${
          (Line - Size - 1) * 3
        }rem)`,
        transition:
          Operation === OperationType.Placing
            ? 'transform 30ms ease-in-out'
            : '',
      }}
    >
      {Array(Size * 2 + Height)
        .fill(0)
        .map((_, i) => {
          return (
            <div key={i} className={styles.row}>
              {Array(Size * 2 + Width)
                .fill(0)
                .map((_, j) => {
                  const borderStyle = isInBuildingRange(
                    i - Size,
                    j - Size,
                    0,
                    0,
                    Width,
                    Height,
                    Size
                  );
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`${styles.cell} ${
                        borderStyle && styles[borderStyle]
                      }`}
                      style={{
                        background: borderStyle ? Color + '6f' : 'transparent',
                        borderColor: Color,
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
