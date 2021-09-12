import React from 'react';
import styles from './index.less';

export default function Coord(props: { line: number; column: number }) {
  const { line, column } = props;

  if (process.env.NODE_ENV === 'production') return null;

  return <div className={styles.container}>{`${line}-${column}`}</div>;
}
