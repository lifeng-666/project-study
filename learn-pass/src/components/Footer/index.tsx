import React, { FC, useState, useEffect } from 'react';
import { Link } from 'umi';
import { Badge } from 'antd';

import { getUerInfo } from '@/util';

import styles from './index.less';

let interval: Timeout;

const Footer: FC = () => {
  const isStudent = getUerInfo().isStudent;
  const [newsCount, setNewsCount] = useState<number>(0);

  useEffect(() => {
    interval = setInterval(() => {
      setNewsCount(newsCount + 1);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [newsCount]);

  return (
    <div className={styles.footer}>
      <Link to="/Course">课程</Link>
      {isStudent ? (
        <Link
          to="/News"
          onClick={() => {
            setNewsCount(0);
          }}
        >
          <Badge
            count={newsCount}
            style={{
              borderRadius: '50%',
            }}
            overflowCount={9}
          >
            消息
          </Badge>
        </Link>
      ) : (
        <Link to="/Management">管理</Link>
      )}
      <Link to="/Home">我</Link>
    </div>
  );
};

export default Footer;
