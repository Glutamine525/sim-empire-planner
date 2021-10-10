import PerfectScrollbar from 'perfect-scrollbar';
import { getScreenSize } from '@/utils/browser';
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
  isInRange,
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
import Canvases from './components/canvases';

const initBuildingPos = { l: -1, oL: -1, c: -1, oC: -1 };
const initRect = { x: -1, y: -1, w: -1, h: -1 };

export const cellCanvasRef = createRef<HTMLCanvasElement>();
export const buildingCanvasRef = createRef<HTMLCanvasElement>();
export const markerCanvasRef = createRef<HTMLCanvasElement>();
export const miniMapCanvasRef = createRef<HTMLCanvasElement>();

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
  const [buildingPos, setBuildingPos] = useState({ ...initBuildingPos }); // 建筑位置
  const [cellOccupied, setCellOccupied] = useState(false);
  const [buildingMarker, setBuildingMarker] = useState(0);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building>({} as any);
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
  const markerBuffer = useMemo(() => {
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

  const dragMap = (type: string, offsetX: number, offsetY: number) => {
    switch (type) {
      case 'down':
        setOrigin({
          x: getScrollLeft() + offsetX,
          y: getScrollTop() + offsetY,
        });
        break;
      case 'move':
        const { x, y } = origin;
        setScrollLeft(x - offsetX);
        setScrollTop(y - offsetY);
        break;
      default:
        break;
    }
  };

  const onWrapperMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(true);
    const { ctrlKey, clientX, clientY } = event;
    if (ctrlKey) {
      dragMap('down', clientX, clientY);
      return;
    }
    dragMap('down', clientX, clientY);
  };

  const onWrapperMouseMove: MouseEventHandler<HTMLDivElement> = event => {
    if (!isDragging) return;
    const { ctrlKey, clientX, clientY } = event;
    if (ctrlKey) {
      dragMap('move', clientX, clientY);
      return;
    }
    dragMap('move', clientX, clientY);
  };

  const onWrapperMouseUp: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(false);
    const { ctrlKey } = event;
    if (ctrlKey) {
      return;
    }
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
      >
        <Canvases
          isMapRotated={isMapRotated}
          cellCanvasRef={cellCanvasRef}
          buildingCanvasRef={buildingCanvasRef}
          markerCanvasRef={markerCanvasRef}
        />
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
