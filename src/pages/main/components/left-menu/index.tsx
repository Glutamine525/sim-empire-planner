import { changeOperation } from '@/actions';
import MenuIcon from '@/components/menu-icon';
import {
  BorderStyleType,
  Building,
  CatalogType,
  CivilBuilding,
} from '@/types/building';
import { BuildingColor } from '@/types/building-color';
import { CivilType } from '@/types/civil';
import { OperationType } from '@/types/operation';
import { Menu } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

const { SubMenu } = Menu;

interface LeftMenuProps {
  Civil: CivilType;
  OnChangeOperation: (a0: OperationType, a1: string, a2: Building) => void;
}

const LeftMenu: FC<LeftMenuProps> = (props: LeftMenuProps) => {
  const { Civil, OnChangeOperation } = props;

  const [overflow, setOverflow] = useState('hidden');
  const [catalog, setCatalog] = useState(
    {} as { [key in CatalogType]: { sub: any[] } }
  );

  useEffect(() => {
    setCatalog({
      道路: { sub: [] },
      住宅: { sub: [] },
      农业: { sub: [] },
      工业: { sub: [] },
      商业: { sub: [] },
      市政: { sub: [] },
      文化: { sub: [] },
      宗教: { sub: [] },
      军事: { sub: [] },
      美化: { sub: [] },
      奇迹: { sub: [] },
      通用: {
        sub: [
          { name: '2x2建筑' },
          { name: '3x3建筑' },
          { name: '4x4建筑' },
          { name: '5x5建筑' },
        ],
      },
      特殊建筑: { sub: [] },
      取消操作: { sub: [] },
      选中建筑: { sub: [] },
      删除建筑: { sub: [] },
      导入导出: {
        sub: [
          { name: '导入新文明' },
          { name: '导入地图数据' },
          { name: '导出地图数据' },
          { name: '截图' },
        ],
      },
    });
  }, []);

  useEffect(() => {
    const newCatalog = {
      住宅: { sub: CivilBuilding[Civil]['住宅'] },
      农业: { sub: CivilBuilding[Civil]['农业'] },
      工业: { sub: CivilBuilding[Civil]['工业'] },
      商业: { sub: CivilBuilding[Civil]['商业'] },
      市政: { sub: CivilBuilding[Civil]['市政'] },
      文化: { sub: CivilBuilding[Civil]['文化'] },
      宗教: { sub: CivilBuilding[Civil]['宗教'] },
      军事: { sub: CivilBuilding[Civil]['军事'] },
      美化: { sub: CivilBuilding[Civil]['美化'] },
      奇迹: { sub: CivilBuilding[Civil]['奇迹'] },
    };
    setCatalog((catalog: any) => ({
      ...catalog,
      ...newCatalog,
    }));
  }, [Civil]);

  const onClick = (e: any) => {
    console.log('[on click left menu]', e);
    e.keyPath.reverse();
    let building: any;
    if (e.keyPath.length === 1 || e.keyPath[0] === '导入导出') {
      switch (e.key as CatalogType) {
        case '道路':
          building = {
            name: '道路',
            text: '',
            size: 1,
            range: 0,
            color: BuildingColor.Black,
            background: '#fdfebd',
            isRoad: true,
          };
          break;
        case '取消操作':
          OnChangeOperation(OperationType.Empty, '', {} as any);
          return;
        case '选中建筑':
          return;
        case '删除建筑':
          return;
        case '导入导出':
          return;
        default:
          return;
      }
    } else {
      building = catalog[e.keyPath[0] as CatalogType].sub.find(
        (v: { name: string }) => v.name === e.key
      );
      building = { ...building, isRoad: false };
    }
    OnChangeOperation(OperationType.Placing, e.keyPath.join('-'), {
      Line: 0,
      Column: 0,
      Name: building.name,
      Text: building.text,
      Range: building.range,
      Marker: 0,
      Catalog: e.keyPath[0] as CatalogType,
      IsFixed: false,
      IsBarrier: false,
      IsRoad: building.isRoad,
      IsProtection:
        e.keyPath[0] === CatalogType.Municipal &&
        CivilBuilding[Civil]['防护'].includes(building.name),
      IsWonder: e.keyPath[0] === CatalogType.Wonder || building.isPalace,
      IsDecoration: e.keyPath[0] === CatalogType.Decoration,
      IsGeneral: e.keyPath[0] === CatalogType.General,
      // css
      Width: building.size,
      Height: building.size,
      Color: building.color,
      FontSize: 1.4,
      Background: building.background,
      BorderColor: 'black',
      BorderWidth: 0.1,
      BorderTStyle: BorderStyleType.Solid,
      BorderRStyle: BorderStyleType.Solid,
      BorderBStyle: BorderStyleType.Solid,
      BorderLStyle: BorderStyleType.Solid,
    });
  };

  const onMouseEnter = () => {
    setOverflow('auto');
  };

  const onMouseLeave = () => {
    setOverflow('hidden');
  };

  return (
    <div className={`left-menu ${styles.wrapper}`}>
      <div
        className={styles.container}
        style={{ overflow: overflow }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Menu
          onClick={onClick}
          mode="vertical"
          inlineCollapsed={true}
          className={styles.menu}
        >
          {Object.keys(catalog).map((v: string) => {
            const icon = (
              <MenuIcon src={require(`@/images/${v}.png`).default} alt={v} />
            );

            return !catalog[v as CatalogType].sub.length ? (
              <Menu.Item key={v} icon={icon}>
                {v}
              </Menu.Item>
            ) : (
              <SubMenu key={v} icon={icon}>
                <Menu.ItemGroup title={v}>
                  {catalog[v as CatalogType].sub.map(
                    (w: any, index: number) => {
                      return (
                        <Menu.Item key={w.name}>
                          {`${index + 1}. ${w.name}`}
                        </Menu.Item>
                      );
                    }
                  )}
                </Menu.ItemGroup>
              </SubMenu>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    Civil: state.TopMenu.civil,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    OnChangeOperation: (
      operation: OperationType,
      operationSub: string,
      buildingConfig: Building
    ) => {
      dispatch(changeOperation(operation, operationSub, buildingConfig));
    },
  };
};

const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu);

export default LeftMenuContainer;
