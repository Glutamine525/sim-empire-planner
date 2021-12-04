import {
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  LikeFilled,
  LikeOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';

import { CivilType } from '@/types/civil';

import styles from './index.less';

interface DisplayerProps {
  type: 'popular' | 'like' | 'common';
  id: string;
  woodNum: number;
  civil: CivilType;
  isNoWood: boolean;
  like: number;
  liked: boolean;
  uploadTime: number;
  editable: boolean;
  url: string;
  tags: string[];
  author: string;
}

const Displayer: FC<DisplayerProps> = props => {
  const {
    type,
    woodNum,
    civil,
    isNoWood,
    like,
    liked,
    uploadTime,
    editable,
    tags,
    author,
  } = props;

  const [mouseOnImg, setMouseOnImg] = useState(false);
  const [time, setTime] = useState(moment(uploadTime).fromNow());

  useEffect(() => {
    let destroyed = false;
    const setter = () => {
      if (destroyed) return;
      setTime(moment(uploadTime).fromNow());
      setTimeout(setter, 1000);
    };
    if (new Date().getTime() - uploadTime >= 60 * 60 * 1000) return;
    setter();
    return () => {
      destroyed = true;
    };
  }, []); // eslint-disable-line

  return (
    <div className={styles.container}>
      <div
        className={styles['map-container']}
        onMouseOver={() => setMouseOnImg(true)}
        onMouseOut={() => setMouseOnImg(false)}
      >
        <img
          src={require('@/images/demo-map.jpg').default}
          className={styles.map}
          alt="thumbnail"
        />
        <div
          className={styles.mask}
          style={{ display: mouseOnImg ? 'block' : 'none' }}
        >
          <a
            href={require('@/images/demo-map.jpg').default}
            target="_blank"
            rel="noreferrer"
          >
            <div
              className={styles.preview}
              onClick={() => {
                setMouseOnImg(false);
              }}
            >
              <EyeOutlined /> 查看原图
            </div>
          </a>
          <div className={styles.button}>
            {editable && (
              <div className={styles.edit}>
                <EditOutlined /> 编辑
              </div>
            )}
            <div className={styles.download}>
              <DownloadOutlined /> 下载
            </div>
          </div>
        </div>
      </div>
      <div className={styles['info-container']}>
        <div className={styles['info-first']}>
          {type !== 'common' && (
            <span style={{ color: 'var(--ant-primary-color)' }}>{civil}</span>
          )}
          <span style={{ color: 'var(--ant-error-color)' }}>{woodNum}木</span>
          <span style={{ color: 'var(--ant-success-color)' }}>
            {isNoWood ? '无' : '有'}木
          </span>
          {tags.map(v => (
            <div className={styles.tag} key={v}>
              {v}
            </div>
          ))}
        </div>
        <div>
          作者 - <strong>{author}</strong>
        </div>
        <div className={styles['info-second']}>
          <span>
            <span style={{ cursor: 'pointer' }}>
              {liked ? <LikeFilled /> : <LikeOutlined />}
            </span>
            <strong> {like}</strong>
          </span>
          <span style={{ fontWeight: 'bolder' }}>·</span>
          <Tooltip
            title={`上传于${moment(uploadTime).format('llll')}`}
            placement="bottom"
          >
            <span>{time}</span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Displayer;
