import PerfectScrollbar from 'perfect-scrollbar';
import React, { FC, useEffect } from 'react';
import Chessboard from './components/chessboard';
import LeftMenu from './components/left-menu';
import styles from './index.less';

const Main: FC = () => {
  useEffect(() => {
    new PerfectScrollbar('#chessboard', { wheelSpeed: 1 });
  }, []);

  return (
    <div className={styles.container}>
      <LeftMenu />
      <Chessboard />
    </div>
  );
};

export default Main;
