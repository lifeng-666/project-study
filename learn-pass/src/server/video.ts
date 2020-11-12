import request from 'umi-request';

import makeQuery from '@/util/makeQuery';
import { deleteFile } from '@/util/oss';

import { AddVideo } from '@/type';
import { videoPrefix } from '@/server/api';

export const getVideoList = (data: { courseId: number }) =>
  request(`${videoPrefix}/getVideoList${makeQuery(data)}`);

export const getVideo = (data: { videoId: number }) =>
  request(`${videoPrefix}/getVideo${makeQuery(data)}`);

export const getVideoProcess = (data: { videoId: number }) =>
  request(`${videoPrefix}/getVideoProcess${makeQuery(data)}`);

export const reportVideoProcess = (data: {
  videoId: number;
  process: number;
}) =>
  request(`${videoPrefix}/reportVideoProcess`, {
    method: 'POST',
    data,
  });

export const finishVideo = (data: { videoId: number }) =>
  request(`${videoPrefix}/finishVideo`, {
    method: 'POST',
    data,
  });

export const deleteVideo = (data: { videoId: string }) =>
  request(`${videoPrefix}/deleteVideo/${data.videoId}`, {
    method: 'DELETE',
  }).then(({ data }) => {
    data.map((item: string) => deleteFile(item));
    return Promise.resolve(data);
  });

export const addVideo = (data: AddVideo) =>
  request(`${videoPrefix}/addVideo`, {
    method: 'POST',
    data,
  });
