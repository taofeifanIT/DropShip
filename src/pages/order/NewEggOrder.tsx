/* eslint-disable radix */
import { useEffect, useRef, useState } from 'react';
import { Button, Typography, Space, Form, Modal, InputNumber, message,Input } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { newEggListing,shipOrder } from '../../services/order/newEggOrder';
import { getNewEggHref } from '../../utils/jumpUrl';
import { getKesGroup, getKesValue } from '../../utils/utils';
import type { vendors } from '../../services/publicKeys';
import { getPageHeight } from '../../utils/utils';
import { getTargetHref } from '../../utils/jumpUrl';
import ParagraphText from '@/components/ParagraphText'
import moment from 'moment';
import styles from './style.less';

const { Text,Paragraph } = Typography;
type GithubIssueItem = {
  NeweggItemNumber: string;
  SellerPartNumber: string;
  OrderNumber: string,
  CustomerName: string;
  CustomerPhoneNumber: string;
  CustomerEmailAddress: string;
  ShipToAddress1: string;
  ShipToAddress2: string;
  ShipToCityName: string;
  ShipToStateCode: string;
  ShipToZipCode: string;
  ShipToCountryCode: string;
  ShipService: string;
  ShipToFirstName: string;
  ShipToLastName: string;
  OrderQty: number;
  after_algorithm_price: string;
  store_id: number;
  tag_id: number;
  vendor_id: number;
  vendor_price: number;
  vendor_sku: string;
  Status: string;
  Description: string;
  OrderItemId: number;
}

const ActionModal = (props: {
  record: GithubIssueItem | any;
  visible: boolean;
  onCancel: (params: any) => void;
  init: () => void;
}) => {
  const { record, visible, onCancel,init } = props
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const onOk = () => {
    form.validateFields().then(values => {
      setLoading(true)
      shipOrder(values).then(res => {
        if(res.code){
          message.success('operation succcesful!')
          setTimeout(() => {
            onCancel(false)
            init()
          }, 1000)
        } else {
          throw res.msg
        }
      }).catch(e => {
        message.error(e) 
      }).finally(() => {
        setLoading(false)
      })
    })
  }
  useEffect(() => {
    if(visible){
      form.setFieldsValue(record)
    }
  }, [visible])
  return (<>
    <Modal confirmLoading={loading} title="fulfill" visible={visible} onOk={onOk} onCancel={() => {
      onCancel(false)
    }}>
    <Form form={form} {...layout} name="nest-messages">
    <Form.Item style={{display: 'none'}} name={'id'} label="id" rules={[{ required: true,message: 'Please input your id!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'ShipCarrier'} label="ShipCarrier" rules={[{ required: true,message: 'Please input your ShipCarrier!' }]}>
        <Input />
      </Form.Item>
      <Form.Item name={'TrackingNumber'} label="TrackingNumber" rules={[{ required: true,message: 'Please input your TrackingNumber!'}]}>
        <Input />
      </Form.Item>
      <Form.Item name={'ShippedQty'} label="ShippedQty" rules={[{required: true, type: 'number', min: 0, max: 19999,message: 'Please input your ShippedQty!' }]}>
        <InputNumber />
      </Form.Item>
    </Form>
      </Modal>
  </>)
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
              Newegg:
              <a target="_blank" href={`${getNewEggHref(record.NeweggItemNumber)}`}>
                {record.NeweggItemNumber}
              </a>
            </Text>
            <Text type="secondary">
              Sku :
              <Text>
                {record?.vendor_sku && (
                  <>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={`${getTargetHref(record?.vendor_id)}${record.vendor_sku}`}
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
              SellerPartNumber : <Text>{record.SellerPartNumber}</Text>
            </Text>
            <Text type="secondary">
              OrderNumber : <Text copyable>{record.OrderNumber}</Text>
            </Text>
            <Text type="secondary">
            OrderItemId : <Text copyable>{record.OrderItemId}</Text>
            </Text>
            <Text type="secondary">
              Tag Name:
                {record.tag_id && (<ParagraphText
                content={getKesValue('tagsData', record.tag_id)?.tag_name}
                width={280}
              />)}
            </Text>
            <Text type="secondary">Description : <ParagraphText
                content={record.Description}
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
    render: (
      _,
      record
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              ShipName : <Text copyable>{`${record.ShipToFirstName} ${record.ShipToLastName}`}</Text>
            </Text>
            <Text type="secondary">
              ShipToAddress1 : <Text copyable>{record.ShipToAddress1}</Text>
            </Text>
            <Text type="secondary">
              ShipToAddress2 : <Text copyable>{record.ShipToAddress2}</Text>
            </Text>
            <Text type="secondary">
              ShipToCountryCode : <Text copyable>{record.ShipToCountryCode}</Text>
            </Text>
            <Text type="secondary">
              ShipToCityName : <Text copyable>{record.ShipToCityName}</Text>
            </Text>
            <Text type="secondary">
              ShipToStateCode : <Text copyable>{record.ShipToStateCode}</Text>
            </Text>
            <Text type="secondary">
              ShipToZipCode : <Text copyable>{record.ShipToZipCode}</Text>
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
      record: {
        order_newegg: {
          OrderDate: string;
        };
        update_at: string;
      },
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Order Date :{' '}
              <Text>
                {moment(parseInt(`${record.order_newegg.OrderDate  }000`)).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </Text>
            <Text type="secondary">
              update_at :{' '}
              <Text>
                {moment(parseInt(`${record.update_at  }000`)).format('YYYY-MM-DD HH:mm:ss')}
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
    title: 'Order Number',
    dataIndex: 'OrderNumber',
    hideInTable: true
  },
  {
    title: 'Vendor price',
    dataIndex: 'vendor_price',
    width: 100,
    align: 'center',
    search: false,
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
    title: 'OrderStatus',
    dataIndex: 'Status',
    width: 150,
    render: (_, record) => {
      return record.Status;
    },
  },
  {
    title: 'Unit Price',
    dataIndex: 'UnitPrice',
    width: 150,
  },
  {
    title: 'After algorithm price',
    valueType: 'money',
    width: 200,
    dataIndex: 'after_algorithm_price',
  },
  {
    title: 'action',
    width: 200,
    fixed: 'right',
    render: (_, record) => {
      const [visible, setVisible] = useState(false)
      return (<>
      <ActionModal record={record} visible={visible} onCancel={setVisible} init={init} />
      <Button onClick={()=>{
        setVisible(true)
      }}>Fulfill</Button>
      </>)
    }
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState(-1);
  return (
    <>
      <ProTable<GithubIssueItem>
        size="small"
        columns={columns(() => {
          actionRef.current?.reload()
        })}
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
            newEggListing(tempParams).then((res) => {
              const tempData: GithubIssueItem[] = res.data.list.map(
                (item: any) => {
                  return {
                    ...item,
                    CustomerName: item.order_newegg.CustomerName,
                    CustomerPhoneNumber: item.order_newegg.CustomerPhoneNumber,
                    CustomerEmailAddress: item.order_newegg.CustomerEmailAddress,
                    ShipToAddress1: item.order_newegg.ShipToAddress1,
                    ShipToAddress2: item.order_newegg.ShipToAddress2,
                    ShipToCityName: item.order_newegg.ShipToCityName,
                    ShipToStateCode: item.order_newegg.ShipToStateCode,
                    ShipToZipCode: item.order_newegg.ShipToZipCode,
                    ShipToCountryCode: item.order_newegg.ShipToCountryCode,
                    ShipService: item.order_newegg.ShipService,
                    ShipToFirstName: item.order_newegg.ShipToFirstName,
                    ShipToLastName: item.order_newegg.ShipToLastName,
                    QuantityOrdered: item.order_newegg.OrderQty,
                    OrderNumber: item.order_newegg.OrderNumber,
                    after_algorithm_price: item.listing.after_algorithm_price,
                    store_id: item.listing.store_id,
                    tag_id: item.listing.tag_id,
                    vendor_id: item.listing.vendor_id,
                    vendor_price: item.listing.vendor_price,
                    vendor_sku: item.listing.vendor_sku,
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
        onRow={(record: { id: number }) => {
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
