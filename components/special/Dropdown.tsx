import { Button, Dropdown as DropdownAntd, DropdownProps } from 'antd';
import React from 'react';

type Props = DropdownProps & { label?: string };

const Dropdown: React.FC<Props> = ({ ...props }) => {
  return (
    <DropdownAntd {...props}>
      <Button>{props?.label || 'Dropdown'}</Button>
    </DropdownAntd>
  );
};

export default Dropdown;
