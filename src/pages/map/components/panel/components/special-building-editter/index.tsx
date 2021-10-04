import { Button, Input, InputNumber, message, Tag } from 'antd';
import { ColorPicker } from '@/components/color-picker';
import React, { useState } from 'react';
import styles from './index.less';
import Switcher from '@/components/switcher';
import { ColorChangeHandler } from 'react-color';
import { connect } from 'react-redux';
import { CivilBuilding, SimpleBuilding } from '@/types/building';
import { deleteSpecialBuilding, insertSpecialBuilding } from '@/actions';
import { CivilType } from '@/types/civil';
import { rgbToHex } from '@/utils/color';

interface SpecialBuildingEditterProps {
  civil: CivilType;
  specials: SimpleBuilding[];
  onInsertSpecialBuilding: any;
  onDeleteSpecialBuilding: any;
}

function SpecialBuildingEditter(props: SpecialBuildingEditterProps) {
  const { civil, specials, onInsertSpecialBuilding, onDeleteSpecialBuilding } =
    props;

  const [isFullProtection, setIsFullProtection] = useState(false);
  const [name, setName] = useState('花坛');
  const [text, setText] = useState('花坛');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(2);
  const [fontSize, setFontSize] = useState(1.4);
  const [range, setRange] = useState(0);
  const [color, setColor] = useState({ r: 245, g: 166, b: 35, a: 1 });
  const [background, setBackground] = useState({ r: 74, g: 200, b: 36, a: 1 });
  const [isDecoration, setIsDecoration] = useState(true);
  const [isWonder, setIsWonder] = useState(false);

  const onChangeTextColor: ColorChangeHandler = color => {
    setColor(color.rgb as any);
  };

  const onChangBgColor: ColorChangeHandler = color => {
    setBackground(color.rgb as any);
  };

  const onClickInsert = () => {
    if (specials.some(v => v.name === name)) {
      message.error('建筑名称重复！');
      return;
    }
    onInsertSpecialBuilding({
      name,
      text,
      range,
      isWonder,
      isDecoration,
      width,
      height,
      color: rgbToHex(color),
      fontSize,
      background: rgbToHex(background),
    });
  };

  const onClickDelete = (name: string) => {
    onDeleteSpecialBuilding(specials.find(v => v.name === name));
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {specials.map(v => {
          const { name } = v;
          return (
            <Tag
              color="blue"
              closable
              onClose={() => onClickDelete(name)}
              key={`special-${name}`}
            >
              {name}
            </Tag>
          );
        })}
      </div>
      <div className={styles.preview}>
        <div
          className={styles.building}
          style={{
            width: `${width * 30}px`,
            height: `${height * 30}px`,
            color: `rgb(${color.r} ${color.g} ${color.b})`,
            background: `rgb(${background.r} ${background.g} ${background.b})`,
            fontSize: `${fontSize}rem`,
          }}
        >
          {text}
          {!isDecoration && !isWonder ? (
            <div
              className={styles.marker}
              style={{
                color: isFullProtection
                  ? 'var(--ant-success-color)'
                  : 'var(--ant-error-color)',
              }}
            >
              {isFullProtection ? CivilBuilding[civil]['防'].length : 0}
            </div>
          ) : null}
        </div>
      </div>
      <div>
        <Button
          type="primary"
          danger
          onClick={() => setIsFullProtection(false)}
        >
          防护未满
        </Button>
        <Button
          type="primary"
          style={{
            background: 'var(--ant-success-color)',
            borderColor: 'var(--ant-success-color)',
            margin: '0 2rem',
          }}
          onClick={() => setIsFullProtection(true)}
        >
          防护已满
        </Button>
        <Button type="primary" onClick={onClickInsert}>
          添加
        </Button>
      </div>
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
              min={1.2}
              max={10}
              value={fontSize}
              onChange={setFontSize}
              step={0.1}
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

const mapStateToProps = (state: any) => {
  return {
    civil: state.TopMenu.civil,
    specials: state.Panel.specials,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onInsertSpecialBuilding: (targetSpecial: SimpleBuilding) => {
      dispatch(insertSpecialBuilding(targetSpecial));
    },
    onDeleteSpecialBuilding: (targetSpecial: SimpleBuilding) => {
      dispatch(deleteSpecialBuilding(targetSpecial));
    },
  };
};

const SpecialBuildingEditterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialBuildingEditter);

export default SpecialBuildingEditterContainer;
