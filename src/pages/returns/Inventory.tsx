import { useRef,useState } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { netsuiteReturns,manualListing} from '@/services/returns';
import { Button, Space, Typography, Modal,Checkbox,Form,Row,Col, message,Select} from 'antd';
import ParagraphText from '@/components/ParagraphText';
import {
  AmazonOutlined,
  ProfileOutlined
} from '@ant-design/icons';
import { getTargetHref, getAsonHref } from '@/utils/jumpUrl';
import { getKesValue,getKesGroup } from '@/utils/utils';


const { Text, Paragraph } = Typography;

type Inventory = {
  id: number;
  sku: string;
  upc: string;
  asin: string;
  quantity: number;
  quantity_id: number;
  description: string;
  add_time: string;
  vendor_db: number;
  listing_stores: number[];
  country_id: number; // 前端生成字段
  statuslist: string[]; // 前端生成字段
};

const columns = (refresh?: () => void): ProColumns<Inventory>[] => [
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
        <Space direction="vertical">
          <Text type="secondary">
            <AmazonOutlined />
             Asin:
            <a target="_blank" href={`${getAsonHref(record.country_id)}${record.asin}`}>
              {record.asin}
            </a>
            <Paragraph style={{ display: 'inline' }} copyable={{ text: record.asin }}></Paragraph>
          </Text>
          <Text type="secondary">
            Sku:
            <Text>
              <>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`${getTargetHref(record?.vendor_db, record.sku)}`}
                >
                  {record.sku}
                </a>
                <Paragraph
                  style={{ display: 'inline' }}
                  copyable={{ text: record.sku }}
                ></Paragraph>
              </>
            </Text>
          </Text>
          <Text type="secondary">
            title: <ParagraphText content={record.description} width={300} />
          </Text>
        </Space>
      );
    },
  },
  {
    title: "State of the market",
    dataIndex: "StateOftheMarket",
    width: 200,
    render: (_, record) => {
      return (<>
        <Space direction="vertical">
              {record.statuslist.map(key => {
                return (<Text type="secondary">
                  {key}: {record[key]? (<Text>Listed</Text>) : "not yet"}
                </Text>)
              })}
        </Space>
      </>)
    }
  },
  {
    title: 'SKU',
    dataIndex: 'sku',
    hideInTable: true
  },
  {
    title: 'ASIN',
    dataIndex: 'asin',
    hideInTable: true
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    search: false,
    hideInTable: true
  },
  {
    title: 'Type',
    dataIndex: 'type',
    valueType: 'select',
    width: 150,
    valueEnum: {
      openbox: { text: 'openbox', status: 'Processing' },
      used: { text: 'used', status: 'Error' },
      clean: { text: 'clean	', status: 'Success' },
    },
  },
  {
    title: 'vendor',
    dataIndex: 'vendor_name',
    search: false,
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    search: false,
  },
  {
    title: 'Description',
    dataIndex: 'description',
    search: false,
    hideInTable: true
  },
  {
    title: 'Add time',
    dataIndex: 'add_time',
    search: false,
  },
  {
    title: 'action',
    valueType: 'option',
    fixed: 'right',
    align: 'center',
    width: 140,
    render: (_,record) => {
      return <OperationComponent record={record} refresh={refresh}  />
    }
  }
];

const OperationComponent = (props: {record: Inventory, refresh?: () => void}) => {
  const { record,refresh } = props
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
  };
  const show = () => {
    setIsModalVisible(true)
    form.setFieldsValue({
      store_ids: record.listing_stores
    })
  }
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onFinish = () => {
    form
      .validateFields()
      .then((value: { store_ids: number[] }) => {
        // 滤除已上架的店铺id
        let stores = JSON.parse(JSON.stringify(value.store_ids))
        for (let i = 0; i < stores.length; i++) {
          if (record.listing_stores.includes(stores[i])) {
            stores.splice(i, 1);
            i--; // i需要自减，否则每次删除都会讲原数组索引发生变化
          }
        }
        setConfirmLoading(true)
        manualListing({store_ids:stores.toString(),ids:[record.id].toString()}).then(res => {
          if(res.code){
            message.success("successful!")
          } else {
            throw res.msg + JSON.stringify(res.data)
          }
        }).catch(e => {
          message.error(e)
        }).finally(()=> {
          setConfirmLoading(false)
          setIsModalVisible(false)
          refresh &&refresh()
        })
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (<>
    <Modal
        title="list"
        confirmLoading={confirmLoading}
        visible={isModalVisible}
        width={600}
        onOk={onFinish}
        onCancel={handleCancel}
      >
           <Form name="validate_other" form={form} {...formItemLayout}>
          <Form.Item
            name="store_ids"
            label="store"
            rules={[{ required: true, message: 'Please select store!' }]}
          >
            <Checkbox.Group>
              <Row style={{width: '500px'}}>
                {getKesGroup('storeData').map((item: { id: number; name: string; ip: string }) => {
                  return (
                    <Col key={`${item.id}checkbox`} span={12}>
                      <Checkbox
                        key={`${item.id}checkbox`}
                        value={item.id}
                        disabled={record.listing_stores.includes(item.id)}
                        style={{ lineHeight: '32px' }}
                      >
                        {item.name}
                      </Checkbox>
                    </Col>
                  );
                })}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Form>
      </Modal>
  <Button type='primary' onClick={show}>List</Button>
  </>)
}

let marketMappingStatus = {}
getKesGroup("storeData").forEach((item:any) => {
  marketMappingStatus[item.id] = 'match_'+item.marketplace.marketplace.toLocaleLowerCase()  
})

export default () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [daynamicModalLoading, setDaynamicModalLoading] = useState(false)
  const [configurationVisible,setConfigurationVisible] = useState(false);
  const actionRef = useRef<ActionType>();
  const [shopFrom] = Form.useForm();
  const refresh = (): void => {
    actionRef.current?.reload();
  };
  const batchFromSubmit = () => {
    shopFrom.validateFields().then(values => {
      const storeId = values.store_id + ''
      setDaynamicModalLoading(true)
      manualListing({store_ids: storeId, ids: selectedRowKeys.toString()}).then((res: any) => {
         if(res.code){
           message.success("successful!")
           refresh()
         } else {
            throw res.msg + JSON.stringify(res.data)
         }
      }).catch((e: string) => {
        message.error(e)
      }).finally(() => {
        setDaynamicModalLoading(false)
        setConfigurationVisible(false)
        setSelectedRowKeys([])
        shopFrom.resetFields()
      })
    }).catch((log) => {
      message.error(log)
    })
  }
  return (
    <>
     <Modal title="Batch listing" confirmLoading={daynamicModalLoading} visible={configurationVisible} onOk={batchFromSubmit} onCancel={() => {setConfigurationVisible(false)}}>
      <Form
          name="control-ref"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 12 }}
          form={shopFrom}
        >
          <Form.Item name="store_id" label="store" rules={[{ required: true, message: 'Please select store!' }]}>
            <Select
              style={{ width: '100%' }}
              placeholder="Select store"
              allowClear
            >
              {getKesGroup('storeData')?.map((item: { id: number; name: string }) => {
                return (
                  <Select.Option key={`company${  item.id}`} value={item.id}>
                    {item.name}
                  </Select.Option>
                );

              })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <ProTable
        size="small"
        bordered
        columns={columns(refresh)}
        actionRef={actionRef}
        rowSelection={{
          selectedRowKeys,
          onChange: (RowKeys: any[] | number[], selectRows: any) => {
            setSelectedRowKeys(RowKeys);
          },
        }}
        request={async (params = {}, sort) =>
          new Promise((resolve) => {
            let tempParams: any = {
              ...params,
              page: params.current,
              limit: params.pageSize,
            };
            netsuiteReturns(tempParams).then((res) => {
              let tempData = res.data.list.map((item:any) => {
                let { vendor_name,country_id } = getKesValue("vendorData", item.vendor_db)
                let statuslist = Object.keys(item).filter(key => key.indexOf("_status") !== -1).map((status: any) => {
                  return status
                })
                return {
                  ...item,
                  vendor_name,
                  country_id,
                  statuslist,
                  listing_stores: item.listing_stores || []
                }
              })
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
          pageSize: 50,
        }}
        options={{
          search: false,
        }}
        scroll={{ x: columns().reduce((sum, e) => sum + Number(e.width || 0), 0) }}
        dateFormatter="string"
        headerTitle={'Inventory'}
        toolBarRender={() => [
          <Button
          key="uploadAndDown"
          disabled={!selectedRowKeys.length}
          onClick={() => {
            setConfigurationVisible(true)
          }}
          icon={<ProfileOutlined />}
        >
          Batch list
      </Button>
        ]}
      />
    </>
  );
};
