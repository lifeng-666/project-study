import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';

import { getDocuments, addDocument } from '@/server';
import { Document as DocumentType, AddDocument } from '@/type';
import { getUerInfo } from '@/util';
import { uploadDocument } from '@/util/oss';

import PullDown from '@/components/PullDown';
import Empty from '@/components/Empty';

import Document from '../Document';
import Upload from '../Upload';

import styles from './index.less';

export default ({ courseId }: { courseId: number }) => {
  const [documentList, setDocumentList] = useState<DocumentType[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDocumentList = () => {
    setLoading(true);
    setDocumentList([]);
    getDocuments({
      courseId: courseId,
    })
      .then(({ data }: { data: DocumentType[] }) => {
        setDocumentList(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const isTeacher = getUerInfo().isTeacher;

  useEffect(() => {
    fetchDocumentList();
  }, []);

  const list = documentList?.length ? (
    documentList?.map(ele => {
      return <Document key={ele.id} {...ele} onRefresh={fetchDocumentList} />;
    })
  ) : (
    <Empty />
  );
  return (
    <PullDown
      LoadingHeight={140}
      abandonHeight={320}
      onRefresh={fetchDocumentList}
    >
      <>
        <div className={styles.documentWrapper}>
          <Skeleton loading={loading} active title={false}>
            {list}
          </Skeleton>
          {isTeacher && (
            <div className={styles.upload}>
              <Upload
                type="document"
                sizeLimite={20}
                onFinish={(data: AddDocument) =>
                  addDocument(data).then(() => {
                    fetchDocumentList();
                  })
                }
                upLoadFn={(file: File) => uploadDocument(file)}
                courseId={courseId}
              />
            </div>
          )}
        </div>
      </>
    </PullDown>
  );
};
