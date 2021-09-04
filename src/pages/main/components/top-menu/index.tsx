import Switcher from '@/components/switcher';
import React, { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CivilType } from '@/types/civil';
import { OperationNameMap, OperationType } from '@/types/operation';
import { Counter } from '@/types/couter';
import styles from './index.less';
import { connect } from 'react-redux';
import { changeDisplay } from '@/actions';
import { ThemeType } from '@/types/theme';

interface TopMenuProps {
  Theme: ThemeType;
  OnClickDisplay: any;
}

const TopMenu: FC<TopMenuProps> = (props: TopMenuProps) => {
  const { Theme, OnClickDisplay } = props;

  const [mapType, setMapType] = useState(5);
  const [civil, setCivil] = useState<CivilType>('China');
  const [isNoWood, setIsNoWood] = useState(false);
  const [isLightTheme, setIsLightTheme] = useState(true);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isRotated, setIsRotated] = useState(false);
  const [operation, setOperation] = useState<OperationType>('Empty');
  const [counter, setCounter] = useState<Counter>({
    OridinaryHouse: 0,
    HighEndHouse: 0,
    Barn: 0,
    Warehouse: 0,
    Agriculture: 0,
    Industry: 0,
    General: 0,
  });

  useEffect(() => {
    setIsLightTheme(Theme === 'Light');
  }, []);

  const onClickNoWood = () => {
    const newVal = !isNoWood;
    setIsNoWood(newVal);
  };

  const onClickDisplay = () => {
    const newVal = !isLightTheme;
    setIsLightTheme(newVal);
    OnClickDisplay(newVal ? 'Light' : 'Dark');
  };

  const onClickMiniMap = () => {
    const newVal = !showMiniMap;
    setShowMiniMap(newVal);
  };

  const onClickRotate = () => {
    const newVal = !isRotated;
    setIsRotated(newVal);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.controller}>
          <Link to="/setting">
            <img width={24} height={24} />
          </Link>
          <div>
            <span>地图类型：</span>
          </div>
          <div>
            <span>文明：</span>
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
              id="display"
              type="daynight"
              value={isLightTheme}
              onClick={onClickDisplay}
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
              value={isRotated}
              onClick={onClickRotate}
            />
          </div>
        </div>
        <div className={styles.operation}>
          <span>当前操作</span>
          <strong>{OperationNameMap[operation]}</strong>
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
            <span>通用：</span>
            <strong>{counter.General}</strong>
            <span>个</span>
          </div>
        </div>
        <div className={styles.helper}>?</div>
        <div className={styles.version}>
          <div>
            <span>模拟帝国地图编辑器 </span>
            <strong>V2.6.0</strong>
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
    Theme: state.TopMenu.theme,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    OnClickDisplay: (theme: ThemeType) => {
      dispatch(changeDisplay(theme));
    },
  };
};

const TopMenuContainer = connect(mapStateToProps, mapDispatchToProps)(TopMenu);

export default TopMenuContainer;
