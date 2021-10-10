import { MapAction } from '@/state';
import { useMapCreators, useValue } from '@/utils/hook';
import { Tabs } from 'antd';
import React from 'react';
import Archive from './components/archive';
import SpecialBuildingEditter from './components/special-building-editter';
import styles from './index.less';

const { TabPane } = Tabs;

function Panel() {
  const { isPanelActive, tab } = useValue<MapAction>(state => state.map);

  const { changePanelTab } = useMapCreators();

  const onTabClick = (key: string) => changePanelTab(key);

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
    </div>
  );
}

export default Panel;
