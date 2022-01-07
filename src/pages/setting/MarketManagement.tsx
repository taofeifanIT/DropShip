import { useState, useRef} from 'react'
import { Tabs, Input, Button, Form, message,Popconfirm, Tree, Row, Col } from 'antd';
import { getKesGroup, getPageHeight, getKesValue } from '@/utils/utils'
import { marketplaces } from '@/services/publicKeys'
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { SearchOutlined } from '@ant-design/icons';
import type { ActionType } from '@ant-design/pro-table';
import { 
    sensitiveWordsDeleteLists,
    sensitiveWordsAdd, 
    sensitiveWordsDelete, 
    sensitiveCategoryLists, 
    sensitiveCategoryAdd, 
    sensitiveCategoryDelete 
} from '@/services/setting/marketManagement'
import moment from 'moment';

const { TabPane } = Tabs;

type categoryItem = {
  id: number;
  marketplace_id: number;
  category_id: number;
  substitute: number;
  type: string;
  add_time: string;
};

type wordsItem = {
  id: number;
  marketplace_id: number;
  name: string;
  substitute: string;
  add_time: string;
};



export default () => {
  return (<>
    <div
      style={{
        background: '#fff',
        padding: '16px 8px 8px 8px',
        height: getPageHeight()
      }}
    >
      <Tabs tabPosition={"left"}>
        {/* <TabPane tab="Tab 1" key="1">
            Content of Tab 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab 3
          </TabPane> */}
        {getKesGroup("marketPlaceData").map((item: marketplaces) => {
          return (<TabPane tab={item.marketplace} key={item.id}>
            <Tabs>
              <TabPane tab={"sensitive words configuration"} key={'words1'}>
                <WordsTable marketplace_id={item.id} />
              </TabPane>
              <TabPane tab={"sensitive category configuration"} key={'category2'}>
                <CategoryTable marketplace_id={item.id} />
              </TabPane>
              {item.id === 5 && (<>
                <TabPane tab={"Shopfiy category configuration"} key={'shopfiycategoryconfig'}>
                  <CateGoryTree />
                </TabPane>
              </>)}
            </Tabs>
          </TabPane>)
        })}
      </Tabs>
    </div>
  </>)
}

interface DataNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: DataNode[];
}

const initTreeData: DataNode[] = [
  { title: 'Expand to load', key: '0' },
  { title: 'Expand to load', key: '1' },
  { title: 'Tree Node', key: '2', isLeaf: true },
];

// It's just a simple demo. You can use tree map to optimize update perf.
function updateTreeData(list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    }
    if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}

const CateGoryTree: React.FC<{}> = () => {
  const [treeData, setTreeData] = useState(initTreeData);

  const onLoadData = ({ key, children }: any) =>
    new Promise<void>(resolve => {
      if (children) {
        resolve();
        return;
      }
      setTimeout(() => {
        setTreeData(origin =>
          updateTreeData(origin, key, [
            { title: 'Child Node', key: `${key}-0` },
            { title: 'Child Node', key: `${key}-1` },
          ]),
        );

        resolve();
      }, 1000);
    });
  const token = localStorage.getItem('token')
  return (<>
    <Row>
      <Col span={6}>
         <Tree loadData={onLoadData} treeData={treeData} />
      </Col>
      <Col span={18}>
         <iframe width={'100%'} height={(getPageHeight() - 100) + 'px'} src={`https://itmars.com/?ose=false`}></iframe>
      </Col>
    </Row>
  </>);
};

const DeleteComponent = (props: {deleteApi: any, id: number,reLoad: () => void}) => {

  const { deleteApi, id,reLoad } = props
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showPopconfirm = () => {
    setVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    deleteApi(id).then((res: any) => {
      if (res && res.code){
        message.success("operation succussful!")
        reLoad()
      } else {
        throw res.msg
      }
    }).catch((e: string) => {
      message.error(e)
    }).finally(() => {
      setVisible(false);
      setConfirmLoading(false);
    })
  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setVisible(false);
  };

  return (
    <Popconfirm
      title="Are you sure？"
      visible={visible}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <a key="link" onClick={showPopconfirm}>delete</a>
    </Popconfirm>
  );
}

const columns = (reload: () => void):ProColumns<wordsItem>[] => [
  {
    title: 'order',
    dataIndex: 'index',
    valueType: 'indexBorder',
    editable: false,
    width: 48,
  },
  {
    title: 'marketplace',
    dataIndex: 'marketplace_id',
    editable: false,
    render: (text) => getKesValue('marketPlaceData', text)?.marketplace,
  },
  {
    title: 'name',
    dataIndex: 'name',
  },
  {
    title: 'substitute',
    dataIndex: 'substitute',
    render: (_) => <a>{_}</a>,
    // 自定义筛选项功能具体实现请参考 https://ant.design/components/table-cn/#components-table-demo-custom-filter-panel
    filterDropdown: () => (
      <div style={{ padding: 8 }}>
        <Input style={{ width: 188, marginBottom: 8, display: 'block' }} />
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
  },
  {
    title: 'add_time',
    dataIndex: 'add_time',
    editable: false
  },
  {
    title: 'action',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (text, record) => {
      return (<DeleteComponent deleteApi={sensitiveWordsDelete} id={record.id} reLoad={reload} />)
    }
  },
];

const WordsTable = (props: {
  marketplace_id: number;
}) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const addWords = (name: string, substitute: string) => {
    return new Promise((resolve,reject) => {
      if (!name || !substitute){
        reject(false)
      }
      sensitiveWordsAdd(name, props.marketplace_id, substitute).then(res => {
        if (res && res.code){
          message.success("operation succussful!")
          resolve(true);
          reload()
        } else {
          throw res.msg
        }
      }).catch(e => {
        message.error(e)
      }).finally(() => {
        reject(false)
      })
    });
  };
  
  const reload = () => {
    actionRef.current?.reload()
  }
  return (
    <EditableProTable<wordsItem>
      rowKey="id"
      actionRef={actionRef}
      headerTitle="sensitive words"
      maxLength={5}
      // 关闭默认的新建按钮
      recordCreatorProps={false}
      columns={columns(reload)}
      request={async () =>
        // 表单搜索项会从 params 传入，传递给后端接口。
        new Promise((resolve) => {
          sensitiveWordsDeleteLists().then(res => {
            resolve({
              data: res.data.list.filter((item: wordsItem) => item.marketplace_id === props.marketplace_id),
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: !!res.code,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: res.data.total,
            });
          })
        })
      }
      editable={{
        form,
        editableKeys,
        onSave: async (key, record) => {
          await addWords(record.name, record.substitute);
        },
        onChange: setEditableRowKeys,
        actionRender: (row, config, dom) => [dom.save, dom.cancel],
      }}
      toolBarRender={() => [
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            actionRef.current?.addEditRecord?.({
              id: (Math.random() * 1000000).toFixed(0),
              name: '',
              substitute: '',
              marketplace_id: props.marketplace_id,
              add_time: moment().format('YYYY-MM-DD HH:mm:ss')
            });
          }}>
          Add sensitive words
        </Button>]}
    />
  );
};

const columnsCategory = (reload: () => void):ProColumns<categoryItem>[] => [
  {
    title: 'order',
    dataIndex: 'index',
    valueType: 'indexBorder',
    editable: false,
    width: 48,
  },
  {
    title: 'marketplace',
    dataIndex: 'marketplace_id',
    editable: false,
    render: (text) => getKesValue('marketPlaceData', text)?.marketplace
  },
  {
    title: 'category_id',
    dataIndex: 'category_id',
  },
  {
    title: 'substitute',
    dataIndex: 'substitute',
  },
  {
    title: 'type',
    dataIndex: 'type',
  },
  {
    title: 'add_time',
    editable: false,
    dataIndex: 'add_time',
  },
  {
    title: 'action',
    width: 180,
    key: 'option',
    valueType: 'option',
    render: (text, record) => {
      return (<DeleteComponent deleteApi={sensitiveCategoryDelete} id={record.id} reLoad={reload} />)
    }
  },
];

const CategoryTable = (props: {
  marketplace_id: number;
}) => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const addCategory = (category_id: number,substitute: number,type_name: string) => {
    return new Promise((resolve,reject) => {
      if (!category_id || !substitute || !type_name){
        reject(false)
      }
      sensitiveCategoryAdd(category_id, props.marketplace_id, substitute,type_name).then(res => {
        if (res && res.code){
          message.success("operation succussful!")
          resolve(true);
          reLoad()
        } else {
          throw res.msg
        }
      }).catch(e => {
        message.error(e)
      }).finally(() => {
        reject(false)
      })
    });
  };
  const reload = () => {
    actionRef.current?.reload()
  }
  return (<>
       <EditableProTable<categoryItem>
      rowKey="id"
      actionRef={actionRef}
      headerTitle="sensitive category"
      maxLength={5}
      // 关闭默认的新建按钮
      recordCreatorProps={false}
      columns={columnsCategory(reload)}
      request={async () =>
        // 表单搜索项会从 params 传入，传递给后端接口。
        new Promise((resolve) => {
          sensitiveCategoryLists().then(res => {
            resolve({
              data: res.data.list.filter((item: wordsItem) => item.marketplace_id === props.marketplace_id),
              // success 请返回 true，
              // 不然 table 会停止解析数据，即使有数据
              success: !!res.code,
              // 不传会使用 data 的长度，如果是分页一定要传
              total: res.data.total,
            });
          })
        })
      }
      editable={{
        form,
        editableKeys,
        onSave: async (key, record) => {
          console.log(record)
          await addCategory(record.category_id,record.substitute,record.type);
        },
        onChange: setEditableRowKeys,
        actionRender: (row, config, dom) => [dom.save, dom.cancel],
      }}
      toolBarRender={() => [
        <Button
          type="primary"
          key="primary"
          onClick={() => {
            actionRef.current?.addEditRecord?.({
              id: (Math.random() * 1000000).toFixed(0),
              category_id: '',
              substitute: '',
              type_name: '',
              marketplace_id: props.marketplace_id,
              add_time: moment().format('YYYY-MM-DD HH:mm:ss')
            });
          }}>
          Add sensitive category
        </Button>]}
    />
  </>);
};