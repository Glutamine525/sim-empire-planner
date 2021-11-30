import { Select } from 'antd';
import React, { FC, useState } from 'react';

import Displayer from '../displayer';
import styles from './index.less';

const { Option } = Select;

interface BlockProps {
  type: 'popular' | 'common';
  title: string;
}

const Block: FC<BlockProps> = props => {
  const { type, title } = props;

  const [woodNum, setWoodNum] = useState('all');
  const [period, setPeriod] = useState('all');

  return (
    <div className={styles.container}>
      <div className={styles['title-container']}>
        <div className={styles.title}>{title}</div>
        {type === 'common' && (
          <div className={styles.select}>
            <div>
              <div className={styles['select-title']}>地图类型</div>
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
              <div className={styles['select-title']}>游戏阶段</div>
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
          </div>
        )}
      </div>
      <div className={styles.content}>
        <Displayer />
        <Displayer />
        <Displayer />
        <Displayer />
        <Displayer />
        <Displayer />
        <Displayer />
        <Displayer />
        <Displayer />
      </div>
    </div>
  );
};

export default Block;
