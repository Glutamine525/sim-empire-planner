import PerfectScrollbar from 'perfect-scrollbar';
import { ThemeColor, ThemeType } from '@/types/theme';
import {
  getRoadImageBuffer,
  isAllInRange,
  isInRange,
  parseBuildingKey,
  showMarker,
} from '@/utils/chessboard';
import { EMAIL, GITHUB, LENGTH, VERSION, WEBSITE } from '@/utils/config';
import React, {
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import { getScreenSize, getCoord, copyLink } from '@/utils/browser';
import { OperationType } from '@/types/operation';
import {
  BorderStyleType,
  Building,
  BuildingType,
  CatalogType,
  CivilBuilding,
  GeneralBuilding,
  MarkerColor,
  SimpleBuilding,
} from '@/types/building';
import { CivilType } from '@/types/civil';
import {
  getFullSizeImage,
  getBuildingImage,
  getMarkerImage,
  RATIO,
} from '@/utils/screenshot';
import Range from './components/range';
import {
  changeIsImportingData,
  changeIsLoading,
  changeNoWood,
  placeOrDeleteBuilding,
  resetCounter,
  setCopiedBuilding,
} from '@/actions';
import {
  BarrierColor,
  BarrierType,
  BuildingFixed,
  FixedBuildingCatalog,
  FixedBuildingColor,
  FixedBuildingSize,
  FixedBuildingText,
  FixedBuildingType,
} from '@/types/building-fixed';
import Coord from './components/coord';
import Box from './components/box';
import { message, Modal } from 'antd';
import { Cells } from '@/utils/cells';
import MiniMap, { MINI_MAP_RATIO, MINI_MAP_SIZE } from './components/mini-map';
import { usePrevState } from '@/utils/hook';

interface ChessboardProps {
  mapType: number;
  civil: CivilType;
  isNoWood: boolean;
  theme: ThemeType;
  showMiniMap: boolean;
  isMapRotated: boolean;
  operation: OperationType;
  buildingConfig: Building;
  isImportingData: boolean;
  specials: SimpleBuilding[];
  onChangeIsLoading: any;
  onChangeNoWood: any;
  onResetCounter: any;
  onPlaceOrDeleteBuilding: any;
  setCopiedBuilding: any;
  onChangeIsImportingData: any;
}

const initDragConfig = {
  initX: -1,
  initY: -1,
  curX: -1,
  curY: -1,
};

const initMoveConfig = {
  line: -1,
  column: -1,
  offsetLine: -1,
  offsetColumn: -1,
};

const initMiniMapConfig = {
  focusWidth: 0,
  focusHeight: 0,
  focusTop: 0,
  focusLeft: 0,
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

let roadBuffer = new Set<string>();
let firstRoadInBuffer = '';

let cancelNoWoodConfirmation = false;

console.time('useEffect []');

const cells = Cells.getInstance();

const Chessboard = (props: ChessboardProps) => {
  const {
    mapType,
    civil,
    isNoWood,
    theme,
    showMiniMap,
    isMapRotated,
    operation,
    buildingConfig,
    isImportingData,
    specials,
    onChangeIsLoading,
    onChangeNoWood,
    onResetCounter,
    onPlaceOrDeleteBuilding,
    setCopiedBuilding,
    onChangeIsImportingData,
  } = props;

  const [isMouseDown, setIsMouseDown] = useState(false); // 全局标记鼠标是否按下
  const [isCtrlDown, setIsCtrlDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragConfig, setDragConfig] = useState({ ...initDragConfig });
  const [boxConfig, setBoxConfig] = useState({ ...initDragConfig });
  const [moveConfig, setMoveConfig] = useState({ ...initMoveConfig });
  const [showBoxButton, setShowBoxButton] = useState(false);
  const [showBuilding, setShowBuilding] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [cellOccupied, setCellOccupied] = useState(false);
  const [buildingMarker, setBuildingMarker] = useState(0);
  const [hoveredBuilding, setHoveredBuilding] = useState({} as Building);
  const [boxBuffer, setBoxBuffer] = useState(new Set<string>());
  const [miniMapConfig, setMiniMapConfig] = useState({ ...initMiniMapConfig });
  const [isDraggingMiniMapFocus, setIsDraggingMiniMapFocus] = useState(false);

  const prevBuildingConfig: any = usePrevState(buildingConfig);

  const wrapperOuterRef = useRef<HTMLDivElement>(null);
  const wrapperInnerRef = useRef<HTMLDivElement>(null);
  const cellCanvasRef = useRef<HTMLCanvasElement>(null);
  const buildingCanvasRef = useRef<HTMLCanvasElement>(null);
  const markerCanvasRef = useRef<HTMLCanvasElement>(null);
  const miniMapCanvasRef = useRef<HTMLCanvasElement>(null);

  const protection = useMemo(() => CivilBuilding[civil]['防护'], [civil]);
  const protectionNum = useMemo(() => protection.length, [protection]);
  const roadMarkerBuffer = useMemo(
    () => Array.from(Array(LENGTH + 1), () => null) as any[],
    []
  );
  const markerBuffer = useMemo(() => {
    const num = protectionNum + 1;
    return {
      [MarkerColor.Normal]: roadMarkerBuffer,
      [MarkerColor.Safe]: Array.from(Array(num), () => null) as any[],
      [MarkerColor.Danger]: Array.from(Array(num), () => null) as any[],
    };
  }, [roadMarkerBuffer, protectionNum]);
  const roadImageBuffer = useMemo(() => getRoadImageBuffer(), []);
  const civilBuildingBuffer = useMemo(() => {
    let result = {} as any;
    Object.values(BuildingType).forEach(v => {
      result[v] = {};
      CivilBuilding[civil][v].forEach(w => {
        result[v][w.name] = null as any;
      });
    });
    return result;
  }, [civil]);
  const generalBuildingBuffer = useMemo(() => {
    let result = {} as any;
    result[CatalogType.General] = {};
    GeneralBuilding.forEach(v => {
      result[CatalogType.General][v.name] = null as any;
    });
    return result;
  }, []);
  const specialBuildingBuffer = useMemo(() => {
    let result = {} as any;
    result[CatalogType.Special] = {};
    specials.forEach(v => {
      result[CatalogType.Special][v.name] = null as any;
    });
    return result;
  }, [specials]);
  const buildingBuffer = useMemo(() => {
    return {
      ...civilBuildingBuffer,
      ...generalBuildingBuffer,
      ...specialBuildingBuffer,
    };
  }, [civilBuildingBuffer, generalBuildingBuffer, specialBuildingBuffer]);
  const building = useMemo(() => {
    setShowBuilding(false);
    if (operation === OperationType.Empty) return hoveredBuilding;
    else if (operation === OperationType.Placing) {
      const { Catalog, Name } = buildingConfig;
      if (
        Catalog !== CatalogType.Road &&
        buildingBuffer[Catalog][Name] === null
      ) {
        buildingBuffer[Catalog][Name] = getBuildingImage(buildingConfig);
      }
      return buildingConfig;
    }
    return {} as Building;
  }, [operation, hoveredBuilding, buildingConfig]); // eslint-disable-line
  const hideMarker = useMemo(() => !showMarker(building), [building]);

  useEffect(() => {
    const scroll = new PerfectScrollbar('#chessboard-wrapper-outer', {
      wheelSpeed: 1,
    });
    const [W, H] = getWrapperSize();
    const [w, h] = getScreenSize();
    setScrollTop((H - h) / 2);
    setScrollLeft((W - w) / 2);
    scroll.update();
    updateMiniMapConfig(true);
    let canvas: any = cellCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = buildingCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = markerCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = miniMapCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    window.addEventListener('resize', () => {
      scroll.update();
      updateMiniMapConfig(true);
    });
    const wrapperOuter = document.getElementById('chessboard-wrapper-outer');
    wrapperOuter!.addEventListener('ps-scroll-x', () => updateMiniMapConfig());
    wrapperOuter!.addEventListener('ps-scroll-y', () => updateMiniMapConfig());
    document.addEventListener('mousedown', () => setIsMouseDown(true));
    document.addEventListener('mouseup', () => setIsMouseDown(false));
    document.addEventListener('mouseleave', () => {
      setIsMouseDown(false);
      setIsCtrlDown(false);
    });
    window.addEventListener('blur', () => {
      setIsMouseDown(false);
      setIsCtrlDown(false);
    });
    document.addEventListener('keydown', event => {
      const { key } = event;
      if (key !== 'Control') return;
      setIsCtrlDown(true);
    });
    document.addEventListener('keyup', event => {
      const { key } = event;
      if (key !== 'Control') return;
      setIsCtrlDown(false);
    });
    document.body.removeChild(document.getElementById('init-loading')!);
    onChangeIsLoading(false);
    document.addEventListener('import', async (event: any) => {
      const { cmd } = event;
      if (cmd === 'repaint') {
        onResetCounter();
        let canvas: any = buildingCanvasRef.current;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas = markerCanvasRef.current;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas = miniMapCanvasRef.current;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        placeBarrier(cells.mapType);
        placeFixed(cells.mapType);
        if (!cells.isNoWood) {
          const keys = BuildingFixed[BarrierType.Tree][cells.mapType - 3];
          const color = BarrierColor[BarrierType.Tree];
          for (let key of keys) {
            const [line, column] = parseBuildingKey(key);
            const occupied = cells.getOccupied(line, column);
            if (occupied) {
              const [oLi, oCo] = parseBuildingKey(occupied);
              await deleteBuilding(oLi, oCo, {});
            }
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
            const canvas: any = miniMapCanvasRef.current;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.fillStyle = color;
            ctx.fillRect(
              (column - 1) * MINI_MAP_RATIO,
              (line - 1) * MINI_MAP_RATIO,
              MINI_MAP_RATIO,
              MINI_MAP_RATIO
            );
          }
          const canvas: any = buildingCanvasRef.current;
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage((await getFullSizeImage(barriers, 'barrier'))!, 0, 0);
          barriers = {};
        }
        let buildings = [] as any[];
        for (let i = 1; i <= LENGTH; i++) {
          for (let j = 0; j < LENGTH; j++) {
            const occupied = cells.getOccupied(i, j);
            if (!occupied) continue;
            if (!occupied.startsWith(`${i}-${j}`)) continue;
            const building = cells.getBuilding(i, j);
            if (building.IsBarrier) continue;
            buildings.push({ ...building, line: i, column: j });
          }
        }
        onPlaceOrDeleteBuilding(buildings, 1);
        canvas = buildingCanvasRef.current;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage((await getFullSizeImage(buildings, 'building'))!, 0, 0);
        canvas = markerCanvasRef.current;
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage((await getFullSizeImage(buildings, 'marker'))!, 0, 0);
        onChangeIsLoading(false);
        onChangeIsImportingData(false);
        message.success('已成功导入地图数据！');
      }
    });
    console.timeEnd('useEffect []');
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isImportingData) return;
    console.time('useEffect [MapType, Civil]');
    setBuildingMarker(0);
    onResetCounter();
    let canvas: any = buildingCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = markerCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas = miniMapCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cells.init(mapType, civil, isNoWood);
    placeBarrier(mapType);
    placeFixed(mapType);
    onChangeIsLoading(false);
    console.timeEnd('useEffect [MapType, Civil]');
  }, [mapType, civil]); // eslint-disable-line

  useEffect(() => {
    (async () => {
      console.time('useEffect [IsNoWood]');
      const keys = BuildingFixed[BarrierType.Tree][mapType - 3];
      const color = BarrierColor[BarrierType.Tree];
      if (isNoWood) {
        if (cancelNoWoodConfirmation) {
          cancelNoWoodConfirmation = false;
          console.timeEnd('useEffect [IsNoWood]');
          return;
        }
        for (let key of keys) {
          const [line, column] = parseBuildingKey(key);
          deleteBuilding(line, column, { force: true });
        }
        if (isImportingData) {
          console.timeEnd('useEffect [IsNoWood]');
          return;
        }
        onChangeIsLoading(false);
        console.timeEnd('useEffect [IsNoWood]');
      } else {
        let needConfirm = false;
        for (let key of keys) {
          const [line, column] = parseBuildingKey(key);
          const occupied = cells.getOccupied(line, column);
          if (occupied) {
            needConfirm = true;
            break;
          }
        }
        const callback = async () => {
          for (let key of keys) {
            const [line, column] = parseBuildingKey(key);
            const occupied = cells.getOccupied(line, column);
            if (occupied) {
              const [oLi, oCo] = parseBuildingKey(occupied);
              await deleteBuilding(oLi, oCo, {});
            }
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
            const canvas: any = miniMapCanvasRef.current;
            const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
            ctx.fillStyle = color;
            ctx.fillRect(
              (column - 1) * MINI_MAP_RATIO,
              (line - 1) * MINI_MAP_RATIO,
              MINI_MAP_RATIO,
              MINI_MAP_RATIO
            );
          }
          const canvas: any = buildingCanvasRef.current;
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.drawImage((await getFullSizeImage(barriers, 'barrier'))!, 0, 0);
          barriers = {};
          if (isImportingData) {
            console.timeEnd('useEffect [IsNoWood]');
            return;
          }
          onChangeIsLoading(false);
          console.timeEnd('useEffect [IsNoWood]');
        };
        if (needConfirm) {
          Modal.confirm({
            title: '警告',
            content:
              '树木的地方已经被占据，开启无木之地后，有冲突的建筑将被直接删除，是否确定开启？',
            centered: true,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
              await callback();
            },
            onCancel: () => {
              cancelNoWoodConfirmation = true;
              onChangeNoWood(true);
              onChangeIsLoading(false);
              console.timeEnd('useEffect [IsNoWood]');
            },
          });
        } else {
          await callback();
        }
      }
    })();
  }, [isNoWood, mapType, civil]); // eslint-disable-line

  useEffect(() => {
    console.time('useEffect [Theme]');
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
    ctx.strokeStyle = ThemeColor[theme]['--border-lighter'];
    ctx.fillStyle = ThemeColor[theme]['--background-lighter'];
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
    onChangeIsLoading(false);
    console.timeEnd('useEffect [Theme]');
  }, [theme]); // eslint-disable-line

  useEffect(() => {
    console.time('useEffect [Operation]');
    setShowBox(false);
    setBoxBuffer(new Set<string>());
    roadBuffer.forEach(key => {
      if (firstRoadInBuffer === key) return;
      const [line, column] = parseBuildingKey(key);
      deleteBuilding(line, column, { force: false, updateRoad: true });
    });
    roadBuffer.clear();
    switch (operation) {
      case OperationType.Empty:
        setCopiedBuilding({});
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
          message.error('当前位置没有建筑可以复制！');
          setCopiedBuilding(prevBuildingConfig);
        } else {
          const [li, co] = parseBuildingKey(occupied);
          const building = cells.getBuilding(li, co);
          if (building.IsFixed) {
            message.error('该建筑不可复制！');
            setCopiedBuilding(prevBuildingConfig);
            console.timeEnd('useEffect [Operation]');
            return;
          }
          setCopiedBuilding({ ...building });
        }
        break;
      default:
        break;
    }
    console.timeEnd('useEffect [Operation]');
  }, [operation]); // eslint-disable-line

  const onWrapperMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    const { target, clientX, clientY } = event;
    setIsDragging(true);
    if (isCtrlDown || isMapRotated) {
      setDragConfig({
        initX: getScrollLeft() + clientX,
        initY: getScrollTop() + clientY,
        curX: getScrollLeft() + clientX,
        curY: getScrollTop() + clientY,
      });
      return;
    }
    switch (operation) {
      case OperationType.Empty:
        setDragConfig({
          initX: getScrollLeft() + clientX,
          initY: getScrollTop() + clientY,
          curX: getScrollLeft() + clientX,
          curY: getScrollTop() + clientY,
        });
        break;
      case OperationType.Placing:
        const { line, offsetLine, column, offsetColumn } = moveConfig;
        // 点击空格取消操作时，当按下鼠标该位置已经被占据时，防止首个道路被删除
        if ((!showBuilding || cellOccupied) && building.IsRoad) {
          firstRoadInBuffer = `${line}-${column}`;
        } else {
          firstRoadInBuffer = '';
        }
        const { Width, Height } = buildingConfig;
        const [canPlace] = cells.canPlace(
          line + offsetLine,
          column + offsetColumn,
          Width,
          Height
        );
        const [canReplace, , generalLine, generalColumn] = cells.canReplace(
          line,
          column,
          Width,
          Height
        );
        if (!buildingConfig.IsGeneral && canReplace) {
          setCellOccupied(true);
          deleteBuilding(generalLine, generalColumn, {});
          placeBuilding(buildingConfig, generalLine, generalColumn, {});
        } else if (canPlace) {
          setCellOccupied(true);
          placeBuilding(
            buildingConfig,
            line + offsetLine,
            column + offsetColumn,
            { updateRoad: false }
          );
        }
        if (buildingConfig.IsRoad) {
          roadBuffer.add(`${line}-${column}`);
          setShowBox(true);
          setBoxConfig({
            initX: getScrollLeft() + clientX - 86,
            initY: getScrollTop() + clientY - 80,
            curX: getScrollLeft() + clientX - 86,
            curY: getScrollTop() + clientY - 80,
          });
        }
        break;
      case OperationType.Select:
      case OperationType.Delete:
        if ((target as any).id?.startsWith('box-')) {
          break;
        }
        setBoxBuffer(new Set<string>());
        setShowBox(true);
        setShowBoxButton(false);
        setBoxConfig({
          initX: getScrollLeft() + clientX - 86,
          initY: getScrollTop() + clientY - 80,
          curX: getScrollLeft() + clientX - 86,
          curY: getScrollTop() + clientY - 80,
        });
        break;
      default:
        break;
    }
  };

  const onWrapperMouseMove: MouseEventHandler<HTMLDivElement> = async event => {
    const { pageX, pageY, clientX, clientY, target } = event;
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
    if (isDragging && (isCtrlDown || isMapRotated)) {
      const { initX, initY } = dragConfig;
      setScrollLeft(initX - clientX);
      setScrollTop(initY - clientY);
      updateMiniMapConfig();
      return;
    }
    if (isMapRotated) return;
    switch (operation) {
      case OperationType.Empty:
        const occupied = cells.getOccupied(line, column);
        if (occupied) {
          const [li, co] = parseBuildingKey(occupied);
          const targetBuilding = cells.getBuilding(li, co);
          if (!targetBuilding.IsBarrier && !targetBuilding.IsRoad) {
            setMoveConfig({
              line: li,
              offsetLine: 0,
              column: co,
              offsetColumn: 0,
            });
            setShowBuilding(true);
            setCellOccupied(false);
            setHoveredBuilding(targetBuilding);
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
        updateMiniMapConfig();
        break;
      case OperationType.Placing:
        const [offsetLine, offsetColumn] = [
          -Math.floor((buildingConfig.Height - 1) / 2),
          -Math.floor((buildingConfig.Width - 1) / 2),
        ];
        const { Width, Height } = buildingConfig;
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
        const [canReplace, generalMarker, generalLine, generalColumn] =
          cells.canReplace(line, column, Width, Height);
        if (!buildingConfig.IsGeneral && canReplace) {
          setBuildingMarker(generalMarker);
          setShowBuilding(true);
          setCellOccupied(false);
          setMoveConfig({
            line: generalLine,
            offsetLine: 0,
            column: generalColumn,
            offsetColumn: 0,
          });
        } else {
          setBuildingMarker(marker);
          setShowBuilding(true);
          setCellOccupied(!canPlace);
          setMoveConfig({ line, offsetLine, column, offsetColumn });
        }
        if (buildingConfig.IsRoad) {
          setBoxConfig(state => {
            const curX = getScrollLeft() + clientX - 86;
            const curY = getScrollTop() + clientY - 80;
            return { ...state, curX, curY };
          });
        }
        if (!isDragging || (!canPlace && !canReplace)) return;
        if (buildingConfig.IsRoad) roadBuffer.add(`${line}-${column}`);
        if (canReplace) {
          deleteBuilding(generalLine, generalColumn, {});
          placeBuilding(buildingConfig, generalLine, generalColumn, {});
        } else {
          placeBuilding(
            buildingConfig,
            line + offsetLine,
            column + offsetColumn,
            { updateRoad: false }
          );
        }
        break;
      case OperationType.Select:
      case OperationType.Delete:
        if (!isDragging) return;
        if ((target as any).id) {
          break;
        }
        setBoxConfig(state => ({
          ...state,
          curX: getScrollLeft() + clientX - 86,
          curY: getScrollTop() + clientY - 80,
        }));
        break;
      default:
        break;
    }
  };

  const onWrapperMouseUp: MouseEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
    if (isCtrlDown) return;
    switch (operation) {
      case OperationType.Placing:
        if (buildingConfig.IsRoad) {
          const { initX, initY, curX, curY } = boxConfig;
          let [startX, endX] = initX < curX ? [initX, curX] : [curX, initX];
          let [startY, endY] = initY < curY ? [initY, curY] : [curY, initY];
          let initCo = Math.floor(startX / 30);
          let initLi = Math.floor(startY / 30);
          let curCo = Math.floor(endX / 30);
          let curLi = Math.floor(endY / 30);
          roadBuffer.forEach(key => {
            const [line, column] = parseBuildingKey(key);
            deleteBuilding(line, column, { force: false, updateRoad: true });
          });
          if (initLi === curLi) {
            for (let i = initCo; i <= curCo; i++) {
              const occupied = cells.getOccupied(initLi + 1, i + 1);
              if (occupied) continue;
              placeBuilding(buildingConfig, initLi + 1, i + 1, {
                updateRoad: true,
              });
            }
          } else if (initCo === curCo) {
            for (let i = initLi; i <= curLi; i++) {
              const occupied = cells.getOccupied(i + 1, initCo + 1);
              if (occupied) continue;
              placeBuilding(buildingConfig, i + 1, initCo + 1, {
                updateRoad: true,
              });
            }
          } else {
            roadBuffer.forEach(key => {
              const [line, column] = parseBuildingKey(key);
              placeBuilding(buildingConfig, line, column, { updateRoad: true });
            });
          }
          roadBuffer.clear();
          setShowBox(false);
        }
        break;
      case OperationType.Select:
      case OperationType.Delete:
        let { initX, initY, curX, curY } = boxConfig;
        if (initX === curX && initY === curY) {
          setShowBox(false);
          return;
        }
        setShowBoxButton(true);
        [initX, curX] = initX < curX ? [initX, curX] : [curX, initX];
        [initY, curY] = initY < curY ? [initY, curY] : [curY, initY];
        const initCo = Math.floor(initX / 30);
        const initLi = Math.floor(initY / 30);
        const curCo = Math.ceil(curX / 30);
        const curLi = Math.ceil(curY / 30);
        initX = initCo * 30;
        initY = initLi * 30;
        curX = curCo * 30;
        curY = curLi * 30;
        for (let i = initLi + 1; i <= curLi; i++) {
          for (let j = initCo + 1; j <= curCo; j++) {
            const occupied = cells.getOccupied(i, j);
            if (!occupied) continue;
            const building = cells.getBuilding(occupied);
            if (building.IsFixed) continue;
            setBoxBuffer(state => state.add(occupied));
          }
        }
        setBoxConfig({ initX, initY, curX, curY });
        break;
      default:
        break;
    }
  };

  const onWrapperMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
    setIsCtrlDown(false);
    setShowBuilding(false);
    setHoveredBuilding({} as Building);
  };

  const onWrapperDoubleClick: MouseEventHandler<HTMLDivElement> = event => {
    if (operation === OperationType.Placing && cellOccupied) return;
    if (operation === OperationType.Select) return;
    const { pageX, pageY } = event;
    const [offsetX, offsetY] = [
      pageX + getScrollLeft() - 86,
      pageY + getScrollTop() - 80,
    ];
    const { line, column } = getCoord(offsetX, offsetY);
    (async () => {
      const deleteResult = await deleteBuilding(line, column, {});
      if (!deleteResult) return;
      setShowBuilding(false);
      setHoveredBuilding({} as Building);
    })();
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
    if (markerBuffer[markerColor][value] === null) {
      markerBuffer[markerColor][value] = getMarkerImage(value, markerColor);
    }
    ctx.drawImage(
      await markerBuffer[markerColor][value]!,
      (column - 1) * 30 * RATIO,
      (line - 1) * 30 * RATIO
    );
  };

  const placeBuilding = async (
    building: Building,
    line: number,
    column: number,
    options: {
      updateRoad?: boolean;
      disableDispatch?: boolean;
    }
  ) => {
    const { updateRoad, disableDispatch } = options;
    if (!disableDispatch) onPlaceOrDeleteBuilding([building], 1);
    const { records } = cells.place(building, line, column);
    if (building.IsProtection) updateRecordMarker(records);
    else if (building.IsRoad && updateRoad) updateRoadDisplay(records);
    if (building.IsRoad && updateRoad) return; // 禁止道路图片重绘
    let canvas: any = buildingCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (building.IsRoad || building.IsFixed) {
      ctx.drawImage(
        await getBuildingImage(building),
        (column - 1) * 30 * RATIO,
        (line - 1) * 30 * RATIO
      );
    } else {
      const { Catalog, Name } = building;
      if (buildingBuffer[Catalog][Name] === null) {
        buildingBuffer[Catalog][Name] = await getBuildingImage(building);
      }
      ctx.drawImage(
        await buildingBuffer[Catalog][Name],
        (column - 1) * 30 * RATIO,
        (line - 1) * 30 * RATIO
      );
    }
    canvas = miniMapCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.fillStyle = building.Background;
    ctx.fillRect(
      (column - 1) * MINI_MAP_RATIO,
      (line - 1) * MINI_MAP_RATIO,
      MINI_MAP_RATIO * building.Width,
      MINI_MAP_RATIO * building.Height
    );
    if (showMarker(building)) {
      await updateMarker(cells.getBuilding(line, column).Marker, line, column);
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

  const deleteBuilding = async (
    line: number,
    column: number,
    option: {
      force?: boolean;
      updateRoad?: boolean;
      disableDispatch?: boolean;
    }
  ) => {
    const { force, updateRoad, disableDispatch } = option;
    const occupied = cells.getOccupied(line, column);
    if (!occupied) return false;
    const [originLine, originColumn, width, height] =
      parseBuildingKey(occupied);
    const target = cells.getBuilding(originLine, originColumn);
    if (target.IsFixed && !force) return false;
    const records = cells.delete(line, column, force);
    if (target.IsProtection) await updateRecordMarker(records);
    else if (target.IsRoad && !updateRoad) await updateRoadDisplay(records);
    if (!disableDispatch) onPlaceOrDeleteBuilding([target], -1);
    deleteMarker(originLine, originColumn);
    let canvas: any = buildingCanvasRef.current;
    let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(
      (originColumn - 1) * 30 * RATIO,
      (originLine - 1) * 30 * RATIO,
      width * 30 * RATIO,
      height * 30 * RATIO
    );
    canvas = miniMapCanvasRef.current;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.clearRect(
      (column - 1) * MINI_MAP_RATIO,
      (line - 1) * MINI_MAP_RATIO,
      MINI_MAP_RATIO * target.Width,
      MINI_MAP_RATIO * target.Height
    );
    return true;
  };

  const placeBarrier = async (mapType: number) => {
    Object.keys(BarrierType)
      .map(v => v.toLowerCase() as BarrierType)
      .map((v: BarrierType) => {
        if (v === BarrierType.Tree) return null;
        const keys = BuildingFixed[v][mapType - 3];
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
          const canvas: any = miniMapCanvasRef.current;
          const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
          ctx.fillStyle = color;
          ctx.fillRect(
            (column - 1) * MINI_MAP_RATIO,
            (line - 1) * MINI_MAP_RATIO,
            MINI_MAP_RATIO,
            MINI_MAP_RATIO
          );
        }
        return null;
      });
    const canvas: any = buildingCanvasRef.current;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage((await getFullSizeImage(barriers, 'barrier'))!, 0, 0);
    barriers = {};
  };

  const placeFixed = async (mapType: number) => {
    Object.keys(FixedBuildingType)
      .map(v => v.toLowerCase() as FixedBuildingType)
      .map((v: FixedBuildingType) => {
        const keys = BuildingFixed[v][mapType - 3];
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
            column,
            {}
          );
        }
        return null;
      });
  };

  const updateMarker = async (
    value: number,
    line: number,
    column: number,
    isRoad?: boolean
  ) => {
    deleteMarker(line, column);
    await placeMarker(value, line, column, isRoad);
  };

  const updateRecordMarker = async (records: string[]) => {
    for (let v of records) {
      const [li, co] = parseBuildingKey(v);
      const target = cells.getBuilding(li, co);
      const { Width, Height } = target;
      const [, marker] = cells.canPlace(li, co, Width, Height);
      await updateMarker(marker, li, co);
    }
  };

  const updateRoadDisplay = async (roads: string[]) => {
    for (let v of roads) {
      const [li, co] = parseBuildingKey(v);
      const target = cells.getBuilding(li, co);
      if (target.isRoadVertex) await updateMarker(target.Marker, li, co, true);
      else deleteMarker(li, co);
      const key = `${target.BorderTStyle} ${target.BorderRStyle} ${target.BorderBStyle} ${target.BorderLStyle}`;
      let canvas: any = buildingCanvasRef.current;
      let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(
        await roadImageBuffer[key],
        (co - 1) * 30 * RATIO,
        (li - 1) * 30 * RATIO
      );
      canvas = miniMapCanvasRef.current;
      ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      ctx.fillStyle = FixedBuildingColor[FixedBuildingType.Road];
      ctx.fillRect(
        (co - 1) * MINI_MAP_RATIO,
        (li - 1) * MINI_MAP_RATIO,
        MINI_MAP_RATIO,
        MINI_MAP_RATIO
      );
    }
  };

  const onClickBoxDelete = async () => {
    for (let v of boxBuffer) {
      const [line, column] = parseBuildingKey(v);
      await deleteBuilding(line, column, {});
    }
    setShowBox(false);
    setShowBoxButton(false);
    setBoxBuffer(new Set<string>());
  };

  const onClickBoxMove = async (event: any) => {
    const {
      target: { id },
    } = event;

    let dir = [0, 0];
    if (id.includes('up')) dir = [-1, 0];
    else if (id.includes('down')) dir = [1, 0];
    else if (id.includes('left')) dir = [0, -1];
    else if (id.includes('right')) dir = [0, 1];
    else return;
    let canMove = true;
    for (let v of boxBuffer) {
      if (!canMove) break;
      const [line, column, width, height] = parseBuildingKey(v);
      const start = dir[0] ? column : line;
      const end = dir[0] ? column + width : line + height;
      for (let i = start; i < end; i++) {
        if (dir[0]) {
          // vertical
          const newLine = line + (dir[0] === 1 ? height : -1);
          const occupied = cells.getOccupied(newLine, i);
          if (
            !isInRange(newLine, i) ||
            (occupied && !boxBuffer.has(occupied))
          ) {
            canMove = false;
          }
        } else {
          // horizontal
          const newColumn = column + (dir[1] === 1 ? width : -1);
          const occupied = cells.getOccupied(i, newColumn);
          if (
            !isInRange(i, newColumn) ||
            (occupied && !boxBuffer.has(occupied))
          ) {
            canMove = false;
          }
        }
      }
    }
    if (!canMove) {
      message.error('无法朝该方向移动！');
      return;
    }
    onChangeIsLoading(true);
    setTimeout(async () => {
      let buildingBuffer = [] as any[];
      for (let v of boxBuffer) {
        const [line, column] = parseBuildingKey(v);
        const building = cells.getBuilding(line, column);
        buildingBuffer.push({ building, line, column });
        await deleteBuilding(line, column, { disableDispatch: true });
      }
      for (let v of buildingBuffer) {
        const { building, line, column } = v;
        await placeBuilding(building, line + dir[0], column + dir[1], {
          updateRoad: true,
          disableDispatch: true,
        });
      }
      let { initX, initY, curX, curY } = boxConfig;
      initX = initX + dir[1] * 30;
      initY = initY + dir[0] * 30;
      curX = curX + dir[1] * 30;
      curY = curY + dir[0] * 30;
      const initCo = Math.floor(initX / 30);
      const initLi = Math.floor(initY / 30);
      const curCo = Math.ceil(curX / 30);
      const curLi = Math.ceil(curY / 30);
      setBoxBuffer(new Set<string>());
      for (let i = initLi + 1; i <= curLi; i++) {
        for (let j = initCo + 1; j <= curCo; j++) {
          const occupied = cells.getOccupied(i, j);
          if (!occupied) continue;
          const building = cells.getBuilding(occupied);
          if (building.IsFixed) continue;
          setBoxBuffer(state => state.add(occupied));
        }
      }
      if (dir[0]) setScrollTop(getScrollTop() + dir[0] * 30);
      else setScrollLeft(getScrollLeft() + dir[1] * 30);
      setBoxConfig({ initX, initY, curX, curY });
      onChangeIsLoading(false);
    }, 0);
  };

  const updateMiniMapConfig = (resize?: boolean) => {
    const { clientWidth, clientHeight } = wrapperInnerRef.current!;
    const focusTop = getScrollTop() / clientHeight;
    const focusLeft = getScrollLeft() / clientWidth;
    if (resize) {
      let { clientWidth: focusWidth, clientHeight: focusHeight } =
        document.documentElement;
      focusWidth /= clientWidth;
      focusHeight /= clientHeight;
      setMiniMapConfig({ focusWidth, focusHeight, focusTop, focusLeft });
      return;
    }
    setMiniMapConfig(state => {
      return { ...state, focusTop, focusLeft };
    });
  };

  const onMiniMapMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    setIsDraggingMiniMapFocus(true);
    dragMiniMapFocus(event);
  };

  const onMiniMapMouseMove: MouseEventHandler<HTMLDivElement> = event => {
    if (!isMouseDown) return;
    if (!isDraggingMiniMapFocus) return;
    dragMiniMapFocus(event);
  };

  const onMiniMapMouseUp: MouseEventHandler<HTMLDivElement> = _ => {
    setIsDraggingMiniMapFocus(false);
  };

  const dragMiniMapFocus = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const {
      nativeEvent: { pageX, pageY },
    } = event as any;
    const { left, top } = document
      .getElementById('mini-map')!
      .getBoundingClientRect();
    const [layerX, layerY] = [pageX - left, pageY - top];
    const { focusWidth, focusHeight } = miniMapConfig;
    const { clientWidth, clientHeight } = wrapperInnerRef.current!;
    setScrollTop(
      ((layerY - (focusHeight * MINI_MAP_SIZE) / 2) / MINI_MAP_SIZE) *
        clientHeight
    );
    setScrollLeft(
      ((layerX - (focusWidth * MINI_MAP_SIZE) / 2) / MINI_MAP_SIZE) *
        clientWidth
    );
    updateMiniMapConfig();
  };

  const getScrollLeft = () => (wrapperOuterRef.current as any).scrollLeft;

  const getScrollTop = () => (wrapperOuterRef.current as any).scrollTop;

  const setScrollLeft = (val: number) =>
    ((wrapperOuterRef.current as any).scrollLeft = val);

  const setScrollTop = (val: number) =>
    ((wrapperOuterRef.current as any).scrollTop = val);

  const getWrapperSize = () => {
    const { clientWidth, clientHeight } = wrapperInnerRef.current as any;
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
        ref={wrapperInnerRef}
        className={styles['wrapper-inner']}
        onMouseDownCapture={onWrapperMouseDown}
        onMouseMoveCapture={onWrapperMouseMove}
        onMouseUpCapture={onWrapperMouseUp}
        onMouseLeave={onWrapperMouseLeave}
        onDoubleClickCapture={onWrapperDoubleClick}
      >
        <div
          className={styles.container}
          style={{
            transform: isMapRotated ? 'rotate(45deg)' : 'none',
          }}
        >
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
                operation === OperationType.Empty ? 'scale(1.02)' : ''
              }`,
              boxShadow:
                operation === OperationType.Empty
                  ? 'var(--text-secondary) 0 0 0.6rem'
                  : '',
              transition:
                operation === OperationType.Placing
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
            show={showBuilding}
            size={building.Range || 0}
            line={moveConfig.line + moveConfig.offsetLine}
            column={moveConfig.column + moveConfig.offsetColumn}
            width={building.Width || 0}
            height={building.Height || 0}
            color={building.Background}
            operation={operation}
          ></Range>
          <Box
            show={showBox}
            dragConfig={boxConfig}
            operation={operation}
            showButton={showBoxButton}
            onClickMove={onClickBoxMove}
            onClickDelete={onClickBoxDelete}
          />
          <div className={styles['box-effect']}>
            {Array.from(boxBuffer).map(v => {
              const [line, column, width, height] = parseBuildingKey(v);
              const boxShadowColor =
                operation === OperationType.Select
                  ? 'var(--ant-primary-color-hover)'
                  : 'var(--ant-error-color-hover)';
              return (
                <div
                  key={`box-effect-${v}`}
                  style={{
                    position: 'absolute',
                    top: `${(line - 1) * 3}rem`,
                    left: `${(column - 1) * 3}rem`,
                    width: `${width * 3}rem`,
                    height: `${height * 3}rem`,
                    boxShadow: `inset 0 0 1rem 0.5rem ${boxShadowColor}`,
                  }}
                ></div>
              );
            })}
          </div>
        </div>
        <div className={styles.copyright}>
          <div>
            <strong style={{ color: 'var(--ant-primary-color)' }}>
              {civil}{' '}
            </strong>
            <strong style={{ color: 'var(--ant-error-color)' }}>
              {mapType}木{' '}
            </strong>
            <strong style={{ color: 'var(--ant-success-color)' }}>
              {isNoWood ? '无' : '有'}木{' '}
            </strong>
            <strong style={{ color: 'var(--text-regular)' }}>地图布局</strong>
          </div>
          <div>
            <span>From the Map Editor </span>
            <strong>V{VERSION}</strong>
            <span> Implemented by </span>
            <strong>Glutamine525</strong>
          </div>
          <div>
            <span>网页链接: </span>
            <strong className={styles.link} onClick={() => copyLink(WEBSITE)}>
              {WEBSITE}
            </strong>
          </div>
          <div>
            <span>Github: </span>
            <strong className={styles.link} onClick={() => copyLink(GITHUB)}>
              {GITHUB}
            </strong>
          </div>
          <div>
            <span>Email: </span>
            <strong className={styles.link} onClick={() => copyLink(EMAIL)}>
              {EMAIL}
            </strong>
          </div>
        </div>
      </div>
      <MiniMap
        forwardedRef={miniMapCanvasRef}
        show={showMiniMap}
        theme={theme}
        rotated={isMapRotated}
        {...miniMapConfig}
        onMouseDown={onMiniMapMouseDown}
        onMouseMove={onMiniMapMouseMove}
        onMouseUp={onMiniMapMouseUp}
      />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    mapType: state.TopMenu.mapType,
    civil: state.TopMenu.civil,
    isNoWood: state.TopMenu.isNoWood,
    theme: state.TopMenu.theme,
    showMiniMap: state.TopMenu.showMiniMap,
    isMapRotated: state.TopMenu.isMapRotated,
    operation: state.LeftMenu.operation,
    buildingConfig: state.LeftMenu.buildingConfig,
    isImportingData: state.LeftMenu.isImportingData,
    specials: state.Panel.specials,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeIsLoading: (isLoading: boolean) => {
      dispatch(changeIsLoading(isLoading));
    },
    onChangeNoWood: (isNoWood: boolean) => {
      dispatch(changeNoWood(isNoWood));
    },
    onResetCounter: () => {
      dispatch(resetCounter());
    },
    onPlaceOrDeleteBuilding: (buildings: Building[], diff: number) => {
      dispatch(placeOrDeleteBuilding(buildings, diff));
    },
    setCopiedBuilding: (building: Building) => {
      dispatch(setCopiedBuilding(building));
    },
    onChangeIsImportingData: (isImportingData: boolean) => {
      dispatch(changeIsImportingData(isImportingData));
    },
  };
};

const ChessboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Chessboard);
export default ChessboardContainer;
