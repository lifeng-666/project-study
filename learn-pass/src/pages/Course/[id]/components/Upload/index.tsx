import React, { useState, FC } from 'react';
import {
  Button,
  Modal,
  Input,
  message,
  Form,
  Upload as AntdUpload,
  Progress,
} from 'antd';
import { UploadOutlined, SyncOutlined } from '@ant-design/icons';

import { AddFile, Process } from '@/type';
import { resumeUpload, abortMultipartUpload } from '@/util/oss';

import styles from './index.less';

const TYPE_INFO_MAP = {
  video: {
    key: 'video',
    text: '视频',
  },
  document: {
    key: 'document',
    text: '课件',
  },
};

interface UploadProps {
  type: 'video' | 'document';
  sizeLimite: number;
  onFinish?: ({ path, name }: AddFile) => Promise<void>;
  upLoadFn: (
    file: File,
  ) => (getProcess?: Process) => Promise<{ path: string; name: string }>;
  onChange?: () => void;
  courseId: number;
}
const Upload: FC<UploadProps> = ({
  type,
  onFinish,
  sizeLimite,
  upLoadFn,
  onChange,
  courseId,
}) => {
  const [addModelShow, setAddModelShow] = useState<boolean>(false);
  const [isSubmiting, setIsSubmiting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isUploadfail, setIsUploadfail] = useState<boolean>(false);
  const [isGettingLocalFile, setIsGettingLocalFile] = useState<boolean>(false);
  const [upLoadProcess, setUpLoadProcess] = useState<number>(0);
  const [fileList, setFileList] = useState<File[]>();
  const [file, setFile] = useState<{
    path: string;
    name: string;
  }>();

  const reset = () => {
    abortMultipartUpload();
    setIsSubmiting(false);
    setIsUploading(false);
    setIsUploadfail(false);
    setIsGettingLocalFile(false);
    setUpLoadProcess(0);
    setFileList([]);
    setFile(undefined);
    setAddModelShow(false);
  };

  const text = TYPE_INFO_MAP[type].text;
  const isVideo = () => type === 'video';
  const handleProcess = ({ process }: { process: number }) =>
    setUpLoadProcess(Math.floor(process * 100));

  const handleUpload = (p?: Promise<{ path: string; name: string }>) => {
    setIsUploadfail(false);
    p?.then(({ path, name }) => {
      setFile({ path, name });
      setIsUploading(false);
      message.success('上传成功');
    }).catch(() => {
      message.error('上传失败');
      setIsUploadfail(true);
    });
  };

  return (
    <div>
      <Button
        block
        type="primary"
        onClick={() => {
          setAddModelShow(true);
        }}
      >
        {`上传${text}`}
      </Button>

      <Modal
        visible={addModelShow}
        title={`上传${text}`}
        closable
        centered
        destroyOnClose
        onCancel={async () => {
          if (fileList?.length) {
            Modal.confirm({
              title: '将终止文件上传或清除已上传文件，确定关闭？',
              width: 800,
              okText: '确定',
              cancelText: '取消',
              onOk() {
                reset();
              },
            });
          } else reset();
        }}
        footer={false}
        width={1000}
        className={styles.uploadModal}
      >
        <Form
          onFinish={({ name }) => {
            if (!fileList?.length) {
              message.info(`请上传${text}文件
            `);
              return;
            }
            if (!file?.name || !file?.path || !name) return;
            const data = {
              name,
              path: file.path,
              courseId,
            };
            setIsSubmiting(true);

            onFinish?.(data)
              .then(() => {
                setFileList([]);
                message.success('提交成功!');
                setAddModelShow(false);
                setIsSubmiting(false);
              })
              .catch(() => {
                setIsSubmiting(false);
              });
          }}
        >
          <Form.Item
            label={`${text}名`}
            name="name"
            rules={[{ required: true, message: `请输入${text}名` }]}
          >
            <Input size="large" maxLength={30} />
          </Form.Item>
          <Form.Item
            label="上传文件"
            name="file"
            rules={[{ required: true, message: `请上传${text}文件` }]}
          >
            <AntdUpload
              accept={isVideo() ? 'video/*' : '*'}
              disabled={Boolean(fileList?.length) || isGettingLocalFile}
              headers={{
                authorization: 'authorization-text',
              }}
              //@ts-ignore
              fileList={fileList}
              beforeUpload={file => {
                if (file.size / 1024 / 1024 > sizeLimite) {
                  message.error(`文件大小不能超过 ${sizeLimite}MB`);
                  setFileList([]);
                  return false;
                }
                return true;
              }}
              onChange={info => {
                const file = info.file.originFileObj;

                switch (info.file.status) {
                  case 'done':
                    setFileList([file as File]);
                    setIsUploading(true);
                    handleUpload(upLoadFn(file as File)(handleProcess));
                    setIsGettingLocalFile(false);

                    onChange?.();
                    break;
                  case 'removed':
                    setIsUploading(false);
                    setFileList([]);
                    setIsGettingLocalFile(false);
                    abortMultipartUpload();
                    break;
                  case 'uploading':
                    setIsGettingLocalFile(true);
                }
              }}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={Boolean(fileList?.length) || isGettingLocalFile}
              >{`点击上传${text}`}</Button>
            </AntdUpload>
          </Form.Item>
          {isUploading && (
            <div className={styles.progress}>
              <Progress
                size="small"
                percent={upLoadProcess}
                status={isUploadfail ? 'exception' : 'normal'}
              />
              {isUploadfail && (
                <Button
                  style={{ color: '#67c23a' }}
                  icon={<SyncOutlined />}
                  shape="circle"
                  size="small"
                  onClick={() => {
                    handleUpload(resumeUpload()(handleProcess));
                  }}
                />
              )}
            </div>
          )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isUploading}
            >
              {isUploading ? '上传中...' : isSubmiting ? '提交中...' : '提交'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Upload;
