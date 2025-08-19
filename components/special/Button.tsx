import { Button, ButtonProps } from 'antd';
import _ from 'lodash';
import React from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';

type Props = ButtonProps & {
  iconData?: {
    name: string;
    [key: string]: any; // Thêm các thuộc tính khác nếu cần
  };
};
const convertIconStringToComponent = (iconString: string) => {
  if (!iconString || typeof iconString !== 'string') {
    return null;
  }

  return <Icon icon={iconString} />;
};

const ButtonSpecial: React.FC<Props> = ({ ...props }) => {
  const buttonProps = _.cloneDeep(props) || {};
  if (buttonProps.iconData && buttonProps.iconData.name) {
    buttonProps.icon = convertIconStringToComponent(buttonProps.iconData.name);
    // Xóa iconData khỏi props vì Button component không cần nó
    delete buttonProps.iconData;
  }
  return <Button {...buttonProps} />;
};

export default ButtonSpecial;
