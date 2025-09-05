import { CSSProperties, useState } from 'react'; // Import nếu cần dùng CSSProperties, nhưng ở đây không bắt buộc

export interface MenuColorConfig {
  textColor?: string;
  textHoverColor?: string;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  activeTextColor?: string;
}

// Function to generate CSS styles from color configuration
export const generateMenuStyles = (colorConfig: MenuColorConfig): Record<string, any> => {
  const {
    textColor = '#000000',
    textHoverColor = '#000000',
    hoverBackgroundColor = '#f5f5f5',
    activeBackgroundColor = '#1890ff',
    activeTextColor = '#ffffff'
  } = colorConfig;

  return {
    color: textColor,
    '& .ant-menu-item': {
      color: textColor,
      '&:hover': {
        backgroundColor: hoverBackgroundColor,
        color: textHoverColor,
      },
      '&.ant-menu-item-selected': {
        backgroundColor: activeBackgroundColor,
        color: activeTextColor,
      },
      '&.ant-menu-item-active': {
        backgroundColor: activeBackgroundColor,
        color: activeTextColor,
      }
    },
    '& .ant-menu-submenu-title': {
      color: textColor,
      '&:hover': {
        backgroundColor: hoverBackgroundColor,
        color: textHoverColor,
      }
    },
    '& .ant-menu-submenu.ant-menu-submenu-selected > .ant-menu-submenu-title': {
      backgroundColor: activeBackgroundColor,
      color: activeTextColor,
    },
    '& .ant-menu-submenu-arrow': {
      color: textColor,
    },
    '& .ant-menu-submenu.ant-menu-submenu-selected > .ant-menu-submenu-title .ant-menu-submenu-arrow': {
      color: activeTextColor,
    }
  };
};

// Các phần khác trong consts.ts của bạn (tôi giữ nguyên để đầy đủ, bạn có thể chỉnh nếu cần)
export type ItemForm = {
  key: string
  label: string
  icon: string
  children?: ItemForm[]
  // Enhanced table options
  width?: number | string
  disabled?: boolean
  collapsible?: boolean
  collapsed?: boolean
  minWidth?: number
  maxWidth?: number
  resizable?: boolean
  sortable?: boolean
  filterable?: boolean
  // Additional options
  fixed?: 'left' | 'right' | boolean
  align?: 'left' | 'center' | 'right'
  ellipsis?: boolean
  className?: string
  dataIndex?: string
  type?: string
  value?: any
  render?: (text: any, record: any, index: number) => React.ReactNode
}

export type MenuForm = {
  items: ItemForm[]
  mode: string
  selectedKeys: string
  style: any
  theme?: string
  // Color configuration options
  textColor?: string
  textHoverColor?: string
  hoverBackgroundColor?: string
  activeBackgroundColor?: string
  activeTextColor?: string
  // Table-specific options
  scroll?: {
    x?: number | string
    y?: number | string
  }
  loading?: boolean
  sticky?: boolean
  showHeader?: boolean
  tableLayout?: 'auto' | 'fixed'
}

// Props interface for the enhanced component
export interface EnhancedTableProps {
  columns: ItemForm[]
  dataSource?: any[]
  loading?: boolean
  scroll?: MenuForm['scroll']
  className?: string
  onColumnResize?: (key: string, width: number) => void
  onColumnToggle?: (key: string, collapsed: boolean) => void
  onSort?: (key: string, direction: 'asc' | 'desc' | null) => void
  onFilter?: (key: string, filters: any[]) => void
}

export const processTableColumns = (items: ItemForm[]) => {
  return items
    .filter(item => !item.disabled)
    .map(item => ({
      key: item.key,
      dataIndex: item.dataIndex || item.key,
      title: item.label,
      width: item.width,
      minWidth: item.minWidth,
      maxWidth: item.maxWidth,
      fixed: item.fixed,
      align: item.align,
      ellipsis: item.ellipsis,
      sorter: item.sortable,
      filterable: item.filterable,
      resizable: item.resizable,
      className: item.className,
      render: item.render,
    }))
}

export const getTableScrollConfig = (items: ItemForm[]) => {
  const totalWidth = items
    .filter(item => !item.disabled)
    .reduce((sum, item) => sum + (Number(item.width) || 200), 0)

  return {
    x: totalWidth > 800 ? totalWidth : undefined,
    y: 400, // default height
  }
}

// Hook for managing table state
export const useTableConfiguration = (initialItems: ItemForm[]) => {
  const [items, setItems] = useState<ItemForm[]>(initialItems)
  const [collapsedColumns, setCollapsedColumns] = useState<string[]>([])

  const updateColumnWidth = (key: string, width: number) => {
    setItems(prev =>
      prev.map(item => (item.key === key ? { ...item, width } : item))
    )
  }

  const toggleColumnCollapse = (key: string) => {
    setCollapsedColumns(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  const enabledColumns = items.filter(item => !item.disabled)
  const visibleColumns = enabledColumns.filter(
    item => !collapsedColumns.includes(item.key)
  )

  return {
    items,
    setItems,
    collapsedColumns,
    enabledColumns,
    visibleColumns,
    updateColumnWidth,
    toggleColumnCollapse,
  }
}

// Hook for managing menu color configuration
export const useMenuColorConfiguration = (initialColorConfig: MenuColorConfig = {}) => {
  const [colorConfig, setColorConfig] = useState<MenuColorConfig>({
    textColor: '#000000',
    textHoverColor: '#000000',
    hoverBackgroundColor: '#f5f5f5',
    activeBackgroundColor: '#1890ff',
    activeTextColor: '#ffffff',
    ...initialColorConfig
  })

  const updateColorConfig = (newConfig: Partial<MenuColorConfig>) => {
    setColorConfig(prev => ({ ...prev, ...newConfig }))
  }

  const resetColorConfig = () => {
    setColorConfig({
      textColor: '#000000',
      textHoverColor: '#000000',
      hoverBackgroundColor: '#f5f5f5',
      activeBackgroundColor: '#1890ff',
      activeTextColor: '#ffffff'
    })
  }

  return {
    colorConfig,
    updateColorConfig,
    resetColorConfig,
    menuStyles: generateMenuStyles(colorConfig)
  }
}

// Function to convert legacy data with color preservation
export const convertLegacyData = (data: any): ItemForm[] => {
  try {
    let items: any[] = []

    if (Array.isArray(data)) {
      items = data
    } else if (data?.valueInput && Array.isArray(data.valueInput)) {
      items = data.valueInput
    } else {
      return []
    }

    return items
      .map(item => {
        if (!item || typeof item !== 'object') return null

        const newItem: ItemForm = {
          ...item,
          key: item.key || item.value || `item-${Date.now()}`,
          label: item.label || 'Unnamed Item',
        }

        // Remove legacy properties
        delete newItem.value
        delete newItem.type // Fix cho type: "group"

        // Handle children recursively
        if (item.children && Array.isArray(item.children)) {
          const convertedChildren = convertLegacyData(item.children).filter(
            Boolean
          )
          if (convertedChildren.length > 0) {
            newItem.children = convertedChildren
          }
        }

        return newItem
      })
      .filter(Boolean)
  } catch (error) {
    console.error('convertLegacyData error:', error)
    return []
  }
}