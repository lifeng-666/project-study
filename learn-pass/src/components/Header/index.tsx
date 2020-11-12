import React, { FC, ReactElement } from 'react';

import { LeftOutlined } from '@ant-design/icons';

import styles from './index.less';

const Header: FC<{
  leftPart?: ReactElement | null;
  rightPart?: ReactElement;
  title: ReactElement | string;
  [k: string]: any;
}> = ({
  leftPart = (
    <LeftOutlined
      onClick={() => {
        history.back();
      }}
    />
  ),
  rightPart,
  title,
  ...props
}) => {
  return (
    <header className={styles.header} {...props}>
      <div>{leftPart}</div>
      <div className={styles.title}>{title}</div>
      <div>{rightPart}</div>
    </header>
  );
};

export default Header;
