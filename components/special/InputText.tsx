import { Icon } from '@iconify/react/dist/iconify.js';
import { Input, InputProps } from 'antd'
import React from 'react'

type Props = InputProps & {
    prefix?: {
        [key: string]: any;
    };
};

const InputText: React.FC<Props> = ({ ...props }) => {
    const prefix = props?.prefix
    
    return (
        <Input
            {...props}
            prefix={prefix ? <Icon icon={prefix?.name} color={prefix?.prefixColor} /> : undefined}
        />
    )
}

export default InputText