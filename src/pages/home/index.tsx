import React, { FC } from 'react';

import Footer from '@/components/footer';

import Nav from './components/nav';
import Block from './components/block';
import styles from './index.less';

const Home: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Nav />
      <div className={styles.container}>
        <Block type="popular" title="热门" />
        <Block type="common" title="中国" />
      </div>
      <Footer show={true} position="initial" />
    </div>
  );
};

export default Home;
