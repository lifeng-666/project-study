import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Skeleton, message, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import { getVideoList, deleteVideo, addVideo } from '@/server';
import PullDown from '@/components/PullDown';
import Empty from '@/components/Empty';

import { getUerInfo } from '@/util';
import { uploadVideo } from '@/util/oss';
import { AddVideo } from '@/type';

import Radio from '../Radio';
import Upload from '../Upload';

import styles from './index.less';

interface Video {
  id: number;
  name: string;
  completed: boolean;
}

export default ({ courseId }: { courseId: number }) => {
  const [videoList, setVideoList] = useState<Video[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const isStudent = getUerInfo().isStudent;

  const fetchVideoList = () => {
    setLoading(true);
    getVideoList({ courseId: courseId })
      .then(({ data }) => {
        setVideoList(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleDeleteVideo = (id: number) => {
    deleteVideo({
      videoId: String(id),
    }).then(() => {
      message.success('删除成功');
      fetchVideoList();
    });
  };

  useEffect(() => {
    fetchVideoList();
  }, []);

  return (
    <PullDown
      LoadingHeight={140}
      abandonHeight={320}
      onRefresh={fetchVideoList}
    >
      <div className={styles.videoList}>
        <Skeleton loading={loading} active title={false}>
          {videoList?.length ? (
            videoList.map((video: Video, index: number) => (
              <div
                className={styles.video}
                key={name + index}
                onClick={() => {
                  history.push(`${history.location.pathname}/${video.id}`);
                }}
              >
                <div className={styles.info}>
                  <span className={styles.serial}>{index + 1}.</span>
                  <span className={styles.name}>{video.name}</span>
                  {isStudent && (
                    <span className={styles.status}>
                      {video.completed && '(已完成)'}
                    </span>
                  )}
                </div>
                <div className={styles.rightIcon}>
                  {isStudent ? (
                    <Radio completed={video.completed} />
                  ) : (
                    <div onClick={e => e.stopPropagation()}>
                      <Popconfirm
                        title="确定删除该节视频?"
                        placement="left"
                        onConfirm={() => {
                          handleDeleteVideo(video.id);
                        }}
                        okText="删除"
                        cancelText="取消"
                      >
                        <DeleteOutlined
                          style={{
                            color: '#ff4d4f',
                          }}
                          size={28}
                        />
                      </Popconfirm>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <Empty />
          )}
        </Skeleton>
        {!isStudent && (
          <div className={styles.upload}>
            <Upload
              type="video"
              sizeLimite={2000}
              courseId={courseId}
              onFinish={(data: AddVideo) =>
                addVideo(data).then(() => {
                  fetchVideoList();
                })
              }
              upLoadFn={(file: File) => uploadVideo(file)}
            />
          </div>
        )}
      </div>
    </PullDown>
  );
};
