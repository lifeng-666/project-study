import React, { useState, FC, useEffect } from 'react';
import { Spin, Popconfirm, message } from 'antd';
import {
  CloseCircleOutlined,
  FilePdfOutlined,
  FilePptOutlined,
  FileWordOutlined,
  FileUnknownOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { Document as DocumentType } from '@/type';
import { deleteDocument } from '@/server';
import { getUerInfo } from '@/util';
import { download, getUrl } from '@/util/oss';

import styles from './index.less';

enum FileType {
  WORD = 'word',
  PDF = 'pdf',
  PPT = 'ppt',
  UNKNOWN = 'unknown',
}

const getFileType = (fileName: string) => {
  const suffixes =
    fileName
      .split('.')
      .splice(-1)
      .toString()
      ?.toLowerCase() || '';
  const WORD_SUFFIXES_LIST = ['doc', 'docx'];
  const PDF_SUFFIXES_LIST = ['pdf'];
  const PPT_SUFFIXES_LIST = ['ppt', 'pptx', 'pps', 'pot', 'ppa'];
  if (WORD_SUFFIXES_LIST.includes(suffixes)) return FileType.WORD;
  if (PDF_SUFFIXES_LIST.includes(suffixes)) return FileType.PDF;
  if (PPT_SUFFIXES_LIST.includes(suffixes)) return FileType.PPT;
  return FileType.UNKNOWN;
};

const isUnknownFile = (fileName: string) =>
  getFileType(fileName) === FileType.UNKNOWN;

const getFileIcon = (fileName: string) => {
  const fileType = getFileType(fileName);

  switch (fileType) {
    case FileType.WORD:
      return (
        <FileWordOutlined
          style={{
            color: '#1890ff',
          }}
        />
      );
    case FileType.WORD:
      return (
        <FileWordOutlined
          style={{
            color: '#1890ff',
          }}
        />
      );
    case FileType.PDF:
      return (
        <FilePdfOutlined
          style={{
            color: '#ff4d4f',
          }}
        />
      );
    case FileType.PPT:
      return (
        <FilePptOutlined
          style={{
            color: '#67c23a',
          }}
        />
      );

    default:
      return <FileUnknownOutlined />;
  }
};

const Document: FC<DocumentType & {
  onRefresh: () => void;
}> = ({ id, path, name, createTime, onRefresh }) => {
  const isTeacher = getUerInfo().isTeacher;
  const fileName = path
    .split('/')
    .splice(-1)
    .toString();
  const [show, setShow] = useState<boolean>(false);
  const [iframeLoading, setIframeLoading] = useState<boolean>(false);
  const [url, setUrl] = useState('');

  const handleDeleteDocument = (id: number) => {
    deleteDocument({
      documentId: String(id),
    }).then(() => {
      message.success('删除成功');
      onRefresh?.();
    });
  };
  const handledDownloadDocument = (path: string) => {
    const close = message.loading('正在下载...');
    download(path)
      .then(() => close())
      .catch(() => {
        close();
        message.info('文件不存在或已失效');
      });
  };

  const isPdf = getFileType(fileName) === FileType.PDF;

  useEffect(() => {
    setUrl(getUrl(path));
  }, []);

  return (
    <>
      <div
        className={styles.document}
        onClick={() => {
          if (isPdf) {
            setShow(true);
            setIframeLoading(true);
          } else {
            message.info('暂仅支持预览 pdf 类型课件，请下载后查看');
          }
        }}
      >
        <div className={styles.icon}>{getFileIcon(fileName)}</div>
        <div className={styles.info}>
          <span className={styles.name}>{name}</span>
          <span className={styles.createTime}>{createTime}</span>
        </div>
        <div className={styles.operate} onClick={e => e.stopPropagation()}>
          <DownloadOutlined
            className={styles.downloadIcon}
            onClick={() => handledDownloadDocument(path)}
          />
          {isTeacher && (
            <Popconfirm
              title="确定删除该课件?"
              placement="left"
              onConfirm={() => {
                return handleDeleteDocument(id);
              }}
              okText="删除"
              cancelText="取消"
            >
              <DeleteOutlined className={styles.deleteIcon} />
            </Popconfirm>
          )}
        </div>
      </div>
      {iframeLoading && (
        <div className={styles.loading}>
          <Spin />
        </div>
      )}

      {show && (
        <>
          <div className={styles.fileShow}>
            <iframe
              onLoad={() => {
                setIframeLoading(false);
              }}
              src={url}
              style={{
                width: '100%',
                height: '100%',
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                border: 'none',
                backgroundColor: '#fff',
              }}
            />
          </div>
          <CloseCircleOutlined
            className={styles.closeIcon}
            onClick={() => {
              setShow(false);
            }}
          />
        </>
      )}
    </>
  );
};
export default Document;
