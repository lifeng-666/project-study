import React from 'react';
import { useLocation, history } from 'umi';

import { Tabs, Modal, message } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import Header from '@/components/Header';
import { deleteCourse } from '@/server';

import DocumentList from './components/DocumentList';
import VideoList from './components/VideoList';

import styles from './index.less';

enum TabKeys {
  VIDEO = 'video',
  DOCUMENT = 'document',
  QUESTION = 'question',
}

const TAB_LIST = [
  {
    value: '视频',
    key: TabKeys.VIDEO,
  },
  {
    value: '课件',
    key: TabKeys.DOCUMENT,
  },
  {
    value: '习题',
    key: TabKeys.QUESTION,
  },
];

export default () => {
  const { TabPane } = Tabs;
  // @ts-ignore
  //umi useLocation type bug
  const courseName = useLocation().query.courseName;
  // @ts-ignore
  const courseId = useLocation().query.courseId;

  const renderContent = (value: TabKeys) => {
    if (value === TabKeys.VIDEO) return <VideoList courseId={courseId} />;
    if (value === TabKeys.DOCUMENT) return <DocumentList courseId={courseId} />;
    return null;
  };

  return (
    <div>
      <Header
        title={courseName}
        rightPart={
          <DeleteOutlined
            style={{
              color: '#ff4d4f',
            }}
            onClick={() => {
              Modal.confirm({
                title: '确定要删除课程吗?',
                width: 800,
                okText: '确定',
                cancelText: '取消',

                onOk() {
                  return deleteCourse({
                    courseId,
                  }).then(() => {
                    message.success('删除成功');
                    history.go(-1);
                  });
                },
              });
            }}
          />
        }
      />
      <Tabs className={styles.tab}>
        {TAB_LIST.map(tab => (
          <TabPane className={styles.tabPane} tab={tab.value} key={tab.key}>
            {renderContent(tab.key)}
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};
