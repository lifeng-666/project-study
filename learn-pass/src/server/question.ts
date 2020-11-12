import request from 'umi-request';
import makeQuery from '@/util/makeQuery';
import cleanObject from '@/util/cleanObject';

import { questionPrefix } from '@/server/api';

export const getQuestions = (data: { courseId?: number; videoId?: number }) =>
  request(`${questionPrefix}/getQuestions${makeQuery(cleanObject(data))}`);
