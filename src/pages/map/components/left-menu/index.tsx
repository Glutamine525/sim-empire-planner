import {
  changeCivil,
  changeHamButton,
  changeIsImportingData,
  changeIsLoading,
  changeMapType,
  changeNoWood,
  changeOperation,
  changePanelTab,
} from '@/actions';
import MenuIcon from '@/components/menu-icon';
import DragUpload from '@/pages/map/components/left-menu/components/drag-upload';
import {
  BorderStyleType,
  Building,
  CatalogType,
  CivilBuilding,
  GeneralBuilding,
  SimpleBuilding,
} from '@/types/building';
import { BuildingColor } from '@/types/building-color';
import { CivilType } from '@/types/civil';
import { Counter } from '@/types/couter';
import { OperationType } from '@/types/operation';
import { Cells } from '@/utils/cells';
import { base64ToString } from '@/utils/file';
import { Menu, message, Modal } from 'antd';
import md5 from 'md5';
import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

const { SubMenu } = Menu;

const KEYS = 'asdqwerzxcv1234567890';

interface LeftMenuProps {
  isHamActive: boolean;
  mapType: number;
  civil: CivilType;
  isMapRotated: boolean;
  operation: OperationType;
  copiedBuilding: Building;
  counter: Counter;
  specials: SimpleBuilding[];
  onChangeHamButton: any;
  onChangeOperation: (a0: OperationType, a1: string, a2: Building) => void;
  onChangeIsLoading: any;
  onChangeMapType: any;
  onChangeCivil: any;
  onChangeNoWood: any;
  onChangeIsImportingData: any;
  onChangePanelTab: any;
}

const cells = Cells.getInstance();

const LeftMenu: FC<LeftMenuProps> = (props: LeftMenuProps) => {
  const {
    isHamActive,
    mapType,
    civil,
    isMapRotated,
    operation,
    copiedBuilding,
    counter,
    specials,
    onChangeHamButton,
    onChangeOperation,
    onChangeIsLoading,
    onChangeMapType,
    onChangeCivil,
    onChangeNoWood,
    onChangeIsImportingData,
    onChangePanelTab,
  } = props;

  const isHamActiveRef = useRef<boolean>();
  isHamActiveRef.current = isHamActive;

  const [showUpload, setShowUpload] = useState(false);
  const [uploadType, setUploadType] = useState('map');
  const [overflow, setOverflow] = useState('hidden');
  const [catalog, setCatalog] = useState(
    {} as { [key in CatalogType]: { sub: SimpleBuilding[] } }
  );

  const protection = useMemo(() => CivilBuilding[civil]['??????'], [civil]);

  useEffect(() => {
    setCatalog({
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: { sub: [] },
      ??????: {
        sub: GeneralBuilding,
      },
      ????????????: { sub: [] },
      ????????????: { sub: [] },
      ????????????: { sub: [] },
      ????????????: { sub: [] },
      ????????????: { sub: [] },
      ????????????: {
        sub: [{ name: '???????????????' }, { name: '????????????' }, { name: '??????' }],
      },
    });
    document.addEventListener('keydown', event => {
      if (isHamActiveRef.current) return;
      const { key } = event;
      if (key !== ' ') return;
      event.preventDefault();
      onChangeOperation(OperationType.Empty, '', {} as any);
    });
  }, []); // eslint-disable-line

  useEffect(() => {
    const newCatalog = {
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
      ??????: { sub: CivilBuilding[civil]['??????'] },
    };
    setCatalog((catalog: any) => ({
      ...catalog,
      ...newCatalog,
    }));
  }, [civil]);

  useEffect(() => {
    let newCatalog: any;
    if (specials.length) {
      const newSubs = specials.concat({ name: '??????????????????' });
      newCatalog = {
        ????????????: { sub: newSubs },
      };
    } else {
      newCatalog = {
        ????????????: { sub: [] },
      };
    }
    setCatalog((catalog: any) => ({
      ...catalog,
      ...newCatalog,
    }));
  }, [specials]);

  useEffect(() => {
    onChangeOperation(OperationType.Empty, '', {} as any);
  }, [mapType, civil]); // eslint-disable-line

  useEffect(() => {
    if (operation === OperationType.Watermark || !isMapRotated) return;
    onChangeOperation(OperationType.Empty, '', {} as any);
  }, [isMapRotated]); // eslint-disable-line

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
      Background,
      IsRoad,
      Color,
      FontSize,
      Shadow,
      IsDecoration,
      IsWonder,
    } = copiedBuilding;
    let keyPath = IsRoad ? [Catalog] : [Catalog, Name];
    dispatchBuilding(keyPath, {
      name: Name,
      text: Text,
      width: Width,
      height: Height,
      range: Range,
      color: Color,
      shadow: Shadow,
      background: Background,
      fontSize: FontSize,
      isRoad: IsRoad,
      isWonder: IsWonder,
      isDecoration: IsDecoration,
    });
  }, [copiedBuilding]); // eslint-disable-line

  useEffect(() => {
    const callback = (event: KeyboardEvent) => {
      if (isHamActive) return;
      if (isMapRotated) return;
      const { key, ctrlKey } = event;
      if (key !== 'c' || !ctrlKey) return;
      onChangeOperation(OperationType.Copying, '', {} as any);
    };
    document.addEventListener('keyup', callback);
    return () => document.removeEventListener('keyup', callback);
  }, [isHamActive, isMapRotated]); // eslint-disable-line

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const { key, ctrlKey } = event;
      if (key === 'Escape') {
        onChangeHamButton(!isHamActive);
        return;
      }
      if (isHamActive) return;
      if (isMapRotated && KEYS.includes(key)) {
        message.warning('????????????????????????????????????');
        return;
      }
      if (ctrlKey) return;
      const digits = Array.from(Array(10), (_, i) => i.toString());
      let keyPath: string[];
      let building: any;
      let parent: CatalogType = CatalogType.Road;
      let name: string = '';
      switch (key) {
        case 'a':
          keyPath = [CatalogType.Road];
          building = {
            name: '??????',
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
          name = '2x2??????';
          break;
        case 'w':
          parent = CatalogType.General;
          name = '3x3??????';
          break;
        case 'e':
          parent = CatalogType.General;
          name = '4x4??????';
          break;
        case 'r':
          parent = CatalogType.General;
          name = '5x5??????';
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
  }, [catalog, isHamActive, isMapRotated]); // eslint-disable-line

  const dispatchBuilding = (keyPath: string[], building: SimpleBuilding) => {
    onChangeOperation(OperationType.Placing, keyPath.join('-'), {
      Name: building.name,
      Text: building.text || '',
      Range: building.range || 0,
      Marker: 0,
      Catalog: keyPath[0] as CatalogType,
      IsFixed: false,
      IsBarrier: false,
      IsRoad: building.isRoad || false,
      IsProtection:
        keyPath[0] === CatalogType.Municipal &&
        protection.includes(building.name),
      IsWonder:
        building.isWonder ||
        keyPath[0] === CatalogType.Wonder ||
        building.isPalace ||
        false,
      IsDecoration:
        building.isDecoration || keyPath[0] === CatalogType.Decoration,
      IsGeneral: keyPath[0] === CatalogType.General,
      // css
      Width: building.size || building.width || 1,
      Height: building.size || building.height || 1,
      Color: building.color || '#000000',
      Shadow: building.shadow || '#ffffff',
      FontSize: building.fontSize || 1.4,
      Background: building.background || '#ffffff',
      BorderColor: '#000000',
      BorderWidth: 0.1,
      BorderTStyle: BorderStyleType.Solid,
      BorderRStyle: BorderStyleType.Solid,
      BorderBStyle: BorderStyleType.Solid,
      BorderLStyle: BorderStyleType.Solid,
    });
  };

  const onClick = (e: any) => {
    console.log('[on click left menu]', e);
    const keyPath = e.key.split('@');
    if (
      isMapRotated &&
      ![
        CatalogType.Watermark,
        CatalogType.Cancel,
        CatalogType.ImportExport,
      ].includes(keyPath[0])
    ) {
      message.warning('????????????????????????????????????');
      return;
    }
    let building: SimpleBuilding;
    if (keyPath.length === 1 || keyPath[0] === '????????????') {
      switch (keyPath[keyPath.length - 1]) {
        case '??????':
          building = {
            name: '??????',
            text: '',
            size: 1,
            range: 0,
            color: BuildingColor.Black,
            background: '#fdfebd',
            isRoad: true,
          };
          break;
        case '????????????':
          onChangeHamButton(true);
          onChangePanelTab('tab-1');
          return;
        case '????????????':
          onChangeOperation(OperationType.Empty, '', {} as any);
          return;
        case '????????????':
          onChangeOperation(OperationType.Select, '', {} as any);
          return;
        case '????????????':
          onChangeOperation(OperationType.Delete, '', {} as any);
          return;
        case '????????????':
          onChangeOperation(OperationType.Watermark, '', {} as any);
          return;
        case '???????????????':
          setShowUpload(true);
          setUploadType('civil');
          return;
        case '????????????':
          const callback = () => {
            setShowUpload(true);
            setUploadType('map');
          };
          const { Total, Fixed, Road } = counter;
          if (Total - Fixed || Road - 1) {
            Modal.confirm({
              title: '??????',
              content:
                '?????????????????????????????????????????????????????????????????????????????????????????????????????????',
              centered: true,
              okText: '??????',
              cancelText: '??????',
              onOk: () => {
                callback();
              },
            });
          } else {
            callback();
          }
          return;
        case '??????':
          return;
        default:
          return;
      }
    } else if (
      keyPath[0] === '????????????' &&
      keyPath[keyPath.length - 1] === '??????????????????'
    ) {
      onChangeHamButton(true);
      onChangePanelTab('tab-1');
      return;
    } else {
      building = catalog[keyPath[0] as CatalogType].sub.find(
        (v: { name: string }) => v.name === keyPath[1]
      )!;
      building = { ...building, isRoad: false };
    }
    dispatchBuilding(keyPath, building);
  };

  const onMouseEnter = () => {
    setOverflow('auto');
  };

  const onMouseLeave = () => {
    setOverflow('hidden');
  };

  const onImportTextData = (_data: any) => {
    try {
      const data = JSON.parse(base64ToString(_data));
      if (!data) {
        message.error('???????????????????????????????????????');
        return;
      }
      if (uploadType === 'civil') {
        return;
      }
      const dataMD5 = data.md5;
      delete data.md5;
      if (dataMD5 !== md5(JSON.stringify(data))) {
        message.error('???????????????????????????????????????');
        return;
      }
      if (
        typeof data.woodNum === 'undefined' ||
        typeof data.civil === 'undefined' ||
        typeof data.isNoWood === 'undefined' ||
        typeof data.roads === 'undefined' ||
        typeof data.buildings === 'undefined'
      ) {
        message.error('?????????????????????????????????????????????');
        return;
      }
      onChangeIsLoading(true);
      onChangeIsImportingData(true);
      onChangeMapType(Number(data.woodNum));
      onChangeCivil(data.civil);
      onChangeNoWood(data.isNoWood);
      cells.init(Number(data.woodNum), data.civil, data.isNoWood);
      data.roads.forEach((v: any) => {
        const { line, column } = v;
        cells.place(
          {
            Name: '??????',
            Text: '',
            Range: 0,
            Catalog: '??????' as CatalogType,
            Marker: 0,
            IsBarrier: false,
            IsDecoration: false,
            IsFixed: false,
            IsGeneral: false,
            IsProtection: false,
            IsRoad: true,
            IsWonder: false,
            Width: 1,
            Height: 1,
            FontSize: 1.4,
            Background: '#fdfebd',
            BorderColor: '#000000',
            BorderWidth: 0.1,
            Color: '#000000',
            Shadow: '#ffffff',
            BorderTStyle: 'solid' as BorderStyleType,
            BorderBStyle: 'solid' as BorderStyleType,
            BorderRStyle: 'solid' as BorderStyleType,
            BorderLStyle: 'solid' as BorderStyleType,
          },
          line,
          column
        );
      });
      data.buildings.forEach((v: any) => {
        cells.place(
          {
            Name: v.name,
            Text: v.text,
            Range: v.range,
            Catalog: v.catagory as CatalogType,
            Marker: 0,
            IsBarrier: false,
            IsDecoration: v.isDecoration,
            IsFixed: false,
            IsGeneral: v.isGeneral,
            IsProtection: v.isProtection,
            IsRoad: false,
            IsWonder:
              v.isMiracle ||
              (v.catagory === '??????' && ['??????', '??????'].includes(v.name)),
            Width: v.width,
            Height: v.height,
            Color: v.color,
            Shadow: v.shadow || '#ffffff',
            FontSize: 1.4,
            Background: v.background,
            BorderColor: '#000000',
            BorderWidth: 0.1,
            BorderTStyle: 'solid' as BorderStyleType,
            BorderBStyle: 'solid' as BorderStyleType,
            BorderRStyle: 'solid' as BorderStyleType,
            BorderLStyle: 'solid' as BorderStyleType,
          },
          v.line,
          v.column
        );
      });
      setShowUpload(false);
      setTimeout(() => {
        let event: any = new Event('import');
        event.cmd = 'repaint';
        document.dispatchEvent(event);
      }, 10);
    } catch (_) {
      message.error('????????????????????????');
    }
  };

  const onImportImageData = (_data: any) => {};

  return (
    <aside className={`left-menu ${styles.wrapper}`}>
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
          style={
            'backdrop-filter' in document.documentElement.style
              ? { backdropFilter: 'blur(1.5rem)' }
              : { background: 'var(--border-lighter)' }
          }
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
                        <Menu.Item
                          key={`${v}@${w.name}`}
                          style={{ whiteSpace: 'pre' }}
                        >
                          {`${
                            v === CatalogType.Special &&
                            w.name === '??????????????????'
                              ? '  '
                              : index + 1 + '.'
                          } ${w.name}`}
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
      <DragUpload
        show={showUpload}
        type={uploadType as any}
        onImportTextData={onImportTextData}
        onImportImageData={onImportImageData}
        onClickMask={() => {
          setShowUpload(false);
        }}
      />
    </aside>
  );
};

const mapStateToProps = (state: any) => {
  return {
    isHamActive: state.TopMenu.isHamActive,
    mapType: state.TopMenu.mapType,
    civil: state.TopMenu.civil,
    isMapRotated: state.TopMenu.isMapRotated,
    operation: state.LeftMenu.operation,
    copiedBuilding: state.Chessboard.copiedBuilding,
    counter: state.Chessboard.counter,
    specials: state.Panel.specials,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onChangeHamButton: (isHamActive: boolean) => {
      dispatch(changeHamButton(isHamActive));
    },
    onChangeOperation: (
      operation: OperationType,
      operationSub: string,
      buildingConfig: Building
    ) => {
      dispatch(changeOperation(operation, operationSub, buildingConfig));
    },
    onChangeIsLoading: (isLoading: boolean) => {
      dispatch(changeIsLoading(isLoading));
    },
    onChangeMapType: (mapType: number) => {
      dispatch(changeMapType(mapType));
    },
    onChangeCivil: (civil: CivilType) => {
      dispatch(changeCivil(civil));
    },
    onChangeNoWood: (isNoWood: boolean) => {
      dispatch(changeNoWood(isNoWood));
    },
    onChangeIsImportingData: (isImportingData: boolean) => {
      dispatch(changeIsImportingData(isImportingData));
    },
    onChangePanelTab: (tab: string) => {
      dispatch(changePanelTab(tab));
    },
  };
};

const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu);

export default LeftMenuContainer;
