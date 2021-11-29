import { Table } from 'antd';
import React from 'react';

import styles from './index.less';

const columns = [
  {
    title: '序号',
    dataIndex: 'order',
    key: 'order',
    fixed: 'left' as any,
  },
  {
    title: '地图类型',
    dataIndex: 'mapType',
    key: 'mapType',
  },
  {
    title: '文明',
    dataIndex: 'civil',
    key: 'civil',
  },
  {
    title: '无木之地',
    dataIndex: 'isNoWood',
    key: 'isNoWood',
  },
  {
    title: '建筑总数',
    dataIndex: 'buildingCount',
    key: 'buildingCount',
  },
  {
    title: '道路总数',
    dataIndex: 'roadCount',
    key: 'roadCount',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '预览',
    dataIndex: 'preview',
    key: 'preview',
    fixed: 'right' as any,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    fixed: 'right' as any,
  },
];

const data = [] as any[];
for (let i = 0; i < 10; i++) {
  data.push({
    order: i,
    mapType: 3,
    civil: '中国',
    isNoWood: 'true',
    buildingCount: 0,
    roadCount: 0,
    time: new Date().getTime(),
  });
}

export default function Archive() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: '100%', y: 'calc(100vh - 5.5rem - 4.8rem)' }}
          pagination={false}
          rowKey={row => row.order}
        />
      </div>
    </div>
  );
}
