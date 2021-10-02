import { changeOperation } from '@/actions';
import MenuIcon from '@/components/menu-icon';
import {
  BorderStyleType,
  Building,
  CatalogType,
  CivilBuilding,
  GeneralBuilding,
} from '@/types/building';
import { BuildingColor } from '@/types/building-color';
import { CivilType } from '@/types/civil';
import { OperationType } from '@/types/operation';
import { Menu } from 'antd';
import React, { FC, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

const { SubMenu } = Menu;

interface LeftMenuProps {
  mapType: number;
  civil: CivilType;
  copiedBuilding: Building;
  onChangeOperation: (a0: OperationType, a1: string, a2: Building) => void;
}

const LeftMenu: FC<LeftMenuProps> = (props: LeftMenuProps) => {
  const { mapType, civil, copiedBuilding, onChangeOperation } = props;

  const [overflow, setOverflow] = useState('hidden');
  const [catalog, setCatalog] = useState(
    {} as { [key in CatalogType]: { sub: any[] } }
  );

  const protection = useMemo(() => CivilBuilding[civil]['防护'], [civil]);

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
        sub: GeneralBuilding,
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
    document.addEventListener('keydown', event => {
      const { key } = event;
      if (key !== ' ') return;
      event.preventDefault();
      onChangeOperation(OperationType.Empty, '', {} as any);
    });
    document.addEventListener('keyup', event => {
      const { key, ctrlKey } = event;
      if (key !== 'c' || !ctrlKey) return;
      onChangeOperation(OperationType.Copying, '', {} as any);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    const newCatalog = {
      住宅: { sub: CivilBuilding[civil]['住宅'] },
      农业: { sub: CivilBuilding[civil]['农业'] },
      工业: { sub: CivilBuilding[civil]['工业'] },
      商业: { sub: CivilBuilding[civil]['商业'] },
      市政: { sub: CivilBuilding[civil]['市政'] },
      文化: { sub: CivilBuilding[civil]['文化'] },
      宗教: { sub: CivilBuilding[civil]['宗教'] },
      军事: { sub: CivilBuilding[civil]['军事'] },
      美化: { sub: CivilBuilding[civil]['美化'] },
      奇迹: { sub: CivilBuilding[civil]['奇迹'] },
    };
    setCatalog((catalog: any) => ({
      ...catalog,
      ...newCatalog,
    }));
  }, [civil]);

  useEffect(() => {
    onChangeOperation(OperationType.Empty, '', {} as any);
  }, [mapType, civil]); // eslint-disable-line

  useEffect(() => {
    if (!Object.keys(copiedBuilding).length) {
      onChangeOperation(OperationType.Empty, '', {} as any);
      return;
    }
    const {
      Catalog,
      Name,
      Text,
      Width,
      Height,
      Range,
      Color,
      Background,
      IsRoad,
    } = copiedBuilding;
    let keyPath = IsRoad ? [Catalog] : [Catalog, Name];
    dispatchBuilding(keyPath, {
      name: Name,
      text: Text,
      width: Width,
      height: Height,
      range: Range,
      color: Color,
      background: Background,
      isRoad: IsRoad,
    });
  }, [copiedBuilding]); // eslint-disable-line

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey } = event;
      const digits = Array.from(Array(10), (_, i) => i.toString());
      if (ctrlKey) return;
      let keyPath: string[];
      let building: any;
      let parent: CatalogType = CatalogType.Road;
      let name: string = '';
      switch (key) {
        case 'a':
          keyPath = [CatalogType.Road];
          building = {
            name: '道路',
            text: '',
            size: 1,
            range: 0,
            color: BuildingColor.Black,
            background: '#fdfebd',
            isRoad: true,
          };
          dispatchBuilding(keyPath, building);
          return;
        case 's':
          onChangeOperation(OperationType.Select, '', {} as any);
          break;
        case 'd':
          onChangeOperation(OperationType.Delete, '', {} as any);
          break;
        case 'z':
          if (protection.length < 1) return;
          parent = CatalogType.Municipal;
          name = protection[0];
          break;
        case 'x':
          if (protection.length < 2) return;
          parent = CatalogType.Municipal;
          name = protection[1];
          break;
        case 'c':
          if (protection.length < 3) return;
          parent = CatalogType.Municipal;
          name = protection[2];
          break;
        case 'v':
          if (protection.length < 4) return;
          parent = CatalogType.Municipal;
          name = protection[3];
          break;
        case 'q':
          parent = CatalogType.General;
          name = '2x2建筑';
          break;
        case 'w':
          parent = CatalogType.General;
          name = '3x3建筑';
          break;
        case 'e':
          parent = CatalogType.General;
          name = '4x4建筑';
          break;
        case 'r':
          parent = CatalogType.General;
          name = '5x5建筑';
          break;
        default:
          break;
      }
      if (digits.includes(key)) {
        parent = CatalogType.Commerce;
        const index = +key - 1 >= 0 ? +key - 1 : 9;
        if (catalog[parent].sub.length <= index) return;
        name = catalog[parent].sub[index].name;
      }
      if (parent === CatalogType.Road) return;
      keyPath = [parent, name];
      building = catalog[parent].sub.find(v => v.name === name);
      building && dispatchBuilding(keyPath, building);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [catalog]); // eslint-disable-line

  const dispatchBuilding = (keyPath: string[], building: any) => {
    onChangeOperation(OperationType.Placing, keyPath.join('-'), {
      Name: building.name,
      Text: building.text,
      Range: building.range,
      Marker: 0,
      Catalog: keyPath[0] as CatalogType,
      IsFixed: false,
      IsBarrier: false,
      IsRoad: building.isRoad,
      IsProtection:
        keyPath[0] === CatalogType.Municipal &&
        protection.includes(building.name),
      IsWonder:
        keyPath[0] === CatalogType.Wonder ||
        typeof building.isPalace !== 'undefined',
      IsDecoration: keyPath[0] === CatalogType.Decoration,
      IsGeneral: keyPath[0] === CatalogType.General,
      // css
      Width: building.size || building.width,
      Height: building.size || building.height,
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
          onChangeOperation(OperationType.Empty, '', {} as any);
          return;
        case '选中建筑':
          onChangeOperation(OperationType.Select, '', {} as any);
          return;
        case '删除建筑':
          onChangeOperation(OperationType.Delete, '', {} as any);
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
    dispatchBuilding(e.keyPath, building);
  };

  const onMouseEnter = () => {
    setOverflow('auto');
  };

  const onMouseLeave = () => {
    setOverflow('hidden');
  };

  return (
    <aside className={styles.wrapper}>
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
    </aside>
  );
};

const mapStateToProps = (state: any) => {
  return {
    mapType: state.TopMenu.mapType,
    civil: state.TopMenu.civil,
    copiedBuilding: state.Chessboard.copiedBuilding,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeOperation: (
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
