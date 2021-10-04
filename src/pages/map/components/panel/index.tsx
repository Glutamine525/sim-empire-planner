import { Tabs } from 'antd';
import PerfectScrollbar from 'perfect-scrollbar';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import Archive from './components/archive';
import SpecialBuildingEditter from './components/special-building-editter';
import styles from './index.less';

const { TabPane } = Tabs;

interface PanelProps {
  isHamActive: boolean;
}

let updateScroll: any;

function Panel(props: PanelProps) {
  const { isHamActive } = props;

  const [activeKey, setActiveKey] = useState('1');

  const panelRef = useRef(null);

  useEffect(() => {
    const scroll = new PerfectScrollbar('#panel', { wheelSpeed: 1 });
    updateScroll = () => scroll.update();
  }, []);

  useEffect(() => {
    (panelRef.current as any).scrollTop = 0;
    updateScroll();
  }, [activeKey]);

  const onTabClick = (key: string) => {
    setActiveKey(key);
  };

  return (
    <div
      id="panel"
      ref={panelRef}
      className={styles.wrapper}
      style={{
        left: isHamActive ? 0 : '-100%',
      }}
    >
      <Tabs activeKey={activeKey} onTabClick={onTabClick}>
        <TabPane tab="特殊建筑 & 存档" key="1" className={styles['panel-1']}>
          <SpecialBuildingEditter />
          <Archive />
        </TabPane>
        <TabPane tab="生成文明" key="2">
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
