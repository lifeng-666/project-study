import request from 'umi-request';

import { Login, UpdatePwd, Register, UserInfoWithOutRole } from '@/type';

import { userPrefix } from '@/server/api';

export const login = (data: Login) =>
  request(`${userPrefix}/login`, {
    method: 'POST',
    data,
  });

export const updatePwd = (data: UpdatePwd) =>
  request(`${userPrefix}/updatePwd`, {
    method: 'PUT',
    data,
  });

export const register = (data: Register) =>
  request(`${userPrefix}/register`, {
    method: 'POST',
    data,
  });

export const updateInfo = (data: UserInfoWithOutRole) =>
  request(`${userPrefix}/updateInfo`, {
    method: 'PUT',
    data,
  });

export const getInfo = () => request(`${userPrefix}/getInfo`);
