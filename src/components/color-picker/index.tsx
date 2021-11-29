import React from 'react';
import { SketchPicker } from 'react-color';
import { createPortal } from 'react-dom';

import styles from './index.less';

interface ColorPickerProps {
  id: string;
  value: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  handleChange: any;
}

interface ColorPickerState {
  showPicker: boolean;
  top: number;
  left: number;
}

export class ColorPicker extends React.Component<
  ColorPickerProps,
  ColorPickerState
> {
  el: HTMLDivElement;

  constructor(props: ColorPickerProps) {
    super(props);
    this.state = {
      showPicker: false,
      top: 0,
      left: 0,
    };
    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
  }

  componentWillUnmount() {
    document.body.removeChild(this.el);
  }

  handleClick = () => {
    const { top, left, width } = document
      .getElementById(this.props.id)!
      .getBoundingClientRect();
    this.setState({
      showPicker: true,
      top: top - 150,
      left: left + width + 20,
    });
  };

  handleClose = () => {
    this.setState({ showPicker: false });
  };

  render() {
    return (
      <>
        <div className={styles.swatch} onClick={this.handleClick}>
          <div
            id={this.props.id}
            className={styles.color}
            style={{
              background: `rgba(${this.props.value.r}, ${this.props.value.g}, ${this.props.value.b}, ${this.props.value.a})`,
            }}
          />
        </div>
        {this.state.showPicker
          ? createPortal(
              <div
                className={styles.popover}
                style={{
                  top: this.state.top,
                  left: this.state.left,
                }}
              >
                <div className={styles.cover} onClick={this.handleClose} />
                <SketchPicker
                  disableAlpha={true}
                  color={this.props.value as any}
                  onChange={this.props.handleChange}
                />
              </div>,
              this.el
            )
          : null}
      </>
    );
  }
}
