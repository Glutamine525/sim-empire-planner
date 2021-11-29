import React from 'react';

import { CivilType } from '@/types/civil';
import { copyLink } from '@/utils/browser';
import { ORIGIN, VERSION } from '@/utils/config';

import styles from './index.less';

interface CopyrightProps {
  civil: CivilType;
  mapType: number;
  isNoWood: boolean;
}

function Copyright(props: CopyrightProps) {
  const { civil, mapType, isNoWood } = props;

  return (
    <div className={styles.copyright}>
      <div>
        <strong style={{ color: 'var(--ant-primary-color)' }}>{civil} </strong>
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
        <strong className={styles.link} onClick={() => copyLink(ORIGIN)}>
          {ORIGIN}
        </strong>
      </div>
    </div>
  );
}

export default React.memo(Copyright);
