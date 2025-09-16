import {
  Avatar,
  Badge,
  Card,
  Checkbox,
  Collapse,
  DatePicker,
  Descriptions,
  Drawer,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Statistic,
  Switch,
  Tag,
  Typography,
  Upload,
} from 'antd';

import { Bar, Column, Histogram, Line, Liquid, Pie, Radar, Rose, Stock } from '@ant-design/plots';
import { Icon } from '@iconify/react/dist/iconify.js';

import { Button, Dropdown, List, Map, Table, Tabs, Tree } from '../special';
import ConfigMenu from './configComponent/ConfigMenu';

export const componentRegistry = {
  text: Typography.Text,
  link: Typography.Link,
  title: Typography.Title,
  paragraph: Typography.Paragraph,
  image: Image,
  inputtext: Input,
  inputnumber: InputNumber,
  checkbox: Checkbox,
  radio: Radio.Group,
  select: Select,
  form: Form,
  formitem: Form.Item,
  collapse: Collapse,
  tag: Tag,
  card: Card,
  statistic: Statistic,
  linechart: Line,
  columnchart: Column,
  piechart: Pie,
  barchart: Bar,
  histogramchart: Histogram,
  liquidchart: Liquid,
  radarchart: Radar,
  rosechart: Rose,
  stockchart: Stock,
  avatar: Avatar,
  switch: Switch,
  menu: ConfigMenu,
  modal: Modal,
  drawer: Drawer,
  datepicker: DatePicker,
  badge: Badge,
  icon: Icon,
  // map: GoogleMapReact,
  textarea: Input.TextArea,
  // tree: Tree,
  upload: Upload,
  description: Descriptions,
};
export const componentSpecial = {
  button: Button,
  dropdown: Dropdown,
  list: List,
  table: Table,
  map: Map,
  tree: Tree,
  tabs: Tabs,
};

export const getComponentRender = ({ valueType }: { valueType: string }) => {
  const componentSpecial: Record<string, React.ComponentType<any>> = {
    button: Button,
    dropdown: Dropdown,
    list: List,
    table: Table,
    map: Map,
    tree: Tree,
    tabs: Tabs,
  };

  switch (valueType) {
    case 'button':
      return componentSpecial.button;
    case 'dropdown':
      return componentSpecial.dropdown;
    case 'list':
      return componentSpecial.list;
    case 'table':
      return componentSpecial.table;
    case 'map':
      return componentSpecial.map;
    case 'tree':
      return componentSpecial.tree;
    case 'tabs':
      return componentSpecial.tabs;
    default:
      return null;
  }
};
