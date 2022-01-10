/* eslint-disable radix */
import { useRef, useState } from 'react';
import { Typography, Space, message} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { shopifyOrders } from '../../services/order/shopifyorder';
import { getKesGroup, getKesValue } from '@/utils/utils';
import type { vendors } from '@/services/publicKeys';
import { getPageHeight } from '@/utils/utils';
import { getTargetHref, getAsonHref } from '@/utils/jumpUrl';
import { AmazonOutlined} from '@ant-design/icons';
import ParagraphText from '@/components/ParagraphText'
import styles from './style.less';

const { Text,Paragraph } = Typography;
type GithubIssueItem = {
    id: number;
    orderId: string;
    sku: string;
    title: string;
    lineItemFulfillmentStatus: string;
    quantity: number;
    lineItemCost: string;
    total: string;
    deliveryCost: string;
    itemLocation: string;
    store_id: string;
    add_time: number;
    update_at: string;
    variant_id: string;
    listing_id: number;
    order_item_id: string;
    listing: {
        vendor_id?: number;
        tag_id?: number;
        vendor_price?: string;
        store_price_now: string;
        asin:string;
    };
    order_shopify:{
        shipping_address: string;
    },
    userInfo: {
        zip?: string;
        name?: string;
        city?: string;
        phone?:string;
        country?:string;
        address1?:string;
        address2?:string;
        province_code?:string;
        country_code?:string;
    },
    order_item_record:{
        title: string;
    },
    country_id: number;
    vendor_id?: number;
    tag_id?: number;
    isRepeatFirst: number;
    isRepeatLaster: number;
    created_at: string;
    updated_at: string;
    shipping: {code: string, title: string, source: string}
}



const columns = (init?: () => void): ProColumns<GithubIssueItem>[] => [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Marketplace',
    dataIndex: 'Marketplace',
    search: false,
    width: 405,
    render: (_, record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Sku :
              <Text>
                {record?.sku && (
                  <>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${getTargetHref(record?.listing.vendor_id || "",record.sku)}`}
                    >
                      {record.sku}
                    </a>
                    <Paragraph
                      style={{ display: 'inline' }}
                      copyable={{ text: record.sku }}
                    ></Paragraph>
                  </>
                )}
              </Text>
            </Text>
            <Text type="secondary">
              <AmazonOutlined />
              Asin:
              <a target="_blank" href={`${getAsonHref(record.country_id)}${record.listing.asin}`}>
                {record.listing.asin}
              </a>
              <Paragraph style={{ display: 'inline' }} copyable={{ text: record.listing.asin }}></Paragraph>
            </Text>
            <Text type="secondary">
            Order item Id : <Text copyable>{record.order_item_id}</Text>
            </Text>
            <Text type="secondary">
            Variant Id : <Text copyable>{record.variant_id}</Text>
            </Text>
              {record.tag_id && (<Text type="secondary">
                Tag Name:
                  {record && (<ParagraphText
                  content={getKesValue('tagsData', record.tag_id || "")?.tag_name}
                  width={280}
                />)}
            </Text>)}
            <Text type="secondary">Title : <ParagraphText
                content={record.order_item_record.title}
                width={280}
              /></Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Pii',
    dataIndex: 'Pii',
    search: false,
    width: 305,
    render: (_,record) => {
      let phone = record.userInfo.phone || ""
      let newPhone = phone.substr(0,3)+'-'+phone.substr(3,3)+'-'+phone.substr(6)
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
             {record.userInfo.name && (<>Username : <Text copyable>{`${record.userInfo.name}`}</Text></>)}
            </Text>
            <Text type="secondary">
            {(record.userInfo as any).address1+(record.userInfo as any).address2 && (<>address : <Text copyable>{`${record.userInfo.address1 + ' ' + record.userInfo.address2}`}</Text></>)}
            </Text>
            <Text type="secondary">
            {record.userInfo.city && (<>City : <Text copyable>{`${record.userInfo.city}`}</Text></>)}
            </Text>
            <Text type="secondary">
            {record.userInfo.province_code && (<>Province code : <Text copyable>{`${record.userInfo.province_code}`}</Text></>)}
            </Text>
            <Text type="secondary">
            {record.userInfo.zip && (<>PostalCode : <Text copyable>{`${record.userInfo.zip}`}</Text></>)}
            </Text>
            <Text type="secondary">
            {record.userInfo.country && (<>Country : <Text copyable>{`${record.userInfo.country}`}</Text></>)}
            </Text>
            <Text type="secondary">
            {record.userInfo.phone && (<>Phone : <Text copyable>{`${newPhone}`}</Text></>)}
            </Text>
          </Space>
        </>
      );
    },
  },
  
  {
    title: 'Shipping info',
    dataIndex: 'Shipping info',
    search: false,
    width: 150,
    render: (_,record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
                    code: <Text copyable>{record.shipping.code}</Text>
            </Text>
            <Text type="secondary">
                    Title: <Text copyable>{record.shipping.title}</Text>
            </Text>
            <Text type="secondary">
                    Source: <Text copyable>{record.shipping.source}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Sku',
    dataIndex: 'sku',
    hideInTable: true,
  },
  {
    title: 'Title',
    dataIndex: 'title',
    hideInTable: true,
  },
  {
    title: 'Date',
    dataIndex: 'time',
    valueType: 'date',
    width: 250,
    search: false,
    render: (_,record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
            creationDate:
              <Text>
                {record.created_at}
              </Text>
            </Text>
            <Text type="secondary">
            updated_at:
              <Text>
                {record.updated_at}
              </Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Vendor',
    dataIndex: 'vendor_id',
    width: 150,
    valueType: 'select',
    request: async () => {
      return [
        ...getKesGroup('vendorData').map((item: vendors) => {
          return {
            label: item.vendor_name,
            value: item.id,
          };
        }),
      ];
    },
  },
  {
    title: 'OrderId',
    dataIndex: 'order_id',
    hideInTable: true
  },
  {
    title: 'quantity',
    dataIndex: 'quantity',
    width: 120,
  },
  {
    title: 'Vendor price',
    dataIndex: 'vendor_price',
    width: 100,
    align: 'center',
    search: false,
    render: (_, record) => {
        return `${record.listing?.vendor_price || ""}`
    }
  },
  {
    title: 'ItemPrice amount',
    dataIndex: 'ItemPriceAmount',
    width: 120,
    render: (_, record) => {
        return `${record.listing?.store_price_now || ""}`
    }
  },
  {
    title: 'Store',
    dataIndex: 'store_id',
    valueType: 'select',
    width: 200,
    request: async (): Promise<any> => {
      const tempData = getKesGroup('storeData').map((item: { id: number; name: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      return tempData;
    },
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<number>(-1);
  return (
    <>
      <ProTable<GithubIssueItem>
        size="small"
        columns={columns(() => {
          actionRef.current?.reload()
        })}
        headerTitle="Shopify orders"
        actionRef={actionRef}
        className={styles.tableStyle}
        request={async (params = {}, sort) =>
          new Promise((resolve) => {
            const sortParams: {
              sort_by?: string;
              sort_field?: string;
            } = {};
            if (sort) {
              for (const key in sort) {
                sortParams.sort_by = sort[key] === 'descend' ? 'desc' : 'asc';
                sortParams.sort_field = key;
              }
            }
            const tempParams: any = {
              ...params,
              ...sortParams,
              page: params.current,
              limit: params.pageSize,
            };
            shopifyOrders(tempParams).then((res) => {
              var tempData = []
              if (res.code){
                tempData = res.data.list.map((item: GithubIssueItem, index: number) => {
                    return {
                        ...item,
                        vendor_id: item.listing?.vendor_id,
                        tag_id: item.listing?.tag_id,
                        userInfo: JSON.parse(item.order_shopify.shipping_address)
                    }
                })
              } else {
                message.error(res.msg);
              }
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
        onRow={(record) => {
          return {
            onClick: () => {
              setCurrentRow(record.id);
            },
          };
        }}
        rowClassName={(record) => {
          return record.id === currentRow ? 'clickRowStyl' : '';
        }}
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
          pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '400'],
          pageSize: 50,
        }}
        options={{
          search: false,
        }}
        scroll={{
          x: columns().reduce((sum, e) => sum + Number(e.width || 0), 0),
          y: getPageHeight() - 250,
        }}
        dateFormatter="string"
      />
    </>
  );
};
