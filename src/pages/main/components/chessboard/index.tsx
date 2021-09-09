import PerfectScrollbar from 'perfect-scrollbar';
import { ThemeColor, ThemeType } from '@/types/theme';
import { getBuildingKey, isInRange } from '@/utils/chessboard';
import { LENGTH } from '@/utils/config';
import React, {
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import {
  getScreenSize,
  changeFontSize,
  getFontSize,
  DEFAULT_SIZE,
  getCoord,
} from '@/utils/browser';
import { OperationType } from '@/types/operation';
import {
  BorderStyleType,
  Building,
  CatalogType,
  CivilBuilding,
  MarkerColor,
} from '@/types/building';
import { CivilType } from '@/types/civil';
import { getBuildingImage, getMarkerImage } from '@/utils/screenshot';

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

const initMoveConfig = {
  line: -1,
  column: -1,
  offsetLine: -1,
  offsetColumn: -1,
};

const testBuildingConfig = {
  Line: 0,
  Column: 0,
  Name: '道路',
  Text: '路',
  Range: 0,
  Marker: 0,
  Catalog: CatalogType.Road,
  IsFixed: false,
  IsBarrier: false,
  IsRoad: true,
  IsProtection: false,
  IsWonder: false,
  IsDecoration: false,
  IsGeneral: false,
  // css
  Width: 1,
  Height: 1,
  Color: 'black',
  FontSize: 1.4,
  Background: '#fdfebd',
  BorderColor: 'var(--border-base)',
  BorderWidth: 0.1,
  BorderTStyle: BorderStyleType.Solid,
  BorderRStyle: BorderStyleType.Solid,
  BorderBStyle: BorderStyleType.Solid,
  BorderLStyle: BorderStyleType.Solid,
};

const Chessboard = (props: ChessboardProps) => {
  const { Civil, Theme, Operation, BuildingConfig } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [dragConfig, setDragConfig] = useState({ ...initDragConfig });
  const [moveConfig, setMoveConfig] = useState({ ...initMoveConfig });
  const [buildingMarker, setBuildingMarker] = useState(0);

  const wrapperOuterRef = useRef(null);
  const wrapperIuterRef = useRef(null);
  const cellCanvasRef = useRef(null);
  const buildingCanvasRef = useRef(null);
  const markerCanvasRef = useRef(null);

  const protectionNum = useMemo<number>(
    () => CivilBuilding[Civil]['防'].length,
    [Civil]
  );
  const buildingBuffer = useMemo(
    () => getBuildingImage(BuildingConfig),
    [BuildingConfig]
  );
  const markerBuffer = useMemo(() => {
    return {
      [MarkerColor.Normal]: Array.from(Array(20), (_, k) => k).map(v =>
        getMarkerImage(v, MarkerColor.Normal)
      ),
      [MarkerColor.Safe]: [0, 1, 2, 3, 4, 5].map(v =>
        getMarkerImage(v, MarkerColor.Safe)
      ),
      [MarkerColor.Danger]: [0, 1, 2, 3, 4, 5].map(v =>
        getMarkerImage(v, MarkerColor.Danger)
      ),
    };
  }, []);

  useEffect(() => {
    const scroll = new PerfectScrollbar('#chessboard-wrapper-outer', {
      wheelSpeed: 1,
    });
    const updateScroll = () => scroll.update();
    updateScroll();
    const [W, H] = getWrapperSize();
    const [w, h] = getScreenSize();
    setScrollTop((H - h) / 2);
    setScrollLeft((W - w) / 2);
    window.addEventListener('resize', updateScroll);

    // (async () => {
    //   const buildingImg = await getBuildingImage(testBuildingConfig);
    //   const markerImg = await getMarkerImage(100, MarkerColor.Danger);
    //   let count = 0;
    //   console.time('[TEST] Painting Building');
    //   for (let i = 1; i <= LENGTH; i++) {
    //     for (let j = 1; j <= LENGTH; j++) {
    //       if (isInRange(i, j)) {
    //         testPlaceBuilding(buildingImg, markerImg, i, j);
    //         count++;
    //       }
    //     }
    //   }
    //   console.timeEnd('[TEST] Painting Building');
    // })();
  }, []);

  useEffect(() => {
    console.time('Painting Cell');
    const canvas: any = cellCanvasRef.current;
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
    ctx.strokeStyle = ThemeColor[Theme]['--border-lighter'];
    ctx.fillStyle = ThemeColor[Theme]['--background-lighter'];
    ctx.lineWidth = 1;
    let offset = 0.5;
    for (let li = 1; li <= 116; li++) {
      for (let co = 1; co <= 116; co++) {
        if (isInRange(li, co)) {
          let x = co * 30 - 30 + offset;
          let y = li * 30 - 30 + offset;
          ctx.strokeRect(x, y, 29, 29);
          ctx.fillRect(x + 0.5, y + 0.5, 28, 28);
        }
      }
    }
    console.timeEnd('Painting Cell');
  }, [Theme]);

  // useEffect(() => {
  //   if (!Object.keys(BuildingConfig).length) return;
  //   (async () => {
  //     setBuildingImage(await getBuildingImage(BuildingConfig));
  //   })();
  // }, [BuildingConfig]);

  const onWrapperMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(true);
    switch (Operation) {
      case OperationType.Empty:
        const { clientX, clientY } = event;
        setDragConfig({
          initX: getScrollLeft() + clientX,
          initY: getScrollTop() + clientY,
        });
        break;
      case OperationType.Placing:
        const { line, offsetLine, column, offsetColumn } = moveConfig;
        placeBuilding(line - offsetLine, column - offsetColumn);
        break;
      default:
        break;
    }
  };

  const onWrapperMouseMove: MouseEventHandler<HTMLDivElement> = event => {
    const { pageX, pageY, clientX, clientY } = event;
    const [offsetX, offsetY] = [
      pageX + getScrollLeft() - 86,
      pageY + getScrollTop() - 80,
    ];
    const { line, column } = getCoord(offsetX, offsetY);
    switch (Operation) {
      case OperationType.Empty:
        if (!isDragging) return;
        const { initX, initY } = dragConfig;
        setScrollLeft(initX - clientX);
        setScrollTop(initY - clientY);
        break;
      case OperationType.Placing:
        const [offsetLine, offsetColumn] = [
          Math.floor((BuildingConfig.Height - 1) / 2),
          Math.floor((BuildingConfig.Width - 1) / 2),
        ];
        setMoveConfig({ line, offsetLine, column, offsetColumn });
        if (!isDragging) return;
        placeBuilding(line - offsetLine, column - offsetColumn);
        break;
      default:
        break;
    }
  };

  const onWrapperMouseUp: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(false);
  };

  const testPlaceBuilding = async (
    building: HTMLImageElement,
    marker: HTMLImageElement,
    line: number,
    column: number
  ) => {
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(building, (column - 1) * 30 * 4, (line - 1) * 30 * 4);
    ctx.drawImage(marker, (column - 1) * 30 * 4, (line - 1) * 30 * 4);
  };

  const placeBuilding = async (line: number, column: number) => {
    if (Operation !== OperationType.Placing) return;
    let canvas: any = buildingCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(
      await buildingBuffer,
      (column - 1) * 30 * 4,
      (line - 1) * 30 * 4
    );
    canvas = markerCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let markerColor: MarkerColor =
      buildingMarker >= protectionNum ? MarkerColor.Safe : MarkerColor.Danger;
    markerColor = BuildingConfig.IsRoad ? MarkerColor.Normal : markerColor;
    console.log(BuildingConfig, markerColor);

    ctx.drawImage(
      await markerBuffer[markerColor][buildingMarker],
      (column - 1) * 30 * 4,
      (line - 1) * 30 * 4
    );
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
        onMouseDownCapture={onWrapperMouseDown}
        onMouseMoveCapture={onWrapperMouseMove}
        onMouseUpCapture={onWrapperMouseUp}
      >
        <div className={styles.container}>
          <canvas
            ref={cellCanvasRef}
            width={3480}
            height={3480}
            className={styles.canvas}
          ></canvas>
          <canvas
            ref={buildingCanvasRef}
            width={13920}
            height={13920}
            className={`${styles.canvas} ${styles['canvas-building']}`}
          ></canvas>
          <canvas
            ref={markerCanvasRef}
            width={13920}
            height={13920}
            className={`${styles.canvas} ${styles['canvas-marker']}`}
          ></canvas>
          <div
            id="building-preview"
            className={styles['building-preview']}
            style={{
              display: Operation === OperationType.Placing ? 'flex' : 'none',
              width: `${BuildingConfig.Width * 3}rem`,
              height: `${BuildingConfig.Height * 3}rem`,
              // top: `${(BuildingConfig.Line - 1) * 3}rem`,
              // left: `${(BuildingConfig.Column - 1) * 3}rem`,
              // top: `${58 * 3}rem`,
              // left: `${58 * 3}rem`,
              color: BuildingConfig.Color,
              fontSize: `${BuildingConfig.FontSize}rem`,
              background: BuildingConfig.Background,
              borderWidth: `${BuildingConfig.BorderWidth}rem`,
              borderColor: BuildingConfig.BorderColor,
              borderTopStyle: BuildingConfig.BorderTStyle,
              borderRightStyle: BuildingConfig.BorderRStyle,
              borderBottomStyle: BuildingConfig.BorderBStyle,
              borderLeftStyle: BuildingConfig.BorderLStyle,
              transform: `translate(${
                (moveConfig.column - moveConfig.offsetColumn - 1) * 3
              }rem,${(moveConfig.line - moveConfig.offsetLine - 1) * 3}rem)`,
              transition:
                Operation === OperationType.Placing
                  ? 'transform 30ms ease-in-out'
                  : '',
            }}
          >
            {BuildingConfig.Text}
            <div
              className={styles.marker}
              style={{
                color:
                  protectionNum <= buildingMarker
                    ? 'var(--ant-success-color)'
                    : 'var(--ant-error-color)',
              }}
            >
              {buildingMarker}
            </div>
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
