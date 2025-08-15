import { Modal as ModalAntd, ModalProps } from 'antd';
import React from 'react';

type Props = ModalProps;

const Modal: React.FC<Props> = ({ ...props }) => {
  return <ModalAntd {...props} destroyOnHidden />;
};

export default Modal;
