/* eslint-disable radix */
import { useRef, useState } from 'react';
import { Typography, Space, message,Tooltip} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ebayOrders } from '../../services/order/ebay';
import { getKesGroup, getKesValue } from '../../utils/utils';
import type { vendors } from '../../services/publicKeys';
import { getPageHeight } from '../../utils/utils';
import { getTargetHref } from '../../utils/jumpUrl';
import ParagraphText from '@/components/ParagraphText'
import moment from 'moment';
import styles from './style.less';

const { Text,Paragraph } = Typography;
type GithubIssueItem = {
    id: number;
    orderId: string;
    lineItemId: string;
    legacyItemId: string;
    sku: string;
    title: string;
    lineItemFulfillmentStatus: string;
    quantity: number;
    lineItemCost: string;
    total: string;
    deliveryCost: string;
    ebayCollectAndRemitTaxes: string;
    lineItemFulfillmentInstructions: string;
    itemLocation: string;
    store_id: string;
    add_time: number;
    update_at: string;
    listing_id: number;
    listing: {
        vendor_id?: number;
        tag_id?: number;
        vendor_price?: string;
    };
    order_ebay_id: number;
    country_id: number;
    order_ebay: {
        id: number;
        orderId: string;
        legacyOrderId: string;
        creationDate: string;
        lastModifiedDate: string;
        orderFulfillmentStatus: string;
        sellerId: string;
        buyer: {
            username: string;
            taxAddress: {
                stateOrProvince: string;
                postalCode: string;
                countryCode: string;
            };
        };
        pricingSummary: string;
        cancelStatus: string;
        paymentSummary: string;
        fulfillmentStartInstructions: string;
        fulfillmentHrefs: unknown;
        totalFeeBasisAmount: string;
        totalMarketplaceFee: string;
        OrderItemTotal: number;
        add_time: string;
        update_at: string;
        store_id: number;
    };
    vendor_id?: number;
    tag_id?: number;
    isRepeatFirst: number;
    isRepeatLaster: number;
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
                orderId : <Text>

                <Tooltip
                placement="top"
                title={record.isRepeatFirst === 1 || record.isRepeatLaster ? 'Repeat order!' : undefined}
              >
                <Text
                  copyable
                  style={record.isRepeatFirst === 1 || record.isRepeatLaster ? { color: 'red', width: '160px' } : undefined}
                >
                  {record.orderId}
                </Text>
              </Tooltip>

                </Text>
            </Text>
            <Text type="secondary">
              lineItemId : <Text copyable>{record.lineItemId}</Text>
            </Text>
            <Text type="secondary">
                legacyItemId : <Text copyable>{record.legacyItemId}</Text>
            </Text>
              {record.tag_id && (<Text type="secondary">
                Tag Name:
                  {record && (<ParagraphText
                  content={getKesValue('tagsData', record.tag_id || "")?.tag_name}
                  width={280}
                />)}
            </Text>)}
            <Text type="secondary">Title : <ParagraphText
                content={record.title}
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
    width: 345,
    render: (_,record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
             Username : <Text copyable>{`${record.order_ebay.buyer.username}`}</Text>
            </Text>
            <Text type="secondary">
             countryCode : <Text copyable>{`${record.order_ebay.buyer.taxAddress.countryCode}`}</Text>
            </Text>
            <Text type="secondary">
            postalCode : <Text copyable>{`${record.order_ebay.buyer.taxAddress.postalCode}`}</Text>
            </Text>
            <Text type="secondary">
            stateOrProvince : <Text copyable>{`${record.order_ebay.buyer.taxAddress.stateOrProvince}`}</Text>
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
            creationDate :{' '}
              <Text>
                {moment(parseInt(`${record.order_ebay.creationDate  }000`)).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </Text>
            <Text type="secondary">
            lastModifiedDate :{' '}
              <Text>
                {moment(parseInt(`${record.order_ebay.lastModifiedDate  }000`)).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </Text>
            <Text type="secondary">
            add_time :{' '}
              <Text>
                {moment(parseInt(`${record.order_ebay.add_time  }000`)).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </Text>
            <Text type="secondary">
            update_at :{' '}
              <Text>
                {moment(parseInt(`${record.order_ebay.update_at  }000`)).format('YYYY-MM-DD HH:mm:ss')}
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
    dataIndex: 'orderId',
    hideInTable: true
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
        headerTitle="Ebay orders"
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
            ebayOrders(tempParams).then((res) => {
              var tempData = []
              if (res.code){
                tempData = res.data.list.map((item: GithubIssueItem, index: number) => {
                    return {
                        ...item,
                        order_ebay: {
                          ...item.order_ebay,
                          buyer: JSON.parse((item.order_ebay as any).buyer)
                        },
                        vendor_id: item.listing?.vendor_id,
                        tag_id: item.listing?.tag_id,
                        isRepeatFirst: res.data.list[index + 1] ? res.data.list[index + 1].orderId === item.orderId ? 1 : 0 : 0,
                        isRepeatLaster: res.data.list[index - 1] ? res.data.list[index - 1].orderId === item.orderId ? 1 : 0 : 0
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
