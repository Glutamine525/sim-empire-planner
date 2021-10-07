import { changePanelTab } from '@/actions';
import { Tabs } from 'antd';
import React from 'react';
import { connect } from 'react-redux';
import Archive from './components/archive';
import SpecialBuildingEditter from './components/special-building-editter';
import styles from './index.less';

const { TabPane } = Tabs;

interface PanelProps {
  isHamActive: boolean;
  tab: string;
  onChangePanelTab: any;
}

function Panel(props: PanelProps) {
  const { isHamActive, tab, onChangePanelTab } = props;

  const onTabClick = (key: string) => {
    onChangePanelTab(key);
  };

  return (
    <div
      id="panel"
      className={styles.wrapper}
      style={{
        left: isHamActive ? 0 : '-100%',
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

const mapStateToProps = (state: any) => {
  return {
    isHamActive: state.TopMenu.isHamActive,
    tab: state.Panel.tab,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangePanelTab: (tab: string) => {
      dispatch(changePanelTab(tab));
    },
  };
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
