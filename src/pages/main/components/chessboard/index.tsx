import PerfectScrollbar from 'perfect-scrollbar';
import { ThemeColor, ThemeType } from '@/types/theme';
import {
  Cells,
  getRoadImageBuffer,
  isAllInRange,
  isInRange,
  parseBuildingKey,
  showMarker,
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
import {
  BarrierColor,
  BarrierType,
  BorderStyleType,
  Building,
  CivilBuilding,
  FixedBuildingCatalog,
  FixedBuildingColor,
  FixedBuildingSize,
  FixedBuildingText,
  FixedBuildingType,
  MarkerColor,
} from '@/types/building';
import { CivilType } from '@/types/civil';
import {
  getBarrierImage,
  getBuildingImage,
  getMarkerImage,
  RATIO,
} from '@/utils/screenshot';
import Range from './components/range';
import {
  placeOrDeleteBuilding,
  resetCounter,
  setCopiedBuilding,
} from '@/actions';
import { BuildingFixed } from '@/types/building-fixed';
import Coord from './components/coord';

interface ChessboardProps {
  MapType: number;
  Civil: CivilType;
  Theme: ThemeType;
  Operation: OperationType;
  BuildingConfig: Building;
  OnResetCounter: any;
  OnPlaceOrDeleteBuilding: any;
  SetCopiedBuilding: any;
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

let barriers = {} as {
  [key: string]: {
    background: string;
    T: boolean;
    B: boolean;
    L: boolean;
    R: boolean;
  };
};

const usePrevState = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const Chessboard = (props: ChessboardProps) => {
  const cells = Cells.getInstance();

  const {
    MapType,
    Civil,
    Theme,
    Operation,
    BuildingConfig,
    OnResetCounter,
    OnPlaceOrDeleteBuilding,
    SetCopiedBuilding,
  } = props;

  const [isDragging, setIsDragging] = useState(false);
  const [dragConfig, setDragConfig] = useState({ ...initDragConfig });
  const [moveConfig, setMoveConfig] = useState({ ...initMoveConfig });
  const [showBuilding, setShowBuilding] = useState(false);
  const [cellOccupied, setCellOccupied] = useState(false);
  const [buildingMarker, setBuildingMarker] = useState(0);
  const [hoveredBuilding, setHoveredBuilding] = useState({} as Building);

  const prevBuildingConfig = usePrevState(BuildingConfig);

  const wrapperOuterRef = useRef(null);
  const wrapperIuterRef = useRef(null);
  const cellCanvasRef = useRef(null);
  const buildingCanvasRef = useRef(null);
  const markerCanvasRef = useRef(null);

  const protection = useMemo(() => CivilBuilding[Civil]['防护'], [Civil]);
  const protectionNum = useMemo(() => protection.length, [protection]);
  const buildingBuffer = useMemo(
    () => getBuildingImage(BuildingConfig),
    [BuildingConfig]
  );
  const roadMarkerBuffer = useMemo(
    () =>
      Array.from(Array(LENGTH + 1), (_, i) => i).map(v =>
        getMarkerImage(v, MarkerColor.Normal)
      ),
    []
  );
  const markerBuffer = useMemo(() => {
    return {
      [MarkerColor.Normal]: roadMarkerBuffer,
      [MarkerColor.Safe]: Array.from(Array(protectionNum + 1), (_, i) => i).map(
        v => getMarkerImage(v, MarkerColor.Safe)
      ),
      [MarkerColor.Danger]: Array.from(
        Array(protectionNum + 1),
        (_, i) => i
      ).map(v => getMarkerImage(v, MarkerColor.Danger)),
    };
  }, [protectionNum]);
  const roadImageBuffer = useMemo(() => getRoadImageBuffer(), []);
  const building = useMemo(() => {
    setShowBuilding(false);
    if (Operation === OperationType.Empty) return hoveredBuilding;
    else if (Operation === OperationType.Placing) return BuildingConfig;
    return {} as Building;
  }, [Operation, hoveredBuilding, BuildingConfig]);
  const hideMarker = useMemo(() => !showMarker(building), [building]);

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
    let canvas: any = cellCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = buildingCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = markerCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.addEventListener('resize', updateScroll);
  }, []);

  useEffect(() => {
    setBuildingMarker(0);
    OnResetCounter();
    let canvas: any = buildingCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = markerCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.init(MapType, Civil);
    placeBarrier();
    placeFixed();
  }, [MapType, Civil]); // eslint-disable-line

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
    switch (Operation) {
      case OperationType.Empty:
        SetCopiedBuilding({});
        setHoveredBuilding({} as Building);
        setShowBuilding(false);
        break;
      case OperationType.Placing:
        setShowBuilding(false);
        break;
      case OperationType.Copying:
        const { line, column } = moveConfig;
        const occupied = cells.getOccupied(line, column);
        if (!occupied) {
          SetCopiedBuilding(prevBuildingConfig);
        } else {
          const [li, co] = parseBuildingKey(occupied);
          const building = cells.getBuilding(li, co);
          if (building.IsFixed) {
            SetCopiedBuilding(prevBuildingConfig);
            return;
          }
          SetCopiedBuilding(building);
        }
        break;
      default:
        break;
    }
  }, [Operation]); // eslint-disable-line

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
        if (!showBuilding || cellOccupied) return;
        const { line, offsetLine, column, offsetColumn } = moveConfig;
        const { Width, Height } = BuildingConfig;
        if (
          !cells.canPlace(
            line + offsetLine,
            column + offsetColumn,
            Height,
            Width
          )[0]
        ) {
          return;
        }
        setCellOccupied(true);
        placeBuilding(BuildingConfig, line + offsetLine, column + offsetColumn);
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
    setMoveConfig({
      line,
      offsetLine: 0,
      column,
      offsetColumn: 0,
    });
    switch (Operation) {
      case OperationType.Empty:
        const occupied = cells.getOccupied(line, column);
        if (isInRange(line, column) && occupied) {
          const [li, co] = parseBuildingKey(occupied);
          const target = cells.getBuilding(li, co);
          if (!target.IsBarrier && !target.IsRoad) {
            setMoveConfig({
              line: li,
              offsetLine: 0,
              column: co,
              offsetColumn: 0,
            });
            setShowBuilding(true);
            setCellOccupied(false);
            setHoveredBuilding(target);
            setBuildingMarker(building.Marker);
          } else {
            setShowBuilding(false);
            setHoveredBuilding({} as Building);
          }
        } else {
          setShowBuilding(false);
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
          setShowBuilding(false);
          setCellOccupied(false);
          return;
        }
        const [canPlace, marker] = cells.canPlace(
          line + offsetLine,
          column + offsetColumn,
          Width,
          Height
        );
        setBuildingMarker(marker);
        setShowBuilding(true);
        setCellOccupied(!canPlace);
        setMoveConfig({ line, offsetLine, column, offsetColumn });
        if (!isDragging || !canPlace) return;
        placeBuilding(BuildingConfig, line + offsetLine, column + offsetColumn);
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
    if (!deleteBuilding(line, column)) return;
    setShowBuilding(false);
    setHoveredBuilding({} as Building);
  };

  const placeMarker = async (
    value: number,
    line: number,
    column: number,
    isRoad?: boolean
  ) => {
    const canvas: any = markerCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let markerColor: MarkerColor =
      value >= protectionNum ? MarkerColor.Safe : MarkerColor.Danger;
    markerColor = isRoad ? MarkerColor.Normal : markerColor;
    ctx.drawImage(
      await markerBuffer[markerColor][value],
      (column - 1) * 30 * RATIO,
      (line - 1) * 30 * RATIO
    );
  };

  const placeBuilding = async (
    building: Building,
    line: number,
    column: number
  ) => {
    const records = cells.place(building, line, column);
    if (building.IsProtection) updateRecordMarker(records);
    else if (building.IsRoad) updateRoadDisplay(records);
    OnPlaceOrDeleteBuilding(building, 1);
    if (building.IsRoad) return; // 禁止道路图片重绘
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (building.IsFixed) {
      ctx.drawImage(
        await getBuildingImage(building),
        (column - 1) * 30 * RATIO,
        (line - 1) * 30 * RATIO
      );
    } else {
      ctx.drawImage(
        await buildingBuffer,
        (column - 1) * 30 * RATIO,
        (line - 1) * 30 * RATIO
      );
    }
    if (showMarker(building)) {
      placeMarker(cells.getBuilding(line, column).Marker, line, column);
    }
  };

  const deleteMarker = (line: number, column: number) => {
    const canvas: any = markerCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(
      (column - 1) * 30 * RATIO,
      (line - 1) * 30 * RATIO,
      30 * RATIO,
      30 * RATIO
    );
  };

  const deleteBuilding = (line: number, column: number) => {
    const occupied = cells.getOccupied(line, column);
    if (!occupied) return false;
    const [originLine, originColumn, width, height] =
      parseBuildingKey(occupied);
    const target = cells.getBuilding(originLine, originColumn);
    if (target.IsFixed) return false;
    const records = cells.delete(line, column);
    if (target.IsProtection) updateRecordMarker(records);
    else if (target.IsRoad) updateRoadDisplay(records);
    OnPlaceOrDeleteBuilding(target, -1);
    deleteMarker(originLine, originColumn);
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(
      (originColumn - 1) * 30 * RATIO,
      (originLine - 1) * 30 * RATIO,
      width * 30 * RATIO,
      height * 30 * RATIO
    );
    return true;
  };

  const placeBarrier = async () => {
    Object.keys(BarrierType)
      .map(v => v.toLowerCase() as BarrierType)
      .map((v: BarrierType) => {
        const keys = BuildingFixed[v][MapType - 3];
        const color = BarrierColor[v];
        for (let key of keys) {
          const [line, column] = parseBuildingKey(key);
          const top = `${line - 1}-${column}`;
          const bottom = `${line + 1}-${column}`;
          const left = `${line}-${column - 1}`;
          const right = `${line}-${column + 1}`;
          barriers[key] = {
            background: color,
            T: !keys.includes(top),
            B: !keys.includes(bottom),
            L: !keys.includes(left),
            R: !keys.includes(right),
          };
          cells.placeBarrier(line, column);
        }
        return null;
      });
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage((await getBarrierImage(barriers))!, 0, 0);
    barriers = {};
  };

  const placeFixed = async () => {
    Object.keys(FixedBuildingType)
      .map(v => v.toLowerCase() as FixedBuildingType)
      .map((v: FixedBuildingType) => {
        const keys = BuildingFixed[v][MapType - 3];
        for (let key of keys) {
          const [line, column] = parseBuildingKey(key);
          placeBuilding(
            {
              Name:
                v === FixedBuildingType.Road ? '道路' : FixedBuildingText[v],
              Text: FixedBuildingText[v],
              Range: 0,
              Marker: 0,
              Catalog: FixedBuildingCatalog[v],
              IsFixed: true,
              IsBarrier: false,
              IsRoad: v === FixedBuildingType.Road,
              IsProtection: false,
              IsWonder: false,
              IsDecoration: false,
              IsGeneral: false,
              Width: FixedBuildingSize[v],
              Height: FixedBuildingSize[v],
              Color: '#000000',
              FontSize: 1.4,
              Background: FixedBuildingColor[v],
              BorderColor: '#000000',
              BorderWidth: 0.1,
              BorderTStyle: BorderStyleType.Solid,
              BorderRStyle: BorderStyleType.Solid,
              BorderBStyle: BorderStyleType.Solid,
              BorderLStyle: BorderStyleType.Solid,
            },
            line,
            column
          );
        }
        return null;
      });
  };

  const updateMarker = (
    value: number,
    line: number,
    column: number,
    isRoad?: boolean
  ) => {
    deleteMarker(line, column);
    placeMarker(value, line, column, isRoad);
  };

  const updateRecordMarker = (records: string[]) => {
    for (let v of records) {
      const [li, co] = parseBuildingKey(v);
      const target = cells.getBuilding(li, co);
      const { Width, Height } = target;
      const [, marker] = cells.canPlace(li, co, Width, Height);
      updateMarker(marker, li, co);
    }
  };

  const updateRoadDisplay = async (roads: string[]) => {
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    for (let v of roads) {
      const [li, co] = parseBuildingKey(v);
      const target = cells.getBuilding(li, co);
      if (target.isRoadVertex) updateMarker(target.Marker, li, co, true);
      else deleteMarker(li, co);
      const key = `${target.BorderTStyle} ${target.BorderRStyle} ${target.BorderBStyle} ${target.BorderLStyle}`;
      ctx.drawImage(
        await roadImageBuffer[key],
        (co - 1) * 30 * RATIO,
        (li - 1) * 30 * RATIO
      );
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
      <Coord line={moveConfig.line} column={moveConfig.column} />
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
            width={LENGTH * 30 * RATIO}
            height={LENGTH * 30 * RATIO}
            className={`${styles.canvas} ${styles['canvas-building']}`}
          ></canvas>
          <canvas
            ref={markerCanvasRef}
            width={LENGTH * 30 * RATIO}
            height={LENGTH * 30 * RATIO}
            className={`${styles.canvas} ${styles['canvas-marker']}`}
          ></canvas>
          <div
            className={`${styles.building} ${
              building.IsRoad ? styles.road : ''
            } ${cellOccupied ? styles.occupied : ''}`}
            style={{
              display: showBuilding ? 'flex' : 'none',
              width: `${building.Width * 3}rem`,
              height: `${building.Height * 3}rem`,
              color: building.Color,
              fontSize: `${building.FontSize}rem`,
              background: building.Background,
              borderWidth: `${building.BorderWidth}rem`,
              borderColor: building.BorderColor,
              borderTopStyle: building.BorderTStyle,
              borderRightStyle: building.BorderRStyle,
              borderBottomStyle: building.BorderBStyle,
              borderLeftStyle: building.BorderLStyle,
              transform: `translate(${
                (moveConfig.column + moveConfig.offsetColumn - 1) * 3
              }rem,${(moveConfig.line + moveConfig.offsetLine - 1) * 3}rem) ${
                Operation === OperationType.Empty ? 'scale(1.02)' : ''
              }`,
              boxShadow:
                Operation === OperationType.Empty ? 'white 0 0 0.6rem' : '',
              transition:
                Operation === OperationType.Placing
                  ? 'transform 30ms ease-in-out'
                  : '',
            }}
          >
            {building.Text}
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
            Show={showBuilding}
            Size={building.Range || 0}
            Line={moveConfig.line + moveConfig.offsetLine}
            Column={moveConfig.column + moveConfig.offsetColumn}
            Width={building.Width || 0}
            Height={building.Height || 0}
            Color={building.Background}
            Operation={Operation}
          ></Range>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    MapType: state.TopMenu.mapType,
    Civil: state.TopMenu.civil,
    Theme: state.TopMenu.theme,
    Operation: state.LeftMenu.operation,
    BuildingConfig: state.LeftMenu.buildingConfig,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    OnResetCounter: () => {
      dispatch(resetCounter());
    },
    OnPlaceOrDeleteBuilding: (building: Building, diff: number) => {
      dispatch(placeOrDeleteBuilding(building, diff));
    },
    SetCopiedBuilding: (building: Building) => {
      dispatch(setCopiedBuilding(building));
    },
  };
};

const ChessboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chessboard);
export default ChessboardContainer;
