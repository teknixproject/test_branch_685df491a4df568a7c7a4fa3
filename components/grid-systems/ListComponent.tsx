'use client';
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
  Radio,
  Statistic,
  Switch,
  Tag,
  Typography,
  Upload,
} from 'antd';
import dynamic from 'next/dynamic';

import { Bar, Column, Histogram, Line, Liquid, Pie, Radar, Rose, Stock } from '@ant-design/plots';

import { Button, Dropdown, List, Map, Modal, Table, Tabs, Tree, Select } from '../special';
import InputText from '../special/InputText';
import PlaceSearch from '../special/PlaceSearch';
import ConfigMenu from './configComponent/ConfigMenu';
import { componentCodes } from '../customComponents';

const Icon = dynamic(() => import('@iconify/react').then((m) => m.Icon), { ssr: false });

export const componentSpecial = {
  button: Button,
  dropdown: Dropdown,
  list: List,
  table: Table,
  map: Map,
  tree: Tree,
  tabs: Tabs,
  modal: Modal,
  placesearch: PlaceSearch,
};
export const componentRegistry = {
  text: Typography.Text,
  link: Typography.Link,
  title: Typography.Title,
  paragraph: Typography.Paragraph,
  image: Image,
  inputtext: InputText,
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
  drawer: Drawer,
  datepicker: DatePicker,
  badge: Badge,
  icon: Icon,
  textarea: Input.TextArea,
  upload: Upload,
  description: Descriptions,
  ...componentSpecial,
  ...componentCodes,
};

export const getName = (id: string) => id.split('$')[0];
