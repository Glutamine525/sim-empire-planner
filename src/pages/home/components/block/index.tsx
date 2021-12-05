import { Dropdown, Empty, Menu, Switch } from 'antd';
import React, { FC, useMemo, useState } from 'react';

import { CivilType } from '@/types/civil';
import { IS_MOBILE } from '@/utils/config';

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
    woodNum: 4,
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
    woodNum: 4,
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
    isNoWood: true,
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
  const [isNoWood, setIsNoWood] = useState('全部');
  const [editable, setEditable] = useState(false);

  const selectedData = useMemo(() => {
    let selectedData = data.slice();
    if (['5', '4', '3'].includes(mapType.split('')[0])) {
      selectedData = selectedData.filter(
        v => v.woodNum === Number(mapType.split('')[0])
      );
    }
    if (isNoWood === '无木') {
      selectedData = selectedData.filter(v => v.isNoWood);
    } else if (isNoWood === '有木') {
      selectedData = selectedData.filter(v => !v.isNoWood);
    }
    if (editable) {
      selectedData = selectedData.filter(v => v.editable);
    }
    return selectedData;
  }, [mapType, isNoWood, editable]);

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

  const isNoWoodDropdown = (
    <Menu
      style={{
        width: '4.8rem',
        textAlign: 'center',
      }}
      onClick={item => {
        setIsNoWood(item.key);
      }}
    >
      {['全部', '有木', '无木'].map(v => {
        return <Menu.Item key={v}>{v}</Menu.Item>;
      })}
    </Menu>
  );

  return (
    <div className={styles.container}>
      <div className={styles['title-container']}>
        <div className={styles.title}>
          {title}
          <span className={styles.count}>{selectedData.length}</span>
        </div>
        {type === 'common' && (
          <div className={styles.filter}>
            <div>
              <div className={styles['filter-title']}>地图类型</div>
              <Dropdown
                overlay={mapTypeDropdown}
                placement="bottomCenter"
                arrow
              >
                <span className={styles.label}>{mapType}</span>
              </Dropdown>
            </div>
            <div>
              <div className={styles['filter-title']}>无木之地</div>
              <Dropdown
                overlay={isNoWoodDropdown}
                placement="bottomCenter"
                arrow
              >
                <span className={styles.label}>{isNoWood}</span>
              </Dropdown>
            </div>
            {!IS_MOBILE && (
              <div>
                <div className={styles['filter-title']}>可编辑</div>
                <Switch
                  size="small"
                  checked={editable}
                  onClick={checked => {
                    setEditable(checked);
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.content}>
        {selectedData.map(v => (
          <Displayer {...v} key={v.id} type={type} />
        ))}
      </div>
      {!selectedData.length && (
        <div className={styles['empty-container']}>
          {!IS_MOBILE && <div className={styles.splitter}></div>}
          <Empty description={<span>暂无数据</span>} />
          {!IS_MOBILE && <div className={styles.splitter}></div>}
        </div>
      )}
    </div>
  );
};

export default Block;
