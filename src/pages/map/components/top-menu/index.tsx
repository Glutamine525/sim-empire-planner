import Switcher from '@/components/switcher';
import React from 'react';
import { CivilArray, CivilType } from '@/types/civil';
import styles from './index.less';
import { ThemeType } from '@/types/theme';
import { Dropdown, Menu, Modal, Tooltip } from 'antd';
import { EMAIL, LENGTH, MINOR_PATCH, VERSION } from '@/utils/config';
import { copyLink } from '@/utils/browser';
import { BuildingFixed } from '@/types/building-fixed';
import { useAppCreators, useMapCreators, useValue } from '@/utils/hook';
import { MapAction } from '@/state';
import { AppAction } from '@/state/reducers/app';

const helper = () => {
  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <strong>建议使用Chrome浏览器访问</strong>
      </div>
      <div className={styles['helper-splitter']}></div>
      <div style={{ textAlign: 'center' }}>
        <strong>快捷键</strong>
      </div>
      <div>- 空格: 取消操作</div> <div>- A: 道路</div>
      <div>- S: 选中建筑</div> <div>- D: 删除建筑</div>
      <div>- ZXC(V): 三(四)防建筑</div>
      <div>- QWER: 2x2 3x3 4x4 5x5 通用建筑</div>
      <div>- 1234567890: 对应的10个商业建筑</div>
      <div>- ESC：打开/关闭 面板</div>
      <div className={styles['helper-splitter']}></div>
      <div style={{ textAlign: 'center' }}>
        <strong>其它操作</strong>
      </div>
      <div>- 左键双击住宅建筑可以查询需求结果</div>
      <div>- 查询需求结果里的建筑可以选中</div>
      <div>- 右键双击建筑可以删除建筑</div>
      <div>- 使用相同大小的建筑可以覆盖通用建筑</div>
      <div>- 按住Ctrl键可以在任何时候拖动地图</div>
      <div>- 鼠标悬停在建筑上，Ctrl+C可以复制建筑</div>
      <div className={styles['helper-splitter']}></div>
      <div style={{ textAlign: 'center' }}>
        <strong>注意事项</strong>
      </div>
      <div>- 在「水印模式」下截图才会添加编辑者水印</div>
      <div>- 旋转地图开启后，只能添加水印或截图</div>
      <div className={styles['helper-splitter']}></div>
      <div style={{ textAlign: 'center' }}>
        模拟帝国地图编辑器 <strong>{`V${VERSION}.${MINOR_PATCH}`}</strong>
      </div>
      <div style={{ textAlign: 'center' }}>
        作者邮箱:{' '}
        <strong className={styles.link} onClick={() => copyLink(EMAIL)}>
          {EMAIL}
        </strong>
      </div>
    </div>
  );
};

export default function TopMenu() {
  const { theme } = useValue<AppAction>(state => state.app);
  const {
    mapType,
    civil,
    isNoWood,
    showMiniMap,
    isMapRotated,
    counter,
    operation,
    operationSub,
  } = useValue<MapAction>(state => state.map);

  const { changeIsLoading, changeTheme } = useAppCreators();
  const {
    changeMapType,
    changeCivil,
    changeNoWood,
    changeMiniMap,
    changeRotateMap,
  } = useMapCreators();

  const mapTypeDropdown = (
    <Menu
      style={{
        width: '4.8rem',
        textAlign: 'center',
      }}
      onClick={async item => {
        const { key } = item;
        if (Number(key) === mapType) return;
        const { Total, Fixed, Road } = counter;
        const callback = () => {
          changeIsLoading(true);
          changeMapType(Number(key));
        };
        if (Total - Fixed || Road - 1) {
          Modal.confirm({
            title: '警告',
            content:
              '当前地图内仍有放置的建筑，更换地图类型后将删除所有建筑，是否确定更换？',
            centered: true,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              callback();
            },
          });
        } else {
          callback();
        }
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
        if (key === civil) return;
        const { Total, Fixed, Road } = counter;
        const callback = () => {
          changeIsLoading(true);
          changeCivil(key as CivilType);
        };
        if (Total - Fixed || Road - 1) {
          Modal.confirm({
            title: '警告',
            content:
              '当前地图内仍有放置的建筑，更换文明后将删除所有建筑，是否确定更换？',
            centered: true,
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
              callback();
            },
          });
        } else {
          callback();
        }
      }}
    >
      {CivilArray.map(v => {
        return <Menu.Item key={v}>{v}</Menu.Item>;
      })}
    </Menu>
  );

  const onClickNoWood = () => {
    changeIsLoading(true);
    changeNoWood(!isNoWood);
  };

  const onClickTheme = () => {
    changeIsLoading(true);
    changeTheme(theme === ThemeType.Light ? ThemeType.Dark : ThemeType.Light);
  };

  const onClickMiniMap = () => {
    changeMiniMap(!showMiniMap);
  };

  const onClickRotateMap = () => {
    changeRotateMap(!isMapRotated);
  };

  return (
    <nav className={styles.wrapper}>
      <div
        className={styles.container}
        style={
          'backdrop-filter' in document.documentElement.style
            ? {
                backdropFilter: 'blur(1.5rem)',
                textShadow: Array(10)
                  .fill('var(--border-base) 0 0 0.1rem')
                  .join(','),
              }
            : { background: 'var(--border-lighter)' }
        }
      >
        <div className={styles.controller}>
          <div style={{ width: '4rem', height: '4rem' }}></div>
          <div>
            <span> 地图类型：</span>
            <Dropdown overlay={mapTypeDropdown} placement="bottomCenter" arrow>
              <span className={`ant-dropdown-link ${styles['map-type-label']}`}>
                {mapType}
              </span>
            </Dropdown>
          </div>
          <div>
            <span> 文明：</span>
            <Dropdown overlay={civilDropdown} placement="bottomCenter" arrow>
              <span className={`ant-dropdown-link ${styles['civil-label']}`}>
                {civil}
              </span>
            </Dropdown>
          </div>
          <div>
            <span> 无木之地：</span>
            <Switcher
              id="no-wood"
              type="ordinary"
              value={isNoWood}
              onClick={onClickNoWood}
            />
          </div>
          <div>
            <span> 显示模式：</span>
            <Switcher
              id="theme"
              type="daynight"
              value={theme === ThemeType.Light}
              onClick={onClickTheme}
            />
          </div>
          <div>
            <span> 小地图：</span>
            <Switcher
              id="mini-map"
              type="ordinary"
              value={showMiniMap}
              onClick={onClickMiniMap}
            />
          </div>
          <div>
            <span> 旋转地图：</span>
            <Switcher
              id="rotate"
              type="ordinary"
              value={isMapRotated}
              onClick={onClickRotateMap}
            />
          </div>
        </div>
        <div className={styles.operation}>
          <span> 当前操作 </span>
          <strong>
            {` ${operation}${operationSub ? ' ' + operationSub : ''} `}
          </strong>
        </div>
        <div className={styles.counter}>
          <div>
            <div>
              <span> 普通住宅：</span>
              <strong>{counter.OridinaryHouse}</strong>
              <span>个 </span>
            </div>
            <div>
              <span> 高级住宅：</span>
              <strong>{counter.HighEndHouse}</strong>
              <span>个 </span>
            </div>
          </div>
          <div>
            <div>
              <span> 粮仓：</span>
              <strong>{counter.Barn}</strong>
              <span>个 </span>
            </div>
            <div>
              <span> 货栈：</span>
              <strong>{counter.Warehouse}</strong>
              <span>个 </span>
            </div>
          </div>
          <div>
            <div>
              <span> 农业：</span>
              <strong>{counter.Agriculture}</strong>
              <span>/150个</span>
            </div>
            <div>
              <span> 工业：</span>
              <strong>{counter.Industry}</strong>
              <span>/100个 </span>
            </div>
          </div>
          <div>
            <div>
              <span> 通用：</span>
              <strong>{counter.General}</strong>
              <span>个 </span>
            </div>
            <div>
              <span> 总计：</span>
              <strong>{counter.Total}</strong>
              <span>个 </span>
            </div>
          </div>
          <div>
            <div>
              <span> 道路：</span>
              <strong>{counter.Road}</strong>
              <span>个 </span>
            </div>
            <div>
              <span> 覆盖率：</span>
              <strong>
                {Math.round(
                  (counter.OccupiedCells * 100) /
                    (2 * (LENGTH / 2 - 1) ** 2 -
                      BuildingFixed.water[mapType - 3].length -
                      BuildingFixed.mountain[mapType - 3].length -
                      (isNoWood ? 0 : BuildingFixed.tree[mapType - 3].length))
                )}
              </strong>
              <span>% </span>
            </div>
          </div>
        </div>
        <Tooltip
          placement="bottom"
          title={helper}
          overlayInnerStyle={{
            borderRadius: 8,
            fontSize: '1.2rem',
            color: 'var(-text-regular)',
            whiteSpace: 'nowrap',
            width: 'max-content',
          }}
        >
          <div className={styles.helper}>?</div>
        </Tooltip>
        <div className={styles.account}>
          <div className={styles.login}> 登录 </div>
        </div>
      </div>
    </nav>
  );
}
