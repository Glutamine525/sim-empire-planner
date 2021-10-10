import PerfectScrollbar from 'perfect-scrollbar';
import { getScreenSize } from '@/utils/browser';
import { LENGTH } from '@/utils/config';
import { useAppCreators, useValue } from '@/utils/hook';
import { RATIO } from '@/utils/screenshot';
import React, {
  createRef,
  MouseEventHandler,
  useEffect,
  useState,
} from 'react';
import styles from './index.less';
import { ThemeColor } from '@/types/theme';
import { isInRange } from '@/utils/chessboard';
import Copyright from './components/copyright';
import Footer from '@/components/footer';
import { MapAction } from '@/state';

const outerRef = createRef<HTMLDivElement>();
const innerRef = createRef<HTMLDivElement>();
export const cellCanvasRef = createRef<HTMLCanvasElement>();
export const buildingCanvasRef = createRef<HTMLCanvasElement>();
export const markerCanvasRef = createRef<HTMLCanvasElement>();
export const miniMapCanvasRef = createRef<HTMLCanvasElement>();

const initDragConfig = { initX: -1, initY: -1, curX: -1, curY: -1 };

function Chessboard() {
  const { mapType, civil, isNoWood, theme, isMapRotated } = useValue<MapAction>(
    state => state.map
  );

  const { changeIsLoading } = useAppCreators();

  const [isDragging, setIsDragging] = useState(false);
  const [dragConfig, setDragConfig] = useState({ ...initDragConfig });
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const scroll = new PerfectScrollbar('#chessboard-wrapper-outer', {
      wheelSpeed: 1,
    });
    const [W, H] = getWrapperSize();
    const [w, h] = getScreenSize();
    setScrollTop((H - h) / 2);
    setScrollLeft((W - w) / 2);
    scroll.update();
    window.addEventListener('resize', () => {
      scroll.update();
    });
    const wrapperOuter = document.getElementById('chessboard-wrapper-outer');
    // wrapperOuter!.addEventListener('ps-scroll-x', () => updateMiniMapConfig());
    wrapperOuter!.addEventListener('ps-scroll-y', () => {
      // updateMiniMapConfig();
      const [, height] = getWrapperSize();
      const [, scrollHeight] = getScreenSize();
      const top = getScrollTop();
      setShowFooter((top + scrollHeight) / height > 0.99);
    });
  }, []);

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

  const onWrapperMouseDown: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(true);
    const { clientX, clientY } = event;
    const scrollLeft = getScrollLeft();
    const scrollTop = getScrollTop();
    setDragConfig({
      initX: scrollLeft + clientX,
      initY: scrollTop + clientY,
      curX: scrollLeft + clientX,
      curY: scrollTop + clientY,
    });
  };

  const onWrapperMouseMove: MouseEventHandler<HTMLDivElement> = event => {
    if (!isDragging) return;
    const { clientX, clientY } = event;
    const { initX, initY } = dragConfig;
    setScrollLeft(initX - clientX);
    setScrollTop(initY - clientY);
  };

  const onWrapperMouseUp: MouseEventHandler<HTMLDivElement> = event => {
    setIsDragging(false);
  };

  const getScrollLeft = () => outerRef.current!.scrollLeft;

  const getScrollTop = () => outerRef.current!.scrollTop;

  const setScrollLeft = (v: number) => (outerRef.current!.scrollLeft = v);

  const setScrollTop = (v: number) => (outerRef.current!.scrollTop = v);

  const getWrapperSize = () => {
    const { clientWidth, clientHeight } = innerRef.current!;
    return [clientWidth, clientHeight];
  };

  return (
    <div
      ref={outerRef}
      id="chessboard-wrapper-outer"
      className={styles['wrapper-outer']}
    >
      <div
        ref={innerRef}
        className={styles['wrapper-inner']}
        onMouseDownCapture={onWrapperMouseDown}
        onMouseMoveCapture={onWrapperMouseMove}
        onMouseUpCapture={onWrapperMouseUp}
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
        </div>
        <Copyright mapType={mapType} civil={civil} isNoWood={isNoWood} />
      </div>
      <Footer show={showFooter} />
    </div>
  );
}

export default React.memo(Chessboard);
