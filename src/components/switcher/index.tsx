import React from 'react';
import styles from './index.less';

interface IProps {
  id: string;
  type: 'ordinary' | 'daynight';
  value: boolean;
  onClick: () => void;
}

export default function Switcher(props: IProps) {
  const { id, type, value, onClick } = props;

  return (
    <div className={`${styles['toggle']} ${styles['toggle--' + type]}`}>
      <input
        id={'switcher-' + id}
        type="checkbox"
        className={styles['toggle--checkbox']}
        checked={value}
        onChange={onClick}
      />
      <label htmlFor={'switcher-' + id} className={styles['toggle--btn']}>
        {type === 'daynight' && (
          <span className={styles['toggle--feature']}></span>
        )}
      </label>
    </div>
  );
}
