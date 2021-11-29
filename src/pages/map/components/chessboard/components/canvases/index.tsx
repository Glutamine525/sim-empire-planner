import React from 'react';

import { LENGTH } from '@/utils/config';
import { RATIO } from '@/utils/screenshot';

import styles from './index.less';

interface CanvasesProps {
  isMapRotated: boolean;
  cellCanvasRef: React.LegacyRef<HTMLCanvasElement>;
  buildingCanvasRef: React.LegacyRef<HTMLCanvasElement>;
  markerCanvasRef: React.LegacyRef<HTMLCanvasElement>;
}

function Canvases(props: CanvasesProps) {
  const { isMapRotated, cellCanvasRef, buildingCanvasRef, markerCanvasRef } =
    props;

  return (
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
  );
}

export default React.memo(Canvases);
