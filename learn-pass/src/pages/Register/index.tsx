import React, { FC, useState } from 'react';
import { history } from 'umi';
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Radio,
  AutoComplete,
} from 'antd';

import { Register, Role } from '@/type';
import { register } from '@/server';

import Header from '@/components/Header';

import SUBJECT_LIST from '@/assets/info/subjects';
import COLLEGE_LIST from '@/assets/info/college';

import styles from './index.less';

const { Option } = Select;
const ChangeInfo: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  return (
    <>
      <Header title="注册" />
      <div className={styles.register}>
        <Form
          autoComplete="off"
          onValuesChange={data => {
            Object.keys(data).map(key => {
              if (key !== 'sex' && key !== 'rid') data[key] = data[key].trim();
            });
            form.setFieldsValue(data);
          }}
          form={form}
          onFinish={(data: Register) => {
            setLoading(true);
            register(data)
              .then(() => {
                let a = 0;
                setInterval(() => {
                  a++;
                }, 500);
                message.success(`注册成功,正在返回登录页...`);
                setTimeout(() => {
                  history.replace('/login');
                }, 1000);
                setLoading(false);
              })
              .catch(() => {
                setLoading(false);
              });
          }}
        >
          <Form.Item
            name="username"
            label="账号"
            rules={[
              {
                required: true,
                message: '请输入账号',
              },
              {
                pattern: /^[\d\w]{9}?$/,
                message: '账号格式为 9 位英文+数字',
              },
            ]}
          >
            <Input
              size="large"
              placeholder="如: JC1234567"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="密码"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              {
                pattern: /^[\d\w]{6,20}?$/,
                message: '密码格式为 6-20 位英文+数字',
              },
            ]}
          >
            <Input placeholder="如: 123abc456" size="large" />
          </Form.Item>
          <Form.Item
            label="姓名"
            name="realname"
            rules={[
              {
                required: true,
                message: '请输入姓名',
              },
            ]}
          >
            <Input size="large" placeholder="如：张三" maxLength={15} />
          </Form.Item>
          <Form.Item
            label="身份"
            name="rid"
            rules={[
              {
                required: true,
                message: '请选择身份',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={Role.Teacher}>老师</Radio>
              <Radio value={Role.Student}>学生</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="性别" name="sex">
            <Radio.Group defaultValue={true}>
              <Radio value={true}>男</Radio>
              <Radio value={false}>女</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="院系" name="college">
            <Select listHeight={800}>
              {COLLEGE_LIST.map(item => (
                <Option value={item}>{item}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="专业" name="subject">
            <AutoComplete
              options={SUBJECT_LIST}
              size="large"
              filterOption
              placeholder="如：计算机科学与技术"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              block
              htmlType="submit"
              loading={loading}
              className={styles.submit}
            >
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ChangeInfo;
