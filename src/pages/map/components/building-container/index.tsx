import React, { useEffect, useState } from 'react';

import { Building } from '@/types/building';
import { OperationType } from '@/types/operation';
import { showMarker } from '@/utils/chessboard';

import styles from './index.less';

interface BuildingContainerProps {
  scene: 'map' | 'editter';
  show: boolean;
  operation: OperationType;
  building: Building;
  cellOccupied: boolean;
  line: number;
  column: number;
  marker: number;
  protectNum: number;
}

function BuildingContainer(props: BuildingContainerProps) {
  const {
    scene,
    show,
    operation,
    building,
    cellOccupied,
    line,
    column,
    marker,
    protectNum,
  } = props;

  const [transform, setTransform] = useState('');
  const [boxShadow, setBoxShadow] = useState('');
  const [transition, setTransition] = useState('');

  useEffect(() => {
    if (scene === 'editter') {
      setBoxShadow('');
      setTransition('');
      return;
    }
    if (operation === OperationType.Empty) {
      setBoxShadow('var(--text-secondary) 0 0 0.6rem');
    } else {
      setBoxShadow('');
    }
    if (operation === OperationType.Placing) {
      setTransition('transform 30ms ease-in-out');
    } else {
      setTransition('');
    }
  }, [operation, scene]);

  useEffect(() => {
    if (scene === 'editter') {
      setTransform('');
      return;
    }
    if (operation === OperationType.Empty) {
      setTransform(
        `translate(${(column - 1) * 3}rem,${(line - 1) * 3}rem) scale(1.02)`
      );
    } else {
      setTransform(`translate(${(column - 1) * 3}rem,${(line - 1) * 3}rem)`);
    }
  }, [line, column, operation, scene]);

  return (
    <div
      className={`${styles.building} ${building.IsRoad ? styles.road : ''} ${
        cellOccupied ? styles.occupied : ''
      }`}
      style={{
        display: show ? 'flex' : 'none',
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
        textShadow: Array(10).fill(`${building.Shadow} 0 0 0.1rem`).join(','),
        transform: transform,
        boxShadow: boxShadow,
        transition: transition,
      }}
    >
      {building.Text}
      <div
        className={styles.marker}
        style={{
          display: showMarker(building) ? 'flex' : 'none',
          color:
            marker >= protectNum
              ? 'var(--ant-success-color)'
              : 'var(--ant-error-color)',
        }}
      >
        {marker}
      </div>
    </div>
  );
}

export default React.memo(BuildingContainer);
