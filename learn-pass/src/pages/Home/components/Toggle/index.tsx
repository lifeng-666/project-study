import React from 'react';
import { Drawer } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import styles from './index.less';

interface Iprops {
  title: string;
  visible: boolean;
  close?: () => void;
  children: JSX.Element;
}

export default function Toggle(props: Iprops) {
  return (
    <div className={styles.toggle}>
      <Drawer
        className={styles.drawer}
        title={props.title}
        placement="right"
        closable
        destroyOnClose
        closeIcon={<LeftOutlined className={styles.icon} />}
        onClose={() => {
          props.close?.();
        }}
        visible={props.visible}
        width="100%"
        headerStyle={{ textAlign: 'center', height: '-1px' }}
        bodyStyle={{ padding: '10px 0px 0px 0px', backgroundColor: '#f6f6f6' }}
      >
        {props.children}
      </Drawer>
    </div>
  );
}
