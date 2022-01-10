import { useRef, useEffect, useState } from 'react';
import { AmazonOutlined, WarningOutlined } from '@ant-design/icons';
import { Typography, Space,Tag, Radio,message,Spin } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { listIndex,updateReturnStatus } from '@/services/returns';
import { getKesGroup } from '@/utils/utils';
import { stores } from '@/services/publicKeys';
import ParagraphText from '@/components/ParagraphText'
import { getTargetHref } from '@/utils/jumpUrl';

import moment from 'moment';
const { Text,Paragraph } = Typography;

type AmazonReturnsItem = {
  ASIN: string;
  AmazonOrderId: string;
  ItemName: string;
  OrderAmount: string;
  OrderDate: string;
  OrderQuantity: number;
  Resolution: string;
  ReturnQuantity: number;
  ReturnReason: string;
  ReturnRequestStatus: string;
  ShipperTrackingNumber: string | null;
  ShippingAddress: string;
  add_time: number
  amazon_response: string
  id: number
  listing: string;
  store_id: number;
  update_at: number;
  City: string;
  AddressType: string;
  PostalCode: string;
  StateOrRegion: string;
  Phone: string;
  Name: string;
  CountryCode: string;
  AddressLine1: string;
  AddressLine2: string;
  status: number;
  vendor_sku:  string;
  vendor_id: number
}


type Pii = {
  City: string;
  AddressType: string;
  PostalCode: string;
  StateOrRegion: string;
  Phone: string;
  Name: string;
  CountryCode: string;
  AddressLine1: string;
  AddressLine2: string;
}

const columns = (): ProColumns<AmazonReturnsItem>[] => [
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
    render: (_,record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              <AmazonOutlined />
              Asin: <Text>{record.ASIN}</Text>
            </Text>
            <Text type="secondary">
              Sku :
              <Text>
                {record?.listing && (
                  <>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${getTargetHref(record?.vendor_id, record.vendor_sku)}`}
                    >
                      {record.vendor_sku}
                    </a>
                    <Paragraph
                      style={{ display: 'inline' }}
                      copyable={{ text: record.vendor_sku }}
                    ></Paragraph>
                  </>
                )}
              </Text>
            </Text>
            <Text type="secondary">
              AmazonOrderId : <Text>{record.AmazonOrderId}</Text>
            </Text>
            <Text type="secondary">
              OrderDate : <Text>{record.OrderDate}</Text>
            </Text>
            {record.ShipperTrackingNumber && (
              <Text type="secondary">
                <AmazonOutlined />
                TrackingNumber: {record.ShipperTrackingNumber}
              </Text>
            )}
            <Text type="secondary">
              ItemName : <ParagraphText content={record.ItemName} width={250} />
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Pii',
    dataIndex: 'Pii',
    search: false,
    width: 180,
    render: (_,record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Name : <Text copyable>{record.Name}</Text>
            </Text>
            <Text type="secondary">
              AddressLine1 : <Text copyable>{record.AddressLine1}</Text>
            </Text>
            <Text type="secondary">
              PostalCode : <Text copyable={{ text: record.PostalCode.split('-')[0] }}>{record.PostalCode}</Text>
            </Text>
            <Text type="secondary">
              City : <Text copyable>{record.City}</Text>
            </Text>
            <Text type="secondary">
              StateOrRegion : <Text copyable>{record.StateOrRegion}</Text>
            </Text>
            <Text type="secondary">
              phone : <Text copyable={{ text: record.Phone.split(' ')[1] }}>{record.Phone}</Text>
            </Text>
            <Text type="secondary">
              <Tag color="#2db7f5">{record.CountryCode}</Tag>
              {record.AddressType === 'Commercial' ? (
                <Tag color="warning">{record.AddressType}</Tag>
              ) : (
                <Tag color="#87d068">{record.AddressType}</Tag>
              )}
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
    title: 'Return Info',
    dataIndex: 'Marketplace',
    search: false,
    width: 180,
    render: (_,record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Quantity : <Text>{record.ReturnQuantity}</Text>
            </Text>
            <Text type="secondary">
              Reason : <Text>{record.ReturnReason}</Text>
            </Text>
            <Text type="secondary">
            Resolution : <Text>{record.Resolution}</Text>
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
    render: (_,record) => {
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
    title: 'Vendor',
    dataIndex: 'vendor_id',
    width: 150,
    valueType: 'select',
    request: async () => {
      return [
        ...getKesGroup('vendorData').map((item: any) => {
          return {
            label: item.vendor_name,
            value: item.id,
          };
        }),
      ];
    },
  },
  {
    title: 'Time',
    dataIndex: 'add_time',
    width: 160,
    search: false,
    render: (_,record) => {
      return (<><Text type="secondary">
      update_at:
      <Text>
          {(record.update_at &&
            moment(parseInt(`${record.update_at  }000`)).format('YYYY-MM-DD HH:mm:ss')) ||
            'not yet'}
      </Text>
    </Text>
    <br/>
    <Text type="secondary">
    add_time:
      <Text>
        {(record.add_time &&
          moment(parseInt(`${record.add_time  }000`)).format(
            'YYYY-MM-DD HH:mm:ss',
          )) ||
          'not yet'}
      </Text>
    </Text></>)
    },
  },
  {
    title: 'action',
    valueType: 'option',
    fixed: 'right',
    align: 'center',
    width: 200,
    render: (text, record) => {
      return <IssueSwitch record={record}  />
    }
  }
];

const IssueSwitch = (props: { record: AmazonReturnsItem }) => {
  const { record } = props
  const [issueStatus, setIssueStatus] = useState<any>(!!record.status)
  const [switchLoading, setSwaitchLoading] = useState(false)
  const changeIssueType = (val: number) => {
    setSwaitchLoading(true)
    updateReturnStatus({
      id: record.id,
      status: val
    }).then(res => {
      if (res.code) {
        message.success('operation successful!')
        setIssueStatus(val)
      }
    }).catch(e => {
      message.error(e)
    }).finally(() => {
      setSwaitchLoading(false)
    })
  }
  useEffect(() => {
    setIssueStatus(record.status)
  }, [record.status])
  return (<Spin spinning={switchLoading}><Radio.Group size='small' value={issueStatus} onChange={(val: any) => {
    changeIssueType(val.target.value)
  }}>
    <Radio.Button value={1}  style={issueStatus == 1 ? {"backgroundColor":"#87d068", "color": "white"}: {}}>Compelete</Radio.Button>
    <Radio.Button value={2} style={issueStatus == 2 ? {"backgroundColor":"red", "color": "white"}: {}}>Reject</Radio.Button>
  </Radio.Group></Spin>)
}


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
              let tempData = []
              tempData = res.data.list.map((item: AmazonReturnsItem) => {
                let address: Pii = JSON.parse(item.ShippingAddress)
                return {
                  ...item,
                  City: address?.City || '',
                  AddressType:address?.AddressType || '',
                  PostalCode: address?.PostalCode || '',
                  StateOrRegion:address?.StateOrRegion || '',
                  CountryCode:address?.CountryCode || '',
                  Phone: address?.Phone || '-',
                  Name: address?.Name || '',
                  AddressLine1:(address?.AddressLine1 || '') + ' ' + (address?.AddressLine2 || ''),
                }
              })
              resolve({
                data: tempData,
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
        headerTitle={
          <>
            <WarningOutlined /> AmazonReturns
          </>
        }
      />
    </>
  );
};
