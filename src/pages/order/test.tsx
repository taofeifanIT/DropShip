import{ useEffect, useRef, useState,createRef,useImperativeHandle} from 'react';
import { AmazonOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';
import { Button, Typography, Space, Form, Modal, InputNumber, message, Tag, Tooltip,Table, Empty,Switch, Spin,Tabs,Row,Col,Dropdown,Menu } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { list, saleLimit,updateIssueTrack, getList } from '@/services/order/order';
import { getPageHeight } from '@/utils/utils';
import { getTargetHref, getAsonHref } from '@/utils/jumpUrl';
import { getKesGroup, getKesValue } from '@/utils/utils';
import { vendors, configs } from '@/services/publicKeys';
import moment from 'moment';
import styles from './style.less';
import ParagraphText from '@/components/ParagraphText'
import { exportExcel } from '@/utils/excelHelper'
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
  order_amazon: {
    PurchaseDate: string;
    issue_tracking: number;
    OrderStatus: number;
    id: number;
  };
  update_at: string;
  vendor_change_time: string;
  QuantityOrdered: number;
  vendor_price: string;
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
    render: (
      _,
      record: GithubIssueItem,
    ) => {
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
              Sku :
              <Text>
                {record?.listing && (
                  <>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${getTargetHref(record?.listing?.vendor_id,record.SellerSKU)}`}
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
              order :
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
              </Text>
              <Text type="secondary">
              {record.vpn && (<>vpn :
                <Text>
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href={`https://www.google.com.hk/search?q=${record.vpn}+${record.brand}`}
                          >
                            {record.vpn}
                          </a>
                </Text></>)}
            </Text>
            <Text type="secondary">
                Tag Name:
                {record.listing && (<ParagraphText
                  content={getKesValue('tagsData', record.listing.tag_id)?.tag_name}
                  width={280}
                />)}
              </Text>
            <Text type="secondary">
              title : <ParagraphText content={record.Title} width={300} />
            </Text>
            {record.IsReplacementOrder ? <Tag  color="#f50">IsReplacementOrder</Tag> : null}
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
    render: (
      _,
      record: GithubIssueItem,
    ) => {
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
              PostalCode : <Text copyable={{text: record.PostalCode.split('-')[0]}}>{record.PostalCode}</Text>
            </Text>
            <Text type="secondary">
              City : <Text copyable>{record.City}</Text>
            </Text>
            <Text type="secondary">
              StateOrRegion : <Text copyable>{record.StateOrRegion}</Text>
            </Text>
            <Text type="secondary">
              phone : <Text copyable={{text: record.phone.split(' ')[1]}}>{record.phone}</Text>
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
    title: 'Date',
    dataIndex: 'time',
    valueType: 'date',
    width: 250,
    search: false,
    render: (
      _,
      record: GithubIssueItem,
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Purchase Date :{' '}
              <Text>
                 {/* eslint-disable-next-line radix */}
                {moment(parseInt(`${record.order_amazon.PurchaseDate  }000`)).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </Text>
            <Text type="secondary">
              update_at :{' '}
              <Text>
                {/* eslint-disable-next-line radix */}
                {moment(parseInt(`${record.update_at  }000`)).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </Text>
            <Text type="secondary">
            vendor_change_time :{' '}
              <Text>
                {/* eslint-disable-next-line radix */}
                {moment(parseInt(`${record.vendor_change_time  }000`)).format('YYYY-MM-DD HH:mm:ss')}
              </Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Quantity ordered',
    dataIndex: 'QuantityOrdered',
    align: 'center',
    width: 150,
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
    title: 'Vendor',
    dataIndex: 'vendor',
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
    render: (
      text,
      record: GithubIssueItem,
    ) => {
      const str =
        `${'Order 1:\n' +
        '\n' +
        'Ship to:\n' +
        ''}${ 
        record.Name 
        }\n` +
        `${ 
        record.AddressLine1 
        }\n` +
        `${ 
        record.City 
        }, ${ 
        record.StateOrRegion 
        } ${ 
        record.PostalCode 
        }\n` +
        `\n` +
        `SKU: ${ 
        record.SellerSKU 
        }\n` +
        `QTY: ${ 
        record.QuantityOrdered 
        }\n` +
        `Price: $${ 
        record.vendor_price 
        }\n` +
        `\n` +
        `Reference Number: ${ 
        record.AmazonOrderId.split('-')[record.AmazonOrderId.split('-').length - 1] 
        }\n`;
      return record.vendor === 5 ? (
        <Paragraph copyable={{ text: str }}>{text}</Paragraph>
      ) : (
        <>{text}</>
      );
    },
  },
  {
    title: 'Vendor price',
    dataIndex: 'vendor_price',
    width: 100,
    align: 'center',
    search: false,
  },
  {
    title: 'After algorithm price',
    valueType: 'money',
    width: 200,
    dataIndex: 'after_algorithm_price',
    align: 'center',
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
    title: 'SKU',
    dataIndex: 'SellerSKU',
    hideInTable: true,
  },
  {
    title: 'OrderStatus',
    dataIndex: 'OrderStatus',
    width: 150,
    render: (_, record) => {
      return record.order_amazon.OrderStatus;
    },
  },
  {
    title: 'ItemPrice amount',
    dataIndex: 'ItemPriceAmount',
    width: 150,
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
    title: 'action',
    valueType: 'option',
    fixed: 'right',
    align: 'center',
    width: 100,
    render: (text, record) => {
      return <IssueSwitch record={record} />
    }
  }
];

const IssueSwitch = (props: {record: GithubIssueItem}) => {
  const { record } = props
  const [issueStatus, setIssueStatus] = useState<any>(!!record.order_amazon.issue_tracking)
  const [switchLoading, setSwaitchLoading] = useState(false)
  const changeIssueType = (val: number) => {
    setSwaitchLoading(true)
    updateIssueTrack({
      id: record.order_amazon.id,
      issue_tracking: val
    }).then(res => {
      if(res.code){
        message.success('operation successful!')
        setIssueStatus(val)
      }
    }).finally(() => {
      setSwaitchLoading(false)
    })
  }
  useEffect(() => {
    setIssueStatus(!!record.order_amazon.issue_tracking)
  }, [record.order_amazon.issue_tracking])
  return <Switch checkedChildren="tracking" unCheckedChildren="close" loading={switchLoading}  checked={issueStatus} onChange={(val: any) => {
    changeIssueType(val + 0)
  }} />
}


type feedbackDataType = {
  key: string,
  items:{
    AmazonOrderId: string,
    po: string,
    reason: string,
    status: string
  }[]
}


const FeedbackModel = (props: {onRef: any}) => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [designType, setDesignType] = useState(false);
  const [width, setWidth] =useState(800)
  const [data, setData] = useState<feedbackDataType[]>([])
  const columns = [
    {
      title: 'AmazonOrderId',
      dataIndex: 'AmazonOrderId',
      key: 'AmazonOrderId',
      width: '160px'
    },
    {
      title: 'po',
      dataIndex: 'po',
      key: 'po',
      width: '120px'
    },
    {
      title: 'reason',
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: 'status',
      dataIndex: 'status',
      key: 'status',
    }
  ];
  
  const init = () => {
    setConfirmLoading(true)
    getList().then(res => {
      let tpData =  Object.keys(res.data).map((key) => {
        return {
          key,
          items: res.data[key]
        }
      })
      setData(tpData)
    }).catch(e => {
      message.error(e)
    }).finally(() => {
      setConfirmLoading(false)
    })
  }
  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={init}>Refresh</Menu.Item>
      <Menu.Item key="2" onClick={() => setDesignType(false)}>Tabs display</Menu.Item>
      <Menu.Item key="3" onClick={() => setDesignType(true)}>Tiled display</Menu.Item>
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
    return  data.map((item,index) => {
      return (<TabPane tab={item.key} key={index}>
               <Table
                   dataSource={item.items} 
                   size='small'
                   key={'table'+ item.key}
                   columns={columns} />
              </TabPane>)
    })
  } 
 const tiledType = () => {
   return (<Row gutter={24}>
    { data.map((item,index) => {
      return (<Col span={8}><Table
        title={() => (<h4>{item.key}</h4>)}
        dataSource={item.items} 
        bordered
        size='small'
        key={'table'+ item.key}
        pagination={{
          size:"small"
        }}
        columns={columns} /></Col>)
    })}
   </Row>)
 }
  useEffect(() => {
    if(visible && !data.length){
      init()
    } else {
      return
    }
  }, [visible])
  useEffect(() => {
    if(designType){
       setWidth(2000)
    } else {
      setWidth(800)
    }
  }, [designType])
  return (<>
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
          <Tabs tabBarExtraContent={<Switch checkedChildren="tiled" unCheckedChildren="tabs" checked={designType} onChange={setDesignType} />}>
            {designType ? tiledType() : tabsType()}
          </Tabs>
          </Spin>
        </Dropdown>
      </Modal>
  </>)
}

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
  const [tableRows,setTableRows] = useState<number[]>([])
  let feedbackModelRef:React.ReactNode = createRef();
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
  function clickDown () {
      const tableData = tableRows.map((item: any) => {
        var tagName = getKesValue('tagsData',item.listing.tag_id).tag_name;
        return {
          Date: moment().format('YYYY/MM/DD'),
          Marketplace: item.storeName.replace(/(^\s*)|(\s*$)/g, ""),
          OrderID: item.AmazonOrderId.replace(/(^\s*)|(\s*$)/g, ""),
          SKU: item.SellerSKU.replace(/(^\s*)|(\s*$)/g, ""),
          PricePerUnit: parseFloat(item.ItemPriceAmount) / parseInt(item.QuantityOrdered),
          QTY: item.QuantityOrdered.toString().replace(/(^\s*)|(\s*$)/g, ""),
          TotalRevenue: '',
          AmazonFee: '',
          PurchasePrice: '',
          Profit: '',
          PurchasedFrom: item.vendorName.replace(/(^\s*)|(\s*$)/g, ""),
          Notes: '',
          tagName: tagName
        }
      })
      const header = [
        {title: 'Date', dataIndex: 'Date', key: 'Date'},
        {title: 'Marketplace', dataIndex: 'Marketplace', key: 'Marketplace'},
        {title: 'OrderID', dataIndex: 'OrderID', key: 'OrderID'},
        {title: 'SKU', dataIndex: 'SKU', key: 'SKU'},
        {title: 'PricePerUnit', dataIndex: 'PricePerUnit', key: 'PricePerUnit'},
        {title: 'QTY', dataIndex: 'QTY', key: 'QTY'},
        {title: 'TotalRevenue', dataIndex: 'TotalRevenue', key: 'TotalRevenue'},
        {title: 'AmazonFee', dataIndex: 'AmazonFee', key: 'AmazonFee'},
        {title: 'PurchasePrice', dataIndex: 'PurchasePrice', key: 'PurchasePrice',type: 'number'},
        {title: 'Profit', dataIndex: 'Profit', key: 'Profit'},
        {title: 'PurchasedFrom', dataIndex: 'PurchasedFrom', key: 'PurchasedFrom'},
        {title: 'Notes', dataIndex: 'Notes', key: 'Notes'},
        {title: 'tagName', dataIndex: 'tagName', key: 'tagName'}
      ]
      exportExcel(header,tableData,`Orders ${moment().format('MMDD')}.xlsx`)
  }
  const returnTwhouseOrders = () => {
    const orders = tableRows.filter((row: any) => row.vendor === 5).map((item: any, index) => {
      return <div key={'ordersDom'+index}>
          <b style={{marginBottom: 0}}>Order {index + 1}:</b><span>{'\n\n\n'+parseFloat(item.weight) * item.QuantityOrdered}</span>
          <p style={{marginBottom: 0}}>Ship to: </p>
          <p style={{marginBottom: 0}}>{item.Name}</p>
          <p style={{marginBottom: 0}}>{item.AddressLine1}</p>
          <p style={{marginBottom: 0}}>{item.City + ', ' + item.StateOrRegion + ' ' + item.PostalCode}</p>
          <br/>
          <p style={{marginBottom: 0}}>SKU: {item.SellerSKU}</p>
          <p style={{marginBottom: 0}}>QTY: {item.QuantityOrdered}</p>
          <p style={{marginBottom: 0}}>Price: {item.vendor_price}</p>
          <br/>
          <p style={{marginBottom: 0}}>Reference Number: {item.AmazonOrderId.split('-')[item.AmazonOrderId.split('-').length - 1] }</p>
          <br/>
          <br/>
      </div>
    })
    if (orders.length){
      orders.unshift(<p key='titleOrder' style={{fontSize: '11pt', color: '#494949'}}>Please ship below orders with attached labels.</p>)
      return orders
    }
    return null
  }

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
                    product_info: string
                  };
                  vendor: number;
                }) => {
                  return {
                    ...item,
                    storeName: getKesValue('storeData',item.order_amazon.store_id)?.name,
                    vendorName: getKesValue('vendorData',item?.listing.vendor_id)?.vendor_name,
                    vendor_price: item.listing ? item?.listing.vendor_price : '-',
                    vendor: item.listing ? item?.listing.vendor_id : -10000,
                    City: JSON.parse(item.order_amazon.ShippingAddress).City || '-',
                    AddressType:
                      JSON.parse(item.order_amazon.ShippingAddress).AddressType || '-',
                    PostalCode: JSON.parse(item.order_amazon.ShippingAddress).PostalCode || '-',
                    StateOrRegion:
                      JSON.parse(item.order_amazon.ShippingAddress).StateOrRegion || '-',
                    CountryCode:
                      JSON.parse(item.order_amazon.ShippingAddress).CountryCode || '-',
                    Name: JSON.parse(item.order_amazon.ShippingAddress).Name || '-',
                    AddressLine1:
                      ((JSON.parse(item.order_amazon.ShippingAddress).AddressLine1 || '')+' '+(JSON.parse(item.order_amazon.ShippingAddress).AddressLine2 || '')) || '-',
                    OrderItemTotal: item.order_amazon.OrderItemTotal,
                    vendor_change_time:item.listing.vendor_change_time,
                    phone: JSON.parse(item.order_amazon.ShippingAddress).Phone || '-',
                    vpn: item.listing ? item?.listing.vpn : "",
                    brand: item.order_item_record ? JSON.parse(item?.order_item_record.product_info)?.brand : "",
                    weight: item.order_item_record ? JSON.parse(item?.order_item_record.product_info)?.weight : "",
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
            <BellOutlined /> orders{' '}
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
          <Button key='OrderProcessingFeedback' onClick={() => {
            feedbackModelRef?.current.func()
          }}>Order Processing feedback</Button>,
          <Button
            key="twhouseEmalInfoBtn"
            onClick={() => {
              setTwHouseInfoVisible(true)
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
          </Button>
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
