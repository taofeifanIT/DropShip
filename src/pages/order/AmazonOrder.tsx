import { useEffect, useRef, useState, createRef, useImperativeHandle } from 'react';
import {
  AmazonOutlined,
  LockOutlined,
  BellOutlined,
  CloudDownloadOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Typography,
  Space,
  Form,
  Modal,
  InputNumber,
  message,
  Tag,
  Tooltip,
  Table,
  Empty,
  Switch,
  Spin,
  Tabs,
  Row,
  Col,
  Dropdown,
  Menu,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  list,
  saleLimit,
  updateIssueTrack,
  getList,
  getAmazonOrders,
  updateTrial,
  autoOrder,
} from '@/services/order/order';
import { getPageHeight } from '@/utils/utils';
import { getTargetHref, getAsonHref } from '@/utils/jumpUrl';
import { getKesGroup, getKesValue } from '@/utils/utils';
import { vendors, configs } from '@/services/publicKeys';
import moment from 'moment';
import styles from './style.less';
import ParagraphText from '@/components/ParagraphText';
import { exportReport } from '@/utils/utils';
const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
  country_id: number;
  AmazonOrderId: string;
  ASIN: string;
  Title: string;
  SellerSKU: string;
  listing: any;
  OrderItemTotal: number;
  OrderItemId: number;
  IsReplacementOrder: number;
  vpn: string;
  brand: string;
  Name: string;
  City: string;
  AddressType: string;
  PostalCode: string;
  StateOrRegion: string;
  CountryCode: string;
  AddressLine1: string;
  phone: string;
  vendor: number;
  auto_order: number;
  is_return: number;
  order_amazon: {
    PurchaseDate: string;
    issue_tracking: number;
    OrderStatus: number;
    id: number;
  };
  update_at: number;
  vendor_change_time: number;
  QuantityOrdered: number;
  vendor_price: string;
  sku_num: number;
  is_trial: number;
  store_id: number;
  ack_reason: string;
  ack_status: string;
  OrderStatus: string;
  order_status: number;
};
// https://www.google.com.hk/search?q=aini+13
const columns: ProColumns<GithubIssueItem>[] = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Marketplace',
    dataIndex: 'Marketplace',
    search: false,
    width: 385,
    render: (_, record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              <AmazonOutlined />
              Asin:
              <a target="_blank" href={`${getAsonHref(record.country_id)}${record.ASIN}`}>
                {record.ASIN}
              </a>
              <Paragraph style={{ display: 'inline' }} copyable={{ text: record.ASIN }}></Paragraph>
            </Text>
            <Text type="secondary">
              Sku:
              <Text>
                {record?.listing && (
                  <>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${getTargetHref(record?.listing?.vendor_id, record.SellerSKU)}`}
                    >
                      {record.SellerSKU}
                    </a>
                    <Paragraph
                      style={{ display: 'inline' }}
                      copyable={{ text: record.SellerSKU }}
                    ></Paragraph>
                  </>
                )}
              </Text>
            </Text>
            <Text type="secondary">
              order:
              <Tooltip
                placement="top"
                title={record.OrderItemTotal > 1 ? 'Repeat order!' : undefined}
              >
                <Text
                  copyable
                  style={record.OrderItemTotal > 1 ? { color: 'red', width: '160px' } : undefined}
                >
                  {record.AmazonOrderId}
                </Text>
              </Tooltip>
            </Text>
            <Text type="secondary">
              OrderItemId:
              <Text copyable>{record.OrderItemId}</Text>
              {record.auto_order === 0 ? (
                <Tooltip placement="top" title={'No automatic ordering'}>
                  <InfoCircleOutlined style={{ color: 'red' }} />
                </Tooltip>
              ) : null}
            </Text>
            <Text type="secondary">
              {record.sku_num ? (
                <>
                  Number of sold:
                  <a
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginRight: 10 }}
                    href={`/order/AmazonOrder?SellerSKU=${record.SellerSKU}`}
                  >
                    {record.sku_num}
                  </a>
                </>
              ) : null}
              {record.vpn && (
                <>
                  vpn:
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.google.com.hk/search?q=${record.vpn}+${record.brand}`}
                  >
                    {record.vpn}
                  </a>
                </>
              )}
            </Text>
            <Text type="secondary">
              Tag Name:
              {record.listing && (
                <ParagraphText
                  content={getKesValue('tagsData', record.listing.tag_id)?.tag_name}
                  width={280}
                />
              )}
            </Text>
            <Text type="secondary">
              title: <ParagraphText content={record.Title} width={300} />
            </Text>
            {record.IsReplacementOrder ? <Tag color="#f50">IsReplacementOrder</Tag> : null}
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
      let isExitOpBox = record.AddressLine1.toUpperCase().includes("PO BOX".toUpperCase())
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Name: <Text copyable>{record.Name}</Text>
            </Text>
            <Text type="secondary">
              AddressLine1: <Text style={{ "color": isExitOpBox ? "red" : "" }} copyable>{record.AddressLine1}</Text>
            </Text>
            <Text type="secondary">
              PostalCode:
              <Text copyable={{ text: record.PostalCode.split('-')[0] }}>{record.PostalCode}</Text>
            </Text>
            <Text type="secondary">
              City: <Text copyable>{record.City}</Text>
            </Text>
            <Text type="secondary">
              StateOrRegion: <Text copyable>{record.StateOrRegion}</Text>
            </Text>
            <Text type="secondary">
              phone: <Text copyable={{ text: record.phone.split(' ')[1] }}>{record.phone}</Text>
            </Text>
            <Text type="secondary">
              <Tag color="#2db7f5">{record.CountryCode}</Tag>
              {record.AddressType === 'Commercial' ? (
                <Tag color="warning">{record.AddressType}</Tag>
              ) : (
                <Tag color="#87d068">{record.AddressType}</Tag>
              )}
              {record.is_return ? <Tag color="#f50">Is return</Tag> : null}
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Date',
    dataIndex: 'time',
    valueType: 'date',
    width: 250,
    search: false,
    render: (_, record) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Purchase Date:
              <Text>
                {moment(parseInt(`${record.order_amazon.PurchaseDate}000`)).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </Text>
            <Text type="secondary">
              update_at:
              <Text>{moment(record.update_at * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </Text>
            <Text type="secondary">
              vendorChangeTime:
              <Text>{moment(record.vendor_change_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'AmazonOrderId',
    dataIndex: 'AmazonOrderId',
    hideInTable: true,
  },
  {
    title: 'ASIN',
    dataIndex: 'ASIN',
    hideInTable: true,
  },
  {
    title: 'SKU',
    dataIndex: 'SellerSKU',
    hideInTable: true,
  },
  {
    title: 'Other info',
    width: 220,
    search: false,
    dataIndex: 'otherInfo',
    render: (_, record) => {
      const str =
        `${'Order 1:\n' + '\n' + 'Ship to:\n' + ''}${record.Name}\n` +
        `${record.AddressLine1}\n` +
        `${record.City}, ${record.StateOrRegion} ${record.PostalCode}\n` +
        `\n` +
        `SKU: ${record.SellerSKU}\n` +
        `QTY: ${record.QuantityOrdered}\n` +
        `Price: $${record.vendor_price}\n` +
        `\n` +
        `Reference Number: ${record.AmazonOrderId.split('-')[record.AmazonOrderId.split('-').length - 1]
        }\n`;
      let vendorName = getKesValue("vendorData", record.vendor).vendor_name
      let vendorContent = record.vendor === 5 ? <Paragraph copyable={{ text: str }} style={{ display: 'inline' }}>{vendorName}</Paragraph> : vendorName
      let quantityOrdered = record.QuantityOrdered
      let vendorPrice = record.vendor_price
      let storeName = getKesValue("storeData", record.store_id).name
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Vendor:
              <Text>
                {vendorContent}
              </Text>
            </Text>
            <Text type="secondary">
              Vendor price:
              <Text>{vendorPrice}</Text>
            </Text>
            <Text type="secondary">
              Store:
              <Text>{storeName}</Text>
            </Text>
            <Text type="secondary">
              Quantity ordered:
              <Text>{quantityOrdered}</Text>
            </Text>
          </Space>
        </>
      );
    }
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
    title: 'Store',
    dataIndex: 'store_id',
    valueType: 'select',
    hideInTable: true,
    request: () => {
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
    title: 'Vendor',
    dataIndex: 'vendor',
    hideInTable: true,
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
    title: 'Quantity ordered',
    dataIndex: 'QuantityOrdered',
    align: 'center',
    hideInTable: true,
  },
  {
    title: 'After algorithm price',
    valueType: 'money',
    // width: 200,
    dataIndex: 'after_algorithm_price',
    align: 'center',
    hideInTable: true, // 暂时关闭
    render: (
      _,
      record: {
        listing: {
          after_algorithm_price: string;
        };
      },
    ) => {
      return <>{record?.listing && record.listing.after_algorithm_price}</>;
    },
  },
  {
    title: 'Auto order',
    dataIndex: 'auto_order',
    hideInTable: true,
    valueEnum: {
      '0': { text: 'No automatic ordering', status: 'Error' },
      '1': { text: 'Automatic order has been placed', status: 'Success' },
    },
  },
  {
    title: 'OrderStatus',
    dataIndex: 'status',
    valueType: 'select',
    hideInTable: true,
    valueEnum: {
      "Unshipped": { text: 'Unshipped', status: 'Error' },
      "Shipped": { text: 'Shipped', status: 'Success' },
    },
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
          statusDesc = 'Unknown operation Operation code:'+record.order_status
      }
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Order status:
              <Text>
                {record.order_amazon.OrderStatus}
              </Text>
            </Text>
            <Text type="secondary">
              Operating status:
              <Text>
                {statusDesc}
              </Text>
            </Text>
          </Space>
        </>
      );
    }
  },
  {
    title: 'ItemPrice amount',
    dataIndex: 'ItemPriceAmount',
    valueType: 'money',
    width: 150,
  },
  {
    title: 'action',
    valueType: 'option',
    fixed: 'right',
    align: 'center',
    width: 140,
    render: (_, record) => {
      return (
        <>
          Issue tracking:
          <IssueSwitch record={record} />
          <br />
          Trial to sell:
          <SoldSwitch record={record} />
          Automatic order:
          <AuToOrderSwitch record={record} />
        </>
      );
    },
  },
];

const IssueSwitch = (props: { record: GithubIssueItem }) => {
  const { record } = props;
  const [issueStatus, setIssueStatus] = useState<any>(!!record.order_amazon.issue_tracking);
  const [switchLoading, setSwaitchLoading] = useState(false);
  const changeIssueType = (val: number) => {
    setSwaitchLoading(true);
    updateIssueTrack({
      id: record.order_amazon.id,
      issue_tracking: val,
    })
      .then((res) => {
        if (res.code) {
          message.success('operation successful!');
          setIssueStatus(val);
        }
      })
      .finally(() => {
        setSwaitchLoading(false);
      });
  };
  useEffect(() => {
    setIssueStatus(!!record.order_amazon.issue_tracking);
  }, [record.order_amazon.issue_tracking]);
  return (
    <Switch
      checkedChildren="tracking"
      unCheckedChildren="No trace"
      loading={switchLoading}
      checked={issueStatus}
      style={{ width: 90 }}
      onChange={(val: any) => {
        changeIssueType(val + 0);
      }}
    />
  );
};

const SoldSwitch = (props: { record: GithubIssueItem }) => {
  const { record } = props;
  const [issueStatus, setIssueStatus] = useState<any>(!!record.is_trial);
  const [switchLoading, setSwaitchLoading] = useState(false);
  const changeIssueType = (status: boolean) => {
    updateTrial({
      vendor_id: record.listing.vendor_id,
      vendor_sku: record.listing.vendor_sku,
      is_trial: +status,
    })
      .then((res) => {
        if (res.code) {
          message.success(`Sku ${record.listing.vendor_sku} will now be sold normally`);
          setIssueStatus(+status);
        } else {
          throw res.msg;
        }
      })
      .catch((e) => {
        message.error(e);
      })
      .finally(() => {
        setSwaitchLoading(false);
      });
  };
  useEffect(() => {
    setIssueStatus(!!record.is_trial);
  }, [record.is_trial]);
  return (
    <div>
      <Switch
        checkedChildren="Trial to sell"
        unCheckedChildren="normal sales"
        disabled={!issueStatus}
        loading={switchLoading}
        checked={issueStatus}
        onChange={(val) => {
          !val && changeIssueType(val);
        }}
      />
    </div>
  );
};

const AuToOrderSwitch = (props: { record: GithubIssueItem }) => {
  const { record } = props;
  const [issueStatus, setIssueStatus] = useState<any>(!!record.auto_order);
  const [switchLoading, setSwaitchLoading] = useState(false);
  const changeIssueType = (status: boolean) => {
    setSwaitchLoading(true);
    autoOrder({
      amazonOrderId: record.AmazonOrderId,
    })
      .then((res) => {
        if (res.code) {
          message.success(`Operation is successful`);
          setIssueStatus(+status);
        } else {
          throw res.msg;
        }
      })
      .catch((e) => {
        message.error(e);
      })
      .finally(() => {
        setSwaitchLoading(false);
      });
  };
  useEffect(() => {
    setIssueStatus(!!record.auto_order);
  }, [record.auto_order]);
  return (
    <div>
      <Switch
        checkedChildren="Have order"
        unCheckedChildren="Place the order"
        disabled={issueStatus}
        loading={switchLoading}
        checked={issueStatus}
        onChange={(val) => {
          val && changeIssueType(val);
        }}
      />
    </div>
  );
};

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
  const [designType, setDesignType] = useState(false);
  const [width, setWidth] = useState(800);
  const [data, setData] = useState<feedbackDataType[]>([]);
  const columns = [
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
      title: 'reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'Track Number',
      dataIndex: 'track_number',
      key: 'track_number',
    },
    {
      title: 'Quantity Shipped',
      dataIndex: 'quantity_shipped',
      key: 'quantity_shipped',
    },
    {
      title: 'Quantity Ordered',
      dataIndex: 'quantity_ordered',
      key: 'quantity_ordered',
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
      <Menu.Item key="2" onClick={() => setDesignType(false)}>
        Tabs display
      </Menu.Item>
      <Menu.Item key="3" onClick={() => setDesignType(true)}>
        Tiled display
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
  const tabsType = () => {
    return data.map((item, index) => {
      return (
        <TabPane tab={item.key} key={index + 'tab'}>
          <Table
            dataSource={item.items}
            size="small"
            key={'table' + item.key}
            pagination={{
              pageSize: 300,
              pageSizeOptions: ['10', '20', '30', '50', '100', '200', '300', '400', '500'],
              showQuickJumper: true,
            }}
            columns={columns}
          />
        </TabPane>
      );
    });
  };
  const tiledType = () => {
    return (
      <Row gutter={24}>
        {data.map((item, index) => {
          return (
            <Col span={8} key={index + 'col'}>
              <Table
                title={() => <h4>{item.key}</h4>}
                dataSource={item.items}
                bordered
                size="small"
                key={'table' + item.key}
                pagination={{
                  size: 'small',
                }}
                columns={columns}
              />
            </Col>
          );
        })}
      </Row>
    );
  };
  useEffect(() => {
    if (visible && !data.length) {
      init();
    } else {
      return;
    }
  }, [visible]);
  useEffect(() => {
    if (designType) {
      setWidth(2150);
    } else {
      setWidth(800);
    }
  }, [designType]);
  return (
    <>
      <Modal
        title="Order Processing feedback"
        width={width}
        visible={visible}
        onOk={handleCancel}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <Spin spinning={confirmLoading}>
            <Tabs
              tabBarExtraContent={
                <Switch
                  checkedChildren="tiled"
                  unCheckedChildren="tabs"
                  checked={designType}
                  onChange={setDesignType}
                />
              }
            >
              {designType ? tiledType() : tabsType()}
            </Tabs>
          </Spin>
        </Dropdown>
      </Modal>
    </>
  );
};

const excelStore = {
  10: '[Tels] Newegg',
  5: '[Tels] TWHouse',
  7: '[Tels] Petra Industries',
  8: '[Tels] MA Labs',
  6: '[Tels] Eldorado',
  2: '[Tels] Grainger',
  9: '[Tels] D&H Distributing',
  11: '[Tels] Scansource',
  13: '[Tels] Zoro',
  1: '[Tels] Ingram Micro USA',
};

export default () => {
  const actionRef = useRef<ActionType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [twHouseInfoVisible, setTwHouseInfoVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [from] = Form.useForm();
  const [currentRow, setCurrentRow] = useState(-1);
  const [limit, setLimit] = useState<configs>(getKesValue('configsData', 'order_quantity_limit'));
  const [scrollX, setScrollX] = useState(columns.reduce((sum, e) => sum + Number(e.width || 0), 0));
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [tableRows, setTableRows] = useState<number[]>([]);
  const [pullOrderLoading, setPullOrderLoading] = useState(false);
  let feedbackModelRef: React.ReactNode = createRef<HTMLElement>();
  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    from.validateFields().then(async (updatedValues: any) => {
      setConfirmLoading(true);
      saleLimit(updatedValues)
        .then((res) => {
          if (res.code) {
            message.success('operation successful!');
            setLimit(updatedValues.order_quantity_limit);
          } else {
            throw res.msg;
          }
        })
        .catch((e) => {
          message.error(e);
        })
        .finally(() => {
          setConfirmLoading(false);
          setIsModalVisible(false);
        });
    });
  };
  function clickDown() {
    const tableData = tableRows.map((item: any) => {
      var tagName = getKesValue('tagsData', item.listing.tag_id).tag_name;
      return {
        OrderID: item.AmazonOrderId.replace(/(^\s*)|(\s*$)/g, ''),
        Date: moment().format('M/D/YYYY'),
        Marketplace: item.storeName.replace(/(^\s*)|(\s*$)/g, ''),
        SKU: item.SellerSKU.replace(/(^\s*)|(\s*$)/g, ''),
        PricePerUnit: parseFloat(item.ItemPriceAmount) / parseInt(item.QuantityOrdered),
        QTY: item.QuantityOrdered.toString().replace(/(^\s*)|(\s*$)/g, ''),
        TotalRevenue: '',
        AmazonFee: '',
        PurchasePrice: '',
        Profit: '',
        PurchasedFrom: excelStore[item.listing.vendor_id],
        Notes: '',
        tagName: tagName,
      };
    });
    exportReport(tableData);
  }
  const returnTwhouseOrders = () => {
    const orders = tableRows
      .filter((row: any) => row.vendor === 5)
      .map((item: any, index) => {
        return (
          <div key={'ordersDom' + index}>
            <b style={{ marginBottom: 0 }}>Order {index + 1}:</b>
            <span>{'\n\n\n' + parseFloat(item.weight) * item.QuantityOrdered}</span>
            <p style={{ marginBottom: 0 }}>Ship to: </p>
            <p style={{ marginBottom: 0 }}>{item.Name}</p>
            <p style={{ marginBottom: 0 }}>{item.AddressLine1}</p>
            <p style={{ marginBottom: 0 }}>
              {item.City + ', ' + item.StateOrRegion + ' ' + item.PostalCode}
            </p>
            <br />
            <p style={{ marginBottom: 0 }}>SKU: {item.SellerSKU}</p>
            <p style={{ marginBottom: 0 }}>QTY: {item.QuantityOrdered}</p>
            <p style={{ marginBottom: 0 }}>Price: {item.vendor_price}</p>
            <br />
            <p style={{ marginBottom: 0 }}>
              Reference Number:{' '}
              {item.AmazonOrderId.split('-')[item.AmazonOrderId.split('-').length - 1]}
            </p>
            <br />
            <br />
          </div>
        );
      });
    if (orders.length) {
      orders.unshift(
        <p key="titleOrder" style={{ fontSize: '11pt', color: '#494949' }}>
          Please ship below orders with attached labels.
        </p>,
      );
      return orders;
    }
    return null;
  };

  function handleMenuClick(e: any) {
    setPullOrderLoading(true);
    getAmazonOrders({ day: e.key })
      .then((res) => {
        if (res.code) {
          message.success('Start pulling in new orders！');
          actionRef.current?.reload();
        } else {
          throw res.msg;
        }
      })
      .catch((e) => {
        message.error(e);
      })
      .finally(() => {
        setPullOrderLoading(false);
      });
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">One day</Menu.Item>
      <Menu.Item key="2">Tow day</Menu.Item>
    </Menu>
  );
  return (
    <>
      <ProTable<GithubIssueItem>
        size="small"
        columns={columns}
        actionRef={actionRef}
        className={styles.tableStyle}
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          selectedRowKeys,
          onChange: (RowKeys: any[] | number[], selectRows: any[]) => {
            setSelectedRowKeys(RowKeys);
            setTableRows(selectRows);
            // console.log('selectedRowKeys changed: ', RowKeys);
          },
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
              };
            }
            return values;
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
            list(tempParams).then((res) => {
              const tempData = res.data.list.map(
                (item: {
                  listing: {
                    vendor_id: number;
                    vendor_price: number;
                    vendor_change_time: string;
                    vpn: string;
                    brand: string;
                  };
                  order_amazon: {
                    ShippingAddress: string;
                    OrderItemTotal: string;
                    store_id: number;
                  };
                  order_item_record: {
                    product_info: string;
                  };
                  vendor: number;
                }) => {
                  return {
                    ...item,
                    storeName: getKesValue('storeData', item.order_amazon.store_id)?.name,
                    vendorName: getKesValue('vendorData', item?.listing.vendor_id)?.vendor_name,
                    vendor_price: item.listing ? item?.listing.vendor_price : '-',
                    vendor: item.listing ? item?.listing.vendor_id : -10000,
                    City: JSON.parse(item.order_amazon.ShippingAddress).City || '-',
                    AddressType: JSON.parse(item.order_amazon.ShippingAddress).AddressType || '-',
                    PostalCode: JSON.parse(item.order_amazon.ShippingAddress).PostalCode || '-',
                    StateOrRegion:
                      JSON.parse(item.order_amazon.ShippingAddress).StateOrRegion || '-',
                    CountryCode: JSON.parse(item.order_amazon.ShippingAddress).CountryCode || '-',
                    Name: JSON.parse(item.order_amazon.ShippingAddress).Name || '-',
                    AddressLine1:
                      (JSON.parse(item.order_amazon.ShippingAddress).AddressLine1 || '') +
                      ' ' +
                      (JSON.parse(item.order_amazon.ShippingAddress).AddressLine2 || '') || '-',
                    OrderItemTotal: item.order_amazon.OrderItemTotal,
                    vendor_change_time: item.listing.vendor_change_time,
                    phone: JSON.parse(item.order_amazon.ShippingAddress).Phone || '-',
                    vpn: item.listing ? item?.listing.vpn : '',
                    brand: item.order_item_record
                      ? JSON.parse(item?.order_item_record.product_info)?.brand
                      : '',
                    weight: item.order_item_record
                      ? JSON.parse(item?.order_item_record.product_info)?.weight
                      : '',
                  };
                },
              );
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
        rowClassName={(record) => {
          return record.id === currentRow ? 'clickRowStyl' : '';
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
          pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '250'],
          pageSize: 50,
        }}
        scroll={{ x: scrollX, y: getPageHeight() - 250 }}
        onColumnsStateChange={(col) => {
          const allWidth = columns.reduce((sum, e) => sum + Number(e.width || 0), 0);
          let reduceNum: number = 0;
          for (const c in col) {
            reduceNum += columns[c].width || 0;
          }
          setScrollX(allWidth - reduceNum);
        }}
        headerTitle={
          <>
            <BellOutlined /> orders
            <span style={{ marginLeft: '20px', fontSize: '16px' }}>
              Current quantity limit： {limit}
            </span>
          </>
        }
        onRow={(record: GithubIssueItem) => {
          return {
            onClick: () => {
              setCurrentRow(record.id);
            },
          };
        }}
        toolBarRender={() => [
          <Dropdown overlay={menu}>
            <Button key="pullNewOrder" loading={pullOrderLoading} icon={<CloudDownloadOutlined />}>
              Pull in new orders
            </Button>
          </Dropdown>,
          <Button
            key="OrderProcessingFeedback"
            onClick={() => {
              feedbackModelRef?.current.func();
            }}
          >
            Order Processing feedback
          </Button>,
          <Button
            key="twhouseEmalInfoBtn"
            onClick={() => {
              setTwHouseInfoVisible(true);
            }}
          >
            Twhouse orders info
          </Button>,
          <Button
            key="ImportOutlined"
            icon={<LockOutlined />}
            onClick={() => {
              showModal();
            }}
          >
            Change Limit
          </Button>,
          <Button disabled={!selectedRowKeys.length} onClick={clickDown}>
            export
          </Button>,
        ]}
      />
      <Modal
        title="Quantity Limit"
        visible={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => {
          setIsModalVisible(false);
        }}
      >
        <Form
          form={from}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            order_quantity_limit: limit,
          }}
          layout="horizontal"
        >
          <Form.Item label="quantity limit">
            <Form.Item
              name="order_quantity_limit"
              noStyle
              rules={[{ required: true, message: 'Please input your order quantity limit!' }]}
            >
              <InputNumber style={{ width: '200px' }}></InputNumber>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Twhouse orders info"
        visible={twHouseInfoVisible}
        onOk={() => setTwHouseInfoVisible(false)}
        onCancel={() => {
          setTwHouseInfoVisible(false);
        }}
      >
        {returnTwhouseOrders() || <Empty />}
      </Modal>
      <FeedbackModel onRef={feedbackModelRef} />
    </>
  );
};
