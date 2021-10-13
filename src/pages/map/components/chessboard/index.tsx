import PerfectScrollbar from 'perfect-scrollbar';
import { getCoord, getScreenSize } from '@/utils/browser';
import { LENGTH } from '@/utils/config';
import { useAppCreators, useValue } from '@/utils/hook';
import { getBuildingImage } from '@/utils/screenshot';
import React, {
  createRef,
  useEffect,
  useMemo,
  useState,
  MouseEventHandler,
  useRef,
} from 'react';
import styles from './index.less';
import { ThemeColor } from '@/types/theme';
import {
  getRoadImageBuffer,
  isAllInRange,
  isEmptyBuilding,
  isInRange,
  mapRectToCell,
  showMarker as showBuildingMarker,
} from '@/utils/chessboard';
import Copyright from './components/copyright';
import Footer from '@/components/footer';
import { MapAction } from '@/state';
import {
  Building,
  BuildingType,
  CatalogType,
  CivilBuilding,
  GeneralBuilding,
  MarkerColor,
} from '@/types/building';
import { OperationType } from '@/types/operation';
import MiniMap, { MINI_MAP_SIZE } from './components/mini-map';
import BuildingContainer from '@/pages/map/components/building-container';
import Canvases from './components/canvases';
import Box from './components/box';
import BoxEffect from './components/box-effect';
import Range from './components/range';
import { Cells } from '@/utils/cells';

const LEFT_OFFSET = 86;
const TOP_OFFSET = 80;

const initBuildingPos = { l: -1, oL: -1, c: -1, oC: -1 };
const initRect = { x: -1, y: -1, w: -1, h: -1 };

export const cellCanvasRef = createRef<HTMLCanvasElement>();
export const buildingCanvasRef = createRef<HTMLCanvasElement>();
export const markerCanvasRef = createRef<HTMLCanvasElement>();
export const miniMapCanvasRef = createRef<HTMLCanvasElement>();

const cells = Cells.getInstance();

function Chessboard() {
  const {
    mapType,
    civil,
    isNoWood,
    theme,
    showMiniMap,
    isMapRotated,
    operation,
    buildingConfig,
    specials,
  } = useValue<MapAction>(state => state.map);

  const { changeIsLoading } = useAppCreators();

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [isMouseDown, setIsMouseDown] = useState(false); // 全局标记鼠标是否按下
  const [isCtrlDown, setIsCtrlDown] = useState(false);
  const [isDragging, setIsDragging] = useState(false); // 是否再拖拽地图
  const [origin, setOrigin] = useState({ x: -1, y: -1 }); // 按下鼠标时的坐标
  const [current, setCurrent] = useState({ x: -1, y: -1 }); // 当前鼠标坐标
  const [showBuilding, setShowBuilding] = useState(false);
  const [buildingPos, setBuildingPos] = useState({ ...initBuildingPos }); // 鼠标指向的建筑位置
  const [cellOccupied, setCellOccupied] = useState(false);
  const [buildingMarker, setBuildingMarker] = useState(0);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building>({} as any);
  const [roadBuffer, setRoadBuffer] = useState(new Set<string>());
  const [showBox, setShowBox] = useState(false);
  const [boxRect, setBoxRect] = useState({ ...initRect });
  const [showBoxButton, setShowBoxButton] = useState(false);
  const [boxBuffer, setBoxBuffer] = useState(new Set<string>());
  const [miniRect, setMiniRect] = useState({ ...initRect });
  const [isDraggingMini, setIsDraggingMini] = useState(false);
  const [showFooter, setShowFooter] = useState(false);

  const protect = useMemo(() => CivilBuilding[civil]['防护'], [civil]);
  const protectNum = useMemo(() => protect.length, [protect]);
  const roadMarkerBuffer = useMemo(
    () => Array.from(Array(LENGTH + 1), () => null) as any[],
    []
  );
  const markerImageBuffer = useMemo(() => {
    const num = protectNum + 1;
    return {
      [MarkerColor.Normal]: roadMarkerBuffer,
      [MarkerColor.Safe]: Array.from(Array(num), () => null) as any[],
      [MarkerColor.Danger]: Array.from(Array(num), () => null) as any[],
    };
  }, [roadMarkerBuffer, protectNum]);
  const roadImageBuffer = useMemo(() => getRoadImageBuffer(), []);
  const civilBuildingImageBuffer = useMemo(() => {
    let result = {} as any;
    Object.values(BuildingType).forEach(v => {
      result[v] = {};
      CivilBuilding[civil][v].forEach(w => (result[v][w.name] = null as any));
    });
    return result;
  }, [civil]);
  const generalBuildingImageBuffer = useMemo(() => {
    let result = { [CatalogType.General]: {} } as any;
    GeneralBuilding.forEach(
      v => (result[CatalogType.General][v.name] = null as any)
    );
    return result;
  }, []);
  const specialBuildingImageBuffer = useMemo(() => {
    let result = { [CatalogType.Special]: {} } as any;
    specials.forEach(v => (result[CatalogType.Special][v.name] = null as any));
    return result;
  }, [specials]);
  const buildingImageBuffer = useMemo(
    () => ({
      ...civilBuildingImageBuffer,
      ...generalBuildingImageBuffer,
      ...specialBuildingImageBuffer,
    }),
    [
      civilBuildingImageBuffer,
      generalBuildingImageBuffer,
      specialBuildingImageBuffer,
    ]
  );
  const building = useMemo(() => {
    setShowBuilding(false);
    if (operation === OperationType.Empty) return hoveredBuilding;
    else if (operation === OperationType.Placing) {
      const { Catalog, Name } = buildingConfig;
      if (
        Catalog !== CatalogType.Road &&
        buildingImageBuffer[Catalog][Name] === null
      ) {
        buildingImageBuffer[Catalog][Name] = getBuildingImage(buildingConfig);
      }
      return buildingConfig;
    }
    return {} as Building;
  }, [operation, hoveredBuilding, buildingConfig]); // eslint-disable-line
  const showMarker = useMemo(() => showBuildingMarker(building), [building]);
  /* eslint-disable @typescript-eslint/no-unused-vars */

  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapperOuter = document.getElementById('chessboard-wrapper')!;
    const scroll = new PerfectScrollbar(wrapperOuter, { wheelSpeed: 1 });
    const onResize = () => {
      scroll.update();
      updateMiniRect(true);
    };
    const [W, H] = getWrapperSize();
    const [w, h] = getScreenSize();
    setScrollTop((H - h) / 2);
    setScrollLeft((W - w) / 2);
    onResize();
    wrapperOuter.addEventListener('ps-scroll-x', () => updateMiniRect());
    wrapperOuter.addEventListener('ps-scroll-y', () => {
      updateMiniRect();
      const [, height] = getWrapperSize();
      const [, scrollHeight] = getScreenSize();
      const top = getScrollTop();
      setShowFooter((top + scrollHeight) / height > 0.99);
    });
    window.addEventListener('resize', onResize);
    document.addEventListener('mouseleave', () => {
      setIsMouseDown(false);
      setIsCtrlDown(false);
    });
    window.addEventListener('blur', () => {
      setIsMouseDown(false);
      setIsCtrlDown(false);
    });
    document.addEventListener('mousedown', () => setIsMouseDown(true));
    document.addEventListener('mouseup', () => setIsMouseDown(false));
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
  }, []); // eslint-disable-line

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
    changeIsLoading(false);
    console.timeEnd('useEffect [Theme]');
  }, [theme]); // eslint-disable-line

  useEffect(() => {
    resetState();
  }, [operation]);

  useEffect(() => {
    if (isEmptyBuilding(building)) return;
  }, [building]);

  const resetState = () => {
    setShowBuilding(false);
    setCellOccupied(false);
    setBuildingMarker(0);
    setHoveredBuilding({} as Building);
    setShowBox(false);
    setShowBoxButton(false);
    setBoxBuffer(new Set<string>());
  };

  const dragMap = (type: string, offsetX: number, offsetY: number) => {
    if (type === 'down') {
      setOrigin({
        x: getScrollLeft() + offsetX,
        y: getScrollTop() + offsetY,
      });
    } else if (type === 'move') {
      const { x, y } = origin;
      setScrollLeft(x - offsetX);
      setScrollTop(y - offsetY);
    }
  };

  const updateBoxRect = (type: string, offsetX?: number, offsetY?: number) => {
    if (type === 'down') {
      setBoxBuffer(new Set<string>());
      setShowBox(true);
      setShowBoxButton(false);
      setBoxRect({
        x: getScrollLeft() + offsetX! - LEFT_OFFSET,
        y: getScrollTop() + offsetY! - TOP_OFFSET,
        w: 0,
        h: 0,
      });
    } else if (type === 'move') {
      const { x, y } = boxRect;
      setBoxRect(state => ({
        ...state,
        w: getScrollLeft() + offsetX! - LEFT_OFFSET - x,
        h: getScrollTop() + offsetY! - TOP_OFFSET - y,
      }));
    } else if (type === 'up') {
      if (building.IsRoad) {
        setShowBox(false);
        return;
      }
      let { x, y, w, h } = mapRectToCell(boxRect);
      if (!w && !h) {
        setShowBox(false);
        return;
      }
      setShowBoxButton(true);
      setBoxRect({ x, y, w, h });
      for (let i = y / 30 + 1; i <= y / 30 + 1 + h / 30; i++) {
        for (let j = x / 30 + 1; j <= x / 30 + 1 + w / 30; j++) {
          const occupied = cells.getOccupied(i, j);
          if (!occupied) continue;
          const building = cells.getBuilding(occupied);
          if (building.IsFixed) continue;
          setBoxBuffer(state => state.add(occupied));
        }
      }
    }
  };

  const updateBuilding = (type: string, offsetX?: number, offsetY?: number) => {
    if (type === 'down') {
    } else if (type === 'move') {
    } else if (type === 'up') {
    }
  };

  const onWrapperMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(true);
    const { ctrlKey, clientX, clientY, target } = event;
    if (ctrlKey) {
      dragMap('down', clientX, clientY);
      return;
    }
    switch (operation) {
      case OperationType.Empty:
        dragMap('down', clientX, clientY);
        break;
      case OperationType.Placing:
        if (building.IsRoad) updateBoxRect('down', clientX, clientY);
        break;
      case OperationType.Select:
      case OperationType.Delete:
        if ((target as any).id?.startsWith('box-')) return;
        updateBoxRect('down', clientX, clientY);
        break;
      default:
        break;
    }
  };

  const onWrapperMouseMove: MouseEventHandler<HTMLDivElement> = event => {
    const { ctrlKey, target, clientX, clientY, pageX, pageY } = event;
    const [offsetX, offsetY] = [
      pageX + getScrollLeft() - LEFT_OFFSET,
      pageY + getScrollTop() - TOP_OFFSET,
    ];
    const { line: l, column: c } = getCoord(offsetX, offsetY);
    if (
      isDragging &&
      (ctrlKey || (isMapRotated && operation !== OperationType.Watermark))
    ) {
      dragMap('move', clientX, clientY);
      return;
    }
    switch (operation) {
      case OperationType.Empty:
        if (isDragging) dragMap('move', clientX, clientY);
        break;
      case OperationType.Placing:
        const { Height, Width } = buildingConfig;
        const [oL, oC] = [
          -Math.floor((Height - 1) / 2),
          -Math.floor((Width - 1) / 2),
        ];
        if (!isAllInRange(l + oL, c + oC, Width - 1, Height - 1)) {
          setShowBuilding(false);
          setCellOccupied(false);
          return;
        }
        const [canP, marker] = cells.canPlace(l + oL, c + oC, Width, Height);
        const [canR, gM, gL, gC] = cells.canReplace(l, c, Width, Height);
        if (!buildingConfig.IsGeneral && canR) {
          setShowBuilding(true);
          setBuildingMarker(gM);
          setCellOccupied(false);
          setBuildingPos({ l: gL, oL: 0, c: gC, oC: 0 });
        } else {
          setShowBuilding(true);
          setBuildingMarker(marker);
          setCellOccupied(!canP);
          setBuildingPos({ l, oL, c, oC });
        }
        if (!isDragging || (!canP && !canR)) return;
        if (building.IsRoad) {
          updateBoxRect('move', clientX, clientY);
          setRoadBuffer(state => state.add(`${l}-${c}`));
          return;
        }
        if (canR) {
          // deleteBuilding(generalLine, generalColumn, {});
          // placeBuilding(buildingConfig, generalLine, generalColumn, {});
        } else if (canP) {
          // placeBuilding(
          //   buildingConfig,
          //   line + offsetLine,
          //   column + offsetColumn,
          //   { updateRoad: false }
          // );
        }
        break;
      case OperationType.Select:
      case OperationType.Delete:
        if (!isDragging) return;
        if ((target as any).id) return;
        updateBoxRect('move', clientX, clientY);
        break;
      default:
        break;
    }
  };

  const onWrapperMouseUp: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(false);
    const { ctrlKey } = event;
    if (ctrlKey) {
      return;
    }
    switch (operation) {
      case OperationType.Placing:
        if (building.IsRoad) updateBoxRect('up');
        break;
      case OperationType.Select:
      case OperationType.Delete:
        updateBoxRect('up');
        break;
      default:
        break;
    }
  };

  const onWrapperMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    setIsDragging(false);
    resetState();
  };

  const onMiniMapMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    setIsDraggingMini(true);
    dragOnMini(event);
  };

  const onMiniMapMouseMove: MouseEventHandler<HTMLDivElement> = event => {
    if (!isMouseDown) return;
    if (!isDraggingMini) return;
    dragOnMini(event);
  };

  const onMiniMapMouseUp: MouseEventHandler<HTMLDivElement> = event => {
    setIsDraggingMini(false);
  };

  const updateMiniRect = (resize?: boolean) => {
    const { clientWidth, clientHeight } = containerRef.current!;
    const x = getScrollLeft() / clientWidth;
    const y = getScrollTop() / clientHeight;
    if (resize) {
      let { clientWidth: w, clientHeight: h } = document.documentElement;
      w /= clientWidth;
      h /= clientHeight;
      setMiniRect({ x, y, w, h });
      return;
    }
    setMiniRect(state => {
      return { ...state, x, y };
    });
  };

  const dragOnMini = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const {
      nativeEvent: { pageX, pageY },
    } = event as any;
    const { left, top } = document
      .getElementById('mini-map')!
      .getBoundingClientRect();
    const [layerX, layerY] = [pageX - left, pageY - top];
    const { w, h } = miniRect;
    const { clientWidth, clientHeight } = containerRef.current!;
    setScrollTop(
      ((layerY - (h * MINI_MAP_SIZE) / 2) / MINI_MAP_SIZE) * clientHeight
    );
    setScrollLeft(
      ((layerX - (w * MINI_MAP_SIZE) / 2) / MINI_MAP_SIZE) * clientWidth
    );
    updateMiniRect();
  };

  const onClickBoxDelete = async () => {};

  const onClickBoxMove = async () => {};

  const getScrollLeft = () => wrapperRef.current!.scrollLeft;

  const getScrollTop = () => wrapperRef.current!.scrollTop;

  const setScrollLeft = (v: number) => (wrapperRef.current!.scrollLeft = v);

  const setScrollTop = (v: number) => (wrapperRef.current!.scrollTop = v);

  const getWrapperSize = () => {
    const { clientWidth, clientHeight } = containerRef.current!;
    return [clientWidth, clientHeight];
  };

  return (
    <div ref={wrapperRef} id="chessboard-wrapper" className={styles.wrapper}>
      <div
        ref={containerRef}
        className={styles.container}
        onMouseDownCapture={onWrapperMouseDown}
        onMouseMoveCapture={onWrapperMouseMove}
        onMouseUpCapture={onWrapperMouseUp}
        onMouseLeave={onWrapperMouseLeave}
      >
        <Canvases
          isMapRotated={isMapRotated}
          cellCanvasRef={cellCanvasRef}
          buildingCanvasRef={buildingCanvasRef}
          markerCanvasRef={markerCanvasRef}
        />
        <div className={styles.function}>
          <BuildingContainer
            scene="map"
            show={showBuilding}
            operation={operation}
            building={building}
            cellOccupied={cellOccupied}
            line={buildingPos.l + buildingPos.oL}
            column={buildingPos.c + buildingPos.oC}
            marker={buildingMarker}
            protectNum={protectNum}
          />
          <Range
            show={showBuilding}
            size={building.Range || 0}
            line={buildingPos.l + buildingPos.oL}
            column={buildingPos.c + buildingPos.oC}
            width={building.Width || 0}
            height={building.Height || 0}
            color={building.Background}
            operation={operation}
          />
          <Box
            show={showBox}
            boxRect={boxRect}
            operation={operation}
            showButton={showBoxButton}
            onClickMove={onClickBoxMove}
            onClickDelete={onClickBoxDelete}
          />
          <BoxEffect operation={operation} boxBuffer={boxBuffer} />
        </div>
        <Copyright mapType={mapType} civil={civil} isNoWood={isNoWood} />
      </div>
      <MiniMap
        forwardedRef={miniMapCanvasRef}
        show={showMiniMap}
        theme={theme}
        rotated={isMapRotated}
        {...miniRect}
        onMouseDown={onMiniMapMouseDown}
        onMouseMove={onMiniMapMouseMove}
        onMouseUp={onMiniMapMouseUp}
      />
      <Footer show={showFooter} />
    </div>
  );
}

// export default Chessboard;
export default React.memo(Chessboard);
