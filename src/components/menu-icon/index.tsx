import React, { FC } from 'react';
import styles from './index.less';

interface IProps {
  src: string;
  alt: string;
}

const MenuIcon: FC<IProps> = IProps => {
  return <img className={styles.icon} src={IProps.src} alt={IProps.alt} />;
};

export default MenuIcon;
