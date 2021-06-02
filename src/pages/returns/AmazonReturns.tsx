import React, { useRef } from 'react';
import { AmazonOutlined, WarningOutlined } from '@ant-design/icons';
import { Typography, Space } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { listIndex } from '../../services/returns';
import { getKesGroup } from '../../utils/utils';
import { stores } from '../../services/publicKeys';
import moment from 'moment';
const { Text } = Typography;

const ParagraphText = (props: { content: string; width: number }) => {
  const [ellipsis] = React.useState(true);
  const { content, width } = props;
  return (
    <Text
      style={ellipsis ? { width: width, display: 'inline' } : undefined}
      ellipsis={ellipsis ? { tooltip: content } : false}
    >
      {content}
    </Text>
  );
};

const columns = (): ProColumns<any>[] => [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'product',
    dataIndex: 'Marketplace',
    search: false,
    width: 235,
    render: (
      _,
      record: {
        country_id: number;
        title: string;
        AmazonOrderId: string;
        ASIN: string;
        Title: string;
        OrderDate: string;
        ItemName: string;
      },
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              <AmazonOutlined />
              Asin: <Text>{record.ASIN}</Text>
            </Text>
            <Text type="secondary">
              AmazonOrderId : <Text>{record.AmazonOrderId}</Text>
            </Text>
            <Text type="secondary">
              OrderDate : <Text>{record.OrderDate}</Text>
            </Text>
            <Text type="secondary">
              ItemName : <ParagraphText content={record.ItemName} width={250} />
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'ASIN',
    dataIndex: 'ASIN',
    hideInTable: true,
  },
  {
    title: 'AmazonOrderId',
    dataIndex: 'AmazonOrderId',
    hideInTable: true,
  },
  {
    title: 'Store',
    dataIndex: 'store_id',
    valueType: 'select',
    width: 108,
    request: async () => {
      return [
        ...getKesGroup('storeData').map((item: stores) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      ];
    },
  },
  {
    title: 'Return Info',
    dataIndex: 'Marketplace',
    search: false,
    width: 180,
    render: (
      _,
      record: {
        ReturnQuantity: number;
        ReturnReason: string;
      },
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Quantity : <Text>{record.ReturnQuantity}</Text>
            </Text>
            <Text type="secondary">
              Reason : <Text>{record.ReturnReason}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Order Info',
    dataIndex: 'Marketplace',
    search: false,
    width: 140,
    render: (
      _,
      record: {
        OrderAmount: string;
        OrderQuantity: string;
      },
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Amount : <Text>{record.OrderAmount}</Text>
            </Text>
            <Text type="secondary">
              Quantity : <Text>{record.OrderQuantity}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Resolution',
    dataIndex: 'Resolution',
    width: 120,
    search: false,
  },
  {
    title: 'update_at',
    dataIndex: 'update_at',
    search: false,
    width: 120,
    render: (date) => {
      return date ? moment(parseInt(date + '000')).format('YYYY-MM-DD HH:mm:ss') : '-';
    },
  },
  {
    title: 'add_time',
    dataIndex: 'add_time',
    width: 120,
    search: false,
    render: (date) => {
      return date ? moment(parseInt(date + '000')).format('YYYY-MM-DD HH:mm:ss') : '-';
    },
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
            let sortParams: {
              sort_by?: string;
              sort_field?: string;
            } = {};
            if (sort) {
              for (let key in sort) {
                sortParams.sort_by = sort[key] === 'descend' ? 'desc' : 'asc';
                sortParams.sort_field = key;
              }
            }
            let tempParams: any = {
              ...params,
              ...sortParams,
              page: params.current,
              limit: params.pageSize,
            };
            listIndex(tempParams).then((res) => {
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
        // scroll={{ x: columns().reduce((sum, e) => sum + Number(e.width || 0), 0) }}
        dateFormatter="string"
        headerTitle={
          <>
            <WarningOutlined /> AmazonReturns
          </>
        }
      />
    </>
  );
};
