import { useRef } from 'react';
import { WarningOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { netsuiteReturns } from '@/services/returns';

type Inventory = {
  id: number;
  sku: string;
  upc: string;
  quantity: number;
  quantity_id: number;
  description: string;
  add_time: string;
};

const columns = (): ProColumns<Inventory>[] => [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
  },
  {
    title: 'ASIN',
    dataIndex: 'asin',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    search: false,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    valueType: 'select',
    width: 150,
    valueEnum: {
      openbox: { text: 'openbox', status: 'Processing' },
      used: { text: 'used', status: 'Error' },
      clean: { text: 'clean	', status: 'Success' },
    },
  },
  {
    title: 'Quantity ID',
    dataIndex: 'quantity_id',
    search: false,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    search: false,
  },
  {
    title: 'Add time',
    dataIndex: 'add_time',
    search: false,
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <>
      <ProTable
        size="small"
        columns={columns()}
        actionRef={actionRef}
        request={async (params = {}, sort) =>
          new Promise((resolve) => {
            let tempParams: any = {
              ...params,
              page: params.current,
              limit: params.pageSize,
            };
            netsuiteReturns(tempParams).then((res) => {
              resolve({
                data: res.data.list,
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: !!res.code,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: res.data.total,
              });
            });
          })
        }
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
          span: {
            xs: 14,
            sm: 24,
            md: 12,
            lg: 12,
            xl: 8,
            xxl: 6,
          },
        }}
        pagination={{
          pageSize: 50,
        }}
        options={{
          search: false,
        }}
        scroll={{ x: columns().reduce((sum, e) => sum + Number(e.width || 0), 0) }}
        dateFormatter="string"
        headerTitle={'Inventory'}
      />
    </>
  );
};
