import { clickHamButton } from '@/actions';
import HamButton from '@/components/ham-button';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import Chessboard from './components/chessboard';
import LeftMenu from './components/left-menu';
import Panel from './components/panel';
import TopMenuContainer from './components/top-menu';
import styles from './index.less';

interface MapProps {
  IsHamActive: boolean;
  OnClickHamButton: any;
}

const Map: FC<MapProps> = (props: MapProps) => {
  const { IsHamActive, OnClickHamButton } = props;

  const onClickHamButton = () => {
    let chessboard = document.getElementById('chessboard-wrapper-outer');
    if (IsHamActive) chessboard!.style.display = 'block';
    else {
      setTimeout(() => {
        chessboard!.style.display = 'none';
      }, 300);
    }
    OnClickHamButton(!IsHamActive);
  };

  return (
    <main id="map" className={styles.container}>
      <div className={styles['ham-container']}>
        <HamButton IsActive={IsHamActive} OnClick={onClickHamButton} />
      </div>
      <TopMenuContainer />
      <LeftMenu />
      <Chessboard />
      <Panel />
    </main>
  );
};

const mapStateToProps = (state: any) => {
  return {
    IsHamActive: state.TopMenu.isHamActive,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    OnClickHamButton: (isHamActive: boolean) => {
      dispatch(clickHamButton(isHamActive));
    },
  };
};

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
