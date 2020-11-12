import md5 from 'js-md5';

import { UserInfo, Role } from '@/type';
import { setItem, getItem, removeItem } from './storage';

const USER_INFO = 'user_info';

export const getUerInfo = () => {
  const userInfo: UserInfo = getItem(USER_INFO);

  return {
    userInfo,
    isLogin: Boolean(userInfo),
    type: Role[userInfo?.rid],
    isStudent: userInfo?.rid === Role.Student,
    isTeacher: userInfo?.rid === Role.Teacher,
  };
};

export const setUerInfo: (userInfo: UserInfo) => Promise<string> = userInfo =>
  new Promise((res, rej) => {
    try {
      setItem(USER_INFO, userInfo);
    } catch (e) {
      // note! may throw
      rej(e);
    }
    res();
  });

const deleteUserInfo = () => removeItem(USER_INFO);

export const delay = async (duration: number) => {
  return new Promise(resolve => {
    let timer: Timeout;
    timer = setTimeout(() => {
      resolve();
      clearTimeout(timer);
    }, duration);
  });
};

export const logout = () => {
  document.cookie = 'token=; max-age=-1';
  deleteUserInfo();
};

export const getMd5 = (data: string) => md5(data);
