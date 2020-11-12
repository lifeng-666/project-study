import React, { FC } from 'react';
import classnames from 'classnames';

import EMPTY from '@/assets/empty.svg';

import styles from './index.less';

interface EmptyProps {
  className?: string;
  description?: string;
}

const Empty: FC<EmptyProps> = ({ className, description = '暂无内容' }) => {
  return (
    <div className={classnames([styles.empty, className])}>
      <img src={EMPTY} alt="empty" />
      <p className={styles.description}>{description}</p>
    </div>
  );
};

export default Empty;
