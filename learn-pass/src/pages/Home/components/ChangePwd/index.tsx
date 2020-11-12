import React, { FC, useState } from 'react';
import { Form, Input, Button, message } from 'antd';

import { updatePwd } from '@/server/index';
import { LockOutlined } from '@ant-design/icons';
import { UpdatePwd } from '@/type';
import { getMd5 } from '@/util';
import styles from './index.less';

const ChangePwd: FC<{
  close: () => void;
}> = ({ close }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = (data: { confirmPassword: string } & UpdatePwd) => {
    if (data.newPassword !== data.confirmPassword) {
      message.error('两次密码不一致!');
      return;
    }
    const { password, newPassword } = data;
    setLoading(true);
    updatePwd({
      password: getMd5(password),
      newPassword: getMd5(newPassword),
    })
      .then(() => {
        setLoading(false);
        close();
        message.success('修改成功');
      })
      .catch(() => {
        setLoading(false);
      });
  };
  return (
    <div className={styles.changePwd}>
      <Form name="changePwd" className={styles.form} onFinish={onFinish}>
        <Form.Item
          className={styles.oldPassword}
          name="password"
          rules={[
            {
              required: true,
              message: '密码不能为空!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="输入原密码"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[
            {
              required: true,
              message: '密码不能为空!',
            },
            {
              pattern: /^[a-zA-Z0-9]{6,}$/,
              message: '密码最低 6 位，支持英文、数字',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="输入新密码"
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: '密码不能为空!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="确认密码"
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.submit}
          >
            点击修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePwd;
