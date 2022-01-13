import React, { useRef, useState } from 'react';
import { Button, Select, Form, Modal, message, InputNumber,Typography } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getTagList } from '../../services/publicKeys';
import { edit } from '../../services/priceManage/tagPrice';
import { getKesGroup, getKesValue, } from '../../utils/utils';
import type { priceAlgorithms,vendors } from '../../services/publicKeys';
import {WarningOutlined} from '@ant-design/icons';
import ParagraphText from '@/components/ParagraphText'
const { Text } = Typography;

const { Option } = Select;
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
  amazon_price_algorithm_id: number;
  newegg_price_algorithm_id: number;
  walmart_price_algorithm_id: number;
  shopify_price_algorithm_id: number;
  ebay_price_algorithm_id: number;
  listing_num: number;
  total_num: number;
};

const columns = (editFn: (visible: boolean, id: number) => void): ProColumns<GithubIssueItem>[] => [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'Tag name',
    dataIndex: 'tag_name',
    search: false,
    width: 300,
    render: (text) => (<Text type="secondary">
    <ParagraphText
      content={text?.toString() || ""}
      width={290}
    />
  </Text>)
  },
  {
    title: 'vendor',
    dataIndex: 'vendor_id',
    valueType: 'select',
    width: 120,
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
    title: 'Total',
    dataIndex: 'total_num',
    width: 100,
    search: false,
    sorter: true,
  },
  {
    title: 'Total listing',
    dataIndex: 'listing_num',
    width: 100,
    search: false,
    sorter: true,
  },
  {
    title: 'Amazon price algorithm',
    dataIndex: 'amazon_price_algorithm_id',
    search: false,
    width: 240,
    render: (_,record) => {
      return getKesValue('priceAlgorithmsData', record.amazon_price_algorithm_id).name;
    },
  },
  {
    title: 'Newegg price algorithm',
    dataIndex: 'newegg_price_algorithm_id',
    search: false,
    width: 240,
    render: (_,record) => {
      return getKesValue('priceAlgorithmsData', record.newegg_price_algorithm_id).name;
    },
  },
  {
    title: 'Walmart price algorithm',
    dataIndex: 'walmart_price_algorithm_id',
    search: false,
    width: 240,
    render: (_,record) => {
      return getKesValue('priceAlgorithmsData', record.walmart_price_algorithm_id).name;
    },
  },
  {
    title: 'Ebay price algorithm',
    dataIndex: 'ebay_price_algorithm_id',
    search: false,
    width: 240,
    render: (_,record) => {
      return getKesValue('priceAlgorithmsData', record.ebay_price_algorithm_id).name;
    },
  },
  {
    title: 'shopify price algorithm',
    dataIndex: 'shopify_price_algorithm_id',
    search: false,
    width: 240,
    render: (_,record) => {
      return getKesValue('priceAlgorithmsData', record.shopify_price_algorithm_id).name;
    },
  },
  {
    title: 'quantity_offset',
    dataIndex: 'quantity_offset',
    width: 110,
    search: false,
  },
  {
    title: 'Filter',
    dataIndex: 'minimum',
    hideInTable: true,
    valueEnum: {
      '0': { text: 'Filtering the total 0', status: 'Success' },
      '1': { text: 'Filtering the total listing 0', status: 'Success' },
      '2': { text: 'Total minimum', status: 'Success' },
      '3': { text: 'Total listing minimum', status: 'Success' },
    }
  },
  {
    title: 'Action',
    dataIndex: 'action',
    search: false,
    width:100,
    fixed: 'right',
    render: (_, record: any) => {
      return (
        <>
          <Button
            size="small"
            onClick={() => {
              editFn(true, record);
            }}
          >
            Edit
          </Button>
        </>
      );
    },
  },
];

const BatchPriceModal = (props: {
  batchPriceModalVisible: boolean;
  setBatchPriceModalVisible: (visible: boolean) => void;
  listingId: any;
  refresh: () => void;
}) => {
  const { batchPriceModalVisible, setBatchPriceModalVisible, listingId, refresh } = props;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [from] = Form.useForm();
  const handleCancel = () => {
    setBatchPriceModalVisible(false);
    from.resetFields();
  };
  const onEmit = () => {
    setConfirmLoading(true);
    from.validateFields().then((updatedValues: any) => {
      edit({
        tag_id: listingId.id,
        ...updatedValues,
      })
        .then((res: { code: number; msg: string; data: any }) => {
          if (res.code) {
            message.success('opetaion successful!');
          } else {
            throw res.msg;
          }
        })
        .catch((e) => {
          message.error(e);
        })
        .finally(() => {
          setConfirmLoading(false);
          setBatchPriceModalVisible(false);
          refresh();
        });
    });
  };
  React.useEffect(() => {
    if (batchPriceModalVisible && listingId) {
      from.setFieldsValue({
        ...listingId,
      });
    } else {
      return;
    }
  }, [batchPriceModalVisible]);
  return (
    <Modal
      title="edit"
      visible={batchPriceModalVisible}
      onOk={onEmit}
      onCancel={handleCancel}
      confirmLoading={confirmLoading}
    >
      <Form form={from} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
        <Form.Item
          label="amazon algorithm"
          name="amazon_price_algorithm_id"
          rules={[{ required: true, message: 'Please input your price algorithm!' }]}
        >
          <Select placeholder="Select a option and change input text above" allowClear>
            {getKesGroup('priceAlgorithmsData').map((item: priceAlgorithms) => {
              return (
                <Option key={`option${item.id}`} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="walmart algorithm"
          name="walmart_price_algorithm_id"
          rules={[{ required: true, message: 'Please input your walmart_price_algorithm_id!' }]}
        >
          <Select placeholder="Select a option and change input text above" allowClear>
            {getKesGroup('priceAlgorithmsData').map((item: priceAlgorithms) => {
              return (
                <Option key={`option${item.id}`} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="newegg algorithm"
          name="newegg_price_algorithm_id"
          rules={[{ required: true, message: 'Please input your price algorithm!' }]}
        >
          <Select placeholder="Select a option and change input text above" allowClear>
            {getKesGroup('priceAlgorithmsData').map((item: priceAlgorithms) => {
              return (
                <Option key={`option${item.id}`} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="ebay algorithm"
          name="ebay_price_algorithm_id"
          rules={[{ required: true, message: 'Please input your price algorithm!' }]}
        >
          <Select placeholder="Select a option and change input text above" allowClear>
            {getKesGroup('priceAlgorithmsData').map((item: priceAlgorithms) => {
              return (
                <Option key={`option${item.id}`} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="shopify algorithm"
          name="shopify_price_algorithm_id"
          rules={[{ required: true, message: 'Please input your price algorithm!' }]}
        >
          <Select placeholder="Select a option and change input text above" allowClear>
            {getKesGroup('priceAlgorithmsData').map((item: priceAlgorithms) => {
              return (
                <Option key={`option${item.id}`} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          label="quantity_offset"
          name="quantity_offset"
          rules={[{ required: true, message: 'Please input your quantity_offset!' }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
      <div><span style={{color: 'red', fontSize: '18px'}}>({<WarningOutlined />}Warning: A negative number subtracts inventory, and a positive number increases inventory)</span></div>
    </Modal>
  );
};
let priceAlgorithmData: any[] = []
export default () => {
  const actionRef = useRef<ActionType>();
  const [visible, setVisible] = useState(false);
  const [listId, setListId] = useState({});
  // 生成 intl 对象
  // const enUSIntl = createIntl('en_US', enUS);
  const refresh = (): void => {
    actionRef.current?.reload();
  };
  const editFn = (comlounVisible: boolean, listId: any) => {
    setVisible(comlounVisible);
    setListId(listId);
    console.log(listId);
  };
  return (
    <>
      <ProTable<GithubIssueItem>
        size="small"
        columns={columns(editFn)}
        actionRef={actionRef}
        request={async (params = {}, sort) =>
          new Promise((resolve) => {
            if(!priceAlgorithmData.length){
              getTagList(params).then((res:{
                data: {
                  list:GithubIssueItem[],
                  total: number
                },
                code: number,
              }) => { 
                 let tempData = res.data.list
                 priceAlgorithmData = tempData
                resolve({
                  data: tempData,
                  success: !!res.code,
                  total: res.data.total,
                });
              });
            } else {
                 let tempData: any[] = JSON.parse(JSON.stringify(priceAlgorithmData))
                 if (sort){
                    let sortPop =  Object.keys(sort)[0]
                    if (sort[sortPop] === 'descend'){
                      tempData = tempData.sort((a, b) => a[sortPop] - b[sortPop])
                    } else {
                      tempData = tempData.sort((a, b) => b[sortPop] - a[sortPop])
                    }
                 }
                 if(params.vendor_id){
                  tempData = tempData.filter(item => item.vendor_id === params.vendor_id)
                 }
                 if(params.minimum){
                   if (params.minimum == 0){
                    tempData = tempData.filter(item => item.total_num !== 0)
                   }
                   if (params.minimum == 1){
                    tempData = tempData.filter(item => item.listing_num !== 0)
                   }
                   if (params.minimum == 2){
                    tempData = tempData.filter(item => item.total_num === 0)
                   }
                   if (params.minimum == 3){
                    tempData = tempData.filter(item => item.listing_num === 0)
                   }
                 }
                resolve({
                  data: tempData,
                  success: true,
                  total:tempData.length,
                });
            }
            
          })
        }
        scroll={{x: columns(editFn).reduce((sum, e) => sum + Number(e.width || 0), 0),}}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        pagination={{
          pageSize: 50,
        }}
        options={{
          search: false,
        }}
        dateFormatter="string"
        headerTitle={'Tag'}
        toolBarRender={() => [
          //    <Button key="ImportOutlined" icon={<ImportOutlined/>}>Batch unlist</Button>,
          //    <Button key="uploadAndDown" icon={<TableOutlined/>}>CSV Upload / Download with tags</Button>
        ]}
      />
      <BatchPriceModal
        batchPriceModalVisible={visible}
        setBatchPriceModalVisible={setVisible}
        listingId={listId}
        refresh={refresh}
      />
    </>
  );
};
