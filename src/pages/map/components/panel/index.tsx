import PerfectScrollbar from 'perfect-scrollbar';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';
import { StickyContainer, Sticky } from 'react-sticky';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

interface PanelProps {
  IsHamActive: boolean;
}

function Panel(props: PanelProps) {
  const { IsHamActive } = props;

  useEffect(() => {
    const scroll = new PerfectScrollbar('#panel', {
      wheelSpeed: 1,
    });
  }, []);

  const renderTabBar = (props: any, DefaultTabBar: any) => (
    <Sticky bottomOffset={80}>
      {({ style }) => (
        <DefaultTabBar
          {...props}
          className="site-custom-tab-bar"
          style={{ ...style }}
        />
      )}
    </Sticky>
  );

  return (
    <div
      id="panel"
      className={styles.wrapper}
      style={{
        left: IsHamActive ? 0 : '-100%',
      }}
    >
      <StickyContainer>
        <Tabs defaultActiveKey="1" renderTabBar={renderTabBar}>
          <TabPane tab="Tab 1" key="1">
            Content of Tab Pane 1
            {Array(100)
              .fill(0)
              .map((_, i) => (
                <p>{i}</p>
              ))}
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </StickyContainer>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    IsHamActive: state.TopMenu.isHamActive,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {};
};

const PanelContainer = connect(mapStateToProps, mapDispatchToProps)(Panel);

export default PanelContainer;
