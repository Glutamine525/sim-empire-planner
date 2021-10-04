import { Tabs } from 'antd';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import Archive from './components/archive';
import SpecialBuildingEditter from './components/special-building-editter';
import styles from './index.less';

const { TabPane } = Tabs;

interface PanelProps {
  isHamActive: boolean;
}

function Panel(props: PanelProps) {
  const { isHamActive } = props;

  const [activeKey, setActiveKey] = useState('tab-0');

  const onTabClick = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div
      id="panel"
      className={styles.wrapper}
      style={{
        left: isHamActive ? 0 : '-100%',
      }}
    >
      <Tabs activeKey={activeKey} onTabClick={onTabClick}>
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

const mapStateToProps = (state: any) => {
  return {
    isHamActive: state.TopMenu.isHamActive,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
