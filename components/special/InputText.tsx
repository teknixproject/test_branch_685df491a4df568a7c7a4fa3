const Icon = dynamic(() => import('@iconify/react').then((m) => m.Icon), { ssr: false });
import { Input, InputProps } from 'antd';
import dynamic from 'next/dynamic';
import React from 'react';

type Props = InputProps & {
  prefix?: {
    [key: string]: any;
  };
};

const InputText: React.FC<Props> = ({ ...props }) => {
  const prefix = props?.prefix;

  return (
    <Input
      {...props}
      prefix={prefix ? <Icon icon={prefix?.name} color={prefix?.prefixColor} /> : undefined}
    />
  );
};

export default InputText;
