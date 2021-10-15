import { copyLink } from '@/utils/browser';
import { BEIAN, EMAIL, ICP, ORIGIN } from '@/utils/config';
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
          联系邮箱：
          <strong className={styles.link} onClick={() => copyLink(EMAIL)}>
            {EMAIL}
          </strong>
        </span>
      </div>
      <div>
        <span>
          <strong>
            © 2021
            {new Date().getFullYear() === 2021
              ? ' '
              : `-${new Date().getFullYear()} `}
            <span className={styles.link} onClick={() => copyLink(EMAIL)}>
              {ORIGIN}
            </span>
            {' 版权所有'}
          </strong>
        </span>
      </div>
      <div>
        <span>
          <img src={require(`@/images/备案.png`).default} alt="备案" />
          <strong className={styles.link}>
            <a
              href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=42010302002383"
              target="_blank"
              rel="noreferrer"
            >
              {` ${BEIAN}`}
            </a>
          </strong>
        </span>
        <span>
          <strong className={styles.link}>
            <a href="http://beian.miit.gov.cn" target="_blank" rel="noreferrer">
              {ICP}
            </a>
          </strong>
        </span>
      </div>
    </div>
  );
}

export default React.memo(Footer);
