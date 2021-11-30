import React, { FC } from 'react';

import { CivilType } from '@/types/civil';

import styles from './index.less';

interface DisplayerProps {
  id: string;
  woodNum: number;
  civil: CivilType;
  isNoWood: boolean;
  period: string;
  view: number;
  like: number;
  dislike: number;
  download: number;
  upload: number;
  editable: boolean;
  url: string;
}

const Displayer: FC = () => {
  return (
    <div className={styles.container}>
      <div></div>
    </div>
  );
};

export default Displayer;
