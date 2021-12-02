import { EyeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
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
  } = props;

  const [mouseOnImg, setMouseOnImg] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [time, setTime] = useState(moment(uploadTime).fromNow());

  useEffect(() => {
    let destroyed = false;
    const setter = () => {
      if (destroyed) return;
      setTime(moment(uploadTime).fromNow());
      setTimeout(setter, 1000);
    };
    setter();
    return () => {
      destroyed = true;
    };
  }, []); // eslint-disable-line

  return (
    <div className={styles.container}>
      <div
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
          <div
            className={styles['preview-button']}
            onClick={() => {
              setIsPreviewing(true);
              setMouseOnImg(false);
            }}
          >
            <EyeOutlined /> 预览
          </div>
          {editable && <div className={styles.edit}>编辑</div>}
        </div>
      </div>
      <div
        className={styles['preview-container']}
        style={{
          display: isPreviewing ? 'block' : 'none',
        }}
        onClick={() => setIsPreviewing(false)}
      >
        <div className={styles['preview-operation']}></div>
        <div className={styles['preview-image']}>
          <img src={require('@/images/demo-map.jpg').default} alt="map" />
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
            <div className={styles.tag}>{v}</div>
          ))}
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
