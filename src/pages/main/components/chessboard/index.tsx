import PerfectScrollbar from 'perfect-scrollbar';
import { ThemeColor, ThemeType } from '@/types/theme';
import {
  getBuildingKey,
  isAllInRange,
  isInRange,
  parseBuildingKey,
} from '@/utils/chessboard';
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
import { getScreenSize, getCoord } from '@/utils/browser';
import { OperationType } from '@/types/operation';
import { Building, CivilBuilding, MarkerColor } from '@/types/building';
import { CivilType } from '@/types/civil';
import { getBuildingImage, getMarkerImage, RATIO } from '@/utils/screenshot';
import Range from '../range';

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

let cells = Array.from(Array(LENGTH), (_, i) =>
  Array.from(Array(LENGTH), (_, j) => {
    return {
      inRange: isInRange(i + 1, j + 1),
      occupied: '',
      protection: {} as any,
      building: {} as Building,
    };
  })
);

const Chessboard = (props: ChessboardProps) => {
  const { Civil, Theme, Operation, BuildingConfig } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [dragConfig, setDragConfig] = useState({ ...initDragConfig });
  const [moveConfig, setMoveConfig] = useState({ ...initMoveConfig });
  const [showPreview, setShowPreview] = useState(false);
  const [cellOccupied, setCellOccupied] = useState(false);
  const [buildingMarker, setBuildingMarker] = useState(0);
  const [hoveredBuilding, setHoveredBuilding] = useState({} as Building);

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
  const hideMarker = useMemo(
    () =>
      BuildingConfig.IsBarrier ||
      BuildingConfig.IsRoad ||
      BuildingConfig.IsDecoration ||
      BuildingConfig.IsProtection ||
      BuildingConfig.IsWonder,
    [BuildingConfig]
  );
  const buildingRange = useMemo(() => {
    if (Operation === OperationType.Empty) return hoveredBuilding;
    else if (Operation === OperationType.Placing) return BuildingConfig;
    return {} as Building;
  }, [Operation, hoveredBuilding, BuildingConfig]);

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

  useEffect(() => {
    if (Operation !== OperationType.Placing) setShowPreview(false);
  }, [Operation]);

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
        if (!showPreview || cellOccupied) return;
        const { line, offsetLine, column, offsetColumn } = moveConfig;
        const { Width, Height } = BuildingConfig;
        for (let i = line + offsetLine; i < line + offsetLine + Height; i++) {
          for (
            let j = column + offsetColumn;
            j < column + offsetColumn + Width;
            j++
          ) {
            if (cells[i][j].occupied) {
              return;
            }
          }
        }
        placeBuilding(line + offsetLine, column + offsetColumn);
        break;
      default:
        break;
    }
  };

  const onWrapperMouseMove: MouseEventHandler<HTMLDivElement> = async event => {
    const { pageX, pageY, clientX, clientY } = event;
    const [offsetX, offsetY] = [
      pageX + getScrollLeft() - 86,
      pageY + getScrollTop() - 80,
    ];
    const { line, column } = getCoord(offsetX, offsetY);
    switch (Operation) {
      case OperationType.Empty:
        const { occupied } = cells[line][column];
        if (occupied) {
          const [li, co] = parseBuildingKey(occupied);
          setMoveConfig({
            line: li,
            offsetLine: 0,
            column: co,
            offsetColumn: 0,
          });
          setHoveredBuilding(cells[li][co].building);
        } else {
          setHoveredBuilding({} as Building);
        }
        if (!isDragging) return;
        const { initX, initY } = dragConfig;
        setScrollLeft(initX - clientX);
        setScrollTop(initY - clientY);
        break;
      case OperationType.Placing:
        const [offsetLine, offsetColumn] = [
          -Math.floor((BuildingConfig.Height - 1) / 2),
          -Math.floor((BuildingConfig.Width - 1) / 2),
        ];
        const { Width, Height } = BuildingConfig;
        if (
          !isAllInRange(
            line + offsetLine,
            column + offsetColumn,
            Width - 1,
            Height - 1
          )
        ) {
          setShowPreview(false);
          setCellOccupied(false);
          return;
        }
        let isOccupied = false;
        for (let i = line + offsetLine; i < line + offsetLine + Height; i++) {
          for (
            let j = column + offsetColumn;
            j < column + offsetColumn + Width;
            j++
          ) {
            if (cells[i][j].occupied) {
              isOccupied = true;
            }
          }
        }
        setShowPreview(true);
        setCellOccupied(isOccupied);
        setMoveConfig({ line, offsetLine, column, offsetColumn });
        if (!isDragging || isOccupied) return;
        placeBuilding(line + offsetLine, column + offsetColumn);
        break;
      default:
        break;
    }
  };

  const onWrapperMouseUp: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(false);
  };

  const onWrapperMouseLeave: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(false);
  };

  const onWrapperDoubleClick: MouseEventHandler<HTMLDivElement> = event => {
    if (Operation === OperationType.Placing && cellOccupied) return;
    const { pageX, pageY } = event;
    const [offsetX, offsetY] = [
      pageX + getScrollLeft() - 86,
      pageY + getScrollTop() - 80,
    ];
    const { line, column } = getCoord(offsetX, offsetY);
    clearBuilding(line, column);
  };

  const placeBuilding = async (line: number, column: number) => {
    const key = getBuildingKey(BuildingConfig, line, column);
    const { Width, Height } = BuildingConfig;
    for (let i = line; i < line + Height; i++) {
      for (let j = column; j < column + Width; j++) {
        cells[i][j].occupied = key;
      }
    }

    cells[line][column].building = BuildingConfig;

    let canvas: any = buildingCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(
      await buildingBuffer,
      (column - 1) * 30 * RATIO,
      (line - 1) * 30 * RATIO
    );
    if (!hideMarker) {
      canvas = markerCanvasRef.current;
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      let markerColor: MarkerColor =
        buildingMarker >= protectionNum ? MarkerColor.Safe : MarkerColor.Danger;
      markerColor = BuildingConfig.IsRoad ? MarkerColor.Normal : markerColor;
      ctx.drawImage(
        await markerBuffer[markerColor][buildingMarker],
        (column - 1) * 30 * RATIO,
        (line - 1) * 30 * RATIO
      );
    }
  };

  const clearMarker = (line: number, column: number) => {
    const canvas: any = markerCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(
      (column - 1) * 30 * RATIO,
      (line - 1) * 30 * RATIO,
      30 * RATIO,
      30 * RATIO
    );
  };

  const clearBuilding = (line: number, column: number) => {
    const { occupied } = cells[line][column];
    if (!occupied) return;
    const [originLine, originColumn, width, height] =
      parseBuildingKey(occupied);
    for (let i = originLine; i < originLine + height; i++) {
      for (let j = originColumn; j < originColumn + width; j++) {
        cells[i][j].occupied = '';
        cells[i][j].building = {} as any;
      }
    }
    clearMarker(originLine, originColumn);
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(
      (originColumn - 1) * 30 * RATIO,
      (originLine - 1) * 30 * RATIO,
      width * 30 * RATIO,
      height * 30 * RATIO
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
        onMouseLeave={onWrapperMouseLeave}
        onDoubleClickCapture={onWrapperDoubleClick}
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
            className={`${styles['building-preview']} ${
              BuildingConfig.IsRoad && styles.road
            } ${cellOccupied && styles.occupied}`}
            style={{
              display: showPreview ? 'flex' : 'none',
              width: `${BuildingConfig.Width * 3}rem`,
              height: `${BuildingConfig.Height * 3}rem`,
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
                (moveConfig.column + moveConfig.offsetColumn - 1) * 3
              }rem,${(moveConfig.line + moveConfig.offsetLine - 1) * 3}rem)`,
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
                display: hideMarker ? 'none' : 'flex',
                color:
                  protectionNum <= buildingMarker
                    ? 'var(--ant-success-color)'
                    : 'var(--ant-error-color)',
              }}
            >
              {buildingMarker}
            </div>
          </div>
          <Range
            Size={buildingRange.Range || 0}
            Line={moveConfig.line + moveConfig.offsetLine}
            Column={moveConfig.column + moveConfig.offsetColumn}
            Width={buildingRange.Width || 0}
            Height={buildingRange.Height || 0}
            Color={buildingRange.Background}
            Operation={Operation}
          ></Range>
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
