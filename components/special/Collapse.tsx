import { Collapse as AtndCollapse } from 'antd';
import React, { useEffect, useState } from 'react';

import RenderSliceItem from '../grid-systems/RenderSliceItem';

type Props = any;

const Collapse: React.FC<Props> = ({ items: rawItems = [], ...rest }) => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const buildItems = async () => {
      const normalized = await Promise.all(
        rawItems.map(async (item: any, idx: number) => {
          // Nếu RenderSliceItem cần await (vd: data fetch / lazy build)
          const labelNode = await Promise.resolve(<RenderSliceItem data={item.label} />);
          const childrenNode = await Promise.resolve(<RenderSliceItem data={item.children} />);

          return {
            key: item.key ?? String(idx),
            label: labelNode,
            children: childrenNode,
          };
        })
      );

      setItems(normalized);
    };

    buildItems();
  }, [rawItems]);

  return <AtndCollapse items={items} {...rest} />;
};

export default Collapse;
