
import { Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { Icon } from '@iconify/react/dist/iconify.js';

interface NavigationMenuProps {
  items: any[];
  mode?: 'horizontal' | 'vertical' | 'inline';
  theme?: 'light' | 'dark';
  style?: React.CSSProperties;
  defaultSelectedKeys?: string[];
  defaultOpenKeys?: string[];
  multiple?: boolean;
  selectable?: boolean;
  inlineCollapsed?: boolean;
  inlineIndent?: number;
  triggerSubMenuAction?: 'hover' | 'click';
  forceSubMenuRender?: boolean;
  onSelect?: (param: any) => void;
  onDeselect?: (param: any) => void;
  onOpenChange?: (openKeys: string[]) => void;
  // Color configuration props
  textColor?: string;
  textHoverColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  borderRadius?: number;
}

const convertIconStringToComponent = (iconString: string) => {
  if (!iconString || typeof iconString !== 'string') {
    return null;
  }
  return <Icon icon={iconString} />;
};

const ConfigMenu: React.FC<NavigationMenuProps> = ({
  items,
  mode = 'horizontal',
  theme = 'light',
  style = {},
  defaultSelectedKeys = [],
  defaultOpenKeys = [],
  multiple,
  selectable,
  inlineCollapsed,
  inlineIndent,
  triggerSubMenuAction,
  forceSubMenuRender,
  onSelect,
  onDeselect,
  onOpenChange,
  // Color props
  textColor = '#000000',
  textHoverColor = '#000000',
  hoverBackgroundColor = '#f5f5f5',
  activeBackgroundColor = '#1890ff',
  activeTextColor = '#ffffff',
  borderRadius = 0,
  ...props
}) => {
  const router = useRouter();
  const pathname = usePathname();

  // Generate unique class name for this instance
  const uniqueClassName = useMemo(() => `custom-menu-${Math.random().toString(36).substr(2, 9)}`, []);

  // Process menu items with icon conversion
  const processMenuItems = useCallback((menuItems: any[]): any[] => {
    if (!Array.isArray(menuItems)) return menuItems;

    return menuItems.map((item) => {
      const processedItem = { ...item };

      // Convert icon string to Icon component
      if (processedItem.icon && typeof processedItem.icon === 'string') {
        processedItem.icon = convertIconStringToComponent(processedItem.icon);
      }

      // Process children recursively
      if (processedItem.children && Array.isArray(processedItem.children)) {
        processedItem.children = processMenuItems(processedItem.children);
      }

      // Ensure key exists if not present
      if (!processedItem.key && processedItem.label) {
        processedItem.key = processedItem.label.toLowerCase().replace(/\s+/g, '-');
      }

      return processedItem;
    });
  }, []);

  // Find selectedKeys based on pathname
  const getSelectedKeysFromPathname = useCallback(
    (menuItems: any[], currentPath: string): string[] => {
      const selectedKeys: string[] = [];

      const findMatchingKeys = (items: any[], path: string) => {
        for (const item of items || []) {
          if (item.key === path) {
            selectedKeys.push(item.key);
            return true;
          }

          if (item.children && Array.isArray(item.children)) {
            if (findMatchingKeys(item.children, path)) {
              selectedKeys.push(item.key);
              return true;
            }
          }
        }
        return false;
      };

      findMatchingKeys(menuItems, currentPath);
      return selectedKeys;
    },
    []
  );

  // Handle menu click
  const handleMenuClick = useCallback(
    (menuInfo: { key: string }) => {
      const key = menuInfo.key;
      router.push(key);
    },
    [router]
  );

  // Processed items
  const processedItems = useMemo(() => processMenuItems(items), [items, processMenuItems]);

  // Selected keys based on pathname
  const selectedKeys = useMemo(() => {
    const pathBasedKeys = getSelectedKeysFromPathname(items, pathname);
    return pathBasedKeys.length > 0 ? pathBasedKeys : defaultSelectedKeys;
  }, [items, pathname, defaultSelectedKeys, getSelectedKeysFromPathname]);

  // Generate CSS styles
  const customStyles = useMemo(() => {
    return `
      .${uniqueClassName}.ant-menu {
        background: transparent !important;
        border: none !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-item {
        color: ${textColor} !important;
        border-radius: ${borderRadius}px !important;
        margin: 2px 0 !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-item:hover {
        background-color: ${hoverBackgroundColor} !important;
        color: ${textHoverColor} !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-item-selected {
        background-color: ${activeBackgroundColor} !important;
        color: ${activeTextColor} !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-item-active {
        background-color: ${activeBackgroundColor} !important;
        color: ${activeTextColor} !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-submenu-title {
        color: ${textColor} !important;
        border-radius: ${borderRadius}px !important;
        margin: 2px 0 !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-submenu-title:hover {
        background-color: ${hoverBackgroundColor} !important;
        color: ${textHoverColor} !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-submenu-selected > .ant-menu-submenu-title {
        background-color: ${activeBackgroundColor} !important;
        color: ${activeTextColor} !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-submenu-arrow {
        color: inherit !important;
      }
      
      .${uniqueClassName} .ant-menu-sub {
        background: transparent !important;
      }
      
      .${uniqueClassName} .ant-menu-sub .ant-menu-item {
        color: ${textColor} !important;
        border-radius: ${borderRadius}px !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-sub .ant-menu-item:hover {
        background-color: ${hoverBackgroundColor} !important;
        color: ${textHoverColor} !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-sub .ant-menu-item-selected {
        background-color: ${activeBackgroundColor} !important;
        color: ${activeTextColor} !important;
        border-right: none !important;
      }
      
      .${uniqueClassName} .ant-menu-submenu .ant-menu-submenu-title {
        border-radius: ${borderRadius}px !important;
        border-right: none !important;
      }
    `;
  }, [uniqueClassName, textColor, textHoverColor, hoverBackgroundColor, activeBackgroundColor, activeTextColor, borderRadius]);

  // Menu props
  const menuProps = useMemo(() => {
    const props: any = {
      items: processedItems,
      mode,
      theme,
      style: {
        width: '100%',
        minWidth: mode === 'horizontal' ? '800px' : 'auto',
        whiteSpace: 'nowrap',
        overflow: mode === 'horizontal' ? 'visible' : 'hidden',
        ...style,
      },
      selectedKeys,
      defaultSelectedKeys,
      className: uniqueClassName,
      onClick: handleMenuClick,
      overflowedIndicator: mode === 'horizontal' ? null : undefined,
    };

    // Only add props if they are defined and not false
    if (defaultOpenKeys.length > 0) props.defaultOpenKeys = defaultOpenKeys;
    if (multiple !== undefined && multiple !== false) props.multiple = multiple;
    if (selectable !== undefined && selectable !== false) props.selectable = selectable;
    if (inlineCollapsed !== undefined && inlineCollapsed !== false)
      props.inlineCollapsed = inlineCollapsed;
    if (inlineIndent !== undefined) props.inlineIndent = inlineIndent;
    if (triggerSubMenuAction !== undefined) props.triggerSubMenuAction = triggerSubMenuAction;
    if (forceSubMenuRender !== undefined && forceSubMenuRender !== false)
      props.forceSubMenuRender = forceSubMenuRender;
    if (onSelect) props.onSelect = onSelect;
    if (onDeselect) props.onDeselect = onDeselect;
    if (onOpenChange) props.onOpenChange = onOpenChange;

    return props;
  }, [
    processedItems,
    mode,
    theme,
    style,
    selectedKeys,
    defaultSelectedKeys,
    uniqueClassName,
    handleMenuClick,
    defaultOpenKeys,
    multiple,
    selectable,
    inlineCollapsed,
    inlineIndent,
    triggerSubMenuAction,
    forceSubMenuRender,
    onSelect,
    onDeselect,
    onOpenChange,
  ]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      <Menu {...menuProps} />
    </>
  );
};

export default ConfigMenu;