import request from 'umi-request';
import { message } from 'antd';

request.interceptors.response.use(async response => {
  try {
    const { code, msg } = await response.clone().json();

    if (code !== 200) {
      message.error(msg);
      return Promise.reject();
    }
  } catch (e) {
    console.log(e);
  }
  return response;
});

request.interceptors.request.use((url, options) => {
  if (!navigator.onLine) message.error('无网络');
  return {
    url,
    options,
  };
});
