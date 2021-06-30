import React, { useEffect, useState,useRef,useCallback  } from 'react'
import { List, Typography, Divider, message } from 'antd';
import { ImportOutlined, ArrowUpOutlined, ArrowDownOutlined, RetweetOutlined, UpOutlined, BugOutlined, SettingOutlined, SmileFilled, AlertFilled } from '@ant-design/icons';
import { Form, Input, Button, Pagination, Spin, Upload, Radio, BackTop, Select, InputNumber, Row, Col, Checkbox, Modal, Tooltip,Table,Alert   } from 'antd';
import { listingwuList, changePm, listingTest } from '../../services/calculation'
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { userList } from '@/services/setting/userManagement'
import ParagraphText from '@/components/ParagraphText'
import { getKesGroup } from '@/utils/utils';
import moment from 'moment';
const data = [
  'Racing car sprays burning fuel into crowd.',
];
const type = 'DragableBodyRow';
const { Text } = Typography
const { Option } = Select;

const orderStyle: React.CSSProperties = {
  backgroundColor: '#314659',
  color: '#fff',
  borderRadius: '20px',
  width: '20px',
  height: '20px',
  display: 'inline-block',
  textAlign: 'center',
  marginRight: '10px',
};

type itemPop = {
  id: number,
  pm: String,
  ns_sku: String,
  brand: String,
  sale_marketplace: String,
  asin: String,
  description: String,
  sale_price: String,
  purchase_price: String,
  import_tariff_rate: String,
  shipping_fee: String,
  platform_fee: String,
  reference_price: String,
  gross_margin: String,
  buybox_info: String,
  update_at: String | number,
  add_time: String | number,
  user_update_at:String | number,
  test_result: Array<{
    code?: number;
    msg: string;
    data: any;
  }>,
  test: Array<{result: boolean; msg: string; storeName: string}>;
  successfulInfo?: string; 
  errorInfo?: string
}
type resultPop = {msg?: string, result?: boolean, storeName?: string, successfulInfo?: string; errorInfo?: string}
type user = { id: number; username: string };

const MARKETS: Array<{id: string;title: string}> = [
  {id: 'sg', title: 'AMZ SG'},
  {id: 'ca', title: 'AMZ CA'},
  {id: 'de', title: 'AMZ DE'},
  {id: 'jp', title: 'AMZ JP'},
  {id: 'us', title: 'AMZ US'},
  {id: 'uk', title: 'AMZ UK'},
]

export default () => {
  const [form] = Form.useForm();
  const [params, setParams] = useState<{
    asin: String | undefined;
    admin_id: Number | undefined;
    brand: String | undefined;
    sale_marketplace: String | undefined;
    page: number;
    limit: number;
    orderby: string | undefined;
  }>({
    asin: undefined,
    admin_id: undefined,
    brand: undefined,
    sale_marketplace: undefined,
    page: 1,
    limit: 10,
    orderby: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [dataObj, setDataObj] = useState<{
    data: Array<itemPop>;
    total: number;
  }>({
    data: [],
    total: 0,
  })
  const [users, setUsers] = useState([])
  const [selectRowsIds, setSelectRowsIds] = useState<number[] | Number[]>([])
  const [modalObj, setModalObj] = useState<{
    visble: boolean;
    loading: boolean;
    userId: number;
  }>({ visble: false, loading: false, userId: -1 })
  const [storeModalObj, setStoreModalObj] = useState<{
    visble: boolean;
    loading: boolean;
    storeId: number[];
  }>({ visble: false, loading: false, storeId: [] })
  const [orderModalObj, setOrderModalObj] = useState<{
    visble: boolean;
    orderData: any[];
  }>({ visble: false, orderData: [] })
  const [infoObj, setInfoObj] = useState<{successfulInfo?: string;errorInfo?: string}>({
    successfulInfo: '',
    errorInfo: ''
  })
  const [allCheckStatus, setAllCheckStates] = useState(false)
  const handleOk = () => {
    setModalObj({
      ...modalObj,
      loading: true
    })
    changePm({
      admin_id: modalObj.userId,
      ids: selectRowsIds
    }).then((res: any) => {
      if (res.code) {
        message.success('operation successful!')
      } else {
        throw res.msg
      }
    }).catch(e => {
      message.error(e)
    }).finally(() => {
      setModalObj({
        ...modalObj,
        loading: false,
        visble: false,
      })
      setSelectRowsIds([])
      initData()
    })
  };
  const handleTestOk = () => {
    setStoreModalObj({
      ...storeModalObj,
      loading: true
    })
    let testStores: any[] = []
    const orderStore:any = localStorage.getItem('orderStore')
    if(orderStore){
      JSON.parse(orderStore)?.forEach((item: { id: number; name: string, order: number }, index: number) => {
        if(storeModalObj.storeId.indexOf(item.id) !== -1){
          testStores.push(item.id)
        }
      })
    } else {
      testStores = storeModalObj.storeId
    }
    listingTest({
      store_ids: storeModalObj.storeId,
      ids: selectRowsIds
    }).then((res: any) => {
      if (res.code) {
        message.success('operation successful!')
      } else {
        throw res.msg
      }
    }).catch(e => {
      message.error(e)
    }).finally(() => {
      setStoreModalObj({
        ...storeModalObj,
        loading: false,
        visble: false,
      })
      setSelectRowsIds([])
      initData()
    })
  };
  const handleOrderOk = () => {
    setOrderModalObj({
      ...orderModalObj,
      visble: false
    })
  };
  const handleCancel = () => {
    setModalObj({
      ...modalObj,
      visble: false
    })
  };
  const handleTestCancel = () => {
    setStoreModalObj({
      ...storeModalObj,
      visble: false
    })
  };
  const handleOrderCancel = () => {
    setOrderModalObj({
      ...orderModalObj,
      visble: false
    })
  };
  const getUsers = () => {
    userList({ page: 1, limit: 10000000 }).then(res => {
      let data = res.data.adminusers.map((item: user) => {
        return {
          id: item.id,
          username: item.username
        }
      })
      setUsers(data)
    })
  }
  const get_object_first_attribute = (data: any) => {
    for (var key in data)
        return data[key];
  }
  const initData = () => {
    setLoading(true)
    listingwuList(params).then(res => {
      if (res.code) {
        let tempData = res.data.list.map((item: itemPop) => {
          let testData: resultPop[] = []
          let successfulMsg = ''
          let errrorMsg = ''
          item.test_result.map(result => {
            let testObj:resultPop = {}
            testObj.result = false
            if(result.code){
              testObj.result = true
            }
            delete result.code
            for(let resultKey in result){
              if(typeof result[resultKey] === "string"){
                testObj.msg = result[resultKey]
              } else {
                testObj.storeName = result[resultKey]?.store?.name || result[resultKey]?.param.store?.name
                if(result[resultKey]?.param){
                  testObj.errorInfo = result[resultKey]?.error
                  errrorMsg += result[resultKey]?.error + '\n'
                } else {
                  testObj.successfulInfo = get_object_first_attribute(result[resultKey])
                  successfulMsg += testObj.successfulInfo + '\n'
                }
              }
            }
            
            item.successfulInfo = successfulMsg
            item.errorInfo = errrorMsg
            testData.push(testObj)
          })
          return {
            ...item,
            test: testData
          }
        })
        setDataObj({
          ...dataObj,
          data: tempData,
          total: res.data.total
        })
      } else {
        throw res.msg
      }
    }).catch(e => {
      message.error(e)
    }).finally(() => {
      setLoading(false)
    })
  }

  const props: any = {
    name: 'file',
    action: 'http://api-multi.itmars.net/export/upload_listing_file',
    // customRequest: (option: any) => {
    //     const formData = new FormData();
    //       formData.append('file',option.file);
    //       importTemplate(formData).then(res => {
    //           console.log(res)
    //       })

    // },
    interceptors: true,
    headers: {
      token: localStorage.getItem('token'),
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file?.response.code) {
          message.success(`${info.file.name} file uploaded successfully`);
          initData()
        } else {
          message.error(`${info.file?.response.msg}`);
        }

      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const search = () => {
    form.validateFields().then(values => {
      setParams({
        ...params,
        ...values,
        page: 1
      })
    })
  }
  const updateAllChecked = () => {
    let isIn = 0
    dataObj.data.forEach(item => {
      if(selectRowsIds.indexOf(item.id) > -1){
        isIn +=1
      }
    })
    if(isIn === params.limit){
      setAllCheckStates(true)
    } else {
      setAllCheckStates(false)
    }
  }
  useEffect(() => {
    initData()
    getUsers()
  }, [])
  useEffect(() => {
    initData()
  }, [params])  
  useEffect(() => {
    updateAllChecked()
  }, [selectRowsIds])
  useEffect(() => {
    updateAllChecked()
  }, [dataObj.data])
  return (<>
    <Row gutter={24}>
      <Col span={18}>
        <div style={{ margin: 8 }}>
          <div style={{ padding: '12px', background: '#fff', borderRadius: '10px' }}>
            <Form
              layout='inline'
              form={form}
            >
              <Form.Item name="admin_id" label="User">
                <Select
                  placeholder="Select a option"
                  allowClear
                  style={{ width: '120px' }}
                >
                  {users.map((item: user) => {
                    return (<Option key={item.id + 'op'} value={item.id}>{item.username}</Option>)
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="sale_marketplace" label="marketplace">
                <Select
                  placeholder="Select a option"
                  allowClear
                  style={{ width: '120px' }}
                >
                  {MARKETS.map((item) => {
                    return (<Option key={item.id + 'market'} value={item.id}>{item.title}</Option>)
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="asin" label="ASIN">
                <Input style={{ width: '100px' }} placeholder="input placeholder" />
              </Form.Item>
              <Form.Item name="brand" label="Brand">
                <Input style={{ width: '100px' }} placeholder="input placeholder" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" loading={loading} onClick={search}>search</Button>
              </Form.Item>
              <Form.Item>
                <Button type="primary" onClick={() => {
                  form.resetFields()
                }}>reset</Button>
              </Form.Item>
              <Form.Item>
                <Radio.Group onChange={e => {
                  setParams({
                    ...params,
                    orderby: e.target.value !== 'null' ? `gross_margin ${e.target.value}` : undefined
                  })
                }}>
                  <Radio.Button value="asc"><ArrowUpOutlined /></Radio.Button>
                  <Radio.Button value="desc"><ArrowDownOutlined /></Radio.Button>
                  <Radio.Button value="null"><RetweetOutlined /></Radio.Button>
                </Radio.Group>
              </Form.Item>
              <Upload {...props}><Button icon={<ImportOutlined />} type="primary">Import</Button></Upload>
              &nbsp;&nbsp;<Button disabled={!selectRowsIds.length} onClick={() => {
                setModalObj({
                  ...modalObj,
                  visble: true
                })
              }}>更改所属用户</Button>
            </Form>
          </div>
          <Spin spinning={loading}>
          <Alert showIcon message={<><Checkbox checked={allCheckStatus} onChange={(e) => {
            if(e.target.checked){
              setSelectRowsIds(Array.from(new Set([...selectRowsIds,...dataObj.data.map(item => item.id)])))
            } else {
              let deleteItemIds = JSON.parse(JSON.stringify(selectRowsIds))
              dataObj.data.forEach(item => {
                let index = deleteItemIds.indexOf(item.id)
                if(index > -1){
                  deleteItemIds.splice(index, 1)
                }
              })
              setSelectRowsIds(deleteItemIds)
            }
          }} />  已选择 {selectRowsIds.length}项 <a onClick={() => {
            setSelectRowsIds([])
          }}>清空</a></>} style={{marginTop: '10px'}} type="info" />
            {dataObj.data.map((items: itemPop, index) => {
              return (<CardList items={items} index={items.id} order={index} setRow={setSelectRowsIds} rows={selectRowsIds} setInfo={setInfoObj} />)
            })}
          </Spin>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Pagination defaultCurrent={1} total={dataObj.total} pageSize={params.limit} onChange={(page:number,pageSize:number) => {
            setParams({
              ...params,
              page: page,
              limit: pageSize
            })
          }} />
        </div>
      </Col>
      <Col span={6}>
        <div style={{ margin: 8, position: 'fixed' }}>
          <Row>
            <Button disabled={!selectRowsIds.length} icon={<BugOutlined />} onClick={() => {
              setStoreModalObj({
                ...storeModalObj,
                visble: true
              })
            }}>测试</Button>
            <Tooltip placement="top" title={'设置'}>
              <Button icon={<SettingOutlined />} onClick={() => {
                setOrderModalObj({
                  ...orderModalObj,
                  visble: true
                })
              }}></Button>
            </Tooltip>
          </Row>
          <Row style={{ marginTop: '10px' }} >
            <span style={{ color: 'darkgray' }}><SmileFilled style={{ color: 'green' }} /> 上架信息：</span>
            <Input.TextArea value={infoObj.successfulInfo} rows={10} />
            <br /><br />
            <span style={{ color: 'darkgray' }}><AlertFilled style={{ color: 'red' }} /> 异常信息：</span>
            <Input.TextArea value={infoObj.errorInfo} rows={10} />
          </Row>
        </div>
      </Col>
    </Row>
    <Modal title="选择所属用户" visible={modalObj.visble} confirmLoading={modalObj.loading} onOk={handleOk} onCancel={handleCancel} bodyStyle={{ textAlign: 'center' }}>
      <label>user name：</label>
      <Select
        placeholder="Select a option"
        allowClear
        style={{ width: '200px' }}
        onChange={(val: number) => {
          setModalObj({
            ...modalObj,
            userId: val
          })
        }}
      >
        {users.map((item: user) => {
          return (<Option key={item.id + 'opm'} value={item.id}>{item.username}</Option>)
        })}
      </Select>
    </Modal>
    <Modal title="选择店铺" visible={storeModalObj.visble} confirmLoading={storeModalObj.loading} onOk={handleTestOk} onCancel={handleTestCancel}>
      <Checkbox.Group options={getKesGroup('storeData')?.map((item: { id: number; name: string }) => {
        return { label: item.name, value: item.id }
      })} onChange={(val: number[] | any) => {
        setStoreModalObj({
          ...storeModalObj,
          storeId: val
        })
      }} />
    </Modal>
    <Modal title="设置" visible={orderModalObj.visble} onOk={handleOrderOk} onCancel={handleOrderCancel}>
      <DragSortingTable />
    </Modal>
    <BackTop>
      <div
        style={{
          border: '1px solid #dcdcdc',
          width: '50px',
          height: '50px',
          textAlign: 'center',
          lineHeight: '50px',
          position: 'fixed',
          right: '5vw',
          bottom: '6vw',
          zIndex: 100,
          background: 'rgb(220, 220, 220)',
          cursor: 'pointer',
        }}
      >
        <UpOutlined />
      </div>
    </BackTop>
  </>)
};



const CardList = (props: { items: itemPop, index: number, order: number; setRow: (ids: number[] | Number[]) => void, rows: Number[],setInfo: (params: any) => void }) => {
  const { items, index, order, setRow, rows,setInfo } = props
  const [price, setPrice] = useState(0)
  const [thisBuyBox, setThisBuyBox] = useState("0")
  return (<div onClick={() => {
    setInfo({
      successfulInfo: items.successfulInfo || '',
      errorInfo: items.errorInfo || ''
    })
  }}>
    <List
      key={'list' + index}
      header={<div><h3><Text type='secondary'>User：</Text>{items.pm}</h3></div>}
      footer={<div>
        <Text type='secondary'>销售价格：
          <Text style={{ fontSize: '21px' }}><InputNumber style={{ width: '100px' }} value={price} onChange={ (val) => {
            // ThisBuyBox（参考售价*（1-平台手续费）-采购单价*（1+进口关税率）-运费）/（(参考售价*（1-平台手续费））
            setPrice(val)
            let platform_fee = parseFloat(items.platform_fee + "") / 100
            let purchase_price = parseFloat(items.purchase_price + "")
            let import_tariff_rate = parseFloat(items.import_tariff_rate + "") / 100
            let shipping_fee = parseFloat(items.shipping_fee + "")
            let value = (((val * (1 - platform_fee)) -
              purchase_price * (1 + import_tariff_rate) - shipping_fee) / (val * (1 - platform_fee)))
            setThisBuyBox((parseFloat(value + '') * 100).toFixed(2) + '%')

          }} /></Text>
        </Text>
        <Text type='secondary' style={{ marginLeft: '10px' }}>销售价格毛利率：
          <Text style={{ fontSize: '21px' }}><span>{thisBuyBox}</span></Text>
        </Text>
        <Text type='secondary' style={{ float: 'right' }}>buybox：
          <Text style={{ fontSize: '21px' }}>{(parseFloat(items.gross_margin + '') * 100).toFixed(2)}%</Text>
        </Text>
      </div>} 
      style={{ background: '#fff', borderRadius: '10px', marginTop: '10px' }}
      bordered
      size='small'
      dataSource={data}
      renderItem={item => (
        <List.Item>
          <Checkbox checked={rows.indexOf(items.id) !== -1 ? true : false} onChange={(val) => {
            if (val.target.checked) {
              setRow([
                ...rows,
                items.id
              ])
            } else {
              let index = rows.indexOf(items.id)
              if (index !== -1) {
                let tempRow = JSON.parse(JSON.stringify(rows))
                tempRow.splice(index, 1)
                setRow(tempRow)
              }
            }
          }} /><div style={orderStyle} key={'order' + index}>{order + 1}</div>
          <Divider type='vertical' style={{ height: '70px' }} />
          <div style={{ display: 'inline-block', width: '180px' }} key={'content' + index}>
            <Text type='secondary'>
              Asin: <a
                target="_blank"
                rel="noreferrer"
              >
                {items.asin}
              </a>
            </Text><br />
            <Text type='secondary'>
              品牌: <Text>{items.brand}</Text>
            </Text><br />
            <Text type='secondary'>
              描述: <ParagraphText content={items.description + ''} width={500} />
            </Text>
          </div>
          <Divider type='vertical' style={{ height: '70px' }} />
          <div style={{ display: 'inline-block' }}>
            <Text type='secondary'>
              销售平台: <Text>{items.sale_marketplace}</Text>
            </Text><br />
            <Text type='secondary'>
              NS SKU: <Text>{items.ns_sku}</Text>
            </Text><br />
          </div>
          <Divider type='vertical' style={{ height: '70px' }} />
          <div style={{ display: 'inline-block' }} key={'sale_price' + index}>
            <Text type='secondary'>
              预计销售单: <Text>${items.sale_price}</Text>
            </Text><br />
            <Text type='secondary'>
              采购单价: <Text>${items.purchase_price}</Text>
            </Text><br />
          </div>
          <Divider type='vertical' style={{ height: '70px' }} />
          <div style={{ display: 'inline-block' }} key={'platform_fee' + index}>
            <Text type='secondary'>
              平台手续费率: <Text>{items.platform_fee}%</Text>
            </Text><br />
            <Text type='secondary'>
              进口关税率: <Text>{items.import_tariff_rate}%</Text>
            </Text><br />
            <Text type='secondary'>
              运费(全程运费): <Text>{items.shipping_fee}</Text>
            </Text><br />
          </div>
          <Divider type='vertical' style={{ height: '70px' }} />
          <div style={{ display: 'inline-block' }} key={'update_at' + index}>
            <Text type='secondary'>
              <div>最后一次更新时间:</div>
              <Text>{moment(+(items.update_at + '000')).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </Text><br />
            <Text type='secondary'>
            <div>最后一次上传时间:</div>
              <Text>{moment(+(items.add_time + '000')).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </Text><br />
            <Text type='secondary'>
            <div>最后一次更改用户时间:</div>
              <Text>{moment(+(items.user_update_at + '000')).format('YYYY-MM-DD HH:mm:ss')}</Text>
            </Text>
          </div>
          <Divider type='vertical' style={{ height: '70px' }} />
          <div style={{ display: 'inline-block' }}>
            <Text type='secondary'>
              参考价格: $<Text copyable>{items.reference_price}</Text>(buy box)
            </Text><br />
          </div>
          <Divider type='vertical' style={{ height: '70px' }} />
          <div style={{ display: 'inline-block' }}>
            {items.test?.map((item) => {
              return (<p><Text type='secondary'>
              {item.storeName}: <Text>{item.msg}</Text>
            </Text></p>)
            })}
          </div>
        </List.Item>
      )}
    />
  </div>)
}

// const type = 'DragableBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: 'DragableBodyRow',
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));

  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

const columns = [
  {
    title: '顺序',
    dataIndex: 'index',
    key: 'index',
    render: (_: any, record: any, index: number) => {
      return index + 1
    }
  },
  {
    title: '店铺名称',
    dataIndex: 'store',
    key: 'store',
  },
];

const DragSortingTable: React.FC = () => {
 
  const [data, setData] = useState([]);

  const components = {
    body: {
      row: DragableBodyRow,
    },
  };
  useEffect(() => {
    if(!localStorage.getItem('orderStore')){
      let tpdata = getKesGroup('storeData')?.map((item: { id: number; name: string }, index: number) => {
        return { store: item.name, order: index + 1,id: item.id }
      })
      localStorage.setItem('orderStore', JSON.stringify(tpdata))
      setData(tpdata)
    } else {
      setData(JSON.parse(localStorage.getItem('orderStore')))
    }
  },[])
  useEffect(() => {
    localStorage.setItem('orderStore', JSON.stringify(data))
  },[data])
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = data[dragIndex];
      setData(
        update(data, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [data],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        components={components}
        onRow={(record, index) => ({
          index,
          moveRow,
        })}
      />
    </DndProvider>
  );
};