import { Select, Switch } from 'antd';
import React, { FC, useState } from 'react';

import { CivilType } from '@/types/civil';

import Displayer from '../displayer';
import styles from './index.less';

const { Option } = Select;

const data = [
  {
    id: '1',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: false,
    url: '',
    tags: ['前期', '有税'],
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
    tags: ['前期', '有税'],
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
    tags: ['前期', '有税'],
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
    tags: ['前期', '有税'],
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
    tags: ['前期', '有税'],
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
    tags: ['前期', '有税'],
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
    tags: ['前期', '有税'],
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
    tags: ['前期', '有税'],
  },
  {
    id: '9',
    woodNum: 5,
    civil: CivilType.China,
    isNoWood: false,
    like: 10,
    liked: true,
    uploadTime: new Date().getTime() - 200000,
    editable: true,
    url: '',
    tags: ['前期', '有税'],
  },
];

interface BlockProps {
  type: 'popular' | 'like' | 'common';
  title: string;
}

const Block: FC<BlockProps> = props => {
  const { type, title } = props;

  const [woodNum, setWoodNum] = useState('all');
  const [period, setPeriod] = useState('all');

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
              <Select
                value={woodNum}
                size="small"
                bordered={false}
                style={{ width: 70 }}
                onChange={v => setWoodNum(v)}
              >
                <Option value="all">全部</Option>
                <Option value="5">5木</Option>
                <Option value="4">4木</Option>
                <Option value="3">3木</Option>
              </Select>
            </div>
            <div>
              <div className={styles['filter-title']}>游戏阶段</div>
              <Select
                value={period}
                size="small"
                bordered={false}
                style={{ width: 70 }}
                onChange={v => setPeriod(v)}
              >
                <Option value="all">全部</Option>
                <Option value="early">前期</Option>
                <Option value="later">后期</Option>
              </Select>
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
