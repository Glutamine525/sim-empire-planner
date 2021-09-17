import { Tabs } from 'antd';
import PerfectScrollbar from 'perfect-scrollbar';
import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
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
        <TabPane tab="自动保存" key="1">
          Content of Tab Pane 1: 自动保存
          {Array(100)
            .fill(0)
            .map((_, i) => (
              <p key={i}>{i}</p>
            ))}
        </TabPane>
        <TabPane tab="特殊建筑" key="2">
          Content of Tab Pane 2: 特殊建筑
        </TabPane>
        <TabPane tab="生成文明" key="3">
          Content of Tab Pane 3: 生成文明
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
