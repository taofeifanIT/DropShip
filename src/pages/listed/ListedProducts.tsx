import React, { useEffect, useRef, useState,useImperativeHandle } from 'react';
import {
  ReconciliationOutlined,
  AmazonOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
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
  Input,
  Select,
  Cascader,
  DatePicker,
  Tooltip,
  Switch
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
  update,
  batchRelisting,
  realUnlisting
} from '@/services/listedProduct';
import { getPageHeight } from '@/utils/utils';
import { useModel, history } from 'umi';
import Notes, { Info } from '@/components/Notes';
import moment from 'moment';
import type { marketplaces, priceAlgorithms, stores, tags, vendors, listing_sort_field } from '@/services/publicKeys';
import { getKesGroup, getKesValue } from '@/utils/utils';
import { getTargetHref, getAsonHref, getNewEggHref } from '@/utils/jumpUrl';
import ParagraphText from '@/components/ParagraphText';
import HistoryChat from '@/components/HistoryChat';
import { createDownload } from '@/utils/utils';
import type { FormInstance } from 'antd';
import Brand from './compoents/Brand'

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
  vendor_id: string;
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
  sales: number;
  marketplace_and_db_diff: number; 
  batch_id: number;
  waiting_update_time: number;
  unlisting_time: number;
  notes: string;
  buybox_info: {
    ListingPrice: {
      Amount: number | string
    } 
  } | string | any
};


const BatchPriceModal = (props: {
  batchPriceModalVisible: boolean;
  setBatchPriceModalVisible: (visible: boolean) => void;
  listingId: number;
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
    return new Promise((resolve) => {
      api(params).then((res: { code: number; msg: string; data: any }) => {
        resolve(res);
      });
    });
  };
  useEffect(() => {
    if (batchPriceModalVisible) {
      from.setFieldsValue({
        quantity_offset: record.quantity_offset,
        price_offset: record.price_offset,
        custom_price: record.custom_price,
      });
    }
  }, [batchPriceModalVisible]);
  const onEmit = () => {
    // do something
    from.validateFields().then(async (updatedValues: any) => {
      setConfirmLoading(true);
      const resultMsg = [];
      const priceoffsetMsg: any = await changeOperation(priceOffset, {
        price_offset: updatedValues.price_offset,
        listing_id: listingId,
      });
      resultMsg.push(<p>price offset modified {priceoffsetMsg.msg}</p>);
      const quantityoffsetMsg: any = await changeOperation(quantityOffset, {
        quantity_offset: updatedValues.quantity_offset,
        listing_id: listingId,
      });
      resultMsg.push(<p>quantity offset modified {quantityoffsetMsg.msg}</p>);
      const customPriceMsg: any = await changeOperation(update, {
        custom_price: updatedValues.custom_price,
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
      id,
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
  editFn: (visible: boolean, id: number, record: any) => void,
  callback?:(record:any) => void
): ProColumns<GithubIssueItem>[] => [
  {
    title: 'Tag name',
    dataIndex: 'tag_id',
    valueType: 'select',
    hideInTable: true,
    renderFormItem: (_, { type, defaultRender, formItemProps, fieldProps}, form) => {
      if (type === 'form') {
        return null;
      }
      const status = form.getFieldValue('state');
      if (status !== 'open') {
        return (
          // value 和 onchange 会通过 form 自动注入。
          <Select
          {...fieldProps}
            showSearch
            style={{ width: '100%' }}
            placeholder="Select a tag"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {getKesGroup('tagsData').map((item: tags) => {
          return <Select.Option key={`op${item.id}`} value={item.id}>{item.tag_name}</Select.Option>;
        })}
          </Select>
        );
      }
      return defaultRender(_);
    }
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
    sorter: true,
    render: (_, record: any) => {
      const tagTitle = getKesValue('tagsData', record.tag_id)?.tag_name;
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              ID:
              <a target="_blank" href={`${getTargetHref(record.vendor_id,record.ts_sku)}`}>
                {record.ts_sku}
              </a>
              {record.notes && <Info content={record.notes} />}
              <EditOutlined onClick={() => {
                callback && callback(record)
              }} />
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
    render: (_, record) => {
      const getText = (pop: string) => {
        // 垃圾后台的数据不规范而写的无语判断
        if (record.buybox_info === '[]' || record.buybox_info === null) {
          return <span>not yet</span>;
        }
        return `${JSON.parse(record.buybox_info)[pop].Amount  }$`;
      };
      const getMarketPlace = () => {
        // marketplace大于50时，marketplace超过(marketplace/buyBox)30%时，文本变红处理
        const marketplace = parseFloat(record.store_price_now);
        if (record.buybox_info !== '[]' && record.buybox_info !== null) {
          const bugBox = parseFloat(JSON.parse(record.buybox_info).ListingPrice.Amount);
          if (marketplace > 50) {
            const adtrus = marketplace - bugBox;
            const adtrusRate = (adtrus / marketplace) * 100;
            if (adtrusRate > 30) {
              return (<Tooltip placement="top" title={'The market price is over $50 and over 30% (market price /buyBox)'}>
                          <span style={{ color: 'red' }}>{marketplace}</span>
                      </Tooltip>)
            }
          }
        }
        return <span>{marketplace}</span>;
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
          default:
            return null
        }
      };
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              Marketplace:
              <Text>{getKesValue('marketPlaceData', record.marketplace_id)?.marketplace}</Text>
            </Text>
            <Text type="secondary">
              Store: <Text>{getKesValue('storeData', record.store_id)?.name}</Text>
            </Text>
            <Text type="secondary">
              Country:
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
    render: (_, record) => {
      const isBeyondTime = () => {
        if(record.waiting_update_time){
          var hours = Math.abs(moment(record.waiting_update_time * 1000).diff(moment(), 'hours'))
          if(hours >=24){
            return(<Tooltip placement="top" title={"It's been over 24 hours"}>
                      <span style={{ color: 'red' }}>{moment(record.waiting_update_time * 1000).format('YYYY-MM-DD HH:mm:ss')}</span>
                   </Tooltip>)
          }
          return <span>{record.listing_status}</span>
        }
        return <span>not yet</span>
      }
      return (
        <>
          <Space direction="vertical">
            <Text type="secondary">
              task_update_at:
              <Text>
                {(record.task_update_at &&
                  moment(parseInt(`${record.task_update_at  }000`)).format('YYYY-MM-DD HH:mm:ss')) ||
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
                    moment(parseInt(`${record.update_at  }000`)).format('YYYY-MM-DD HH:mm:ss')) ||
                    'not yet'}
                </a>
              </Text>
            </Text>
            <Text type="secondary">
              price_and_quantity_change_time:
              <Text>
                {(record.price_and_quantity_change_time &&
                  moment(parseInt(`${record.price_and_quantity_change_time  }000`)).format(
                    'YYYY-MM-DD HH:mm:ss',
                  )) ||
                  'not yet'}
              </Text>
            </Text>
            <Text type="secondary">
              add_time:
              <Text>
                {(record.add_time &&
                  moment(parseInt(`${record.add_time  }000`)).format('YYYY-MM-DD HH:mm:ss')) ||
                  'not yet'}
              </Text>
            </Text>
            <Text type="secondary">
            waiting_update_time:
              <Text>{isBeyondTime()}</Text>
            </Text>
            <Text type="secondary">
            unlisting_time:
              <Text>
                {(record.unlisting_time &&
                  moment(parseInt(`${record.unlisting_time  }000`)).format('YYYY-MM-DD HH:mm:ss')) ||
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
    render: (_, record) => {
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
    title: 'is_sale',
    dataIndex: 'is_sale',
    valueType: 'select',
    hideInTable: true,
    request: async () => {
      return [
        {
          label: "Have sold",
          value: 1,
        },
        {
          label: 'Unsold',
          value: 0,
        },
      ];
    },
  },
  {
    title: 'Sort',
    dataIndex: 'sort_field',
    valueType: 'select',
    hideInTable: true,
    renderFormItem: (_, { type, defaultRender}, form) => {
      const basicData = getKesGroup('listing_sort_field')
      const options = [...Object.keys(basicData).map((item: listing_sort_field)=>{
        return {
          value: item,
          label: basicData[item],
          children:[
            {
              value: `${item} desc`,
              label: `desc`,
            },
            {
              value: `${item} asc`,
              label: `asc`,
            },
          ]
        }
      })];
      if (type === 'form') {
        return null;
      }
      const status = form.getFieldValue('state');
      if (status !== 'open') {
        return (
          // value 和 onchange 会通过 form 自动注入。
          <Cascader options={options} placeholder="Please select" />
        );
      }
      return defaultRender(_);
    }
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
    render: (_, record) => {
      if (record.marketplace_and_db_diff === 2) {
        return (<Tooltip placement="top" title={'In Db not in marketplace'}>
            <span style={{ color: 'red' }}>{record.listing_status}</span>
        </Tooltip>)
      } 
        return record.listing_status;
      
    },
  },
  {
    title: 'marketplace_and_db_diff',
    dataIndex: 'marketplace_and_db_diff',
    valueType: 'select',
    hideInTable: true,
    valueEnum: {
      '2': { text: 'InDbnotInMarketPlace'},
      '3': { text: 'InDbAndInMarketplace'},
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
    title: 'sales',
    dataIndex: 'sales',
    width: 150,
    sorter: true
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
    title: 'available status',
    dataIndex: 'quantity_offset',
    request: async () => {
      return [
        {
          label: 'unavailable',
          value: -1,
        },
        {
          label: 'available',
          value: undefined,
        },
      ];
    },
    hideInTable: true,
  },
  {
    title: 'upc',
    dataIndex: 'upc',
    width: 200,
  },
  {
    title: 'got_buybox',
    dataIndex: 'got_buybox',
    width: 200,
    request: async () => {
      return [
        {
          label: 'Buy box is equal to price',
          value: 1,
        },
        {
          label: 'no equal',
          value: undefined,
        },
      ];
    },
    hideInTable: true,
  },
  {
    title: 'no_update',
    dataIndex: 'no_update',
    hideInTable: true,
    valueType: 'digit'
  },
  {
    title: 'action',
    valueType: 'option',
    fixed: 'right',
    align: 'center',
    width: 100,
    render: (_,record) => {
      const [unavailableLoading, setUnavailableLoading] = useState(false)
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
            style={{ width: '115px', marginTop: '8px' }}
            size="small"
            type="primary"
            loading={unavailableLoading}
            ghost
            disabled={record.quantity_offset === -1 || record.listing_status !== "Listed"}
            onClick={() => {
              setUnavailableLoading(true)
              batchChangeQuantity({
                listing_ids: [record.id],
                quantity_offset: -1
              }).then(res => {
                if (res && res.code){
                  message.success("operation successful!")
                  record.quantity_offset = -1
                } else {
                  throw res.msg
                }
              }).catch((e: string) => {
                message.error(e)
              }).finally(() => {
                setUnavailableLoading(false)
              })
            }}
          >
            unavailable
          </Button>
          <HistoryChat
            style={{ width: '115px', marginTop: '8px' }}
            vendor_id={record.vendor_id}
            vendor_sku={record.vendor_sku}
          />
        </>
      );
    },
  },
];
type listingArugment = {
  initData: () => void;
  ids: number[];
  setIds: (ids: number[]) => void;
}
const RelistingFrame =React.forwardRef((props: listingArugment,ref)=>{
  const { initData, ids,setIds } = props
  const [from] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false)
  const [apiType, setApiType] = useState("")
  const [title, setTitle] = useState("")
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    showModal: (type: string) => {
    setIsModalVisible(true)
    setApiType(type)
    const tempTitle = type === "unlist" ? "batch unlist" : "batch relisting"
    setTitle(tempTitle)
    }
}));
const handleOk = () => {
  from.validateFields().then(async (updatedValues: {tag_id?: number,unlisting_time_after?: any,unlisting_time_before?: any,unlisting_type?: boolean}) => {
    let batchApi = batchRelisting
    const params = {listing_ids: ids, ...updatedValues}
    if(apiType === "unlist"){
      batchApi = unlisting
    } else {
      params.unlisting_time_after = params.unlisting_time_after ? moment(params.unlisting_time_after).format('YYYY-MM-DD HH:mm:ss') : undefined
      params.unlisting_time_before = params.unlisting_time_before ? moment(params.unlisting_time_before).format('YYYY-MM-DD HH:mm:ss') : undefined
    }
    if (updatedValues.unlisting_type){
      batchApi = realUnlisting
    }
    setLoading(true)
    batchApi(params).then((res) => {
        if (res.code) {
          console.log(res)
          message.success('Operation successful!');
          setIds([])
          initData()
        } else {
          throw res.msg;
        }
      }).catch((e) => {
        message.error(e);
      }).finally(() => {
        setLoading(false)
        setIsModalVisible(false)
      });
  })
};

const handleCancel = () => {
  setIsModalVisible(false);
};
return <Modal title={title}  confirmLoading={loading} ref={inputRef} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
    <Form form={from} labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} layout="horizontal">
            <Form.Item label="tags" name="tag_id">
                  <Select
                      showSearch
                      allowClear
                      style={{ width: '100%' }}
                      placeholder="Select a tag"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {getKesGroup('tagsData').map((item: tags) => {
                    return <Select.Option key={`op${item.id}`} value={item.id}>{item.tag_name}</Select.Option>;
                  })}
                    </Select>
            </Form.Item>
           {title !== "batch unlist" ? (<>
            <Form.Item label="start time" name="unlisting_time_after">
             <DatePicker showTime/>
            </Form.Item>
            <Form.Item label="end time" name="unlisting_time_before">
             <DatePicker showTime/>
            </Form.Item>
           </>) :  <Form.Item label="unListing type" name="unlisting_type">
              <Switch checkedChildren="real unlisting" unCheckedChildren="unlisting" />
            </Form.Item>}
        </Form>
        <h3>Selected {ids.length} item</h3>
</Modal>
})

export default () => {
  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [record, setRecord] = useState<{
    id: number,
    content: string,
    title: string,
  }>({
    id: 0,
    content: '',
    title: ''
  });
  const [from] = Form.useForm();
  const [listId, setListId] = useState<number>(-1);
  const [currentItem, setCurrentItem] = useState(null);
  const [brandModal, setBrandModal] = useState<{
    visible: boolean;
    confirmLoading: boolean;
    handleOk: () => void;
    onCancel: () => void;
    showModal: () => void;
  }>({
    visible: false,
    confirmLoading: false,
    handleOk: () => {
      setBrandModal({
        ...brandModal,
        visible: true
      })
    },
    onCancel: () => {
      setBrandModal({
        ...brandModal,
        visible: false
      })
    },
    showModal: () => {
      setBrandModal({
        ...brandModal,
        visible: true
      })
    }
  })
  const { initialState } = useModel('@@initialState');
  const comparisonRef = useRef();
  // 生成 intl 对象
  // const enUSIntl = createIntl('en_US', enUS);
  const refresh = (): void => {
    actionRef.current?.reload();
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
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
      .then(async (updatedValues: { vendor_quantity: number; quantity_offset: number, custom_quantity: number }) => {
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
        return new Promise<void>((resolve) => {
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
              // eslint-disable-next-line no-console
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
  return (
    <>
      <Alert
        showIcon
        style={{ marginBottom: '10px' }}
        message={`Next Amazon Listing update time:${moment(
          parseInt(`${initialState?.listTimes?.getAmazonListingDeliverTime  }000`),
        ).format('YYYY-MM-DD HH:mm:ss')}/
                             Next Amazon Feed/update price/quantity update time:${moment(
                               parseInt(
                                 `${initialState?.listTimes?.getAmazonNormalDeliverTime  }000`,
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
          onChange: (selectedRowKeys: any[]) => {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        size="small"
        columns={columns(editFn, (record) => {
          setDrawerVisible(true);
          setRecord({
            id: record.id,
            content: record.notes,
            title: record.vendor_sku,
          });
        })}
        actionRef={actionRef}
        formRef={ref}
        request={async (params = {}, sort) =>
          new Promise((resolve) => {
            const sortParms: any = {}
            const tempParam = JSON.parse(JSON.stringify(params))
            if(sort && JSON.stringify(sort) !== "{}"){
              if(sort.id){
                sortParms.sort_field = 'add_time'
                sortParms.sort = sort.id === 'ascend' ? 'asc' : 'desc'
              }
              if(sort.sales){
                sortParms.sort_field = 'sales'
                sortParms.sort = sort.sales === 'ascend' ? 'asc' : 'desc'
              }
            }
            if (params.is_delete === '10000') {
              tempParam.is_delete = undefined;
            }
            if(params.sort_field && params.sort_field.length > 0){
              tempParam.sort_field =  params?.sort_field[1]
            }
            const tempParams = {
              ...tempParam,
              ...sortParms,
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
          showQuickJumper: true
        }}
        options={{
          search: false,
        }}
        scroll={{
          x: columns(editFn).reduce((sum, e) => sum + Number(e.width || 0), 0),
          y: getPageHeight() - 290,
        }}
        dateFormatter="string"
        headerTitle="Listed product"
        // eslint-disable-next-line @typescript-eslint/no-shadow
        onRow={(record) => {
          return {
            onClick: () => {
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
          key="batchunlishbytag"
          onClick={() => {
            comparisonRef.current.showModal('relisting')
          }}
        >
          Batch relisting
        </Button>,
          <Brand key='brandmanage' />,
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
           key="batchunlishbytag"
           onClick={() => {
            comparisonRef.current.showModal('unlist')
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
          <Button
            onClick={() => {
              const valObj = ref.current?.getFieldsValue();
              let tempParams: string = '';
              Object.keys(valObj).forEach((key,index) => {
                if (valObj[key]) {
                      let paramsStr = `${key}=${valObj[key]}`;
                      tempParams += `${index ? '&' : ''}${paramsStr}`;
                }
              })
              tempParams = `${'https://api-multi.itmars.net/listing/index?'}${  tempParams  }&is_download=1`;
              createDownload(`test.csv`, tempParams);
            }}
          >
            Download
          </Button>
        ]}
      />
      <Modal
        title="batch update"
        key='batchupdate'
        visible={isModalVisible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Form form={from} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item label="Vendor quantity">
            <Form.Item name="vendor_quantity" noStyle>
              <InputNumber style={{ width: '200px' }}></InputNumber>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Custom quantity">
            <Form.Item name="custom_quantity" noStyle>
              <InputNumber style={{ width: '200px' }}></InputNumber>
            </Form.Item>
          </Form.Item>
          <Form.Item label="Quantity offset">
            <Form.Item name="quantity_offset" noStyle>
              <InputNumber style={{ width: '200px' }}></InputNumber>
            </Form.Item>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="brand black list"
        key='brandList'
        visible={brandModal.visible}
        onOk={brandModal.handleOk}
        confirmLoading={brandModal.confirmLoading}
        onCancel={brandModal.onCancel}
      >
        <Brand />
      </Modal>
      <BatchPriceModal
        batchPriceModalVisible={visible}
        setBatchPriceModalVisible={setVisible}
        record={currentItem}
        listingId={listId}
        refresh={refresh}
      />
      <RelistingFrame  ref={comparisonRef} ids={selectedRowKeys} setIds={setSelectedRowKeys}  initData={refresh} />
    </>
  );
};


