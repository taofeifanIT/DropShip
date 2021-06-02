import React, { useRef, useState } from 'react';
import { LockOutlined, BellOutlined } from '@ant-design/icons';
import { Button, Typography, Space, Form, Modal, InputNumber, message, Tag } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { newEggListing } from '../../services/order/newEggOrder';
import usePopInfo from '../../hooks/usePopInfo';
import { getNewEggHref } from '../../utils/jumpUrl';
import { getKesGroup, getKesValue } from '../../utils/utils';
import { configs } from '../../services/publicKeys';
import { getPageHeight } from '../../utils/utils';
import moment from 'moment';
import styles from './style.less';
const { Text } = Typography;
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
};

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
    width: 285,
    render: (
      _,
      record: {
        NeweggItemNumber: string;
        SellerPartNumber: string;
        Description: string;
        order_newegg: any;
      },
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Newegg:{' '}
              <a target="_blank" href={`${getNewEggHref(record.NeweggItemNumber)}`}>
                {record.NeweggItemNumber}
              </a>
            </Text>
            <Text type="secondary">
              SellerPartNumber : <Text>{record.SellerPartNumber}</Text>
            </Text>
            <Text type="secondary">
              OrderNumber : <Text>{record.order_newegg.OrderNumber}</Text>
            </Text>
            <Text type="secondary">Description : {record.Description}</Text>
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
      record: {
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
      },
    ) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              CustomerName : <Text copyable>{record.CustomerName}</Text>
            </Text>
            <Text type="secondary">
              CustomerPhoneNumber : <Text copyable>{record.CustomerPhoneNumber}</Text>
            </Text>
            <Text type="secondary">
              CustomerEmailAddress : <Text copyable>{record.CustomerEmailAddress}</Text>
            </Text>
            <Text type="secondary">
              ShipToAddress1 : <Text copyable>{record.ShipToAddress1}</Text>
            </Text>
            <Text type="secondary">
              ShipToAddress2 : <Text copyable>{record.ShipToAddress2}</Text>
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
            <Text type="secondary">
              ShipToCountryCode : <Text copyable>{record.ShipToCountryCode}</Text>
            </Text>
            <Text type="secondary">
              ShipService : <Text copyable>{record.ShipService}</Text>
            </Text>
            <Text type="secondary">
              ShipToFirstName : <Text copyable>{record.ShipToFirstName}</Text>
            </Text>
            <Text type="secondary">
              ShipToLastName : <Text copyable>{record.ShipToLastName}</Text>
            </Text>
            {/* <Text type="secondary">
                            <Tag color="#2db7f5">{record.CountryCode}</Tag>
                            {record.AddressType === "Commercial" ? (<Tag color="warning">{record.AddressType}</Tag>) : (<Tag color="#87d068">{record.AddressType}</Tag>)}
                        </Text> */}
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
                {moment(parseInt(record.order_newegg.OrderDate + '000')).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Text>
            </Text>
            <Text type="secondary">
              update_at :{' '}
              <Text>
                {moment(parseInt(record.update_at + '000')).format('YYYY-MM-DD HH:mm:ss')}
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
    width: 100,
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
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [from] = Form.useForm();
  const [currentRow, setCurrentRow] = useState(-1);
  const [limit, setLimit] = useState<configs>(getKesValue('configsData', 'order_quantity_limit'));

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
            setLimit(updatedValues['order_quantity_limit']);
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
  return (
    <>
      <ProTable<GithubIssueItem>
        size="small"
        columns={columns}
        actionRef={actionRef}
        className={styles.tableStyle}
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
            newEggListing(tempParams).then((res) => {
              const tempData = res.data.list.map(
                (item: {
                  order_newegg: {
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
                  };
                }) => {
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
            onClick: (event) => {
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
          pageSizeOptions: ['10', '20', '30', '40', '50', '100', '200', '500'],
          pageSize: 50,
        }}
        options={{
          search: false,
        }}
        scroll={{
          x: columns.reduce((sum, e) => sum + Number(e.width || 0), 0),
          y: getPageHeight() - 250,
        }}
        dateFormatter="string"
        headerTitle={
          <>
            <BellOutlined /> orders{' '}
            <span style={{ marginLeft: '20px', fontSize: '16px' }}>
              Current quantity limit： {limit}
            </span>
          </>
        }
        toolBarRender={() => [
          <Button
            key="ImportOutlined"
            icon={<LockOutlined />}
            onClick={() => {
              showModal();
            }}
          >
            Change Limit
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
    </>
  );
};
