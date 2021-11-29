import React from 'react';

import styles from './index.less';

export default function Loading(props: { isLoading: boolean }) {
  const { isLoading } = props;

  return (
    <div
      className={styles.wrapper}
      style={{
        display: isLoading ? 'flex' : 'none',
      }}
    >
      <div className={styles.container}>
        <div className={styles.child}></div>
        <div className={styles.child}></div>
        <div className={styles.child}></div>
      </div>
    </div>
  );
}
