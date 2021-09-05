import { ThemeColor, ThemeType } from '@/types/theme';
import { isInRange } from '@/utils/chessboard';
import { $length } from '@/utils/config';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

interface ChessboardProps {
  Theme: ThemeType;
}

const Chessboard = (props: ChessboardProps) => {
  const { Theme } = props;

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 边框
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(1755, 5);
    ctx.lineTo(5, 1755);
    ctx.lineTo(1725, 3475);
    ctx.lineTo(3475, 1725);
    ctx.closePath();
    ctx.fill();
    // 格子
    ctx.lineWidth = 1;
    ctx.strokeStyle = ThemeColor[Theme]['--border-lighter'];
    ctx.fillStyle = ThemeColor[Theme]['--background-lighter'];
    const offset = 0.5;
    for (let li = 1; li <= $length; li++) {
      for (let co = 1; co <= $length; co++) {
        if (isInRange(li, co)) {
          const x = co * 30 - 30 + offset;
          const y = li * 30 - 30 + offset;
          ctx.strokeRect(x, y, 29, 29);
          ctx.fillRect(x + 0.5, y + 0.5, 28, 28);
        }
      }
    }
  }, [Theme]);

  return (
    <div id="chessboard" className={styles['wrapper-outer']}>
      <div className={styles['wrapper-inner']}>
        <div className={styles.container}>
          <canvas
            ref={canvasRef}
            width={3480}
            height={3480}
            className={styles.canvas}
          ></canvas>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    Theme: state.TopMenu.theme,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const ChessboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chessboard);
export default ChessboardContainer;
