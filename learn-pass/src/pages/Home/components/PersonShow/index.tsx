import React from 'react';
import { UserInfo } from '@/type';
import { getUerInfo } from '@/util';

import TEACHER from '@/assets/teacher.svg';
import STUDENT from '@/assets/student.svg';

import styles from './index.less';

export default function PersonShow(props: UserInfo) {
  const isStudent = getUerInfo().isStudent;
  return (
    <div className={styles.wrapper}>
      <div className={styles.info}>
        <span className={styles.name}> {props.realname} </span>
        <span>({props.sex ? '男' : '女'})</span>
        <img
          className={styles.identityIcon}
          src={isStudent ? STUDENT : TEACHER}
        />

        <div className={styles.discription}>
          <span className={styles.college}> {props.college} </span>
          <span className={styles.class}> {props.subject} </span>
        </div>
      </div>
    </div>
  );
}
