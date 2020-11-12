import React, { FC } from 'react';
import { history } from 'umi';
import { message } from 'antd';
import CopyToClipboard from 'react-copy-to-clipboard';

import { RightOutlined } from '@ant-design/icons';

import Empty from '@/components/Empty';

import makeQuery from '@/util/makeQuery';
import { getUrl } from '@/util/oss';

import { Course } from '@/type';

import styles from './index.less';

interface CourseListProps {
  courseList: Course[];
}

const CourseList: FC<CourseListProps> = ({ courseList }) => {
  return (
    <div className={styles.courseList}>
      {courseList?.length ? (
        courseList.map(({ name, teacher, cover, id, token }: Course) => (
          <div
            key={id}
            className={styles.courseItem}
            onClick={() => {
              history.push(
                `${history.location.pathname}/${id}${makeQuery({
                  courseName: name,
                  courseId: id,
                })}`,
              );
            }}
          >
            <div className={styles.cover}>
              <img src={getUrl(cover)} />
            </div>
            <div className={styles.content}>
              <p className={styles.name}>{name}</p>
              <p className={styles.description}>
                <span>{teacher}</span>

                <CopyToClipboard
                  text={token}
                  onCopy={() => {
                    message.success('复制成功');
                  }}
                >
                  <span onClick={e => e.stopPropagation()}>
                    <span className={styles.token}>点击复制口令</span>
                  </span>
                </CopyToClipboard>
              </p>
            </div>

            <RightOutlined className={styles.enter} />
          </div>
        ))
      ) : (
        <Empty />
      )}
    </div>
  );
};

export default CourseList;
