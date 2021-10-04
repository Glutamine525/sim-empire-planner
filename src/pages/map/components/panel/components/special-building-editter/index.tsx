import { Button, Input, InputNumber, message, Tag, Tooltip } from 'antd';
import { ColorPicker } from '@/components/color-picker';
import React, { useState } from 'react';
import styles from './index.less';
import Switcher from '@/components/switcher';
import { ColorChangeHandler } from 'react-color';
import { connect } from 'react-redux';
import { CivilBuilding, SimpleBuilding } from '@/types/building';
import {
  deleteSpecialBuilding,
  insertSpecialBuilding,
  swapSpecialBuilding,
} from '@/actions';
import { CivilType } from '@/types/civil';
import { rgbToHex } from '@/utils/color';

interface SpecialBuildingEditterProps {
  civil: CivilType;
  specials: SimpleBuilding[];
  onInsertSpecialBuilding: any;
  onDeleteSpecialBuilding: any;
  onSwapSpecialBuilding: any;
}

function SpecialBuildingEditter(props: SpecialBuildingEditterProps) {
  const {
    civil,
    specials,
    onInsertSpecialBuilding,
    onDeleteSpecialBuilding,
    onSwapSpecialBuilding,
  } = props;

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
  const [dragIndex, setDragIndex] = useState(0);
  const [hash, setHash] = useState(new Date().getTime().toString()); // 作为tooltip key的后缀，强制重新渲染

  const onChangeTextColor: ColorChangeHandler = color => {
    setColor(color.rgb as any);
  };

  const onChangBgColor: ColorChangeHandler = color => {
    setBackground(color.rgb as any);
  };

  const onClickInsert = () => {
    if (!name) {
      message.error('建筑名称不允许为空！');
      return;
    }
    if (name.includes('@')) {
      message.error('建筑名称不允许含有@！');
      return;
    }
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

  const onDragStart = (index: number) => {
    setDragIndex(index);
  };

  const onDrop = (index: number) => {
    setHash(new Date().getTime().toString());
    onSwapSpecialBuilding(dragIndex, index);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.column}>
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
          </div>
        </div>
        <div className={styles.column}>
          <div>
            已添加
            <strong> {specials.length} </strong>
            个建筑，拖动下方标签可改变他们的顺序。
          </div>
          <div className={styles.list}>
            {specials.map((v, index) => {
              const {
                name,
                text,
                width,
                height,
                fontSize,
                range,
                color,
                background,
                isDecoration,
                isWonder,
              } = v;

              const content = () => (
                <div style={{ fontSize: 12 }}>
                  <div>
                    建筑名称：<strong>{name}</strong>
                  </div>
                  <div>
                    显示名称：<strong>{text}</strong>
                  </div>
                  <div>
                    建筑宽度：<strong>{width}</strong>格
                  </div>
                  <div>
                    建筑高度：<strong>{height}</strong>格
                  </div>
                  <div>
                    文字大小：<strong>{fontSize! * 10}</strong>px
                  </div>
                  <div>
                    影响范围：<strong>{range}</strong>格
                  </div>
                  <div>
                    美化建筑：<strong>{isDecoration ? '√' : '×'}</strong>
                  </div>
                  <div>
                    奇迹建筑：<strong>{isWonder ? '√' : '×'}</strong>
                  </div>
                </div>
              );

              return (
                <Tooltip
                  key={`special-${name}-${hash}`}
                  placement="bottom"
                  title={content}
                >
                  <Tag
                    color="blue"
                    closable
                    onClose={() => onClickDelete(name)}
                    draggable
                    onDragStart={() => onDragStart(index)}
                    onDrop={() => onDrop(index)}
                    onDragOver={e => e.preventDefault()}
                    style={{
                      color: color,
                      background: background,
                      borderColor: '#000000',
                      cursor: 'pointer',
                      margin: 0,
                      textShadow:
                        'white 0 0 1px,white 0 0 1px,white 0 0 1px,white 0 0 1px,white 0 0 1px',
                    }}
                  >
                    {name}
                  </Tag>
                </Tooltip>
              );
            })}
          </div>
          <div className={styles.config}>
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
            <div>
              建筑宽度：
              <InputNumber min={1} max={20} value={width} onChange={setWidth} />
            </div>
            <div>
              建筑高度：
              <InputNumber
                min={1}
                max={20}
                value={height}
                onChange={setHeight}
              />
            </div>
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
          <div>
            <Button type="primary" onClick={onClickInsert}>
              添加
            </Button>
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
    onSwapSpecialBuilding: (dragIndex: number, dropIndex: number) => {
      dispatch(swapSpecialBuilding(dragIndex, dropIndex));
    },
  };
};

const SpecialBuildingEditterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SpecialBuildingEditter);

export default SpecialBuildingEditterContainer;
