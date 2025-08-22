/** @jsxImportSource @emotion/react */

import { useState } from 'react';

import {
    AdvancedMarker, APIProvider, Map, MapMouseEvent, MapProps
} from '@vis.gl/react-google-maps';

type TProps = MapProps;
const GoogleMap: React.FC<TProps> = ({ ...props }) => {
  console.log('🚀 ~ GoogleMap ~ props:', props);
  const { className, ...rest } = props;
  const [pos, setPos] = useState<{ lat: number | undefined; lng: number | undefined } | null>(null);
  // const [pos, setPos] = useState(null);
  // const inputRef = useRef<HTMLInputElement>(null);

  // useEffect(() => {
  //   if (!window.google || !inputRef.current) return;

  //   const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
  //     fields: ['geometry', 'formatted_address', 'name'],
  //   });

  //   autocomplete.addListener('place_changed', () => {
  //     const place = autocomplete.getPlace();
  //     if (!place.geometry) return;
  //     const location = place.geometry.location;
  //     setPos({ lat: location.lat(), lng: location.lng() });
  //   });
  // }, []);

  // const handleOnDbClick = (event) => {
  //   console.log('🚀 ~ handleOnDbClick ~ event:', event);
  // };
  const handleOnClick = (event: MapMouseEvent) => {
    console.log('🚀 ~ handleOnClick ~ event:', event);
    setPos({ lat: event.detail.latLng?.lat, lng: event.detail.latLng?.lng });
    rest.onClick?.(event);
  };
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_MAP || ''} libraries={['places']}>
      <div className={className}>
        <Map
          // defaultCenter={{ lat: 10.77, lng: 106.7 }}
          // defaultZoom={14}
          // onClick={handleOnDbClick}
          {...rest}
          onClick={handleOnClick}
        >
          {pos && <AdvancedMarker position={pos} />}
        </Map>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
