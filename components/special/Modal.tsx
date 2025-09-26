'use client';
/** @jsxImportSource @emotion/react */
import { Modal as ModalAntd, ModalProps } from 'antd';
import React from 'react';

type Props = ModalProps & {
  styleMultiple?: React.CSSProperties;
};

const Modal: React.FC<Props> = ({ styleMultiple, ...props }) => {
  const mergedStyles: any = {
    content: {
      pointerEvents: 'auto',
      margin: '0',
      padding: '0',
    },
    body: {
      padding: '20px 24px',
      ...styleMultiple,
    },
  };

  return <ModalAntd {...props} />;
};

export default Modal;
