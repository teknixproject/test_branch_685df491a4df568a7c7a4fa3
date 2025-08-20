/** @jsxImportSource @emotion/react */
import { Popover } from 'antd';
import GoogleMapReact from 'google-map-react';
import React from 'react';

import { Icon } from '@iconify/react/dist/iconify.js';

type Props = GoogleMapReact.Props & {
  dataSource?: Array<{
    lat: number;
    lng: number;
    [key: string]: any; // Thêm các thuộc tính khác nếu cần
  }>;
};
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Maker = ({ text, lat, lng }: { text: string; lat: number; lng: number }) => (
  <Popover title={text}>
    <Icon icon={'healthicons:geo-location-outline-24px'} className="text-red-400 fill-cyan-50" />
  </Popover>
);
const MapSpecial: React.FC<Props> = ({ ...props }) => {
  const propsConvert = {
    ...props,
    children: props.dataSource?.map((item: any) => (
      <Maker key={`${item.lat}-${item.lng}`} lat={item.lat} lng={item.lng} text="My Marker" />
    )),
  };
  return <GoogleMapReact {...propsConvert} />;
};

export default MapSpecial;
