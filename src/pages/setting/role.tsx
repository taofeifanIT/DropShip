import React, { useState, useEffect } from 'react';
import { List, Divider, Input, Button, Table, message, Tag, Card, Modal, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { roleList, addRole, updateRole, deleteRole } from '../../services/setting/roleManagement';
import { listRules } from '../../services/setting/menuManagement'
import styles from './style/role.less';

function DeleteComponent(props: {id: number, setTableRecord: (obj: object) => void,initData: () => void}) {
  const [visible, setVisible] = React.useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const showPopconfirm = () => {
    setVisible(true);
  };
  const handleOk = () => {
    setConfirmLoading(true);
    deleteRole(props.id).then(res => {
      if(res.status){
        props.initData()
        props.setTableRecord({})
        message.success("操作成功！");
      } else {
        throw res.message
      }
    }).catch((e:string) => {
       message.error(e)
    }).finally(() => {
      setVisible(false);
      setConfirmLoading(false);
    })
  };

  const handleCancel = () => {
    setVisible(false);
  };
  return (<Popconfirm
    title="你确定要删除吗？"
    visible={visible}
    onConfirm={handleOk}
    okButtonProps={{ loading: confirmLoading }}
    onCancel={handleCancel}
  >
    <a onClick={showPopconfirm}>delete</a>
  </Popconfirm>)
}

export default (props: any) => {
  const [init, setInit] = useState([])
  const [data, setData] = useState<Array<any>>([])
  const [tableRecord, setTableRecord] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState({});
  const [listLoading, setListLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const operation= (api:any, param: object) => {
    setConfirmLoading(true)
    api(param).then((res: any) => {
      if (res.code) {
        initData()
        message.success("The operation was successful！")
      } else {
        throw res.message
      }
    }).catch((e: string) => {
      message.error(e)
    }).finally(() => {
      setConfirmLoading(false)
      setIsModalVisible(false);
      setEditRecord({})
    })
  }
  function replaceRecord(record:any){
    const index = data.findIndex((item:any) => item.id === record.id)
    const tempData: any[] = data
    tempData.splice(index, 1, record)
    setData(tempData)
  }
  function initData() {
    setListLoading(true)
    roleList().then(res => {
      if (res.code) {
        setData(res.data.list_groups)
        setInit(res.data.list_groups)
      } else {
        throw res.message
      }
    }).catch((e: string) => {
      message.error(e)
    }).finally(() => {
      setListLoading(false)
    })
  }
  function editRole(role: object){
    setIsModalVisible(true);
    setEditRecord(role)
  }
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const tempEditRecord = (editRecord as any)
    let api: any = addRole
    let param: Object = { title: tempEditRecord.name }
    if (tempEditRecord.id){
      api = updateRole
      tempEditRecord.permission = tempEditRecord.permission_ids
      param = tempEditRecord
    }
    if (!tempEditRecord.name) {
      message.warning("Please enter")
      return
    }
    operation(api, param)
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditRecord({})
  };
  useEffect(() => {
    initData()
  }, [])
  const onSearch = (value: any) => {
    const str = value.replace(/[\s\n\t]+$/g, "")
    setData(init)
    if (value) {
      setData(data.filter((item:any) => item.name.indexOf(str) != -1))
    } else {
      setData(init)
    }
  };
  const { initialState } = useModel('@@initialState')
  return (
    <div style={{ background: "#fff", padding: "8px", minHeight: `${(initialState as any).pageHeight}px` }}>
      <Modal title={(editRecord as any).id ? "edit" : "add"} visible={isModalVisible} confirmLoading={confirmLoading} onOk={handleOk} onCancel={handleCancel} bodyStyle={{ textAlign: 'center' }}>
        <div>
          <label>Role name：</label><Input value={(editRecord as any).name} style={{ width: "200px" }} onChange={(e) => {
            setEditRecord({ ...editRecord, name: e.target.value })
          }} />
        </div>
      </Modal>
      <List
        loading={listLoading}
        style={{ width: "20%", height: "100%", display: "inline-block", verticalAlign: "top", overflow: "scroll-Y" }}
        header={<div>
          <Input.Search style={{ width: "60%" }} placeholder="input search text" onSearch={onSearch} enterButton />
          <Button style={{ float: "right", width: "40%" }} type="primary" icon={<PlusOutlined />} onClick={() => { showModal() }}>add role</Button>
        </div>}
        bordered
        dataSource={data}
        renderItem={(item: any) => (
          <List.Item
            className={styles.listItemLast}
            style={{ cursor: "pointer", background: item.title === (tableRecord as any).title ? "gainsboro" : ""}}
            extra={<span>
              <a onClick={() => editRole(item)}>edit</a>
              <Divider type="vertical" />
              <DeleteComponent setTableRecord={setTableRecord} initData={initData} id={item['id']} />
              </span>}
            onClick={() => {
              setTableRecord(item)
            }}>
            {item.title}
          </List.Item>
        )}
      />
      <Divider type="vertical" style={{ height: `${(initialState as any).pageHeight - 10}px`, verticalAlign: "top" }} />
      <TreeData init={replaceRecord} tableRecord={tableRecord} />
    </div>);
};




function TreeData(props: { tableRecord: any, init: any }) {
  const columns = [
    {
      title: "Mune name",
      dataIndex: 'name',
      key: 'display_name',
      width: '50%',
    },
    {
      title: 'Is show',
      dataIndex: 'is_show',
      width: '50%',
      key: 'is_show',
      render: (text: boolean) => (!text ? <Tag color="magenta">close</Tag>:<Tag color="green">Open</Tag>)
    }
  ];
  const [data, setData] = React.useState([])
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<Array<number>>(props.tableRecord.permission_ids)
  function initData() {
    setTableLoading(true)
    listRules().then(res => {
      let tempData = res.data.auth_rules
      setData(tempData) 
    }).catch((e: any) => {
      message.error("data init error!")
    }).finally(() => {
      setTableLoading(false)
    })
  }
  useEffect(() => {
    // 相当于 componentDidMount
    initData()
  }, [])
  useEffect(() => {
    setSelectedRowKeys(props.tableRecord.rules)
  }, [props.tableRecord])
  const rowSelection = {
    onChange: (selectedRowKeys: any) => {
      setSelectedRowKeys(selectedRowKeys)
    },
    onSelect: (record: any, selected: any, selectedRows: any) => {
      // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: any, selectedRows: any, changeRows: any) => {
      // console.log(selected, selectedRows, changeRows);
    },
    selectedRowKeys: selectedRowKeys
  };
  return (<div style={{ width: "78%", display: "inline-block" }}>
    <Card size="small" title={(props.tableRecord.title ? <><span>Current role：</span><h3 style={{display:"inline-block"}}>{props.tableRecord.title}</h3></>: null)} extra={
      <Button loading={tableLoading} disabled={props.tableRecord.title ? false : true} type="primary" onClick={() => {
        props.tableRecord.rules = selectedRowKeys
        setTableLoading(true)
        updateRole(props.tableRecord).then(res => {
          if (res.code){
            props.init(props.tableRecord)
            message.success("The operation was successful！")
          } else {
            throw res.message
          }
        }).catch((e: string) => {
          message.error(e)
        }).finally(() => {
          setTableLoading(false)
        })
      }}>
        save
        </Button>}>
      <Table
        rowSelection={{ ...rowSelection }}
        columns={columns}
        dataSource={data}
        rowKey={(record: any) => record.id}
        pagination={false}
        loading={tableLoading}
      />
    </Card>
  </div>);
}