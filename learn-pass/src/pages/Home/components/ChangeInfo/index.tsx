import React, { FC, useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  message,
  Select,
  Radio,
  AutoComplete,
} from 'antd';

import { UserInfo, UserInfoWithOutRole } from '@/type';
import { getInfo, updateInfo } from '@/server';
import SUBJECT_LIST from '@/assets/info/subjects';
import COLLEGE_LIST from '@/assets/info/college';

import styles from './index.less';

const { Option } = Select;
const ChangeInfo: FC<{
  setInfo: (data: UserInfo) => void;
  close: () => void;
}> = ({ setInfo, close }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getInfo().then(({ data }) => {
      form.setFieldsValue(data);
    });
  }, []);

  return (
    <div className={styles.changeInfo}>
      <Form
        onValuesChange={data => {
          Object.keys(data).map(key => {
            if (key !== 'sex') data[key] = data[key].trim();
          });
          form.setFieldsValue(data);
        }}
        form={form}
        onFinish={(data: UserInfoWithOutRole) => {
          setLoading(true);

          updateInfo(data)
            .then(() => {
              message.success('修改成功');
              close();
              setLoading(false);
              getInfo().then(({ data }) => {
                setInfo(data);
              });
            })
            .catch(() => {
              setLoading(false);
            });
        }}
      >
        <Form.Item
          label="姓名"
          name="realname"
          required={false}
          rules={[
            {
              required: true,
              message: '请输入姓名',
            },
          ]}
        >
          <Input size="large" maxLength={15} />
        </Form.Item>
        <Form.Item label="性别" name="sex">
          <Radio.Group>
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
          <AutoComplete options={SUBJECT_LIST} size="large" filterOption />
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
  );
};

export default ChangeInfo;
