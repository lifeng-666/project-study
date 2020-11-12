import React, { FC, useState } from 'react';
import { history } from 'umi';
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import { Login as LoginType } from '@/type';
import { login } from '@/server';
import { setUerInfo, getMd5 } from '@/util';

import styles from './index.less';

const Login: FC = () => {
  const [loadinig, setLoading] = useState<boolean>(false);
  const onFinish = ({ username, password }: LoginType) => {
    setLoading(true);

    login({
      username,
      password: getMd5(password),
    })
      .then(({ data }) => {
        setLoading(false);
        message.success('登录成功');
        setUerInfo(data).then(() => {
          history.replace('/');
        });
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.login}>
      <div className={styles.backgroung} />
      <div className={styles.wrapper}>
        <div className={styles.title}>
          <h2>工大学习通</h2>
        </div>
        <Form name="login" className={styles.form} onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请输入学号/职工号',
              },
              {
                pattern: /^[\d\w]{9}?$/,
                message: '请输入正确的学号/职工号',
              },
            ]}
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="学号/职工号"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={styles.submit}>
              {loadinig ? '登录中...' : '登录'}
            </Button>
            <div className={styles.register}>
              <span>
                没有账户？
                <a
                  onClick={() => {
                    history.push('/register');
                  }}
                >
                  去注册
                </a>
              </span>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
