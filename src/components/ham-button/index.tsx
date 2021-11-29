import React from 'react';

import styles from './index.less';

interface HamButtonProps {
  isActive: boolean;
  onClick: any;
}

export default function HamButton(props: HamButtonProps) {
  const { isActive, onClick } = props;

  return (
    <svg
      className={`${styles['ham-button']} ${styles['ham-button-rotate']} ${
        isActive ? styles.active : ''
      }`}
      viewBox="0 0 100 100"
      onClick={onClick}
    >
      <path
        className={`${styles['line']} ${styles['top']}`}
        d="m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429"
      />
      <path
        className={`${styles['line']} ${styles['middle']}`}
        d="m 70,50 h -40"
      />
      <path
        className={`${styles['line']} ${styles['bottom']}`}
        d="m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429"
      />
    </svg>
  );
}
