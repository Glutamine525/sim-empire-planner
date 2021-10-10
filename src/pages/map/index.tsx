import HamButton from '@/components/ham-button';
import { MapAction } from '@/state';
import { useMapCreators, useValue } from '@/utils/hook';
import React from 'react';
import Chessboard from './components/chessboard';
import LeftMenu from './components/left-menu';
import Panel from './components/panel';
import TopMenu from './components/top-menu';
import styles from './index.less';

export default function Map() {
  const isLoading = useValue<boolean>(state => state.app.isLoading);
  const { isPanelActive } = useValue<MapAction>(state => state.map);
  const { changeIsPanelActive } = useMapCreators();

  const onClickButton = () => changeIsPanelActive(!isPanelActive);

  return (
    <main
      id="map"
      className={styles.container}
      style={{ filter: isLoading ? 'blur(5px)' : 'none' }}
    >
      <Panel />
      <TopMenu />
      <div className={styles['ham-container']}>
        <HamButton isActive={isPanelActive} onClick={onClickButton} />
      </div>
      <LeftMenu />
      <Chessboard />
      <a id="download" href="#!" style={{ display: 'none' }}>
        #
      </a>
    </main>
  );
}
