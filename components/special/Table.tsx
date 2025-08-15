import { Table, TableProps } from 'antd';
import React from 'react';

import RenderSliceItem from '../grid-systems/RenderSliceItem';

type Props = TableProps & {
  enableFooter?: boolean;
  footerColumns?: any[];
};

const TableSpecial: React.FC<Props> = ({ ...props }) => {
  const configs = () => {
    let summary = null;
    if (props.enableFooter && (props.footerColumns?.length ?? 0) > 0) {
      summary = () => (
        <Table.Summary>
          <Table.Summary.Row>
            {props.footerColumns?.map((footer: any, index: any) => {
              return (
                <Table.Summary.Cell
                  key={footer.key || index}
                  index={index}
                  align={footer?.align || 'left'}
                >
                  <RenderSliceItem data={footer.box} />
                </Table.Summary.Cell>
              );
            })}
          </Table.Summary.Row>
        </Table.Summary>
      );
    }
    return {
      ...props,
      rowKey: (record: any) => record.id || record.key,
      columns: props?.columns?.map((item: any) => {
        return {
          ...item,
          render: (value: any) => {
            return <RenderSliceItem data={item.box} valueStream={value} key={item.box.id} />;
          },
        };
      }),
      summary,
    } as TableProps;
  };
  return <Table {...configs()} />;
};

export default TableSpecial;
