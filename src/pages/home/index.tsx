import React, { FC, useEffect } from 'react';

import Footer from '@/components/footer';

import Block from './components/block';
import Nav from './components/nav';
import styles from './index.less';

const Home: FC = () => {
  useEffect(() => {}, []);

  return (
    <div className={styles.wrapper}>
      <Nav />
      <div className={styles.container}>
        <div className={styles.content}>
          <Block type="popular" title="热门" />
          <Block type="common" title="中国" />
          <Block type="common" title="阿兹特克" />
        </div>
        <Footer show={true} position="initial" />
      </div>
    </div>
  );
};

export default Home;
