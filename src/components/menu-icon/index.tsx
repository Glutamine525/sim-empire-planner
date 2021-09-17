import React, { FC } from 'react';
import styles from './index.less';

interface MenuIconProps {
  src: string;
  alt: string;
}

const MenuIcon: FC<MenuIconProps> = props => {
  const { src, alt } = props;

  return <img className={styles.icon} src={src} alt={alt} />;
};

export default MenuIcon;
