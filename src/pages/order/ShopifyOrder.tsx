/* eslint-disable radix */
import { useRef, useState, useImperativeHandle, useEffect, createRef } from 'react';
import { Typography, Space, message, Button, Tabs, Dropdown, Menu, Modal, Spin, Table, Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { shopifyOrders, manualOrder, setPurchasePrice, getList } from '../../services/order/shopifyorder';
import { getKesGroup, getKesValue, getPurchaseFromTitle } from '@/utils/utils';
import type { vendors } from '@/services/publicKeys';
import { getPageHeight } from '@/utils/utils';
import { getTargetHref, getAsonHref } from '@/utils/jumpUrl';
import { AmazonOutlined } from '@ant-design/icons';
import ParagraphText from '@/components/ParagraphText'
import OrderSwitch from './components/OrderSwitch';
import styles from './style.less';
import Edit from '@/components/Edit'
import { exportReport } from '@/utils/utils';
import moment from 'moment'
const { TabPane } = Tabs;

const { Text, Paragraph } = Typography;
type GithubIssueItem = {
  id: number;
  order_id: string;
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
    store_id?: number;
    store_price_now: string;
    asin: string;
  };
  order_shopify: {
    shipping_address: string;
    current_total_price: string;
    subtotal_price: string;
  },
  userInfo: {
    zip?: string;
    name?: string;
    city?: string;
    phone?: string;
    country?: string;
    address1?: string;
    address2?: string;
    province_code?: string;
    country_code?: string;
  },
  order_item_record: {
    title: string;
  },
  country_id: number;
  vendor_id: number;
  tag_id: number;
  isRepeatFirst: number;
  isRepeatLaster: number;
  created_at: string;
  updated_at: string;
  auto_order: number;
  is_auto: number;
  price: string;
  tracking_numbe: string | null;
  ack_reason: string;
  ack_status: string;
  order_status: number;
  status: string;
  shipping: { code: string, title: string, source: string },
  other_platform_order_number:number;
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
                      href={`${getTargetHref(record?.listing.vendor_id || "", record.sku)}`}
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
              order ID :
              <Tooltip
                  placement="top"
                  title={record.isRepeatFirst === 1 || record.isRepeatLaster ? 'Repeat order!' : undefined}
                >
                  <Text>
                    <a  
                      style={record.isRepeatFirst === 1 || record.isRepeatLaster ? { color: 'red', width: '160px' } : undefined}
                      href={`https://i-t-mars.myshopify.com/admin/orders/${record.order_id}`} target="_blank">{record.order_id}</a>
                  </Text>
                </Tooltip>
              <Paragraph style={{ display: 'inline' }} copyable={{ text: record.order_id }}></Paragraph>
            </Text>
            {record.other_platform_order_number ? (<Text type="secondary">Source order ID: <Text copyable>{record.other_platform_order_number}</Text></Text>): null}
            <Text type="secondary">
              Order item ID : <Text copyable>{record.order_item_id}</Text>
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
    render: (_, record) => {
      let phone = record.userInfo.phone || ""
      let newPhone = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6)
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              {record.userInfo.name && (<>Username : <Text copyable>{`${record.userInfo.name}`}</Text></>)}
            </Text>
            <Text type="secondary">
              {(record.userInfo as any).address1 + (record.userInfo as any).address2 && (<>address : <Text copyable>{`${record.userInfo.address1 + ' ' + record.userInfo.address2}`}</Text></>)}
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
    render: (_, record) => {
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
    title: 'ACK',
    width: 180,
    search: false,
    dataIndex: 'ACK',
    render: (_, record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              reason:
              {record.ack_reason ?
                <Text>
                  {record.ack_reason}
                </Text> :
                'not yet'}
            </Text>
            <Text type="secondary">
              status:
              {record.ack_status ?
                <Text>
                  {record.ack_status}
                </Text> :
                'not yet'}
            </Text>
          </Space>
        </>
      );
    }
  },
  {
    title: 'Status',
    dataIndex: 'Status_info',
    search: false,
    width: 240,
    render: (_, record) => {
      let statusDesc = ''
      switch (record.order_status) {
        case 0:
          statusDesc = 'No operation'
          break
        case 1:
          statusDesc = 'Automatic order has been placed'
          break
        case 2:
          statusDesc = 'Automatic order failure'
          break
        case 3:
          statusDesc = 'The logistics tracking number has been obtained'
          break
        default:
          statusDesc = 'Unknown operation Operation code:' + record.order_status
      }
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Operating status:
              <Text>
                {statusDesc}
              </Text>
            </Text>
            <Text type="secondary">
              Order results:
              <Text>
                {record.status}
              </Text>
            </Text>
          </Space>
        </>
      );
    }
  },
  {
    title: 'Purchase price',
    dataIndex: 'purchase_price',
    valueType: 'money',
    search: false,
    width: 150,
    render: (text, record) => {
      return <Edit id={record.id} pramsKey={"purchase_price"} api={setPurchasePrice} record={record} refresh={init} children={text} />
    }
  },
  {
    title: 'Price',
    dataIndex: 'vendor_price',
    width: 170,
    search: false,
    render: (_, record) => {
      return (<Space direction="vertical">
        <Text type="secondary">
          Vendor price:
          <Text>
            {record.listing?.vendor_price || ""}
          </Text>
        </Text>
        <Text type="secondary">
          Subtotal:
          <Text>
            {record.order_shopify?.subtotal_price || ""}
          </Text>
        </Text>
        <Text type="secondary">
          Shipping:
          <Text>
            {(parseFloat(record.order_shopify.current_total_price) - parseFloat(record.listing?.store_price_now)).toFixed(2) || ""}
          </Text>
        </Text>
        <Text type="secondary">
          Total:
          <Text>
            {record.listing.store_price_now || ""}
          </Text>
        </Text>
      </Space>)
    }
  },
  {
    title: 'Date',
    dataIndex: 'time',
    valueType: 'date',
    width: 220,
    search: false,
    render: (_, record) => {
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
    title: 'Order ID',
    dataIndex: 'order_id',
    hideInTable: true
  },
  {
    title: 'Source order ID',
    dataIndex: 'other_platform_order_number',
    hideInTable: true
  },
  {
    title: 'quantity',
    dataIndex: 'quantity',
    valueType: 'digit',
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
  {
    title: 'action',
    valueType: 'option',
    fixed: 'right',
    align: 'center',
    width: 140,
    render: (_, record) => {
      // is_auto:  0: 不可以一键下单  1： 可以一键下单  
      return (
        <>
          {record.is_auto ? (<OrderSwitch
            params={{
              order_id: record.order_id,
            }}
            targetKey={"is_sure"}
            targetValue={record.auto_order}
            checkedChildren={"Have order"}
            unCheckedChildren={"Place the order"}
            api={manualOrder}
            isTrueDisbled
          />) : null
          }
        </>
      );
    },
  },
];

type feedbackDataType = {
  key: string;
  items: {
    AmazonOrderId: string;
    po: string;
    reason: string;
    status: string;
  }[];
};

const FeedbackModel = (props: { onRef: any }) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [data, setData] = useState<feedbackDataType[]>([]);
  const columns: any[] = [
    {
      title: 'AmazonOrderId',
      dataIndex: 'AmazonOrderId',
      key: 'AmazonOrderId',
      width: '160px',
    },
    {
      title: 'po',
      dataIndex: 'po',
      key: 'po',
    },
    {
      title: 'status sku',
      dataIndex: 'status',
      key: 'status',
      width: 150
    },
    {
      title: 'reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 200
    },
    {
      title: 'order sku',
      dataIndex: 'order_sku',
      key: 'track_number',
    },
    {
      title: 'Quantity',
      dataIndex: 'Quantity',
      key: 'Quantity',
      width: 100,
      render: (_: any, record: any) => {
        return <Space direction="vertical">
          <Text type="secondary">
            Shipped: <Text>{record.quantity_shipped}</Text>
          </Text>
          <Text type="secondary">
            ordered: <Text>{record.quantity_ordered}</Text>
          </Text>
        </Space>
      }
    },
    {
      title: 'File',
      dataIndex: 'File',
      key: 'File',
      width: 160,
      render: (_: any, record: any) => {
        return <Space direction="vertical">
          <Text type="secondary">
            Quantity: <Text>{record.file_quantity}</Text>
          </Text>
          <Text type="secondary">
            Sku: <Text>{record.file_sku}</Text>
          </Text>
        </Space>
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const init = () => {
    setConfirmLoading(true);
    getList()
      .then((res) => {
        let tpData = Object.keys(res.data).map((key) => {
          return {
            key,
            items: res.data[key],
          };
        });
        setData(tpData);
      })
      .catch((e) => {
        message.error(e);
      })
      .finally(() => {
        setConfirmLoading(false);
      });
  };
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={init}>
        Refresh
      </Menu.Item>
    </Menu>
  );
  useImperativeHandle(props.onRef, () => {
    return {
      func: showModal,
    };
  });
  const handleCancel = () => {
    setVisible(false);
  };
  const showModal = () => {
    setVisible(true);
  };
  useEffect(() => {
    if (visible && !data.length) {
      init();
    } else {
      return;
    }
  }, [visible]);
  return (
    <>
      <Modal
        title="Order Processing feedback"
        width={1180}
        visible={visible}
        onOk={handleCancel}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <Spin spinning={confirmLoading}>
            <Tabs
            >
              {data.map((item, index) => (
                <TabPane tab={item.key} key={index + 'tab'}>
                  <Table<any>
                    dataSource={item.items}
                    size="small"
                    bordered
                    key={'table' + item.key}
                    rowKey="id"
                    columns={columns}
                    expandable={{
                      expandedRowRender: record => <p style={{ margin: 0 }}>{record.t1}</p>,
                      rowExpandable: record => !!record.t1,
                    }}
                  />
                </TabPane>
              ))}
            </Tabs>
          </Spin>
        </Dropdown>
      </Modal>
    </>
  );
};

export default () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<number>(-1);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableRows, setTableRows] = useState<GithubIssueItem[]>([]);
  const [time, setTime] = useState(moment().unix())
  let feedbackModelRef: any = createRef<HTMLElement>();
  function clickDown() {
    const tableData = tableRows.map((item: GithubIssueItem) => {
      let storeName = getKesValue('storeData', item.store_id)?.name;
      let tagName = getKesValue('tagsData', item.tag_id)?.tag_name;
      return {
        sourceOrderID: item.shipping.source === "walmart" ? item.other_platform_order_number : item.order_id.replace(/(^\s*)|(\s*$)/g, ''),
        Date: moment().format('M/D/YYYY'),
        Marketplace: storeName.replace(/(^\s*)|(\s*$)/g, ''),
        SKU: item.sku.replace(/(^\s*)|(\s*$)/g, ''),
        PricePerUnit: parseFloat(item.order_shopify?.subtotal_price) / item.quantity,
        QTY: item.quantity.toString().replace(/(^\s*)|(\s*$)/g, ''),
        TotalRevenue: '',
        AmazonFee: '',
        PurchasePrice: "",
        Profit: '',
        PurchasedFrom: getPurchaseFromTitle(item.vendor_id),
        Notes: "",
        tagName: tagName,
        ack_status: item.ack_status || "",
        ShipperTrackingNumber: item.tracking_numbe || "",
        source: item.shipping.source,
        orderId: item.order_id
      };
    });
    exportReport(tableData, 2);
  }
  return (
    <>
      <ProTable<GithubIssueItem>
        size="small"
        columns={columns(() => {
          setTime(moment().unix())
        })}
        headerTitle="Shopify orders"
        actionRef={actionRef}
        className={styles.tableStyle}
        rowSelection={{
          selectedRowKeys,
          onChange: (RowKeys: any[] | number[], selectRows: any[]) => {
            setSelectedRowKeys(RowKeys);
            setTableRows(selectRows);
          },
        }}
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
              if (res.code) {
                tempData = res.data.list.map((item: GithubIssueItem, index: number) => {
                  return {
                    ...item,
                    vendor_id: item.listing?.vendor_id,
                    tag_id: item.listing?.tag_id,
                    store_id: item.listing?.store_id,
                    userInfo: JSON.parse(item.order_shopify.shipping_address),
                    isRepeatFirst: res.data.list[index + 1] ? res.data.list[index + 1].order_id === item.order_id ? 1 : 0 : 0,
                    isRepeatLaster: res.data.list[index - 1] ? res.data.list[index - 1].order_id === item.order_id ? 1 : 0 : 0
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
        toolBarRender={() => [
          <Button key="exporttoolBtn" disabled={!selectedRowKeys.length} onClick={clickDown}>
            export
          </Button>,
          <Button
            key="OrderProcessingFeedback"
            onClick={() => {
              feedbackModelRef?.current.func();
            }}
          >
            Order Processing feedback
          </Button>
        ]}
      />
      <FeedbackModel onRef={feedbackModelRef} />
    </>
  );
};
