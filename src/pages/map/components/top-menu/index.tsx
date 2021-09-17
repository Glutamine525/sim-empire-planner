import Switcher from '@/components/switcher';
import React, { FC } from 'react';
import { CivilArray, CivilType } from '@/types/civil';
import { OperationType } from '@/types/operation';
import { CounterType } from '@/types/couter';
import styles from './index.less';
import { connect } from 'react-redux';
import {
  changeCivil,
  changeTheme,
  changeMapType,
  changeMiniMap,
  changeNoWood,
  changeRotateMap,
} from '@/actions';
import { ThemeType } from '@/types/theme';
import { Dropdown, Menu } from 'antd';
import { MINOR_PATCH, VERSION } from '@/utils/config';

interface TopMenuProps {
  mapType: number;
  civil: CivilType;
  isNoWood: boolean;
  theme: ThemeType;
  showMiniMap: boolean;
  isMapRotated: boolean;
  operation: OperationType;
  operationSub: string;
  counter: CounterType;
  onChangeMapType: any;
  onChangeCivil: any;
  onChangeNoWood: any;
  onChangeTheme: any;
  onChangeMiniMap: any;
  onChangeRotateMap: any;
}

const TopMenu: FC<TopMenuProps> = (props: TopMenuProps) => {
  const {
    mapType,
    civil,
    isNoWood,
    theme,
    showMiniMap,
    isMapRotated,
    operation,
    operationSub,
    counter,
    onChangeMapType,
    onChangeCivil,
    onChangeNoWood,
    onChangeTheme,
    onChangeMiniMap,
    onChangeRotateMap,
  } = props;

  const mapTypeDropdown = (
    <Menu
      style={{
        width: '4.8rem',
        textAlign: 'center',
      }}
      onClick={item => {
        const { key } = item;
        onChangeMapType(Number(key));
      }}
    >
      {[5, 4, 3].map(v => {
        return <Menu.Item key={v}>{v}</Menu.Item>;
      })}
    </Menu>
  );

  const civilDropdown = (
    <Menu
      style={{
        width: '10rem',
        textAlign: 'center',
      }}
      onClick={item => {
        const { key } = item;
        onChangeCivil(key);
      }}
    >
      {CivilArray.map(v => {
        return <Menu.Item key={v}>{v}</Menu.Item>;
      })}
    </Menu>
  );

  const onClickNoWood = () => {
    onChangeNoWood(!isNoWood);
  };

  const onClickTheme = () => {
    onChangeTheme(theme === ThemeType.Light ? ThemeType.Dark : ThemeType.Light);
  };

  const onClickMiniMap = () => {
    onChangeMiniMap(!showMiniMap);
  };

  const onClickRotateMap = () => {
    onChangeRotateMap(!isMapRotated);
  };

  return (
    <nav className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.controller}>
          <div style={{ width: '4rem', height: '4rem' }}></div>
          <div>
            <span>地图类型：</span>
            <Dropdown overlay={mapTypeDropdown} placement="bottomCenter" arrow>
              <span className={`ant-dropdown-link ${styles['map-type-label']}`}>
                {mapType}
              </span>
            </Dropdown>
          </div>
          <div>
            <span>文明：</span>
            <Dropdown overlay={civilDropdown} placement="bottomCenter" arrow>
              <span className={`ant-dropdown-link ${styles['civil-label']}`}>
                {civil}
              </span>
            </Dropdown>
          </div>
          <div>
            <span>无木之地：</span>
            <Switcher
              id="no-wood"
              type="ordinary"
              value={isNoWood}
              onClick={onClickNoWood}
            />
          </div>
          <div>
            <span>显示模式：</span>
            <Switcher
              id="theme"
              type="daynight"
              value={theme === ThemeType.Light}
              onClick={onClickTheme}
            />
          </div>
          <div>
            <span>小地图：</span>
            <Switcher
              id="mini-map"
              type="ordinary"
              value={showMiniMap}
              onClick={onClickMiniMap}
            />
          </div>
          <div>
            <span>旋转地图：</span>
            <Switcher
              id="rotate"
              type="ordinary"
              value={isMapRotated}
              onClick={onClickRotateMap}
            />
          </div>
        </div>
        <div className={styles.operation}>
          <span>当前操作</span>
          <strong>{`${operation}${
            operationSub ? ' ' + operationSub : ''
          }`}</strong>
        </div>
        <div className={styles.counter}>
          <div>
            <div>
              <span>普通住宅：</span>
              <strong>{counter.OridinaryHouse}</strong>
              <span>个</span>
            </div>
            <div>
              <span>高级住宅：</span>
              <strong>{counter.HighEndHouse}</strong>
              <span>个</span>
            </div>
          </div>
          <div>
            <div>
              <span>粮仓：</span>
              <strong>{counter.Barn}</strong>
              <span>个</span>
            </div>
            <div>
              <span>货栈：</span>
              <strong>{counter.Warehouse}</strong>
              <span>个</span>
            </div>
          </div>
          <div>
            <div>
              <span>农业：</span>
              <strong>{counter.Agriculture}</strong>
              <span>/150个</span>
            </div>
            <div>
              <span>工业：</span>
              <strong>{counter.Industry}</strong>
              <span>/100个</span>
            </div>
          </div>
          <div>
            <div>
              <span>通用：</span>
              <strong>{counter.General}</strong>
              <span>个</span>
            </div>
            <div>
              <span>总计：</span>
              <strong>{counter.Total}</strong>
              <span>个</span>
            </div>
          </div>
        </div>
        <div className={styles.helper}>?</div>
        <div className={styles.version}>
          <div>
            <span>模拟帝国地图编辑器 </span>
            <strong>{`V${VERSION}.${MINOR_PATCH}`}</strong>
          </div>
          <div>
            <span>作者：</span>
            <strong>咕噜他命</strong>
          </div>
        </div>
      </div>
    </nav>
  );
};

const mapStateToProps = (state: any) => {
  return {
    mapType: state.TopMenu.mapType,
    civil: state.TopMenu.civil,
    isNoWood: state.TopMenu.isNoWood,
    theme: state.TopMenu.theme,
    showMiniMap: state.TopMenu.showMiniMap,
    isMapRotated: state.TopMenu.isMapRotated,
    operation: state.LeftMenu.operation,
    operationSub: state.LeftMenu.operationSub,
    counter: state.Chessboard.counter,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeMapType: (mapType: number) => {
      dispatch(changeMapType(mapType));
    },
    onChangeCivil: (civil: CivilType) => {
      dispatch(changeCivil(civil));
    },
    onChangeNoWood: (isNoWood: boolean) => {
      dispatch(changeNoWood(isNoWood));
    },
    onChangeTheme: (theme: ThemeType) => {
      dispatch(changeTheme(theme));
    },
    onChangeMiniMap: (showMiniMap: boolean) => {
      dispatch(changeMiniMap(showMiniMap));
    },
    onChangeRotateMap: (isMapRotated: boolean) => {
      dispatch(changeRotateMap(isMapRotated));
    },
  };
};

const TopMenuContainer = connect(mapStateToProps, mapDispatchToProps)(TopMenu);

export default TopMenuContainer;
