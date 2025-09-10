'use client';
/** @jsxImportSource @emotion/react */

import { Button } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';

import {
  APIProvider,
  InfoWindow,
  Map,
  MapMouseEvent,
  MapProps,
  Marker,
  useMap,
} from '@vis.gl/react-google-maps';

type LatLng = { lat: number; lng: number };
function isLatLng(obj: any): obj is LatLng {
  if (!_.isObject(obj)) return false;
  return 'lat' in obj && 'lng' in obj;
}
type TProps = MapProps & { makers: { lat: number; lng: number }[] };
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
        <Marker
          key={index}
          position={item}
          icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          onClick={() => setSelected(item)}
        />
      ))}
      {current && (
        <Marker
          position={current}
          icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          title="Vị trí hiện tại của bạn"
          onClick={() => setSelected(current)}
        />
      )}
      {pos && (
        <Marker
          position={pos}
          icon="http://maps.google.com/mapfiles/ms/icons/yellow-dot.png"
          title="Vị trí bạn chọn"
          onClick={() => setSelected(pos)}
        />
      )}
      {selected && (
        <InfoWindow position={selected} onCloseClick={() => setSelected(null)}>
          <div style={{ maxWidth: '200px' }}>
            <strong>📍 Địa chỉ:</strong>
            <div>{address || 'Đang tìm địa chỉ...'}</div>
          </div>
        </InfoWindow>
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
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <Map {...rest} gestureHandling={'greedy'} center={null} onClick={handleOnClick}>
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
