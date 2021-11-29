import { Tabs } from 'antd';
import React from 'react';

import Switcher from '@/components/switcher';
import { MapAction } from '@/state';
import { AppAction } from '@/state/reducers/app';
import { ThemeType } from '@/types/theme';
import { useAppCreators, useMapCreators, useValue } from '@/utils/hook';

import Archive from './components/archive';
import SpecialBuildingEditter from './components/special-building-editter';
import styles from './index.less';

const { TabPane } = Tabs;

function Panel() {
  const { theme } = useValue<AppAction>(state => state.app);
  const { isPanelActive, tab } = useValue<MapAction>(state => state.map);

  const { changeTheme } = useAppCreators();
  const { changePanelTab } = useMapCreators();

  const onTabClick = (key: string) => changePanelTab(key);

  const onClickTheme = () => {
    changeTheme(theme === ThemeType.Light ? ThemeType.Dark : ThemeType.Light);
  };

  return (
    <div
      id="panel"
      className={styles.wrapper}
      style={{
        left: isPanelActive ? 0 : '-100%',
      }}
    >
      <Tabs activeKey={tab} onTabClick={onTabClick}>
        <TabPane tab="自动存档" key="tab-0">
          <Archive />
        </TabPane>
        <TabPane tab="特殊建筑" key="tab-1">
          <SpecialBuildingEditter />
        </TabPane>
        <TabPane tab="生成文明" key="tab-2">
          Content of Tab Pane 2: 生成文明
        </TabPane>
      </Tabs>
      <div className={styles['theme-container']}>
        <Switcher
          id="theme-in-panel"
          type="daynight"
          value={theme === ThemeType.Light}
          onClick={onClickTheme}
        />
      </div>
    </div>
  );
}

export default Panel;
