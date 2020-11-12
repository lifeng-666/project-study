import request from 'umi-request';
import makeQuery from '@/util/makeQuery';
import { coursePrefix } from '@/server/api';
import { deleteFile } from '@/util/oss';

export const getCourseListTeacher = () =>
  request(`${coursePrefix}/getCourseListTeacher`);

export const getCourseListStudent = () =>
  request(`${coursePrefix}/getCourseListStudent`);

export const joinCourse = (data: { token: string }) =>
  request(`${coursePrefix}/joinCourse`, {
    method: 'POST',
    data,
  });

export const deleteCourse = (data: { courseId: string }) =>
  request(`${coursePrefix}/deleteCourse/${data.courseId}`, {
    method: 'DELETE',
  }).then(({ data }) => {
    data.map((item: string) => deleteFile(item));
    return Promise.resolve(data);
  });

export const createCourse = (data: {
  name: string;
  description: string;
  coverPath: string;
}) =>
  request(`${coursePrefix}/createCourse`, {
    method: 'POST',
    data,
  });

export const getCourseRoles = (data: { courseId: number }) =>
  request(`${coursePrefix}/getCourseRoles${makeQuery(data)}`);

export const kick = (data: { studentId: number; courseId: number }) =>
  request(`${coursePrefix}/kick`, {
    method: 'POST',
    data,
  });

// getCourseRoles({
//   courseId: 10,
// });

// kick({
//   courseId: 11,
//   studentId: 174307121,
// });
