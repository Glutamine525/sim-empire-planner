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
  isLoading: boolean;
  isHamActive: boolean;
  onChangeHamButton: any;
}

const Map: FC<MapProps> = (props: MapProps) => {
  const { isLoading, isHamActive, onChangeHamButton } = props;

  const onClickHamButton = () => {
    onChangeHamButton(!isHamActive);
  };

  return (
    <main
      id="map"
      className={styles.container}
      style={{ filter: isLoading ? 'blur(5px)' : 'none' }}
    >
      <Panel />
      <TopMenuContainer />
      <div className={styles['ham-container']}>
        <HamButton isActive={isHamActive} onClick={onClickHamButton} />
      </div>
      <LeftMenu />
      <Chessboard />
      <a id="download" href="#!" style={{ display: 'none' }}>
        #
      </a>
    </main>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isLoading: state.App.isLoading,
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
