import { Card, Empty, Input, List, Spin } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps';

type PlaceResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat(): number;
      lng(): number;
    };
  };
  rating?: number;
  types?: string[];
  photos?: any[];
};

type TProps = {
  showSearch?: boolean;
  showList?: boolean;
  apiKey: string;
} & Record<string, any>;

const GoogleMap: React.FC<TProps> = ({ ...props }) => {
  const {
    css,
    showSearch = true,
    showList = true,
    apiKey = process.env.NEXT_PUBLIC_MAP,
    ...rest
  } = props;
  const [pos, setPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 10.77, lng: 106.7 }); // Ho Chi Minh City
  const [zoom, setZoom] = useState(14);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const listContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Google Places Autocomplete với delay
  useEffect(() => {
    const initializeAutocomplete = () => {
      console.log('🚀 Initializing autocomplete...');
      console.log('🌐 Window.google:', !!window.google);
      console.log('🔧 Input ref:', !!inputRef.current);

      if (!window.google) {
        console.log('⏳ Google not loaded yet, waiting...');
        setTimeout(initializeAutocomplete, 500);
        return;
      }

      if (!window.google.maps) {
        console.log('⏳ Google Maps not loaded yet...');
        setTimeout(initializeAutocomplete, 500);
        return;
      }

      if (!window.google.maps.places) {
        console.log('⏳ Google Places not loaded yet...');
        setTimeout(initializeAutocomplete, 500);
        return;
      }

      if (!inputRef.current) {
        console.log('⏳ Input ref not ready yet...');
        setTimeout(initializeAutocomplete, 100);
        return;
      }

      console.log('✅ All dependencies ready, creating autocomplete...');

      try {
        // Tạo autocomplete với container riêng để tránh conflict
        const inputElement = inputRef.current.querySelector('input') || inputRef.current;

        autocompleteRef.current = new window.google.maps.places.Autocomplete(
          inputElement as HTMLInputElement,
          {
            fields: ['geometry', 'formatted_address', 'name', 'place_id', 'rating', 'types'],
            types: ['establishment', 'geocode'],
          }
        );

        console.log('✅ Autocomplete created successfully');

        // Listen for place selection
        const listener = autocompleteRef.current.addListener('place_changed', () => {
          if (autocompleteDisabled) return;

          console.log('🏷️ Autocomplete place changed');
          const place = autocompleteRef.current?.getPlace();
          console.log('📍 Selected place:', place);

          if (!place || !place.geometry || !place.geometry.location) {
            console.log('❌ Invalid place selected');
            return;
          }

          const newPos = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };

          console.log('📍 Setting position from autocomplete:', newPos);
          setPos(newPos);
          setMapCenter(newPos);
          setZoom(16);
          setSelectedPlace(place as PlaceResult);
          setSearchValue(place.formatted_address || place.name || '');

          // Thêm vào search results nếu chưa có
          setSearchResults((prev) => {
            if (!prev.find((p) => p.place_id === place.place_id)) {
              return [place as PlaceResult, ...prev];
            }
            return prev;
          });
        });

        return () => {
          console.log('🧹 Cleaning up autocomplete listener');
          if (listener) {
            google.maps.event.removeListener(listener);
          }
        };
      } catch (error) {
        console.error('❌ Error creating autocomplete:', error);
      }
    };

    // Delay khởi tạo để đảm bảo component đã render
    const timer = setTimeout(initializeAutocomplete, 100);
    return () => clearTimeout(timer);
  }, [autocompleteDisabled]);

  // Handle input change với realtime search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setIsTyping(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Temporary disable autocomplete when typing manually
    setAutocompleteDisabled(true);

    // Clear results if input is empty
    if (!value.trim()) {
      setSearchResults([]);
      setIsTyping(false);
      setAutocompleteDisabled(false);
      return;
    }

    // Debounced search - tự động search sau 500ms user ngừng gõ
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(value);
      setIsTyping(false);
      setAutocompleteDisabled(false);
    }, 500);
  };

  // Tách logic search thành function riêng để tái sử dụng
  const performSearch = (query: string) => {
    console.log('🔍 Starting search for:', query);

    if (!window.google) {
      console.error('❌ Google Maps not loaded');
      return;
    }

    if (!window.google.maps || !window.google.maps.places) {
      console.error('❌ Google Places API not loaded');
      return;
    }

    if (!query.trim()) {
      console.warn('⚠️ Empty search value');
      return;
    }

    setLoading(true);

    const service = new google.maps.places.PlacesService(document.createElement('div'));

    const request = {
      query: query,
      fields: ['name', 'geometry', 'formatted_address', 'place_id', 'rating', 'types', 'photos'],
    };

    console.log('📡 Making search request:', request);

    service.textSearch(request, (results, status) => {
      console.log('📥 Search response status:', status);
      console.log('📥 Search results:', results);

      setLoading(false);

      if (status === google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
        console.log('✅ Found', results.length, 'results');
        setSearchResults(results as PlaceResult[]);

        // Auto select first result chỉ khi search manual (không phải realtime)
        if (!isTyping) {
          const firstResult = results[0];
          if (firstResult.geometry && firstResult.geometry.location) {
            const newPos = {
              lat: firstResult.geometry.location.lat(),
              lng: firstResult.geometry.location.lng(),
            };
            console.log('📍 Setting position to:', newPos);
            setPos(newPos);
            setMapCenter(newPos);
            setZoom(16);
            setSelectedPlace(firstResult as PlaceResult);
          }
        }
      } else {
        console.log('❌ No results found. Status:', status);
        setSearchResults([]);
      }
    });
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setIsTyping(false);
    performSearch(searchValue);
  };

  // Handle place selection from list
  const handlePlaceSelect = (place: PlaceResult) => {
    if (place.geometry && place.geometry.location) {
      const newPos = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      setPos(newPos);
      setMapCenter(newPos);
      setZoom(16);
      setSelectedPlace(place);
      setSearchValue(place.formatted_address || place.name);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Clear timeout và search ngay lập tức
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setIsTyping(false);
      performSearch(searchValue);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Get place type display name
  const getPlaceTypeDisplay = (types?: string[]) => {
    if (!types || types.length === 0) return '';
    const typeMap: Record<string, string> = {
      restaurant: 'Nhà hàng',
      hospital: 'Bệnh viện',
      school: 'Trường học',
      bank: 'Ngân hàng',
      gas_station: 'Cây xăng',
      shopping_mall: 'Trung tâm mua sắm',
      tourist_attraction: 'Điểm du lịch',
      lodging: 'Khách sạn',
      establishment: 'Cơ sở',
    };

    const primaryType = types.find((type) => typeMap[type]) || types[0];
    return typeMap[primaryType] || primaryType;
  };

  return (
    <APIProvider apiKey={apiKey} libraries={['places']}>
      <div style={{ display: 'flex', height: '600px', gap: '10px', position: 'relative' }}>
        {/* Debug Info */}
        <div
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(240, 240, 240, 0.9)',
            padding: '8px',
            fontSize: '12px',
            zIndex: 2000,
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          <div>Google: {window.google ? '✅' : '❌'}</div>
          <div>Places: {window.google?.maps?.places ? '✅' : '❌'}</div>
          <div>Results: {searchResults.length}</div>
          <div>Typing: {isTyping ? '✍️' : '⏸️'}</div>
        </div>

        {/* Search Results List */}
        {showList && (
          <div
            ref={listContainerRef}
            style={{
              width: '400px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '600px', // Fix height để scroll hoạt động
            }}
          >
            {/* Search Header */}
            <div
              style={{
                padding: '16px',
                borderBottom: '1px solid #f0f0f0',
                backgroundColor: 'white',
                position: 'sticky',
                top: 0,
                zIndex: 10,
              }}
            >
              <Input.Search
                ref={inputRef}
                placeholder="Tìm kiếm địa điểm..."
                value={searchValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onSearch={handleSearch}
                enterButton={<SearchOutlined />}
                size="large"
                loading={loading || isTyping}
                autoComplete="off"
                allowClear
              />
            </div>

            {/* Results List - Scrollable */}
            <div
              style={{
                flex: 1,
                overflow: 'auto',
                maxHeight: 'calc(600px - 100px)', // Trừ đi header và padding
              }}
            >
              {loading || isTyping ? (
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <Spin size="large" />
                  <div style={{ marginTop: '16px', color: '#666' }}>
                    {isTyping ? 'Đang nhập...' : 'Đang tìm kiếm...'}
                  </div>
                </div>
              ) : searchResults.length > 0 ? (
                <List
                  itemLayout="vertical"
                  dataSource={searchResults}
                  renderItem={(place, index) => (
                    <List.Item
                      key={place.place_id || index}
                      style={{
                        cursor: 'pointer',
                        backgroundColor:
                          selectedPlace?.place_id === place.place_id ? '#e6f7ff' : 'white',
                        borderBottom: '1px solid #f0f0f0',
                        padding: '16px',
                        transition: 'background-color 0.3s ease',
                      }}
                      onClick={() => handlePlaceSelect(place)}
                      onMouseEnter={(e) => {
                        if (selectedPlace?.place_id !== place.place_id) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = '#f8f9fa';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedPlace?.place_id !== place.place_id) {
                          (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                        }
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <div
                            style={{
                              backgroundColor:
                                selectedPlace?.place_id === place.place_id ? '#1890ff' : '#52c41a',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            <EnvironmentOutlined />
                          </div>
                        }
                        title={
                          <div
                            style={{
                              fontWeight: 'bold',
                              color:
                                selectedPlace?.place_id === place.place_id ? '#1890ff' : '#1f2937',
                              fontSize: '14px',
                            }}
                          >
                            {place.name}
                          </div>
                        }
                        description={
                          <div>
                            <div
                              style={{
                                color: '#666',
                                fontSize: '12px',
                                marginBottom: '6px',
                                lineHeight: '1.4',
                              }}
                            >
                              {place.formatted_address}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '8px',
                              }}
                            >
                              <span
                                style={{
                                  backgroundColor:
                                    selectedPlace?.place_id === place.place_id
                                      ? '#e6f7ff'
                                      : '#f0f0f0',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  color: '#666',
                                  border:
                                    selectedPlace?.place_id === place.place_id
                                      ? '1px solid #1890ff'
                                      : '1px solid transparent',
                                }}
                              >
                                {getPlaceTypeDisplay(place.types)}
                              </span>
                              {place.rating && (
                                <span
                                  style={{ fontSize: '12px', color: '#faad14', fontWeight: '500' }}
                                >
                                  ⭐ {place.rating}
                                </span>
                              )}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : searchValue && !loading && !isTyping ? (
                <div style={{ padding: '40px' }}>
                  <Empty
                    description="Không tìm thấy kết quả nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                </div>
              ) : (
                <div
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999',
                  }}
                >
                  <SearchOutlined
                    style={{ fontSize: '48px', marginBottom: '16px', color: '#d9d9d9' }}
                  />
                  <div>Nhập địa điểm để tìm kiếm</div>
                  <div style={{ fontSize: '12px', marginTop: '8px', color: '#bbb' }}>
                    Ví dụ: "restaurant", "hospital", "Bitexco"
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Map */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            minHeight: '600px',
          }}
        >
          <Map
            defaultCenter={mapCenter}
            defaultZoom={zoom}
            center={mapCenter}
            zoom={zoom}
            mapId="DEMO_MAP_ID"
            gestureHandling="greedy"
            disableDefaultUI={false}
          >
            {/* Search Input (when list is hidden) */}
            {showSearch && !showList && (
              <div
                style={{
                  position: 'absolute',
                  top: '15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 1000,
                  width: '320px',
                }}
              >
                <Input.Search
                  placeholder="Tìm kiếm địa điểm..."
                  value={searchValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  onSearch={handleSearch}
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                  enterButton="Tìm"
                  size="large"
                />
              </div>
            )}

            {/* Selected Place Info */}
            {selectedPlace && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  left: '20px',
                  zIndex: 1000,
                  maxWidth: '300px',
                }}
              >
                <Card
                  size="small"
                  style={{
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px', fontSize: '14px' }}>
                    {selectedPlace.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.4' }}>
                    {selectedPlace.formatted_address}
                  </div>
                  {selectedPlace.rating && (
                    <div style={{ marginTop: '8px', fontSize: '12px', color: '#faad14' }}>
                      ⭐ Rating: {selectedPlace.rating}/5
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Marker */}
            {pos && (
              <AdvancedMarker position={pos} title={selectedPlace?.name || 'Vị trí đã chọn'}>
                <div
                  style={{
                    backgroundColor: '#1890ff',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    border: '3px solid white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transform: 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.transform = 'scale(1)';
                  }}
                >
                  📍
                </div>
              </AdvancedMarker>
            )}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};

export default GoogleMap;
