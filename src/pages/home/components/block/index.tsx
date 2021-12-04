import { Dropdown, Menu, Switch } from 'antd';
import React, { FC, useState } from 'react';

import { CivilType } from '@/types/civil';

import Displayer from '../displayer';
import styles from './index.less';

const data = [
  {
    id: '1',
    woodNum: 5,
    civil: CivilType.Aztec,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '2',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '3',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '4',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '5',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '6',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '7',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime(),
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '8',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: false,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
  {
    id: '9',
    woodNum: 5,
    civil: CivilType.Aztec,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: true,
    url: '',
    tags: ['前期'],
    author: '咕噜他命',
  },
];

interface BlockProps {
  type: 'popular' | 'like' | 'common';
  title: string;
}

const Block: FC<BlockProps> = props => {
  const { type, title } = props;

  const [mapType, setMapType] = useState('全部');

  const mapTypeDropdown = (
    <Menu
      style={{
        width: '4.8rem',
        textAlign: 'center',
      }}
      onClick={item => {
        setMapType(item.key);
      }}
    >
      {['全部', '5木', '4木', '3木'].map(v => {
        return <Menu.Item key={v}>{v}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <div className={styles.container}>
      <div className={styles['title-container']}>
        <div className={styles.title}>
          {title}
          <span className={styles.count}>10</span>
        </div>
        {type === 'common' && (
          <div className={styles.filter}>
            <div>
              <div className={styles['filter-title']}>地图类型</div>
              <Dropdown overlay={mapTypeDropdown} placement="bottomCenter">
                <span
                  className={`ant-dropdown-link ${styles['map-type-label']}`}
                >
                  {mapType}
                </span>
              </Dropdown>
            </div>
            <div>
              <div className={styles['filter-title']}>无木之地</div>
              <Switch size="small" />
            </div>
            <div>
              <div className={styles['filter-title']}>可编辑</div>
              <Switch size="small" />
            </div>
          </div>
        )}
      </div>
      <div className={styles.content}>
        {data.map(v => (
          <Displayer {...v} key={v.id} type={type} />
        ))}
      </div>
    </div>
  );
};

export default Block;
