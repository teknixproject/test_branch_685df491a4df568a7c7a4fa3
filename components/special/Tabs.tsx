/** @jsxImportSource @emotion/react */
import { Tabs as TabsAntd, TabsProps } from 'antd';
import React from 'react';
import { css } from '@emotion/react';

import RenderSliceItem from '../grid-systems/RenderSliceItem';

interface StyleHeaderTabs {
  tabStyles?: React.CSSProperties;
  activeTabStyles?: React.CSSProperties;
  hoverTabStyles?: React.CSSProperties;
  customCSS?: string;
}

interface Props extends TabsProps {
  styleHeaderTabs?: StyleHeaderTabs;
}

const Tabs: React.FC<Props> = ({ styleHeaderTabs, ...props }) => {
  const data = props?.items?.map((item: any) => {
    return {
      ...item,
      children: <RenderSliceItem data={item.children} />,
    };
  });

  // Convert CSSProperties object to CSS string
  const objectToCSSString = (obj: React.CSSProperties = {}): string => {
    return Object.entries(obj)
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${cssKey}: ${value}`;
      })
      .join('; ');
  };

  // Default styles
  const defaultTabStyles: React.CSSProperties = {
    background: '#f0f0f0',
    border: '1px solid #d9d9d9',
    borderRadius: '20px',
    padding: '8px 20px',
    margin: '0',
    color: '#666',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    ...styleHeaderTabs?.tabStyles
  };

  const defaultActiveTabStyles: React.CSSProperties = {
    background: '#1890ff',
    borderColor: '#1890ff',
    color: 'white',
    ...styleHeaderTabs?.activeTabStyles
  };

  const defaultHoverTabStyles: React.CSSProperties = {
    background: '#e6f4ff',
    borderColor: '#40a9ff',
    color: '#1890ff',
    ...styleHeaderTabs?.hoverTabStyles
  };

  // Generate unique class name to avoid conflicts
  const uniqueClass = `custom-tabs-${Math.random().toString(36).substr(2, 9)}`;

  const customStyles = css`
    &.${uniqueClass} .ant-tabs-nav {
      margin-bottom: 24px;
    }
    
    &.${uniqueClass} .ant-tabs-nav-wrap {
      background: transparent;
    }
    
    &.${uniqueClass} .ant-tabs-nav-list {
      display: flex;
      gap: 8px;
    }
    
    &.${uniqueClass} .ant-tabs-tab {
      ${objectToCSSString(defaultTabStyles)} !important;
    }
    
    &.${uniqueClass} .ant-tabs-tab:hover {
      ${objectToCSSString(defaultHoverTabStyles)} !important;
    }
    
    &.${uniqueClass} .ant-tabs-tab.ant-tabs-tab-active {
      ${objectToCSSString(defaultActiveTabStyles)} !important;
    }
    
    &.${uniqueClass} .ant-tabs-tab-btn {
      color: inherit !important;
      font-size: 14px;
    }
    
    &.${uniqueClass} .ant-tabs-ink-bar {
      display: none !important;
    }
    
    &.${uniqueClass} .ant-tabs-content-holder {
      padding: 16px 0;
    }
    
    ${styleHeaderTabs?.customCSS || ''}
  `;

  return (
    <div css={customStyles} className={uniqueClass}>
      <TabsAntd {...props} items={data} />
    </div>
  );
};

export default Tabs;