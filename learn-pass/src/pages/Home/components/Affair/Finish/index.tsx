import React from 'react';
import styles from '../UnFinish/index.less';
import { DeleteOutlined } from '@ant-design/icons';
interface Iprops {
  Finishs: string[];
  remove: Function;
}
export default function Finish(props: Iprops) {
  const arr = props.Finishs.map((ele, index) => {
    return (
      <div className={styles.item} key={index}>
        <span className={styles.remove}>{ele}</span>
        <span
          className={styles.finish}
          onClick={() => {
            props.remove(index);
          }}
        >
          <DeleteOutlined
            style={{
              color: '#f40',
              fontSize: '1.1em',
            }}
          />
        </span>
      </div>
    );
  });
  return (
    <div>
      <div className={styles.wrapper}>
        <div className={styles.title}>已完成 :</div>
        {arr}
      </div>
    </div>
  );
}
