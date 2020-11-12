import React, { useState, useEffect } from 'react';
import { Skeleton, Button, Modal, Input, message, Form, Upload } from 'antd';

import {
  PlusOutlined,
  LoadingOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';

import {
  getCourseListTeacher,
  getCourseListStudent,
  joinCourse,
  createCourse,
} from '@/server';

import Header from '@/components/Header';
import PullDown from '@/components/PullDown';

import { getUerInfo } from '@/util';
import { getUrl, uploadCover } from '@/util/oss';
import { Course } from '@/type';

import CourseList from './components/CourseList';

import styles from './index.less';

// @ts-ignore

export default () => {
  const isStudent = getUerInfo().isStudent;

  const [joinCourseModalShow, setJoinCourseModalShow] = useState<boolean>(
    false,
  );
  const [creatCourseModalShow, setCreatCourseModalShow] = useState<boolean>(
    false,
  );
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [courseListLoading, setCourseListLoading] = useState<boolean>(false);
  const [uploadCoverLoading, setUploadCoverLoading] = useState<boolean>(false);
  const [confirmJoinCourse, setConfirmJoinCourse] = useState<boolean>(false);
  const [courseTokenValue, setCourseTokenValue] = useState<string>('');
  const [courseCoverPath, setCourseCoverPath] = useState<string>('');
  const [courseCoverError, setCourseCoverError] = useState<boolean>(false);

  const fetchCourseList = () => {
    setCourseListLoading(true);

    const getCourseList = () => {
      return isStudent ? getCourseListStudent() : getCourseListTeacher();
    };

    getCourseList()
      .then(({ data }: { data: Course[] }) => {
        setCourseList(data);
        setCourseListLoading(false);
      })
      .catch(() => {
        setCourseListLoading(false);
      });
  };
  const handleJoinCourse = () => {
    setConfirmJoinCourse(true);
    const reset = () => {
      setConfirmJoinCourse(false);
      setJoinCourseModalShow(false);
      setCourseTokenValue('');
    };

    joinCourse({ token: courseTokenValue.trim() })
      .then(() => {
        reset();
        message.success('加入课程成功');
        fetchCourseList();
      })
      .catch(() => {
        setConfirmJoinCourse(false);
      });
  };

  useEffect(() => {
    fetchCourseList();
  }, []);

  const uploadButton = (
    <div>{uploadCoverLoading ? <LoadingOutlined /> : <PlusOutlined />}</div>
  );

  const createCourseModal = (
    <Modal
      visible={creatCourseModalShow}
      title="创建课程"
      confirmLoading={confirmJoinCourse}
      closable
      centered
      destroyOnClose
      onCancel={async () => {
        setCreatCourseModalShow(false);
        setCourseCoverError(false);
        setCourseCoverPath('');
        setUploadCoverLoading(false);
      }}
      footer={false}
      width={1000}
    >
      <Form
        onFinish={({ name, description }) => {
          setCourseCoverError(!Boolean(courseCoverPath));
          if (!name || !courseCoverPath) return;
          createCourse({
            name,
            description,
            coverPath: courseCoverPath,
          }).then(() => {
            message.success('创建成功');
            setCreatCourseModalShow(false);
            fetchCourseList();
          });
        }}
      >
        <Form.Item
          label="课程名"
          name="name"
          rules={[{ required: true, message: '请输入课程名' }]}
        >
          <Input size="large" maxLength={30} />
        </Form.Item>

        <Form.Item
          label="课程封面"
          name="cover"
          rules={[{ required: true, message: '请上传课程封面' }]}
          validateStatus="error"
          help={courseCoverError ? '请上传课程封面' : null}
        >
          <Upload
            listType="picture-card"
            accept="image/*"
            showUploadList={false}
            beforeUpload={file => {
              const isLt5M = file.size / 1024 / 1024 < 5;
              if (!isLt5M) {
                message.error('文件大小不能超过 5MB');
                return false;
              }
              return true;
            }}
            onChange={info => {
              if (info.file.status === 'uploading') {
                setUploadCoverLoading(true);
                return;
              }
              uploadCover(info.file.originFileObj as File)
                .then(({ path }) => {
                  setCourseCoverPath(path);
                })
                .catch(() => {
                  message.error('封面上传失败');
                });
            }}
          >
            {courseCoverPath ? (
              <img
                className={styles.coverImage}
                src={getUrl(courseCoverPath)}
                alt="avatar"
                onClick={e => {
                  setCourseCoverPath('');
                  setUploadCoverLoading(false);
                  e.stopPropagation();
                }}
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>

        <Form.Item label="其它信息" name="description">
          <Input.TextArea maxLength={30} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            block
            htmlType="submit"
            className={styles.submit}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );

  const addCourseModal = (
    <Modal
      visible={joinCourseModalShow}
      title="请输入课程口令"
      confirmLoading={confirmJoinCourse}
      closable
      centered
      destroyOnClose
      onOk={handleJoinCourse}
      onCancel={() => {
        setJoinCourseModalShow(false);
      }}
      okText="加入"
      cancelText="取消"
      okButtonProps={{
        disabled: !courseTokenValue.trim(),
      }}
      width={1000}
    >
      <Input
        autoFocus
        size="large"
        value={courseTokenValue}
        onChange={e => {
          setCourseTokenValue(e.target.value);
        }}
      />
    </Modal>
  );

  return (
    <>
      <div className={styles.course}>
        <Header
          leftPart={null}
          title="全部课程"
          rightPart={
            <PlusCircleOutlined
              onClick={() => {
                isStudent
                  ? setJoinCourseModalShow(true)
                  : setCreatCourseModalShow(true);
              }}
              style={{
                color: '#1890ff',
              }}
            />
          }
        />
        <PullDown
          abandonHeight={280}
          onRefresh={() => {
            fetchCourseList();
          }}
        >
          <>
            <Skeleton
              active
              avatar={{ shape: 'square' }}
              round
              title={false}
              loading={courseListLoading}
              className={styles.skeleton}
            >
              <CourseList courseList={courseList} />
            </Skeleton>
          </>
        </PullDown>
      </div>

      {addCourseModal}
      {createCourseModal}
    </>
  );
};
