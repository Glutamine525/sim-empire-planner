import MenuIcon from '@/components/menu-icon';
import { Building } from '@/types/building';
import { CivilType } from '@/types/civil';
import { Menu } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

const { SubMenu } = Menu;

interface LeftMenuProps {
  Civil: CivilType;
}

const LeftMenu: FC<LeftMenuProps> = (props: LeftMenuProps) => {
  const { Civil } = props;

  const [overflow, setOverflow] = useState('hidden');
  const [catalog, setCatalog] = useState({} as any);

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
      住宅: { sub: Building[Civil]['住宅'] },
      农业: { sub: Building[Civil]['农业'] },
      工业: { sub: Building[Civil]['工业'] },
      商业: { sub: Building[Civil]['商业'] },
      市政: { sub: Building[Civil]['市政'] },
      文化: { sub: Building[Civil]['文化'] },
      宗教: { sub: Building[Civil]['宗教'] },
      军事: { sub: Building[Civil]['军事'] },
      美化: { sub: Building[Civil]['美化'] },
      奇迹: { sub: Building[Civil]['奇迹'] },
    };
    setCatalog((catalog: any) => ({
      ...catalog,
      ...newCatalog,
    }));
  }, [Civil]);

  const onClick = (e: any) => {
    console.log('click', e);
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
          {Object.keys(catalog).map((v: any) => {
            const icon = (
              <MenuIcon src={require(`@/images/${v}.png`).default} alt={v} />
            );

            return !catalog[v].sub.length ? (
              <Menu.Item key={v} icon={icon}>
                {v}
              </Menu.Item>
            ) : (
              <SubMenu key={v} icon={icon}>
                <Menu.ItemGroup title={v}>
                  {catalog[v].sub.map((w: any, index: number) => {
                    return (
                      <Menu.Item key={w.name}>
                        {`${index + 1}. ${w.name}`}
                      </Menu.Item>
                    );
                  })}
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
  return {};
};

const LeftMenuContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftMenu);
export default LeftMenuContainer;
