import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.less';
import { Input } from 'antd';
import { Button } from 'antd';
import UnFinish from './UnFinish';
import Finish from './Finish';
import { setItem, getItem } from '@/util/storage';

interface event {
  target: {
    value: string;
  };
}

export default function Affair() {
  const [finish, setfinish] = useState<string[]>([]);
  const [unFinish, setunFinish] = useState<string[]>([]);
  const [val, setval] = useState('');
  const change = useCallback((e: event) => {
    setval(e.target.value);
  }, []);
  const add = useCallback(() => {
    if (!val.trim()) return;
    const tpl: string[] = [...unFinish];
    tpl.push(val);
    setunFinish(tpl);
    setItem('unFinish', tpl);
    setval('');
  }, [val]);
  useEffect(() => {
    const f = getItem('finish');
    const v = f === null ? [] : f;
    setfinish(v);
    const uf = getItem('unFinish');
    const uv = uf === null ? [] : uf;
    setunFinish(uv);
  }, []);

  const update = useCallback(
    (i: number) => {
      const tpl = [...unFinish];
      const finishArr = [...finish];
      const aff = tpl.splice(i, 1).toString();
      finishArr.push(aff);
      setunFinish(tpl);
      setfinish(finishArr);
      setItem('unFinish', tpl);
      setItem('finish', finishArr);
    },
    [unFinish, finish],
  );
  const remove = useCallback(
    (i: number) => {
      const tpl = [...finish];
      tpl.splice(i, 1);
      setfinish(tpl);
      setItem('finish', tpl);
    },
    [finish, unFinish],
  );
  return (
    <div className={styles.wrapper}>
      <div className={styles.add}>
        <Input
          size="large"
          placeholder="代办事项"
          value={val}
          onChange={change}
        />
        <Button type="primary" onClick={add} className={styles.addBtn}>
          添加
        </Button>
      </div>
      <UnFinish affairs={unFinish} finish={update} />
      <Finish Finishs={finish} remove={remove} />
    </div>
  );
}
