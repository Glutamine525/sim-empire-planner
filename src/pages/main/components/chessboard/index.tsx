import PerfectScrollbar from 'perfect-scrollbar';
import { ThemeColor, ThemeType } from '@/types/theme';
import { getBuildingKey, isInRange } from '@/utils/chessboard';
import { getFontSize, LENGTH } from '@/utils/config';
import React, { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import { getScreenSize } from '@/utils/screen';
import { OperationType } from '@/types/operation';
import { Building, CivilBuilding } from '@/types/building';
import { CivilType } from '@/types/civil';

interface ChessboardProps {
  Civil: CivilType;
  Theme: ThemeType;
  Operation: OperationType;
  BuildingConfig: Building;
}

const initDragConfig = {
  initX: -1,
  initY: -1,
};

const Chessboard = (props: ChessboardProps) => {
  const { Civil, Theme, Operation, BuildingConfig } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [dragConfig, setDragConfig] = useState({ ...initDragConfig });
  const [buildings, setBuildings] = useState([] as Building[]);

  const wrapperOuterRef = useRef(null);
  const wrapperIuterRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const scroll = new PerfectScrollbar('#chessboard-wrapper-outer', {
      wheelSpeed: 1,
    });
    const [W, H] = getWrapperSize();
    const [w, h] = getScreenSize();
    setScrollTop((H - h) / 2);
    setScrollLeft((W - w) / 2);
    window.addEventListener('resize', () => scroll.update());
  }, []);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Boundary
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(1755, 5);
    ctx.lineTo(5, 1755);
    ctx.lineTo(1725, 3475);
    ctx.lineTo(3475, 1725);
    ctx.closePath();
    ctx.fill();
    // Cell
    ctx.lineWidth = 1;
    ctx.strokeStyle = ThemeColor[Theme]['--border-lighter'];
    ctx.fillStyle = ThemeColor[Theme]['--background-lighter'];
    const offset = 0.5;
    for (let li = 1; li <= LENGTH; li++) {
      for (let co = 1; co <= LENGTH; co++) {
        if (isInRange(li, co)) {
          const x = co * 30 - 30 + offset;
          const y = li * 30 - 30 + offset;
          ctx.strokeRect(x, y, 29, 29);
          ctx.fillRect(x + 0.5, y + 0.5, 28, 28);
        }
      }
    }
  }, [Theme]);

  const onWrapperMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    if (Operation !== OperationType.Empty) return;
    const { clientX, clientY } = event;
    setIsDragging(true);
    setDragConfig({
      initX: getScrollLeft() + clientX,
      initY: getScrollTop() + clientY,
    });
  };

  const onWrapperMouseMove: MouseEventHandler<HTMLDivElement> = event => {
    if (!isDragging) return;
    const { initX, initY } = dragConfig;
    const { clientX, clientY } = event;
    setScrollLeft(initX - clientX);
    setScrollTop(initY - clientY);
  };

  const onWrapperMouseUp: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(false);
  };

  const onBuildingContainerMouseDown: MouseEventHandler<HTMLDivElement> =
    event => {
      const {
        nativeEvent: { offsetX, offsetY },
      } = event;
      const fontSize = getFontSize();
      console.log({ fontSize, offsetX, offsetY });

      if (Operation === OperationType.Placing) {
        setBuildings(buildings => {
          return [
            ...buildings,
            {
              ...BuildingConfig,
              Line: 60,
              Column: 60,
            },
          ];
        });
        return;
      }
    };

  const getScrollLeft = () => (wrapperOuterRef.current as any).scrollLeft;

  const getScrollTop = () => (wrapperOuterRef.current as any).scrollTop;

  const setScrollLeft = (val: number) =>
    ((wrapperOuterRef.current as any).scrollLeft = val);

  const setScrollTop = (val: number) =>
    ((wrapperOuterRef.current as any).scrollTop = val);

  const getWrapperSize = () => {
    const { clientWidth, clientHeight } = wrapperIuterRef.current as any;
    return [clientWidth, clientHeight];
  };

  return (
    <div
      ref={wrapperOuterRef}
      id="chessboard-wrapper-outer"
      className={styles['wrapper-outer']}
    >
      <div
        ref={wrapperIuterRef}
        className={styles['wrapper-inner']}
        onMouseDown={onWrapperMouseDown}
        onMouseMove={onWrapperMouseMove}
        onMouseUp={onWrapperMouseUp}
      >
        <div className={styles.container}>
          <canvas
            ref={canvasRef}
            width={3480}
            height={3480}
            className={styles.canvas}
          ></canvas>
          <div
            className={styles['building-container']}
            onMouseDown={onBuildingContainerMouseDown}
          >
            {buildings.map(building => {
              return (
                <div
                  key={getBuildingKey(building)}
                  className={styles.building}
                  style={{
                    width: `${building.Width * 3}rem`,
                    height: `${building.Height * 3}rem`,
                    top: `${building.Line * 3}rem`,
                    left: `${building.Column * 3}rem`,
                    color: building.Color,
                    fontSize: `${building.FontSize}rem`,
                    background: building.Background,
                    borderWidth: building.BorderWidth,
                    borderColor: building.BorderColor,
                    borderTopStyle: building.BorderTStyle,
                    borderRightStyle: building.BorderRStyle,
                    borderBottomStyle: building.BorderBStyle,
                    borderLeftStyle: building.BorderLStyle,
                  }}
                >
                  <div className={styles.text}>{building.Text}</div>
                  <div
                    className={styles.marker}
                    style={{
                      color:
                        CivilBuilding[Civil]['防'].length <= building.Marker
                          ? 'var(--ant-success-color)'
                          : 'var(--ant-error-color)',
                    }}
                  >
                    {building.Marker}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    Civil: state.TopMenu.civil,
    Theme: state.TopMenu.theme,
    Operation: state.LeftMenu.operation,
    BuildingConfig: state.LeftMenu.buildingConfig,
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
