import Switcher from '@/components/switcher';
import React, { FC } from 'react';
import { Link } from 'react-router-dom';
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
  clickHamButton,
  rotateMap,
} from '@/actions';
import { ThemeType } from '@/types/theme';
import { Dropdown, Menu } from 'antd';
import HamButton from '@/components/ham-button';
import { MINOR_PATCH, VERSION } from '@/utils/config';

interface TopMenuProps {
  IsHamActive: boolean;
  MapType: number;
  Civil: CivilType;
  IsNoWood: boolean;
  Theme: ThemeType;
  ShowMiniMap: boolean;
  IsMapRotated: boolean;
  Operation: OperationType;
  OperationSub: string;
  Counter: CounterType;
  OnClickHamButton: any;
  OnChangeMapType: any;
  OnChangeCivil: any;
  OnChangeNoWood: any;
  OnChangeTheme: any;
  OnChangeMiniMap: any;
  OnRotateMap: any;
}

const TopMenu: FC<TopMenuProps> = (props: TopMenuProps) => {
  const {
    IsHamActive,
    MapType,
    Civil,
    IsNoWood,
    Theme,
    ShowMiniMap,
    IsMapRotated,
    Operation,
    OperationSub,
    Counter,
    OnClickHamButton,
    OnChangeMapType,
    OnChangeCivil,
    OnChangeNoWood,
    OnChangeTheme,
    OnChangeMiniMap,
    OnRotateMap,
  } = props;

  const mapTypeDropdown = (
    <Menu
      style={{
        width: '4.8rem',
        textAlign: 'center',
      }}
      onClick={item => {
        const { key } = item;
        OnChangeMapType(Number(key));
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
        OnChangeCivil(key);
      }}
    >
      {CivilArray.map(v => {
        return <Menu.Item key={v}>{v}</Menu.Item>;
      })}
    </Menu>
  );

  const onClickHamButton = () => {
    OnClickHamButton(!IsHamActive);
  };

  const onClickNoWood = () => {
    OnChangeNoWood(!IsNoWood);
  };

  const onClickTheme = () => {
    OnChangeTheme(Theme === ThemeType.Light ? ThemeType.Dark : ThemeType.Light);
  };

  const onClickMiniMap = () => {
    OnChangeMiniMap(!ShowMiniMap);
  };

  const onClickRotate = () => {
    OnRotateMap(!IsMapRotated);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.controller}>
          <Link to={IsHamActive ? '/' : '/setting'}>
            <HamButton IsActive={IsHamActive} OnClick={onClickHamButton} />
          </Link>
          <div>
            <span>地图类型：</span>
            <Dropdown overlay={mapTypeDropdown} placement="bottomCenter" arrow>
              <span className={`ant-dropdown-link ${styles['map-type-label']}`}>
                {MapType}
              </span>
            </Dropdown>
          </div>
          <div>
            <span>文明：</span>
            <Dropdown overlay={civilDropdown} placement="bottomCenter" arrow>
              <span className={`ant-dropdown-link ${styles['civil-label']}`}>
                {Civil}
              </span>
            </Dropdown>
          </div>
          <div>
            <span>无木之地：</span>
            <Switcher
              id="no-wood"
              type="ordinary"
              value={IsNoWood}
              onClick={onClickNoWood}
            />
          </div>
          <div>
            <span>显示模式：</span>
            <Switcher
              id="theme"
              type="daynight"
              value={Theme === ThemeType.Light}
              onClick={onClickTheme}
            />
          </div>
          <div>
            <span>小地图：</span>
            <Switcher
              id="mini-map"
              type="ordinary"
              value={ShowMiniMap}
              onClick={onClickMiniMap}
            />
          </div>
          <div>
            <span>旋转地图：</span>
            <Switcher
              id="rotate"
              type="ordinary"
              value={IsMapRotated}
              onClick={onClickRotate}
            />
          </div>
        </div>
        <div className={styles.operation}>
          <span>当前操作</span>
          <strong>{`${Operation}${
            OperationSub ? ' ' + OperationSub : ''
          }`}</strong>
        </div>
        <div className={styles.counter}>
          <div>
            <div>
              <span>普通住宅：</span>
              <strong>{Counter.OridinaryHouse}</strong>
              <span>个</span>
            </div>
            <div>
              <span>高级住宅：</span>
              <strong>{Counter.HighEndHouse}</strong>
              <span>个</span>
            </div>
          </div>
          <div>
            <div>
              <span>粮仓：</span>
              <strong>{Counter.Barn}</strong>
              <span>个</span>
            </div>
            <div>
              <span>货栈：</span>
              <strong>{Counter.Warehouse}</strong>
              <span>个</span>
            </div>
          </div>
          <div>
            <div>
              <span>农业：</span>
              <strong>{Counter.Agriculture}</strong>
              <span>/150个</span>
            </div>
            <div>
              <span>工业：</span>
              <strong>{Counter.Industry}</strong>
              <span>/100个</span>
            </div>
          </div>
          <div>
            <span>通用：</span>
            <strong>{Counter.General}</strong>
            <span>个</span>
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
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    IsHamActive: state.TopMenu.isHamActive,
    MapType: state.TopMenu.mapType,
    Civil: state.TopMenu.civil,
    IsNoWood: state.TopMenu.isNoWood,
    Theme: state.TopMenu.theme,
    ShowMiniMap: state.TopMenu.showMiniMap,
    IsMapRotated: state.TopMenu.isMapRotated,
    Operation: state.LeftMenu.operation,
    OperationSub: state.LeftMenu.operationSub,
    Counter: state.TopMenu.counter,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    OnClickHamButton: (isHamActive: boolean) => {
      dispatch(clickHamButton(isHamActive));
    },
    OnChangeMapType: (mapType: number) => {
      dispatch(changeMapType(mapType));
    },
    OnChangeCivil: (civil: CivilType) => {
      dispatch(changeCivil(civil));
    },
    OnChangeNoWood: (isNoWood: boolean) => {
      dispatch(changeNoWood(isNoWood));
    },
    OnChangeTheme: (theme: ThemeType) => {
      dispatch(changeTheme(theme));
    },
    OnChangeMiniMap: (showMiniMap: boolean) => {
      dispatch(changeMiniMap(showMiniMap));
    },
    OnRotateMap: (isMapRotated: boolean) => {
      dispatch(rotateMap(isMapRotated));
    },
  };
};

const TopMenuContainer = connect(mapStateToProps, mapDispatchToProps)(TopMenu);

export default TopMenuContainer;
