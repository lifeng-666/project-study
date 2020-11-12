import React, { FC } from 'react';
import classnames from 'classnames';

import { Radio as AntdRadio } from 'antd';

import styles from './index.less';

interface RadioProps {
  completed?: boolean;
  className?: string;
}

const Radio: FC<RadioProps> = ({ completed = false, className = '' }) => {
  return (
    <AntdRadio
      className={classnames({
        [styles.radio]: true,
        [className]: Boolean(className),
      })}
      checked={completed}
    />
  );
};

export default Radio;
