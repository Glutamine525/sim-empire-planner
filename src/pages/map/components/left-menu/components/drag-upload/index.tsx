import { message, Upload } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import styles from './index.less';
import { createPortal } from 'react-dom';
import { RcFile } from 'antd/lib/upload';

const { Dragger } = Upload;

interface UploadMaskProps {
  show: boolean;
  type: 'civil' | 'map';
  onImportTextData: any;
  onImportImageData: any;
  onClickMask: any;
}

const el = document.createElement('div');

export default function DragUpload(props: UploadMaskProps) {
  const { show, type, onImportTextData, onImportImageData, onClickMask } =
    props;

  const accept = type === 'civil' ? '.txt' : '.txt, .png, .jpg, .jpeg';

  useEffect(() => {
    document.body.appendChild(el);
    return () => {
      document.body.removeChild(el);
    };
  }, []);

  const beforeUpload = (file: RcFile) => {
    const reader = new FileReader();
    const { type } = file;
    if (type === 'text/plain') {
      reader.readAsText(file);
    } else if (['image/png', 'image/jpg', 'image/jpeg'].includes(type)) {
      reader.readAsDataURL(file);
    } else {
      message.error('不支持的文件格式！');
    }
    reader.onload = () => {
      const { result } = reader;
      if (type === 'text/plain') {
        onImportTextData(result);
      } else if (['image/png', 'image/jpg', 'image/jpeg'].includes(type)) {
        onImportImageData(result);
      }
    };
    return Upload.LIST_IGNORE;
  };

  return createPortal(
    <div
      className={styles.container}
      style={{
        opacity: show ? '1' : '0',
        visibility: show ? 'visible' : 'hidden',
      }}
    >
      <div className={styles.mask} onClick={onClickMask}></div>
      <Dragger accept={accept} beforeUpload={beforeUpload}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          导入
          <strong>{type === 'map' ? ' 地图 ' : ' 新文明 '}</strong>
          数据
        </p>
        <p className="ant-upload-text">点击选择文件 或 将文件拖拽到这里</p>
        <p className="ant-upload-hint">
          只能上传 <strong>{accept}</strong> 格式文件
        </p>
        <p className="ant-upload-hint">点击其它区域即可关闭此界面</p>
      </Dragger>
    </div>,
    el
  );
}
