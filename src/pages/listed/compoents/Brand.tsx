import { useState, useEffect } from 'react';
import { Table, Input, Popconfirm, Button, message, Modal, Tabs } from 'antd';
import {
  listBlackBrand,
  addBlackBrand,
  deleteBlackBrand,
  autoAddBlackBrand,
  autolistBlackBrand,
  autoDeleteBlackBrand,
  asinBlacklists,
  asinBlackAdd,
  asinBlackDelete
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
          <InputPlusTable listApi={listBlackBrand} addBrandApi={addBlackBrand} deleteBlackApi={deleteBlackBrand} />
        </TabPane>
        <TabPane tab="Auto_order black list" key="2">
          <InputPlusTable listApi={autolistBlackBrand} addBrandApi={autoAddBlackBrand} deleteBlackApi={autoDeleteBlackBrand} />
        </TabPane>
        <TabPane tab="Asin black list" key="3">
          <InputPlusTable listApi={asinBlacklists} addBrandApi={asinBlackAdd} deleteBlackApi={asinBlackDelete} />
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
}) => {
  const { addBrandApi, listApi, deleteBlackApi } = props
  const [data, setData] = useState<Array<brandItem>>([])
  const [loading, setLoading] = useState(false)
  const [addBrand, setAddBrand] = useState("")
  const [addBtnLoading, setAddBtnLoading] = useState(false)
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
    setAddBtnLoading(true)
    addBrandApi(addBrand).then((res: any) => {
      if (res.code) {
        message.success('successful!')
        setAddBrand("")
        initData()
      } else {
        throw res.msg
      }
    }).catch(e => {
      message.error(e)
    }).finally(() => {
      setAddBtnLoading(false)
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
    <Input.Group compact>
      <Input style={{ width: 'calc(100% - 120px)' }} value={addBrand} onChange={(e) => {
        setAddBrand(e.target.value)
      }} />
      <Button loading={addBtnLoading} onClick={() => {
        addBrandFn()
      }} type="primary">
        Add
      </Button>
    </Input.Group>
    <Table
      bordered
      dataSource={data}
      size={'small'}
      loading={loading}
      columns={columns(handleDelete)}
      rowClassName="editable-row"
      pagination={false}
    />
  </>
}


export default EditableTable