import React, { FC } from 'react';
import Chessboard from './components/chessboard';
import LeftMenu from './components/left-menu';
import styles from './index.less';

const Main: FC = () => {
  return (
    <div className={styles.container}>
      <LeftMenu />
      <Chessboard />
    </div>
  );
};

export default Main;
