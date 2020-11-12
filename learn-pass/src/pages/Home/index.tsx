import React, { useState, cloneElement } from 'react';
import { Button } from 'antd';
import { history } from 'umi';
import Header from '@/components/Header';
import {
  SmileTwoTone,
  RightOutlined,
  SettingOutlined,
} from '@ant-design/icons';

import { UserInfo } from '@/type';
import { getUerInfo, setUerInfo as setLocalUserInfo } from '@/util';
import { logout } from '@/util';

import Affair from './components/Affair';
import ChangePwd from './components/ChangePwd';
import ChangeInfo from './components/ChangeInfo';
import Toggle from './components/Toggle';
import PersonShow from '../Home/components/PersonShow';

import styles from './index.less';

enum Operation {
  AFFAIR = 'Affair',
  CHANG_PWD = 'ChangePwd',
  CHANGE_INFO = 'ChangeInfo',
}

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo>(getUerInfo().userInfo);

  const setInfo = (data: UserInfo) => {
    setLocalUserInfo(data);
    setUserInfo(data);
  };

  const [toggleShow, setToggleShow] = useState<boolean>(false);
  const [curOperation, setCurOperation] = useState<Operation>(Operation.AFFAIR);

  const close = () => {
    setToggleShow(false);
  };

  const openToggle = (name: Operation) => {
    setToggleShow(true);
    setCurOperation(name);
  };

  const operatonMap = {
    [Operation.CHANG_PWD]: {
      component: <ChangePwd close={close} />,
      title: '修改密码',
    },
    [Operation.CHANGE_INFO]: {
      component: <ChangeInfo setInfo={setInfo} close={close} />,
      title: '修改资料',
    },
    [Operation.AFFAIR]: {
      component: <Affair />,
      title: '我的计划',
    },
  };

  const affair = (
    <p
      className={styles.item}
      onClick={() => {
        openToggle(Operation.AFFAIR);
      }}
    >
      <span className={styles.icon}>
        <SmileTwoTone />
      </span>
      <span>我的计划</span>
      <span className={styles.link}>
        <RightOutlined className={styles.arrow} />
      </span>
    </p>
  );
  const changePwd = (
    <p
      className={styles.item}
      onClick={() => {
        openToggle(Operation.CHANG_PWD);
      }}
    >
      <span className={styles.icon}>
        <SettingOutlined style={{ color: '#1890ff' }} />
      </span>
      <span>修改密码</span>
      <span className={styles.link}>
        <RightOutlined className={styles.arrow} />
      </span>
    </p>
  );

  const changeInfo = (
    <>
      <p
        className={styles.item}
        onClick={() => {
          openToggle(Operation.CHANGE_INFO);
        }}
      >
        <span className={styles.icon}>
          <SettingOutlined style={{ color: '#1890ff' }} />
        </span>
        <span>修改资料</span>
        <span className={styles.link}>
          <RightOutlined className={styles.arrow} />
        </span>
      </p>
    </>
  );

  const logoutEle = (
    <span className={styles.exit}>
      <Button
        type="primary"
        danger
        shape="round"
        onClick={() => {
          history.push('/login');
          setTimeout(logout, 500);
        }}
        className={styles.exitBtn}
      >
        退出登录
      </Button>
    </span>
  );
  return (
    <div className={styles.home}>
      <Header title="我" leftPart={null} />
      <PersonShow {...userInfo} />
      <div>
        {/* 修改密码模块 */}
        {changePwd}

        {/* 修改资料模块 */}
        {changeInfo}
        {/* 备忘录模块 */}
        {affair}

        {/* 注销登录 */}
        {logoutEle}
      </div>
      <Toggle
        visible={toggleShow}
        close={() => {
          setToggleShow(false);
        }}
        title={operatonMap[curOperation].title}
      >
        {cloneElement(operatonMap[curOperation].component)}
      </Toggle>
    </div>
  );
}
