import { changeHamButton } from '@/actions';
import HamButton from '@/components/ham-button';
import React, { FC } from 'react';
import { connect } from 'react-redux';
import Chessboard from './components/chessboard';
import LeftMenu from './components/left-menu';
import Panel from './components/panel';
import TopMenuContainer from './components/top-menu';
import styles from './index.less';

interface MapProps {
  isHamActive: boolean;
  onChangeHamButton: any;
}

const Map: FC<MapProps> = (props: MapProps) => {
  const { isHamActive, onChangeHamButton } = props;

  const onClickHamButton = () => {
    let chessboard = document.getElementById('chessboard-wrapper-outer');
    if (isHamActive) chessboard!.style.display = 'block';
    else {
      setTimeout(() => {
        chessboard!.style.display = 'none';
      }, 300);
    }
    onChangeHamButton(!isHamActive);
  };

  return (
    <main id="map" className={styles.container}>
      <div className={styles['ham-container']}>
        <HamButton isActive={isHamActive} onClick={onClickHamButton} />
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
    isHamActive: state.TopMenu.isHamActive,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeHamButton: (isHamActive: boolean) => {
      dispatch(changeHamButton(isHamActive));
    },
  };
};

const MapContainer = connect(mapStateToProps, mapDispatchToProps)(Map);

export default MapContainer;
