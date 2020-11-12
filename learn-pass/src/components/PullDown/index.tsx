import React, { FC, ReactElement, useState } from 'react';
import { Spin } from 'antd';
import { delay } from '@/util';

import styles from './index.less';

interface PullDownProps {
  children: ReactElement;
  LoadingHeight?: number;
  abandonHeight?: number;
  slideDistance?: number;
  onRefresh: () => void;
}

const PullDown: FC<PullDownProps> = ({
  children,
  LoadingHeight = 150,
  abandonHeight = 0,
  slideDistance = 200,
  onRefresh,
}) => {
  let startDistance = 0;
  let curDistance = 0;
  let touchStart = 0;
  const [top, setTop] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const getIsOpening = () => curDistance - startDistance > LoadingHeight;
  return (
    <div
      className={styles.pullDown}
      style={{
        height: `calc(100vh - ${LoadingHeight}px )`,
      }}
      onTouchStart={e => {
        touchStart = e.touches[0].clientY;
      }}
      onTouchMove={e => {
        if (!loading) {
          startDistance = e.touches[0].clientY;
          if (startDistance - touchStart > slideDistance) setLoading(true);
        }
        curDistance = e.touches[0].clientY;
        if (getIsOpening()) setTop(LoadingHeight);
      }}
      onTouchEnd={() => {
        if (getIsOpening()) {
          delay(300).then(() => {
            setLoading(false);
            setTop(0);
            onRefresh?.();
          });
        }
        startDistance = 0;
        curDistance = 0;
      }}
    >
      {loading && (
        <div
          className={styles.loading}
          style={{
            height: `${LoadingHeight}px`,
          }}
        >
          <Spin />
          <span className={styles.spinIcon}>下拉刷新</span>
        </div>
      )}
      <div
        className={styles.wrapper}
        style={{
          top: top + 'px',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullDown;
