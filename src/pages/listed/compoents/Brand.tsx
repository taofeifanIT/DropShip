import { useState,useEffect } from 'react';
import { Table, Input, Popconfirm,Button,message } from 'antd';
import { listBlackBrand, addBlackBrand, deleteBlackBrand } from '@/services/listedProduct'

const EditableTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const [addBrand, setAddBrand] = useState("")
  const [addBtnLoading, setAddBtnLoading] = useState(false)    
  const initData = () => {
    setLoading(true)
    listBlackBrand().then(res => {
        if(res && res.code){
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
  const addBrandApi = () => {
    setAddBtnLoading(true)
    addBlackBrand(addBrand).then(res => {
        if(res.code){
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
  const handleDelete = (id: string) => {
    deleteBlackBrand(id).then(res => {
        if(res.code){
            message.success('successful!')
            initData()
        }else {
            throw res.msg
        }
    }).catch(e => {
        message.error(e)
    })
  }
  useEffect(() => {
    initData()
  }, [])

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_,record: {id: string}) => {
          return  <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.id)}>
          <a>Delete</a>
        </Popconfirm>
      }
    },
  ];


  return (<>
         <Input style={{width: '75%'}} value={addBrand} onChange={(e) => {
             setAddBrand(e.target.value)
         }} />
         <Button loading={addBtnLoading} onClick={() => {
             addBrandApi()
         }}  type="primary" style={{ marginBottom: 16,marginInlineStart: '8px' }}>
          Add a brand
        </Button>
      <Table
        bordered
        dataSource={data}
        size={'small'}
        loading={loading}
        columns={columns}
        rowClassName="editable-row"
        pagination={false}
      />
    </>
  );
};


export default EditableTable