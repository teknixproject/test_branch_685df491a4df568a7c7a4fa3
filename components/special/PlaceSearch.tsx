'use client';
import { Select, SelectProps } from 'antd';
import axios from 'axios';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

type Options = NonNullable<SelectProps<any>['options']>[number];

type Props = {
  onSelect?: (point: { lat: number; lng: number }, address: string, details: any) => void;
};

const PlaceSearch: React.FC<Props> = ({ onSelect, ...props }) => {
  const [textSearch, setTextSearch] = useState<string>('');
  const [options, setOptions] = useState<Options[]>([]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['place', textSearch],
    queryFn: async () => {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          format: 'json',
          q: textSearch,
          limit: 10,
          addressdetails: 1,
          'accept-language': 'vi,en',
          countrycodes: 'vn',
        },
        headers: {
          Accept: 'application/json',
          'User-Agent': 'LocationSearch/1.0',
        },
      });
      return response.data;
    },
    enabled: !!textSearch && textSearch.length > 2,
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const formattedOptions: Options[] = data.map((item: any) => ({
        label: item.display_name,
        value: item.place_id,
      }));
      setOptions(formattedOptions);
    } else {
      setOptions([]);
    }
  }, [data]);

  // Debounced search function
  const handleSearch = _.debounce((value: string) => {
    setTextSearch(value);
  }, 500);

  // Handle selection
  const handleSelect = (value: string | undefined) => {
    const location = data.find((item: any) => item.place_id === value);

    if (onSelect) {
      onSelect(
        { lat: Number(location.lat), lng: Number(location.lon) },
        location.display_name,
        location
      );
    }
  };

  // Handle clear
  const handleClear = () => {
    setTextSearch('');
    setOptions([]);
  };

  return (
    <div className="w-full">
      <Select
        showSearch
        value={undefined} // Không controlled value để cho phép search
        options={options}
        onSearch={handleSearch}
        onSelect={handleSelect}
        onClear={handleClear}
        loading={isLoading || isFetching}
        allowClear
        filterOption={false} // Tắt filter mặc định để dùng API search
        notFoundContent={
          isLoading || isFetching
            ? 'Đang tìm kiếm...'
            : textSearch && textSearch.length > 2
            ? 'Không tìm thấy kết quả'
            : 'Nhập ít nhất 3 ký tự để tìm kiếm'
        }
        {...props}
      />
    </div>
  );
};

export default PlaceSearch;
