import request from 'umi-request';
import makeQuery from '@/util/makeQuery';
import cleanObject from '@/util/cleanObject';
import { deleteFile } from '@/util/oss';
import { AddDocument } from '@/type';

import { documentPrefix } from '@/server/api';

export const getDocuments = (data: { courseId?: number; videoId?: number }) =>
  request(`${documentPrefix}/getDocuments${makeQuery(cleanObject(data))}`);

export const deleteDocument = (data: { documentId: string }) =>
  request(`${documentPrefix}/deleteDocument/${data.documentId}`, {
    method: 'DELETE',
  }).then(({ data }) => {
    data.map((item: string) => deleteFile(item));
    return Promise.resolve(data);
  });

export const addDocument = (data: AddDocument) =>
  request(`${documentPrefix}/addDocument`, {
    method: 'POST',
    data,
  });
