import React from 'react';
import styles from './index.less';
import { CheckOutlined } from '@ant-design/icons';
interface Iprops {
  affairs: string[];
  finish: Function;
}

export default function UnFinish(props: Iprops) {
  const arr = props.affairs.map((ele, index) => {
    return (
      <div className={styles.item} key={index}>
        <span>{index + 1}.</span>

        <span className={styles.affair}>{ele}</span>
        <span
          className={styles.finish}
          onClick={() => {
            props.finish(index);
          }}
        >
          <CheckOutlined
            style={{
              color: '#1890ff',
              fontSize: '1.1em',
            }}
          />
        </span>
      </div>
    );
  });
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>未完成 :</div>
      {arr}
    </div>
  );
}
