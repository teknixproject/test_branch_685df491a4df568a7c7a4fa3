import { Select as SelectCpn, SelectProps } from 'antd'
import React from 'react'

type Props = SelectProps & {
    styleMultiple?: React.CSSProperties;
    [key: string]: any;
};

const Select: React.FC<Props> = ({ styleMultiple, ...props }) => {
    // Tạo unique class name
    const uniqueClassName = React.useMemo(() => 
        `custom-select-${Math.random().toString(36).substr(2, 9)}`, 
        []
    );
    
    // Tạo dynamic styles
    const dynamicStyles = React.useMemo(() => {
        if (!styleMultiple || Object.keys(styleMultiple).length === 0) return null;
        
        const cssProperties = Object.entries(styleMultiple)
            .map(([key, value]) => {
                // Convert camelCase to kebab-case
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${cssKey}: ${value};`;
            })
            .join(' ');
            
        return (
            <style>
                {`.${uniqueClassName} .ant-select-selector { ${cssProperties} }`}
            </style>
        );
    }, [styleMultiple, uniqueClassName]);
    
    return (
        <>
            {dynamicStyles}
            <SelectCpn
                {...props}
                className={`${props.className || ''} ${uniqueClassName}`.trim()}
            />
        </>
    )
}

export default Select