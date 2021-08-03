import React, { useRef, useState } from 'react';
import { AmazonOutlined, LockOutlined, BellOutlined } from '@ant-design/icons';
import { Button, Typography, Space, Form, Modal, InputNumber, message, Tag, Tooltip,Table } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { list, saleLimit } from '../../services/order/order';
import { getPageHeight } from '../../utils/utils';
import { getTargetHref, getAsonHref } from '../../utils/jumpUrl';
import { getKesGroup, getKesValue } from '../../utils/utils';
import { vendors, configs } from '../../services/publicKeys';
import moment from 'moment';
import styles from './style.less';
import ParagraphText from '@/components/ParagraphText'
const { Text, Paragraph } = Typography;
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
    width: 385,
    render: (
      _,
      record: {
        country_id: number;
        title: string;
        AmazonOrderId: string;
        ASIN: string;
        Title: string;
        SellerSKU: string;
        listing: any;
        OrderItemTotal: number;
        OrderItemId: number;
        IsReplacementOrder: number;
      },
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
                Tag Name:
                {record.listing && (<ParagraphText
                  content={getKesValue('tagsData', record.listing.tag_id)?.tag_name}
                  width={280}
                />)}
              </Text>
            <Text type="secondary">
              title : <ParagraphText content={record.Title} width={300} />
            </Text>
            {record.IsReplacementOrder ? <Tag  color="#f50">IsReplacementOrder</Tag> : <Tag color="#108ee9">IsReplacementOrder</Tag>}
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
      record: {
        Name: string;
        City: string;
        AddressType: string;
        PostalCode: string;
        StateOrRegion: string;
        CountryCode: string;
        AddressLine1: string;
        phone: string;
        vendor: number;
      },
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
            {
              record.vendor === 10 ? (<Text type="secondary">
              phone : <Text copyable>{record.phone}</Text>
              </Text>) : null
            }
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
      record: {
        order_amazon: {
          PurchaseDate: string;
        };
        update_at: string;
        vendor_change_time: string;
      },
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
      record: {
        Name: string;
        AddressLine1: string;
        City: string;
        StateOrRegion: string;
        PostalCode: string;
        SellerSKU: string;
        QuantityOrdered: string;
        vendor_price: string;
        AmazonOrderId: string;
        vendor: number;
      },
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
];

const strs: any = '';
export default () => {
  const actionRef = useRef<ActionType>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [from] = Form.useForm();
  const [currentRow, setCurrentRow] = useState(-1);
  const [limit, setLimit] = useState<configs>(getKesValue('configsData', 'order_quantity_limit'));
  const [scrollX, setScrollX] = useState(columns.reduce((sum, e) => sum + Number(e.width || 0), 0));
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [tableRows,setTableRows] = useState([])
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
  function downLoadExcel(data: any[], fileName: string) {
    // 定义表头
    let str = `Date,Marketplace,Order ID,SKU,Price Per Unit,QTY,Total Revenue,Amazon Fee,Purchase Price,Profit,Purchased from,Notes\n`;
    // 增加\t为了不让表格显示科学计数法或者其他格式
    for(let i = 0 ; i < data.length ; i++ ){
        for(const item in data[i]){
            str+=`${`${data[i][item]}\t`},`;     
        }
        str+='\n';
    }
    // encodeURIComponent解决中文乱码
    const uri = `data:text/xls;charset=utf-8,\ufeff${encodeURIComponent(str)}`;
    // 通过创建a标签实现
    const link = document.createElement("a");
    link.href = uri;
    // 对下载的文件命名
    link.download = `${fileName || '表格数据'}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function clickDown () {
    const tableData = tableRows.map((item: any) => {
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
        Notes: ''
      }
    })
    downLoadExcel(tableData, `Orders ${moment().format('MMDD')}`)
}

  React.useEffect(() => {
    document.addEventListener('copy', (event: any) => {
      if (event.clipboardData || event.originalEvent) {
        const clipboardData = event.clipboardData || event.originalEvent.clipboardData;
        if (strs.map) {
          const first = strs.map((strItem: string) => strItem).join('\t');
          const selection = `${first}`;
          clipboardData.setData('text/plain', selection.toString());
          message.success('Copy success!');
          event.preventDefault();
        }
      }
    });
  }, []);
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
            console.log(selectRows)
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
                  };
                  order_amazon: {
                    ShippingAddress: string;
                    OrderItemTotal: string;
                    store_id: number;
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
                      JSON.parse(item.order_amazon.ShippingAddress).AddressLine1 || '-',
                    OrderItemTotal: item.order_amazon.OrderItemTotal,
                    vendor_change_time:item.listing.vendor_change_time,
                    phone: JSON.parse(item.order_amazon.ShippingAddress).Phone || '-',
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
        scroll={{ x: scrollX, y: getPageHeight() - 250 }}
        onColumnsStateChange={(col) => {
          const allWidth = columns.reduce((sum, e) => sum + Number(e.width || 0), 0);
          let reduceNum: number = 0;
          for (const c in col) {
            reduceNum += columns[c].width || 0;
          }
          setScrollX(allWidth - reduceNum);
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
        onRow={(record: {
          id: number;
          notes: string;
          vendor_sku: string;
          ts_sku: string;
          AmazonOrderId: string;
          SellerSKU: string;
          QuantityOrdered: string;
          ItemPriceAmount: string;
        }) => {
          return {
            onClick: () => {
              setCurrentRow(record.id);
            },
            onDoubleClick: () => {
              // btnClick(record)
            },
            onContextMenu: (event) => console.log(event),
          };
        }}
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
    </>
  );
};
