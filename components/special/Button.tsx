/** @jsxImportSource @emotion/react */
import { Button, ButtonProps } from 'antd';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import React from 'react';

const Icon = dynamic(() => import('@iconify/react').then((m) => m.Icon), { ssr: false });
type Props = ButtonProps & {
  iconData?: {
    name: string;
    [key: string]: any; // Thêm các thuộc tính khác nếu cần
  };
};
const convertIconStringToComponent = (iconString: string) => {
  console.log('🚀 ~ convertIconStringToComponent ~ iconString:', iconString);
  if (!iconString || typeof iconString !== 'string') {
    return null;
  }

  return <Icon icon={iconString} />;
};

const ButtonSpecial: React.FC<Props> = ({ ...props }) => {
  const buttonProps = _.cloneDeep(props) || {};
  console.log('🚀 ~ ButtonSpecial ~ buttonProps:', buttonProps);

  if (buttonProps.iconData && buttonProps.iconData.name) {
    buttonProps.icon = convertIconStringToComponent(buttonProps.iconData.name);
    // Xóa iconData khỏi props vì Button component không cần nó
    delete buttonProps.iconData;
  }
  return <Button {...buttonProps} />;
};

export default ButtonSpecial;
