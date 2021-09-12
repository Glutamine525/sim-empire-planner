import PerfectScrollbar from 'perfect-scrollbar';
import { ThemeColor, ThemeType } from '@/types/theme';
import {
  getBuildingKey,
  isAllInRange,
  isInBuildingRange,
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

let cells = Array.from(Array(LENGTH + 1), (_, i) =>
  Array.from(Array(LENGTH + 1), (_, j) => {
    return {
      inRange: isInRange(i + 1, j + 1),
      occupied: '',
      protection: {} as any,
      building: {} as any,
      marker: 0,
    };
  })
);

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
  const markerBuffer = useMemo(() => {
    return {
      [MarkerColor.Normal]: Array.from(Array(100), (_, i) => i).map(v =>
        getMarkerImage(v, MarkerColor.Normal)
      ),
      [MarkerColor.Safe]: Array.from(Array(protectionNum + 1), (_, i) => i).map(
        v => getMarkerImage(v, MarkerColor.Safe)
      ),
      [MarkerColor.Danger]: Array.from(
        Array(protectionNum + 1),
        (_, i) => i
      ).map(v => getMarkerImage(v, MarkerColor.Danger)),
    };
  }, [protectionNum]);
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
    cells = Array.from(Array(LENGTH + 1), (_, i) =>
      Array.from(Array(LENGTH + 1), (_, j) => {
        return {
          inRange: isInRange(i + 1, j + 1),
          occupied: '',
          protection: {} as any,
          building: {} as any,
          marker: 0,
        };
      })
    );
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
        const { occupied } = cells[line][column];
        if (!occupied) {
          SetCopiedBuilding(prevBuildingConfig);
        } else {
          const [li, co] = parseBuildingKey(occupied);
          const { building } = cells[li][co];
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
        const { occupied } = cells[line][column];
        if (occupied) {
          const [li, co] = parseBuildingKey(occupied);
          const { building: target } = cells[li][co];
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
        let isOccupied = false;
        let protectionRecord: string[] = [];
        for (let i = line + offsetLine; i < line + offsetLine + Height; i++) {
          for (
            let j = column + offsetColumn;
            j < column + offsetColumn + Width;
            j++
          ) {
            if (cells[i][j].occupied) {
              isOccupied = true;
            }
            if (hideMarker) continue;
            for (let v of protection) {
              if (
                cells[i][j].protection[v]?.length &&
                !protectionRecord.includes(v)
              ) {
                protectionRecord.push(v);
              }
            }
          }
        }
        setBuildingMarker(protectionRecord.length);
        setShowBuilding(true);
        setCellOccupied(isOccupied);
        setMoveConfig({ line, offsetLine, column, offsetColumn });
        if (!isDragging || isOccupied) return;
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
    deleteBuilding(line, column);
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
    const key = getBuildingKey(building, line, column);
    const { Width, Height } = building;
    let marker = 0;
    for (let i = line; i < line + Height; i++) {
      for (let j = column; j < column + Width; j++) {
        cells[i][j].occupied = key;
        marker = cells[i][j].marker > marker ? cells[i][j].marker : marker;
      }
    }
    cells[line][column].building = { ...building };
    cells[line][column].building.Marker = marker;

    if (building.IsProtection) {
      let record: string[] = [];
      const { Range, Name } = building;
      for (let i = line - Range; i < line + Height + Range; i++) {
        for (let j = column - Range; j < column + Width + Range; j++) {
          if (!isInBuildingRange(i, j, line, column, Width, Height, Range))
            continue;
          if (i < 1 || j < 1) continue;
          if (i > LENGTH || j > LENGTH) continue;
          if (cells[i][j].protection[Name]) {
            cells[i][j].protection[Name].push(key);
          } else {
            cells[i][j].protection[Name] = [key];
            cells[i][j].marker += 1;
          }

          const { occupied } = cells[i][j];
          if (!occupied) continue;
          const [li, co] = parseBuildingKey(occupied);
          const { building: target } = cells[li][co];
          if (!showMarker(target)) continue;
          if (!record.includes(occupied)) record.push(occupied);
        }
      }
      updateRecordMarker(record);
    }

    if (building.IsRoad) {
      cells[line][column].building.Marker = 1;
      updateRoadMarker(line, column);
    }

    OnPlaceOrDeleteBuilding(building, 1);
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
      placeMarker(marker, line, column);
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
    const { occupied } = cells[line][column];
    if (!occupied) return;
    const [originLine, originColumn, width, height] =
      parseBuildingKey(occupied);
    const { building: target } = cells[originLine][originColumn];
    const { Range, Name } = target;
    if (target.IsFixed || target.IsBarrier) return;

    if (target.IsProtection) {
      let record: string[] = [];
      for (let i = line - Range; i < line + height + Range; i++) {
        for (let j = column - Range; j < column + width + Range; j++) {
          if (!isInBuildingRange(i, j, line, column, width, height, Range))
            continue;
          if (i < 1 || j < 1) continue;
          if (i > LENGTH || j > LENGTH) continue;
          const { protection: p } = cells[i][j];
          p[Name].splice(p[Name].indexOf(occupied), 1);
          if (!p[Name].length) {
            delete p[Name];
            cells[i][j].marker -= 1;
          }
          const { occupied: o } = cells[i][j];
          if (!o) continue;
          const [li, co] = parseBuildingKey(o);
          const { building: b } = cells[li][co];
          if (!showMarker(b)) continue;
          if (!record.includes(o)) record.push(o);
        }
      }
      updateRecordMarker(record);
    }

    for (let i = originLine; i < originLine + height; i++) {
      for (let j = originColumn; j < originColumn + width; j++) {
        cells[i][j].occupied = '';
        cells[i][j].building = {} as any;
      }
    }

    if (target.IsRoad) {
      updateRoadMarker(line, column);
    }

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
          cells[line][column].occupied = `${key}-1`;
          cells[line][column].building = {
            IsFixed: true,
            IsBarrier: true,
          } as Building;
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

  const updateRecordMarker = (record: string[]) => {
    for (let v of record) {
      const [li, co] = parseBuildingKey(v);
      const { building: target } = cells[li][co];
      let flag: string[] = [];
      for (let i = li; i < li + target.Height; i++) {
        for (let j = co; j < co + target.Width; j++) {
          for (let w of protection) {
            if (cells[i][j].protection[w]?.length && !flag.includes(w)) {
              flag.push(w);
            }
          }
        }
      }
      cells[li][co].building.Marker = flag.length;
      updateMarker(flag.length, li, co);
    }
  };

  const isRoad = (li: number, co: number) => !!cells[li][co].building.IsRoad;

  const getRoad = (li: number, co: number) => cells[li][co].building;

  const getRoadDir = (li: number, co: number) => {
    if (isRoad(li, co - 1)) return 'h';
    if (isRoad(li, co + 1)) return 'h';
    if (
      isRoad(li - 1, co) &&
      !isRoad(li - 1, co - 1) &&
      !isRoad(li - 1, co + 1)
    )
      return 'v';
    if (
      isRoad(li + 1, co) &&
      !isRoad(li + 1, co - 1) &&
      !isRoad(li + 1, co + 1)
    )
      return 'v';
    return 'n';
  };

  const isDirRoad = (li: number, co: number, dir: string) => {
    if (isRoad(li, co) && getRoadDir(li, co) === dir) return true;
    return false;
  };

  const updateRoadDisplay = async (li: number, co: number) => {
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let self = getRoad(li, co);
    const selfDir = getRoadDir(li, co);
    if (selfDir === 'h') {
      for (let i = -1; i < 2; i += 2) {
        if (isRoad(li + i, co)) {
          let adj = getRoad(li + i, co);
          if (i === -1) {
            adj.BorderBStyle = BorderStyleType.Dashed;
            self.BorderTStyle = BorderStyleType.Dashed;
          } else {
            self.BorderBStyle = BorderStyleType.Dashed;
            adj.BorderTStyle = BorderStyleType.Dashed;
          }
          if (isDirRoad(li + i, co, 'v') || isDirRoad(li + i, co, 'n')) {
            self.isRoadVertex = true;
          }
          if (adj.isRoadVertex) updateMarker(adj.Marker, li + i, co, true);
          else deleteMarker(li + i, co);
          ctx.drawImage(
            await getBuildingImage(adj),
            (co - 1) * 30 * RATIO,
            (li + i - 1) * 30 * RATIO
          );
        }
      }
    } else if (selfDir === 'v') {
      if (isDirRoad(li - 1, co, 'v')) self.BorderTStyle = BorderStyleType.None;
      else if (isDirRoad(li - 1, co, 'h'))
        self.BorderTStyle = BorderStyleType.Dashed;
      else self.BorderTStyle = BorderStyleType.Solid;
      if (isDirRoad(li + 1, co, 'v')) self.BorderBStyle = BorderStyleType.None;
      else if (isDirRoad(li + 1, co, 'h'))
        self.BorderBStyle = BorderStyleType.Dashed;
      else self.BorderBStyle = BorderStyleType.Solid;
    }

    if (isRoad(li, co - 1)) self.BorderLStyle = BorderStyleType.None;
    else self.BorderLStyle = BorderStyleType.Solid;
    if (isRoad(li, co + 1)) self.BorderRStyle = BorderStyleType.None;
    else self.BorderRStyle = BorderStyleType.Solid;
    if (!isRoad(li - 1, co)) self.BorderTStyle = BorderStyleType.Solid;
    if (!isRoad(li + 1, co)) self.BorderBStyle = BorderStyleType.Solid;
    if (self.isRoadVertex) updateMarker(self.Marker, li, co, true);
    else deleteMarker(li, co);
    ctx.drawImage(
      await getBuildingImage(self),
      (co - 1) * 30 * RATIO,
      (li - 1) * 30 * RATIO
    );
  };

  const updateRoadMarker = async (li: number, co: number) => {
    let neighbors = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (isRoad(li + i, co + j)) neighbors.push({ li: li + i, co: co + j });
      }
    }
    let queue = [];
    for (let v of neighbors) {
      let self = getRoad(v.li, v.co);
      if (getRoadDir(v.li, v.co) === 'h') {
        let hasLeft = false;
        if (isRoad(v.li, v.co - 1)) {
          let left = getRoad(v.li, v.co - 1);
          let { Marker } = left;
          if (Marker === 1) {
            left.Marker = 1;
            self.Marker = 2;
            left.isRoadVertex = true;
          } else {
            self.Marker = Marker + 1;
            if (Marker > 1) left.isRoadVertex = false;
          }
          self.isRoadVertex = true;
          queue.push(JSON.stringify({ li: v.li, co: v.co - 1 }));
          queue.push(JSON.stringify({ li: v.li, co: v.co }));
          hasLeft = true;
        }
        if (isRoad(v.li, v.co + 1)) {
          let right = getRoad(v.li, v.co + 1);
          let { Marker } = self;
          if (Marker === 1 || !hasLeft) {
            Marker = 1;
            self.Marker = 1;
            right.Marker = 2;
            self.isRoadVertex = true;
          } else {
            right.Marker = Marker + 1;
            if (Marker > 1) self.isRoadVertex = false;
          }
          right.isRoadVertex = true;
          queue.push(JSON.stringify({ li: v.li, co: v.co }));
          queue.push(JSON.stringify({ li: v.li, co: v.co + 1 }));
          Marker += 2;
          let idx = v.co + 2;
          while (isRoad(v.li, idx)) {
            getRoad(v.li, idx).isRoadVertex = true;
            getRoad(v.li, idx).Marker = Marker;
            getRoad(v.li, idx - 1).isRoadVertex = false;
            queue.pop();
            queue.push(JSON.stringify({ li: v.li, co: idx }));
            Marker++;
            idx++;
          }
        }
      }
    }
    for (let v of neighbors) {
      let self = getRoad(v.li, v.co);
      if (getRoadDir(v.li, v.co) === 'v') {
        let hasTop = false;
        if (isDirRoad(v.li - 1, v.co, 'v')) {
          let top = getRoad(v.li - 1, v.co);
          let { Marker } = top;
          if (Marker === 1) {
            top.Marker = 1;
            self.Marker = 2;
            top.isRoadVertex = true;
          } else {
            self.Marker = Marker + 1;
            if (Marker > 1) top.isRoadVertex = false;
          }
          self.isRoadVertex = true;
          queue.push(JSON.stringify({ li: v.li - 1, co: v.co }));
          queue.push(JSON.stringify({ li: v.li, co: v.co }));
          hasTop = true;
        }
        if (isDirRoad(v.li + 1, v.co, 'v')) {
          let bottom = getRoad(v.li + 1, v.co);
          let { Marker } = self;
          if (Marker === 1 || !hasTop) {
            Marker = 1;
            self.Marker = 1;
            bottom.Marker = 2;
            self.isRoadVertex = true;
          } else {
            bottom.Marker = Marker + 1;
            if (Marker > 1) self.isRoadVertex = false;
          }
          bottom.isRoadVertex = true;
          queue.push(JSON.stringify({ li: v.li, co: v.co }));
          queue.push(JSON.stringify({ li: v.li + 1, co: v.co }));
          Marker += 2;
          let idx = v.li + 2;
          while (isDirRoad(idx, v.co, 'v')) {
            getRoad(idx, v.co).Marker = Marker;
            getRoad(idx, v.co).isRoadVertex = true;
            getRoad(idx - 1, v.co).isRoadVertex = false;
            queue.pop();
            queue.push(JSON.stringify({ li: idx, co: v.co }));
            Marker++;
            idx++;
          }
        }
      }
      if (getRoadDir(v.li, v.co) === 'n') {
        self.isRoadVertex = false;
        self.Marker = 1;
        updateRoadDisplay(v.li, v.co);
      }
    }
    queue = Array.from(new Set(queue));
    for (let v of queue) {
      const { li, co } = JSON.parse(v);
      await updateRoadDisplay(li, co);
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
