import { ThemeType } from '@/types/theme';
import React, { FC, useEffect } from 'react';
import { connect } from 'react-redux';
import Chessboard from './components/chessboard';
import LeftMenu from './components/left-menu';
import TopMenu from './components/top-menu';
import styles from './index.less';

interface MainProps {
  Theme: ThemeType;
}

const Main: FC<MainProps> = (props: MainProps) => {
  const { Theme } = props;

  return (
    <div className={`${styles.container} ${styles[Theme]}`}>
      <TopMenu />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    Theme: state.TopMenu.theme,
  };
};

const MainContainer = connect(mapStateToProps)(Main);

export default MainContainer;
