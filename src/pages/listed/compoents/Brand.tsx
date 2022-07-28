import { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Button, message, Modal, Tabs,Form, Select } from 'antd';
import {
  listBlackBrand,
  addBlackBrand,
  deleteBlackBrand,
  autoAddBlackBrand,
  autolistBlackBrand,
  autoDeleteBlackBrand,
  asinBlacklists,
  asinBlackAdd,
  asinBlackDelete,
  skuBlackAdd,
  skuBlackDelete,
  skuBlacklists,
  autoOrderWhiteList,
  autoOrderWhiteAdd,
  autoOrderWhiteDelete
} from '@/services/listedProduct'
const { TabPane } = Tabs

type brandItem = {
  id: number;
  add_time: number;
  name: string;
}

const EditableTable = () => {
  const [visible, setVisible] = useState(false)
  return (<>
    <Button
      key="BrandBtn"
      onClick={() => setVisible(true)}
    >
      Black list manage
    </Button>
    <Modal
      title="black list"
      key='brandList'
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
    >
      <Tabs defaultActiveKey="1">
        <TabPane tab="brand black list" key="1">
          <InputPlusTable listApi={listBlackBrand} addBrandApi={addBlackBrand} deleteBlackApi={deleteBlackBrand}  hasType />
        </TabPane>
        <TabPane tab="Auto_order black list" key="2">
          <InputPlusTable listApi={autolistBlackBrand} addBrandApi={autoAddBlackBrand} deleteBlackApi={autoDeleteBlackBrand} />
          <h3>
          Auto order white list
          </h3>
          <InputPlusTable listApi={autoOrderWhiteList} addBrandApi={autoOrderWhiteAdd} deleteBlackApi={autoOrderWhiteDelete} />
        </TabPane>
        <TabPane tab="Asin black list" key="3">
          <InputPlusTable listApi={asinBlacklists} addBrandApi={asinBlackAdd} deleteBlackApi={asinBlackDelete} />
        </TabPane>
        <TabPane tab="Sku black list" key="4">
          <InputPlusTable listApi={skuBlacklists} addBrandApi={skuBlackAdd} deleteBlackApi={skuBlackDelete} hasType/>
        </TabPane>
      </Tabs>
    </Modal>
  </>
  );
};

const columns: any = (handleDelete: (id: number) => void) => [
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: 'type',
    dataIndex: 'type',
    render: (text: number) => {
      return [ {
        label: 'amazon',
        value: 1,
      },
      {
        label: 'ebay',
        value: 4,
      }].find(item => item.value === text)?.label
    }
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    render: (_, record: { id: number }) => {
      return <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
        <a>Delete</a>
      </Popconfirm>
    }
  },
];

const otherColumns: any = (handleDelete: (id: number) => void) => [
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    render: (_, record: { id: number }) => {
      return <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
        <a>Delete</a>
      </Popconfirm>
    }
  },
];

const InputPlusTable = (props: {
  listApi: any;
  addBrandApi: any;
  deleteBlackApi: any;
  hasType?: boolean;
}) => {
  const { addBrandApi, listApi, deleteBlackApi, hasType } = props
  const [data, setData] = useState<Array<brandItem>>([])
  const [loading, setLoading] = useState(false)
  const [addBtnLoading, setAddBtnLoading] = useState(false)
  const [form] = Form.useForm();
  const handleDelete = (id: string) => {
    deleteBlackApi(id).then((res: any) => {
      if (res.code) {
        message.success('successful!')
        initData()
      } else {
        throw res.msg
      }
    }).catch(e => {
      message.error(e)
    })
  }
  const addBrandFn = () => {
      form.validateFields().then(async (updatedValues) => {
        console.log(updatedValues)
        setAddBtnLoading(true)
        addBrandApi(updatedValues).then((res: any) => {
          if (res.code) {
            message.success('successful!')
            initData()
          } else {
            throw res.msg
          }
        }).catch(e => {
          message.error(e)
        }).finally(() => {
          setAddBtnLoading(false)
        })
    })
  }
  const initData = () => {
    setLoading(true)
    listApi().then((res: any) => {
      if (res && res.code) {
        setData(res.data.list)
      } else {
        throw res.msg
      }
    }).catch(e => {
      message.error(e);
    }).finally(() => {
      setLoading(false)
    })
  }
  useEffect(() => {
    initData()
  }, [])
  return <>
    <div style={{"marginBottom": '5px'}}>
    <Form
      layout={'inline'}
      form={form}
    >
      <Form.Item label="value" name="value">
        <Input placeholder="input placeholder" />
      </Form.Item>
      {hasType ? (<Form.Item label="type" name="type">
          <Select style={{"width": "80px"}}>
            <Select.Option value="1">amazon</Select.Option>
            <Select.Option value="4">ebay</Select.Option>
          </Select>
      </Form.Item>): null}
      <Form.Item>
        <Button type="primary" loading={addBtnLoading} onClick={addBrandFn}>Add</Button>
      </Form.Item>
    </Form>
    </div>
    <Table
      bordered
      dataSource={data}
      size={'small'}
      loading={loading}
      columns={hasType?columns(handleDelete):otherColumns(handleDelete)}
      rowClassName="editable-row"
    />
  </>
}


export default EditableTable