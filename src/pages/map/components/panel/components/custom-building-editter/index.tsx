import { Input, InputNumber } from 'antd';
import { ColorPicker } from '@/components/color-picker';
import React, { useState } from 'react';
import styles from './index.less';
import Switcher from '@/components/switcher';
import { ColorChangeHandler } from 'react-color';

export default function CustomBuildingEditter() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(3);
  const [fontSize, setFontSize] = useState(14);
  const [range, setRange] = useState(0);
  const [color, setColor] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [background, setBackground] = useState({ r: 0, g: 0, b: 0, a: 1 });
  const [isDecoration, setIsDecoration] = useState(false);
  const [isWonder, setIsWonder] = useState(false);

  const onChangeTextColor: ColorChangeHandler = color => {
    setColor(color.rgb as any);
  };

  const onChangBgColor: ColorChangeHandler = color => {
    setBackground(color.rgb as any);
  };

  return (
    <div className={styles.container}>
      <div className={styles.preview}></div>
      <div className={styles.config}>
        <div className={styles.row}>
          <div>
            建筑名称：
            <Input
              placeholder="请输入..."
              allowClear
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div>
            显示名称：
            <Input
              placeholder="请输入..."
              allowClear
              className={styles.input}
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            建筑宽度：
            <InputNumber min={1} max={20} value={width} onChange={setWidth} />
          </div>
          <div>
            建筑高度：
            <InputNumber min={1} max={20} value={height} onChange={setHeight} />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            文字大小：
            <InputNumber
              min={12}
              max={100}
              value={fontSize}
              onChange={setFontSize}
            />
          </div>
          <div>
            影响范围：
            <InputNumber min={0} max={20} value={range} onChange={setRange} />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            文字颜色：
            <ColorPicker
              id="picker-text"
              value={color}
              handleChange={onChangeTextColor}
            />
          </div>
          <div>
            背景颜色：
            <ColorPicker
              id="picker-bg"
              value={background}
              handleChange={onChangBgColor}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div>
            美化建筑：
            <div
              style={{
                position: 'relative',
                left: -4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Switcher
                id="is-decoration"
                type="ordinary"
                value={isDecoration}
                onClick={() => {
                  if (isWonder && !isDecoration) setIsWonder(false);
                  setIsDecoration(!isDecoration);
                }}
              />
            </div>
          </div>
          <div>
            奇迹建筑：
            <div
              style={{
                position: 'relative',
                left: -4,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Switcher
                id="is-wonder"
                type="ordinary"
                value={isWonder}
                onClick={() => {
                  if (isDecoration && !isWonder) setIsDecoration(false);
                  setIsWonder(!isWonder);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
