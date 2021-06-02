import React, { useEffect, useRef, useState } from 'react';
import {
  ReconciliationOutlined,
  AmazonOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  EditOutlined,
  RetweetOutlined,
  EnterOutlined,
} from '@ant-design/icons';
import {
  Button,
  Typography,
  Space,
  Table,
  Modal,
  message,
  Form,
  InputNumber,
  Alert,
  Spin,
  Input,
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  listIndex,
  listDelete,
  unlisting,
  quantityOffset,
  priceOffset,
  batchChangeQuantity,
  relisting,
  update,
} from '../../services/listedProduct';
import { log_vendor_quantity_and_price_change } from '../../services/distributors/ingramMicro';
import { getPageHeight } from '../../utils/utils';
import { useModel, history } from 'umi';
import Notes, { Info } from '../../components/Notes';
import { Column } from '@ant-design/charts';
import moment from 'moment';
import { marketplaces, priceAlgorithms, stores, tags, vendors } from '../../services/publicKeys';
import { getKesGroup, getKesValue } from '../../utils/utils';
import { getTargetHref, getAsonHref, getNewEggHref } from '../../utils/jumpUrl';
const { Text, Link } = Typography;
type GithubIssueItem = {
  id: number;
  store_price_now: string;
  asin: string;
  listing_to_store_quantity: number;
  listing_status: string;
  marketplace_id: number;
  company_id: number;
  country_id: number;
  store_id: number;
  quantity_offset: number;
  price_offset: string;
  after_algorithm_price: string;
  vendor_id: number;
  vendor_sku: string;
  ts_sku: string;
  title: string;
  price_and_quantity_change_time: number;
  operate_time: number;
  task_update_at: number;
  is_delete: number;
  tag_id: number;
  price_algorithm_id: number;
  upc: string;
  add_time: number;
  vendor_quantity: number;
  vendor_price: string;
  update_at: number;
};
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
const BatchPriceModal = (props: {
  batchPriceModalVisible: boolean;
  setBatchPriceModalVisible: (visible: boolean) => void;
  listingId: Number;
  record: any;
  refresh: () => void;
}) => {
  const { batchPriceModalVisible, setBatchPriceModalVisible, listingId, refresh, record } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [from] = Form.useForm();

  const handleCancel = () => {
    setBatchPriceModalVisible(false);
    from.resetFields();
  };
  const changeOperation = (api: any, params: any) => {
    return new Promise((resolve, reject) => {
      api(params).then((res: { code: number; msg: string; data: any }) => {
        resolve(res);
      });
    });
  };
  useEffect(() => {
    if (batchPriceModalVisible) {
      from.setFieldsValue({
        quantity_offset: record['quantity_offset'],
        price_offset: record['price_offset'],
        custom_price: record['custom_price'],
      });
    } else {
      return;
    }
  }, [batchPriceModalVisible]);
  const onEmit = () => {
    // do something
    from.validateFields().then(async (updatedValues: any) => {
      setConfirmLoading(true);
      let resultMsg = [];
      const priceoffsetMsg: any = await changeOperation(priceOffset, {
        price_offset: updatedValues['price_offset'],
        listing_id: listingId,
      });
      resultMsg.push(<p>price offset modified {priceoffsetMsg.msg}</p>);
      const quantityoffsetMsg: any = await changeOperation(quantityOffset, {
        quantity_offset: updatedValues['quantity_offset'],
        listing_id: listingId,
      });
      resultMsg.push(<p>quantity offset modified {quantityoffsetMsg.msg}</p>);
      const customPriceMsg: any = await changeOperation(update, {
        custom_price: updatedValues['custom_price'],
        id: listingId,
      });
      resultMsg.push(<p>quantity offset modified {customPriceMsg.msg}</p>);
      refresh();
      message.info(resultMsg);
      from.resetFields();
      setConfirmLoading(false);
      setBatchPriceModalVisible(false);
    });
  };
  return (
    <Modal
      title="edit"
      visible={batchPriceModalVisible}
      onOk={onEmit}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form form={from} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
        <Form.Item label="quantity offset">
          <Form.Item
            name="quantity_offset"
            noStyle
            rules={[{ required: true, message: 'Please input your quantity offset!' }]}
          >
            <InputNumber style={{ width: '200px' }}></InputNumber>
          </Form.Item>
        </Form.Item>
        <Form.Item label="price offset">
          <Form.Item
            name="price_offset"
            noStyle
            rules={[{ required: true, message: 'Please input your price offset!' }]}
          >
            <InputNumber style={{ width: '200px' }}></InputNumber>
          </Form.Item>
        </Form.Item>
        <Form.Item label="custom price">
          <Form.Item
            name="custom_price"
            noStyle
            rules={[{ required: true, message: 'Please input your price offset!' }]}
          >
            <InputNumber style={{ width: '200px' }}></InputNumber>
          </Form.Item>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const ViewHistoryData = (props: { vendor_id: string; vendor_sku: string; style: any }) => {
  const { vendor_id, vendor_sku, style } = props;
  const [historyVisible, setHistoryVisible] = useState(false);
  const [historyConfirmLoading, setHistoryConfirmLoading] = useState(false);
  const [historyDataLoading, setHistoryDataLoading] = useState(false);
  const [historyData, setHistoryData] = useState({
    log_vendor_price_change: [],
    log_vendor_quantity_change: [],
  });
  const handleOpenView = () => {
    setHistoryVisible(true);
    getHistoryData();
  };
  const handleOpenViewCancel = () => {
    setHistoryVisible(false);
  };
  const DemoColumn = (props: {
    data: { log_vendor_price_change: []; log_vendor_quantity_change: [] };
  }) => {
    var config = {
      data: props.data.log_vendor_price_change,
      isGroup: true,
      xField: 'time',
      yField: 'price',
      seriesField: 'name',
      style: { height: '250px' },
      titile: 'price history',
      label: {
        position: 'middle',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
      },
    };
    var quantityConfig = {
      data: props.data.log_vendor_quantity_change,
      isGroup: true,
      style: { height: '250px' },
      xField: 'time',
      yField: 'price',
      seriesField: 'name',
      titile: 'quantiy history',
      label: {
        position: 'middle',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
      },
    };
    return (
      <>
        <h3>Price history data</h3>
        <Column {...config} />
        <h3>quantity history data</h3>
        <Column {...quantityConfig} />
      </>
    );
  };
  const getHistoryData = () => {
    const params: any = {
      id: vendor_id,
      vendor_sku: vendor_sku,
    };
    setHistoryDataLoading(true);
    log_vendor_quantity_and_price_change(params)
      .then((res) => {
        if (res.code) {
          let priceHistoryData: any = [];
          let quantityHistoryData: any = [];
          res.data.log_vendor_price_change.forEach(
            (item: { add_datetime: string; after: string; before: string }) => {
              priceHistoryData.push({
                name: 'after',
                time: item.add_datetime,
                price: parseFloat(item.after),
              });
              priceHistoryData.push({
                name: 'before',
                time: item.add_datetime,
                price: parseFloat(item.before),
              });
            },
          );
          res.data.log_vendor_quantity_change.forEach(
            (item: { add_datetime: string; after: string; before: string }) => {
              quantityHistoryData.push({
                name: 'after',
                time: item.add_datetime,
                price: parseFloat(item.after),
              });
              quantityHistoryData.push({
                name: 'before',
                time: item.add_datetime,
                price: parseFloat(item.before),
              });
            },
          );
          setHistoryData({
            log_vendor_price_change: priceHistoryData,
            log_vendor_quantity_change: quantityHistoryData,
          });
        } else {
          throw res.msg;
        }
      })
      .catch((e: string) => {
        message.error(e);
      })
      .finally(() => {
        setHistoryConfirmLoading(false);
        setHistoryDataLoading(false);
      });
  };
  return (
    <>
      <Button
        icon={<BarChartOutlined />}
        style={{ ...style }}
        onClick={() => {
          handleOpenView();
        }}
      >
        history data
      </Button>
      <Modal
        title="price and quantity history data"
        width={800}
        bodyStyle={{ height: '600px' }}
        confirmLoading={historyConfirmLoading}
        visible={historyVisible}
        onOk={handleOpenViewCancel}
        onCancel={handleOpenViewCancel}
      >
        <Spin spinning={historyDataLoading}>
          <DemoColumn data={historyData} />
        </Spin>
      </Modal>
    </>
  );
};
const EditLinKStr = (props: {
  record: {
    id: number;
    country_id: number;
    asin: string;
  };
}) => {
  const { country_id, asin, id } = props.record;
  const [editStatus, setEditStates] = useState(false);
  const [editAsin, setEditAsin] = useState(asin);
  const inputEl = useRef(null);
  const updateApi = (title: string) => {
    if (title.trim() === asin) {
      setEditStates(false);
      return;
    }
    update({
      id: id,
      asin: title,
    }).then((res) => {
      if (res.code) {
        message.success('operation successful!');
      } else {
        message.error(res.msg);
        setEditAsin(asin);
      }
    });
  };
  useEffect(() => {
    if (editStatus) {
      inputEl?.current?.focus();
    } else {
      return;
    }
  }, [editStatus]);
  return (
    <>
      {editStatus ? (
        <>
          <Input
            ref={inputEl}
            size={'small'}
            style={{ width: '120px' }}
            suffix={<EnterOutlined />}
            value={editAsin}
            onPressEnter={(e: any) => {
              setEditAsin(e.target.value);
              setEditStates(false);
              updateApi(e.target.value);
            }}
            onChange={(e) => {
              setEditAsin(e.target.value);
            }}
            onBlur={() => {
              setEditStates(false);
              updateApi(editAsin);
            }}
          ></Input>
        </>
      ) : (
        <>
          <Link href={`${getAsonHref(country_id)}${asin}`} target="_blank">
            {editAsin}
          </Link>
          <EditOutlined
            style={{ color: '#1890ff', cursor: 'pointer', marginLeft: '6px' }}
            onClick={() => {
              setEditStates(true);
            }}
          />
        </>
      )}
    </>
  );
};
const columns = (
  refresh: () => void,
  editFn: (visible: boolean, id: number, record: any) => void,
): ProColumns<GithubIssueItem>[] => [
  {
    title: 'Tag name',
    dataIndex: 'tag_id',
    valueType: 'select',
    hideInTable: true,
    request: async () => {
      return [
        ...getKesGroup('tagsData').map((item: tags) => {
          return {
            label: item.tag_name,
            value: item.id,
          };
        }),
      ];
    },
  },
  {
    title: 'vendor_sku',
    dataIndex: 'vendor_sku',
    hideInTable: true,
  },
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'product',
    dataIndex: 'id',
    search: false,
    width: 300,
    render: (_, record: any) => {
      var tagTitle = getKesValue('tagsData', record.tag_id).tag_name;
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              ID:{' '}
              <a target="_blank" href={`${getTargetHref(record.vendor_id)}${record.ts_sku}`}>
                {record.ts_sku}
              </a>
              {record.notes && <Info content={record.notes} />}
            </Text>
            {record.asin && (
              <Text type="secondary">
                <AmazonOutlined />
                Asin: <EditLinKStr record={record} />
              </Text>
            )}
            {record.newegg_id && (
              <Text type="secondary">
                newegg:{' '}
                <Text>
                  <a target="_Blank" href={getNewEggHref(record.newegg_id)}>
                    {record.newegg_id}
                  </a>
                </Text>
              </Text>
            )}
            <Text type="secondary">
              Tag Name:{' '}
              <Text style={{ width: '210px' }} title={tagTitle} ellipsis>
                {tagTitle}
              </Text>
            </Text>
            <Text type="secondary">
              Description: <ParagraphText content={record.title} width={780} />
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Price',
    dataIndex: 'Price',
    search: false,
    width: 170,
    render: (_, record: any) => {
      const getText = (pop: string) => {
        // 垃圾后台的数据不规范而写的无语判断
        if (record.buybox_info === '[]' || record.buybox_info === null) {
          return <span style={{ color: '#c0c01e' }}>not yet</span>;
        }
        return JSON.parse(record.buybox_info)[pop].Amount + '$';
      };
      const getMarketPlace = () => {
        // marketplace大于50时，marketplace超过(marketplace/buyBox)30%时，文本变红处理
        let color = '';
        const marketplace = parseFloat(record.store_price_now);
        if (record.buybox_info !== '[]' && record.buybox_info !== null) {
          const bugBox = parseFloat(JSON.parse(record.buybox_info)['ListingPrice'].Amount);
          if (marketplace > 50) {
            let adtrus = marketplace - bugBox;
            let adtrusRate = (adtrus / marketplace) * 100;
            if (adtrusRate > 30) {
              color = 'red';
            }
          }
        }
        return <span style={{ color: color }}>{marketplace}</span>;
      };
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Marketplace: <Text>{getMarketPlace()}$</Text>
            </Text>
            <Text type="secondary">
              After algorithm: <Text>{record.after_algorithm_price}$</Text>
            </Text>
            <Text type="secondary">
              Price offset: <Text>{record.price_offset}$</Text>
            </Text>
            <Text type="secondary">
              Lowest Listed: <Text>{getText('LandedPrice')}</Text>
            </Text>
            <Text type="secondary">
              Buy Box: <Text>{getText('ListingPrice')}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'quantity',
    dataIndex: 'quantity',
    search: false,
    width: 180,
    render: (_, record: any) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Marketplace Inventory: <Text>{record.listing_to_store_quantity}</Text>
            </Text>
            <Text type="secondary">
              Quantity Offset: <Text>{record.quantity_offset}</Text>
            </Text>
            <Text type="secondary">
              vendor quantity: <Text>{record.vendor_quantity}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Multi',
    dataIndex: 'Multi',
    search: false,
    width: 200,
    render: (_, record: any) => {
      const getCountryImg = (countryName: string) => {
        switch (countryName) {
          case 'UK':
            return (
              <img
                width="20"
                src={
                  'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1640819749,3704395080&fm=58&app=83&f=JPG?w=200&h=132&s=7097A97266B303A3091E6AEC0300A006'
                }
              />
            );
          case 'US':
            return (
              <img
                width="20"
                src={
                  'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=806796136,1072976903&fm=58&app=83&f=JPEG?w=200&h=132&s=7063B1546F9C31EBB6AD4FDD03001006'
                }
              />
            );
        }
      };
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Marketplace:{' '}
              <Text>{getKesValue('marketPlaceData', record.marketplace_id)?.marketplace}</Text>
            </Text>
            <Text type="secondary">
              Store: <Text>{getKesValue('storeData', record.store_id)?.name}</Text>
            </Text>
            <Text type="secondary">
              Country:{' '}
              <Text>{getCountryImg(getKesValue('countryData', record.country_id)?.country)}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'time',
    dataIndex: 'time',
    search: false,
    width: 360,
    render: (_, record: any) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              task_update_at:{' '}
              <Text>
                {(record.task_update_at &&
                  moment(parseInt(record.task_update_at + '000')).format('YYYY-MM-DD HH:mm:ss')) ||
                  'not yet'}
              </Text>
            </Text>
            <Text type="secondary">
              update_at:{' '}
              <Text>
                <a
                  onClick={() => {
                    history.push(`/log/OperationLog?batch_id=${record.batch_id}`);
                  }}
                >
                  {(record.update_at &&
                    moment(parseInt(record.update_at + '000')).format('YYYY-MM-DD HH:mm:ss')) ||
                    'not yet'}
                </a>
              </Text>
            </Text>
            <Text type="secondary">
              price_and_quantity_change_time:{' '}
              <Text>
                {(record.price_and_quantity_change_time &&
                  moment(parseInt(record.price_and_quantity_change_time + '000')).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )) ||
                  'not yet'}
              </Text>
            </Text>
            <Text type="secondary">
              add_time:{' '}
              <Text>
                {(record.add_time &&
                  moment(parseInt(record.add_time + '000')).format('YYYY-MM-DD HH:mm:ss')) ||
                  'not yet'}
              </Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'vendor',
    dataIndex: 'vendor',
    search: false,
    width: 150,
    render: (_, record: any) => {
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              vendor: <Text>{getKesValue('vendorData', record.vendor_id)?.vendor_name}</Text>
            </Text>
            <Text type="secondary">
              vendor_sku: <Text>{record.vendor_sku}</Text>
            </Text>
            <Text type="secondary">
              vendor_quantity: <Text>{record.vendor_quantity}</Text>
            </Text>
            <Text type="secondary">
              vendor_price: <Text>{record.vendor_price}</Text>
            </Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Asin',
    dataIndex: 'asin',
    copyable: true,
    hideInTable: true,
  },
  {
    title: 'Marketplace',
    dataIndex: 'store_price_now',
    search: false,
    hideInTable: true,
    align: 'center',
    render: (store_price_now: string) => {
      return (
        <>
          <Space direction="vertical">
            <Text>{`${store_price_now}$`}</Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Adjusted',
    dataIndex: 'after_algorithm_price',
    search: false,
    hideInTable: true,
    align: 'center',
    render: (after_algorithm_price: string) => {
      return (
        <>
          <Space direction="vertical">
            <Text>{`${after_algorithm_price}$`}</Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Marketplace Inventory',
    dataIndex: 'listing_to_store_quantity',
    search: false,
    hideInTable: true,
    align: 'center',
    render: (listing_to_store_quantity: number) => {
      return (
        <>
          <Space direction="vertical">
            <Text>{listing_to_store_quantity}</Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Inventory Offset',
    dataIndex: 'quantity_offset',
    search: false,
    hideInTable: true,
    align: 'center',
    render: (quantity_offset: number) => {
      return (
        <>
          <Space direction="vertical">
            <Text>{quantity_offset}</Text>
          </Space>
        </>
      );
    },
  },
  {
    title: 'Listing status',
    dataIndex: 'listing_status',
    valueType: 'select',
    width: 150,
    valueEnum: {
      '1': { text: 'PendingListing', status: 'Processing' },
      '2': { text: 'Listed', status: 'Success' },
      '3': { text: 'UnListed', status: 'Error' },
    },
    render: (_, record: { marketplace_and_db_diff: number; listing_status: string }) => {
      if (record.marketplace_and_db_diff === 2) {
        return <span style={{ color: 'red' }}>{record.listing_status}</span>;
      } else {
        return record.listing_status;
      }
    },
  },
  {
    title: 'marketplace_and_db_diff',
    dataIndex: 'marketplace_and_db_diff',
    valueType: 'select',
    hideInTable: true,
    width: 250,
    valueEnum: {
      '2': { text: 'InDbnotInMarketPlace', status: 'Error' },
      '3': { text: 'InDbAndInMarketplace', status: 'Error' },
    },
  },
  {
    title: 'Deleted state',
    dataIndex: 'is_delete',
    valueType: 'select',
    width: 150,
    initialValue: ['0'],
    valueEnum: {
      0: { text: 'Not deleted', status: 'Success' },
      1: { text: 'deleted', status: 'Error' },
    },
  },
  // scroll={{
  {
    title: 'Price algorithm',
    dataIndex: 'price_algorithm_id',
    valueType: 'select',
    width: 150,
    request: async () => {
      return [
        ...getKesGroup('priceAlgorithmsData').map((item: priceAlgorithms) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      ];
    },
  },
  {
    title: 'Store',
    dataIndex: 'store_id',
    valueType: 'select',
    hideInTable: true,
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
    title: 'marketPlace',
    dataIndex: 'marketplace_id',
    valueType: 'select',
    hideInTable: true,
    request: async () => {
      return [
        ...getKesGroup('marketPlaceData').map((item: marketplaces) => {
          return {
            label: item.marketplace,
            value: item.id,
          };
        }),
      ];
    },
  },
  {
    title: 'vendor',
    dataIndex: 'vendor_id',
    valueType: 'select',
    hideInTable: true,
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
    title: 'Custom price',
    dataIndex: 'custom_price',
    valueType: 'select',
    hideInTable: true,
    request: async () => {
      return [
        {
          label: 'Set',
          value: 0,
        },
        {
          label: 'not set',
          value: 1,
        },
      ];
    },
  },
  {
    title: 'title',
    dataIndex: 'title',
    hideInTable: true,
  },
  {
    title: 'newegg_id',
    dataIndex: 'newegg_id',
    hideInTable: true,
  },
  {
    title: 'upc',
    dataIndex: 'upc',
    width: 200,
  },
  {
    title: 'action',
    valueType: 'option',
    fixed: 'right',
    align: 'center',
    width: 100,
    render: (
      text,
      record: {
        id: number;
        listing_status: string;
        vendor_id: string;
        vendor_sku: string;
      },
      _,
      action,
    ) => {
      const [loadingBtn, setLoadingBtn] = useState(false);
      const relistFn = () => {
        setLoadingBtn(true);
        relisting(record.id)
          .then((res) => {
            if (res.code) {
              message.success('operation successful!');
              refresh();
            } else {
              throw res.msg;
            }
          })
          .catch((e: string) => {
            message.error(e);
          })
          .finally(() => {
            setLoadingBtn(false);
          });
      };
      return (
        <>
          <Button
            style={{ width: '115px' }}
            size="small"
            type="primary"
            onClick={() => {
              editFn(true, record.id, record);
            }}
          >
            <EditOutlined />
            Edit
          </Button>
          <Button
            loading={loadingBtn}
            type="ghost"
            style={{ width: '115px', marginTop: '8px' }}
            disabled={record.listing_status === 'Listed'}
            size="small"
            onClick={() => {
              relistFn();
            }}
          >
            <RetweetOutlined />
            Relisting
          </Button>
          <ViewHistoryData
            style={{ width: '115px', marginTop: '8px' }}
            vendor_id={record.vendor_id}
            vendor_sku={record.vendor_sku}
          />
        </>
      );
    },
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [record, setRecord] = useState();
  const [from] = Form.useForm();
  const [listId, setListId] = useState<number | number[]>(-1);
  const [currentItem, setCurrentItem] = useState(null);
  const { initialState } = useModel('@@initialState');
  // 生成 intl 对象
  // const enUSIntl = createIntl('en_US', enUS);
  const refresh = (): void => {
    actionRef.current?.reload();
  };
  const editFn = (comlounVisible: boolean, listId: number, record: any) => {
    setVisible(comlounVisible);
    setListId(listId);
    setCurrentItem(record);
  };
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    from
      .validateFields()
      .then(async (updatedValues: { quantity: number; quantity_offset: number }) => {
        if (!updatedValues.quantity && !updatedValues.quantity_offset) {
          message.warning('Please enter at least one of them!');
          return;
        }
        setConfirmLoading(true);
        batchChangeQuantity({
          listing_ids: selectedRowKeys,
          ...updatedValues,
        })
          .then((res: any) => {
            if (res.code) {
              message.success('operation successful!');
            } else {
              throw res.msg;
            }
          })
          .catch((e) => {
            message.error(e);
          })
          .finally(() => {
            setSelectedRowKeys([]);
            setConfirmLoading(false);
            setIsModalVisible(false);
            refresh();
          });
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  function deleteListItem() {
    Modal.confirm({
      title: 'Do you want to delete these products?',
      icon: <ExclamationCircleOutlined />,
      content: `You have selected ${selectedRowKeys.length} pieces of data`,
      onOk() {
        return new Promise((resolve, reject) => {
          listDelete({
            listing_ids: selectedRowKeys,
          })
            .then((res) => {
              if (res.code) {
                setSelectedRowKeys([]);
                message.success('Operation successful!');
                actionRef.current?.reload();
              } else {
                throw res.msg;
              }
            })
            .catch((e) => {
              console.error(e);
              message.error(e);
            })
            .finally(() => {
              resolve();
            });
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }
  function unlistingListItem() {
    Modal.confirm({
      title: 'Do you want to unlist these products?',
      icon: <ExclamationCircleOutlined />,
      content: `You have selected ${selectedRowKeys.length} pieces of data`,
      onOk() {
        return new Promise((resolve, reject) => {
          unlisting({
            listing_ids: selectedRowKeys,
          })
            .then((res) => {
              if (res.code) {
                setSelectedRowKeys([]);
                message.success('Operation successful!');
                actionRef.current?.reload();
              } else {
                throw res.msg;
              }
            })
            .catch((e) => {
              console.error(e);
              message.error(e);
            })
            .finally(() => {
              resolve();
            });
        });
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }
  return (
    <>
      <Alert
        showIcon
        style={{ marginBottom: '10px' }}
        message={`Next Amazon Listing update time:${moment(
          parseInt(initialState?.listTimes?.getAmazonListingDeliverTime + '000'),
        ).format('YYYY-MM-DD HH:mm:ss')}/
                             Next Amazon Feed/update price/quantity update time:${moment(
                               parseInt(
                                 initialState?.listTimes?.getAmazonNormalDeliverTime + '000',
                               ),
                             ).format('YYYY-MM-DD HH:mm:ss')}`}
      />
      <Notes
        visible={drawerVisible}
        setVisible={setDrawerVisible}
        {...record}
        refresh={refresh}
        updateApi={update}
      />
      <ProTable<GithubIssueItem>
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          selectedRowKeys,
          onChange: (selectedRowKeys: Number[]) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        size="small"
        columns={columns(refresh, editFn)}
        actionRef={actionRef}
        request={async (params = {}) =>
          new Promise((resolve) => {
            if (params.is_delete === '10000') {
              params.is_delete = undefined;
            }
            let tempParams = {
              ...params,
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
        pagination={{
          pageSize: 30,
        }}
        options={{
          search: false,
        }}
        scroll={{
          x: columns(refresh, editFn).reduce((sum, e) => sum + Number(e.width || 0), 0),
          y: getPageHeight() - 290,
        }}
        dateFormatter="string"
        headerTitle="Listed product"
        onRow={(record: { id: number; notes: string; vendor_sku: string }) => {
          return {
            onDoubleClick: (event) => {
              setDrawerVisible(true);
              setRecord({
                id: record.id,
                content: record.notes,
                title: record.vendor_sku,
              });
            }, // 鼠标移入行
            onClick: (event) => {
              if (drawerVisible) {
                setRecord({
                  id: record.id,
                  content: record.notes,
                  title: record.vendor_sku,
                });
              }
            }, // 鼠标移入
          };
        }}
        toolBarRender={() => [
          <Button
            key="ImportOutlined"
            icon={<DeleteOutlined />}
            type="primary"
            disabled={!selectedRowKeys.length}
            onClick={() => {
              deleteListItem();
            }}
            danger
          >
            Delete
          </Button>,
          <Button
            key="uploadAndDown"
            disabled={!selectedRowKeys.length}
            onClick={() => {
              unlistingListItem();
            }}
            icon={<ReconciliationOutlined />}
          >
            Batch unlist
          </Button>,
          <Button
            key="uploadAndDown"
            disabled={!selectedRowKeys.length}
            onClick={() => {
              showModal();
            }}
          >
            Batch change quantity
          </Button>,
        ]}
      />
      <Modal
        title="batch update"
        visible={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={from} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item label="quantity">
            <Form.Item name="quantity" noStyle>
              <InputNumber style={{ width: '200px' }}></InputNumber>
            </Form.Item>
          </Form.Item>
          <Form.Item label="quantity offset">
            <Form.Item name="quantity_offset" noStyle>
              <InputNumber style={{ width: '200px' }}></InputNumber>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
      <BatchPriceModal
        batchPriceModalVisible={visible}
        setBatchPriceModalVisible={setVisible}
        record={currentItem}
        listingId={listId}
        refresh={refresh}
      />
    </>
  );
};
