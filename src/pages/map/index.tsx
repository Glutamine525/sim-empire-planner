import React from 'react';

import HamButton from '@/components/ham-button';
import { MapAction } from '@/state';
import { AppAction } from '@/state/reducers/app';
import { useMapCreators, useValue } from '@/utils/hook';

import Chessboard from './components/chessboard';
import LeftMenu from './components/left-menu';
import Panel from './components/panel';
import TopMenu from './components/top-menu';
import styles from './index.less';

export default function Map() {
  const { isLoading } = useValue<AppAction>(state => state.app);
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
