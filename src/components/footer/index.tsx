import { copyLink } from '@/utils/browser';
import { EMAIL, ICP, ORIGIN } from '@/utils/config';
import React from 'react';
import styles from './index.less';

interface FooterProps {
  show: boolean;
}

function Footer(props: FooterProps) {
  const { show } = props;

  return (
    <div
      className={styles.container}
      style={{
        opacity: show ? 1 : 0,
        visibility: show ? 'visible' : 'hidden',
      }}
    >
      <div>
        <span>
          <strong>
            © 2021
            {new Date().getFullYear() === 2021
              ? ' '
              : `-${new Date().getFullYear()} `}
            {ORIGIN} 版权所有
          </strong>
        </span>
        <span>
          联系邮箱:
          <strong className={styles.link} onClick={() => copyLink(EMAIL)}>
            {EMAIL}
          </strong>
        </span>
      </div>
      <div>
        <strong className={styles.link}>
          <a href="http://beian.miit.gov.cn" target="_blank" rel="noreferrer">
            {ICP}
          </a>
        </strong>
      </div>
    </div>
  );
}

export default React.memo(Footer);
