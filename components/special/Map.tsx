'use client';
/** @jsxImportSource @emotion/react */

import './map.css';

import { Button } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import { css, keyframes } from '@emotion/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  MapMouseEvent,
  MapProps,
  useMap,
} from '@vis.gl/react-google-maps';

const blink = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 #E62727; }
  50% { box-shadow: 0 0 16px 8px #E62727; }
`;

const blinkStyle = css`
  display: inline-block;
  border-radius: 50%;
  animation: ${blink} 1s infinite;
`;

type LatLng = { lat: number; lng: number };
function isLatLng(obj: any): obj is LatLng {
  if (!_.isObject(obj)) return false;
  return 'lat' in obj && 'lng' in obj;
}
type TProps = MapProps & {
  makers: { lat: number; lng: number }[];
  language?: string;
};
const apiKey = process.env.NEXT_PUBLIC_MAP || '';
const MapWithMarkers: React.FC<{
  makers: LatLng[];
  current: LatLng | null;
  pos: LatLng | null;
}> = ({ makers, current, pos }) => {
  const map = useMap();
  const [selected, setSelected] = useState<LatLng | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  // Fit camera khi makers thay đổi
  useEffect(() => {
    if (!map || _.isEmpty(makers) || makers.length === 0 || _.isEmpty(makers?.[0])) return;

    if (makers.length === 1) {
      map.panTo(makers[0]);
      map.setZoom(14);
    } else {
      const bounds = new google.maps.LatLngBounds();
      makers.forEach((m) => bounds.extend(m));
      map.fitBounds(bounds);
    }
  }, [makers, map]);

  // Khi click marker → lấy địa chỉ
  useEffect(() => {
    if (!selected) return;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: selected }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress('Không tìm thấy địa chỉ');
      }
    });
  }, [selected]);
  useEffect(() => {
    if (!current || !map) return;

    map.panTo(current);
    map.setZoom(16);
  }, [current, map, pos]);

  useEffect(() => {
    if (!pos || !map) return;

    map.panTo(pos);
    map.setZoom(14);
  }, [map, pos]);

  return (
    <>
      {makers?.filter(isLatLng).map((item, index) => (
        <AdvancedMarker position={item} onClick={() => setSelected(item)} key={index}>
          <div className="loader"></div>
          {selected && selected.lat === item.lat && selected.lng === item.lng && (
            <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
              <div style={{ maxWidth: '200px' }}>
                <strong>📍 Địa chỉ:</strong>
                <div>{address || 'Đang tìm địa chỉ...'}</div>
              </div>
            </InfoWindow>
          )}
        </AdvancedMarker>
      ))}

      {current && (
        <AdvancedMarker position={current} onClick={() => setSelected(current)}>
          <Icon icon="line-md:map-marker-filled-loop" className="text-[#00dbdb] size-10" />
          {selected && selected.lat === current.lat && selected.lng === current.lng && (
            <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
              <div style={{ maxWidth: '200px' }}>
                <strong>📍 Địa chỉ:</strong>
                <div>{address || 'Đang tìm địa chỉ...'}</div>
              </div>
            </InfoWindow>
          )}
        </AdvancedMarker>
      )}

      {pos && (
        <AdvancedMarker position={pos} title="Vị trí bạn chọn" onClick={() => setSelected(pos)}>
          <Icon icon="line-md:map-marker-filled-loop" className="text-[#0078db] size-10" />
          {selected && selected.lat === pos.lat && selected.lng === pos.lng && (
            <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
              <div style={{ maxWidth: '200px' }}>
                <strong>📍 Địa chỉ:</strong>
                <div>{address || 'Đang tìm địa chỉ...'}</div>
              </div>
            </InfoWindow>
          )}
        </AdvancedMarker>
      )}
    </>
  );
};
const GoogleMap: React.FC<TProps> = ({ ...props }) => {
  const { className, makers, ...rest } = props;
  const [pos, setPos] = useState<LatLng | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [current, setCurrent] = useState<LatLng | null>(null);
  const handleOnClick = (event: MapMouseEvent) => {
    const lat = event.detail.latLng?.lat;
    const lng = event.detail.latLng?.lng;
    setPos({ lat: Number(lat), lng: Number(lng) });
    rest.onClick?.(event);
  };
  const locateMe = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setCurrent(coords);
          // setMakers((prev) => [...prev, coords]);
          setLoading(false);
        },
        (err) => {
          console.error('Geolocation error:', err);
          alert('Không thể lấy vị trí hiện tại');
          setLoading(false);
        }
      );
    } else {
      alert('Trình duyệt không hỗ trợ định vị');
      setLoading(false);
    }
  };

  return (
    <APIProvider apiKey={apiKey} libraries={['places']} language={rest.language || 'en'}>
      <Map
        {...rest}
        gestureHandling={'greedy'}
        center={null}
        onClick={handleOnClick}
        mapId={process.env.NEXT_PUBLIC_MAP}
      >
        <MapWithMarkers makers={makers} current={current} pos={pos} />
        <Button
          onClick={locateMe}
          loading={loading}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            padding: '8px 12px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
          }}
        >
          📍 Vị trí của tôi
        </Button>
      </Map>
    </APIProvider>
  );
};

export default GoogleMap;
