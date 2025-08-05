'use client';
import { App } from 'antd';
import React from 'react';

import { StyleProvider } from '@ant-design/cssinjs';
import { AntdRegistry } from '@ant-design/nextjs-registry';

type Props = {
  children: React.ReactNode;
};

const AntdProvider: React.FC<Props> = ({ children }) => {
  return (
    <AntdRegistry>
      <StyleProvider>
        <App>{children}</App>
      </StyleProvider>
    </AntdRegistry>
  );
};

export default AntdProvider;
