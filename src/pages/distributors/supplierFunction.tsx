import React, { useEffect, useState } from 'react';
import { AmazonOutlined, ExclamationCircleOutlined, BarChartOutlined, DeleteOutlined  } from '@ant-design/icons';
import { Button, Typography, Space, Form, Row, Col, Modal, Checkbox, message, Select, Spin, Tag  } from 'antd';
import { log_vendor_quantity_and_price_change } from '../../services/distributors/ingramMicro'
import type { ProColumns } from '@ant-design/pro-table';
import { history } from 'umi';  
import { tags } from '../../services/publicKeys'
import { getKesGroup, getKesValue } from '../../utils/utils'
import { getTargetHref, getAsonHref,getNewEggHref } from '../../utils/jumpUrl'
import{Info} from '../../components/Notes'
import { getPublicParams } from '../../utils/cookes'
import { Column } from '@ant-design/charts';
import moment from 'moment'

const { Text } = Typography;

const DemoColumn = (props: {data: {log_vendor_price_change: [], log_vendor_quantity_change:[]}}) => {
    var config = {
      data: props.data.log_vendor_price_change,
      isGroup: true,
      xField: 'time',
      yField: 'price',
      seriesField: 'name',
      style: {height: "250px"},
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
        style: {height: "250px"},
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

type apiItem = {
    updateApi: any,
    listingApi: any,
    deleteApi: any,
}

export const ButtonGroup = (props: {
    refresh: () => void,
    record: {
        id: number,
        listing_stores: Array<{
            store_id: Number,
        }>,
        match_amazon: number;
        match_ebay: number;
        match_walmart: number;
        match_newegg: number;
        is_auth: number;
        vendor_sku: string;
        vendor_id: string;
    },
    api: apiItem,
    isAuth?: boolean
}) => {
    const { record, refresh, api, isAuth} = props
    const {updateApi, listingApi, deleteApi} = api
    const size = "small"
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [confirmMatchLoading, setConfirmMatchLoading] = useState(false);
    const [alreadyStoreId, setAlreadyStoreId] = useState({});
    const [matchlVisible, setMatchlVisible] = useState(false);
    const [historyVisible, setHistoryVisible] = useState(false)
    const [historyConfirmLoading, setHistoryConfirmLoading] = useState(false)
    const [historyDataLoading, setHistoryDataLoading]= useState(false)
    const [isDefaultStores, setIsDefaultStores] = useState(false)
    const [historyData, setHistoryData] = useState({log_vendor_price_change: [], log_vendor_quantity_change:[]})
    const [form] = Form.useForm();
    const [matchForm] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 },
    };
    const showModal = () => {
        setIsModalVisible(true);
    };
    const handleOk = () => {
        form.resetFields()
        setIsModalVisible(false);
        refresh()
    };
    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const getResponseInfo = (obj: {
        errors_stores?: Array<{ name: string }>;
        success_stores?: Array<{ name: string }>;
    }): {
        success: string,
        errors: string
    } => {
        let successInfo: string | undefined = undefined
        if (obj.success_stores && obj.success_stores.length) {
            successInfo = [obj.success_stores.map((item: {
                name: string
            }) => {
                return item.name
            })].toString()
        }
        let errorInfo: string | undefined = undefined
        if (obj.errors_stores && obj.errors_stores.length) {
            errorInfo = [obj.errors_stores.map((item: {
                name: string
            }) => {
                return item.name
            })].toString()
        }
        return {
            success: successInfo || '',
            errors: errorInfo || ''
        }
    }
    const onMatchFinish = () => {
        matchForm.validateFields().then((value) => {
            setConfirmMatchLoading(true)
            let params = {
                id: record.id,
                ...value
            }
            updateApi(params).then((res: {
                code: number;
                msg: string;
            }) => {
                if (res.code) {
                    message.success('operation successful!')
                    refresh()
                } else {
                    throw res.msg
                }
            }).catch(e => {
                message.error(e)
            }).finally(() => {
                setConfirmMatchLoading(false)
                setMatchlVisible(false)
            })
        }).catch((e) => {
            console.log(e)
        })
    };
    const handleMatchModalCancel = () => {
        setMatchlVisible(false)
    }
    const onFinish = () => {
        form.validateFields().then((value: {
            store_ids: Number[]
        }) => {
            // 3.滤除已上架的店铺id
            let tempValue = value
            for (var i = 0; i < tempValue.store_ids.length; i++) {
                if (alreadyStoreId[tempValue.store_ids[i].toString()]) {
                    tempValue.store_ids.splice(i, 1);
                    i--;//i需要自减，否则每次删除都会讲原数组索引发生变化
                }
            }
            tempValue.store_ids = Array.from(new Set(tempValue.store_ids))
            setConfirmLoading(true)
            listingApi({ id: record.id, ...tempValue }).then(res => {
                if (res.code) {
                    message.info("Listed succssful!")
                    const { success, errors } = getResponseInfo(res.data)
                    message.success((
                        <div>
                            {success && (<p>{`${success}'  Listed succssful!`}</p>)}
                            {errors && (<p>{`${errors}  Listed faild!`}</p>)}
                            {!success && (<p>{`0 Listed succssful!`}</p>)}
                            {!errors && (<p>{`0 Listed faild!`}</p>)}
                        </div>
                    ))
                } else {
                    throw res.msg
                }
            }).catch((e: any) => {
                message.error(e.error ? e.error : e)
            }).finally(() => {
                setConfirmLoading(false)
                handleOk()
            })
        }).catch((e) => {
            console.log(e)
        })
    };
    const updatePop = (pop: string, value: any) => {
        let params = {
            id: record.id
        }
        params[pop] = value
        updateApi(params).then((res: {
            code: number;
            msg: string;
        }) => {
            if (res.code) {
                message.success('operation successful!')
                refresh()
            }
        })
    }
    function DeleteComponent(props: { id: number; initData: () => void }) {
        const handleOk = () => {
            Modal.confirm({
                title: 'are you sure you want to delete it?',
                icon: <ExclamationCircleOutlined />,
                content: '',
                okText: 'ok',
                cancelText: 'cancel',
                onOk: () => {
                    return new Promise((resolve, reject) => {
                        deleteApi(props.id)
                        .then((res) => {
                          if (res.code) {
                            message.success('Operation successful!');
                            props.initData();
                          } else {
                            throw res.msg;
                          }
                        })
                        .catch((e: string) => {
                          message.error(e);
                        })
                        .finally(() => {
                          resolve(null)
                        });
                      }).catch(() => console.log('Oops errors!'));
                }
              });
        };
        return (
            <Button type="primary" size={size} danger style={{marginTop: "10px", width: '110px'  }} onClick={handleOk} ><DeleteOutlined />delete</Button>
        );
      }
    const getListBotton = () => {
        return (<Button
            type="default"
            key="listBtn"
            size={size}
            style={{color: record.match_amazon !== 0 ? "white" : "", background: record.match_amazon !== 0 ? "#87d068" : "", width: '110px' }}
            onClick={() => {
                showModal()
            }}
        >
            List
        </Button>)
    }
    const getMatchButton = () => {
        return (<Button size={size} style={{marginTop: "10px", color: "white", background: "rgb(45, 183, 245)",width: '110px' }} onClick={() => {
            setMatchlVisible(true)
        }}>match</Button>)
    }
    const getAuthButton = () => {
        switch (record.is_auth) {
            case -1:
                return (<Button size={size} type="primary" style={{ marginTop: "10px",width: '110px'  }} onClick={() => {
                    updatePop('is_auth', 1)
                }}>Authorized</Button>)
            case 0:
                return (<Button size={size} type="primary" style={{marginTop: "10px",width: '110px'  }} onClick={() => {
                    updatePop('is_auth', 1)
                }}>Authorized</Button>)
            case 1:
                return (<Button type="dashed" size={size} style={{marginTop: "10px",width: '110px'  }} onClick={() => {
                    updatePop('is_auth', 0)
                }}>UnAuthorized</Button>)
        }
    }
    const marketPop = (storeId: number) => {
        return getKesGroup('storeData').find((item: { id: number }) => item.id === storeId)
    }
    const handleOpenView = () => {
        setHistoryVisible(true)
        getHistoryData()
    }
    const handleOpenViewCancel = () => {
        setHistoryVisible(false)
    }
    useEffect(() => {
        if (isModalVisible) {
            let tempObj = {}
            const disableStatus = 0
            // 1.标记已存在属性
            record.listing_stores?.forEach((item: any) => {
                tempObj[item.store_id.toString()] = true
            })
            getKesGroup('storeData').forEach((storeItem: any) => {
                if (marketPop(storeItem.id)?.marketplace.id === 1 && record.match_amazon === disableStatus) {
                    tempObj[storeItem.id.toString()] = true
                }
                if (marketPop(storeItem.id)?.marketplace.id === 2 && record.match_walmart === disableStatus) {
                    tempObj[storeItem.id.toString()] = true
                }
                if (marketPop(storeItem.id)?.marketplace.id === 4 && record.match_ebay === disableStatus) {
                    tempObj[storeItem.id.toString()] = true
                }
                if (marketPop(storeItem.id)?.marketplace.id === 3 && record.match_newegg === disableStatus) {
                    tempObj[storeItem.id.toString()] = true
                }
            })
            // 设置同一国家下的店铺
            // const params = JSON.parse(getPublicParams() || '{}')
            // let isCountry: number[] = []
            // if(params['country_id']){
            //     isCountry = getKesGroup('storeData').filter((item: {
            //         country: {id: number}
            //     }) => item.country.id === params['country_id']).map((flItem: {id: number}) => {
            //         return flItem.id
            //     })
            // }
            // 设置默认配置选线
            let defaultStoresArr: number[] = []
            if(!!localStorage.getItem('defaultStore')){
                setIsDefaultStores(true)
                let defaultStores = JSON.parse(localStorage.getItem('defaultStore') as string)
                defaultStores.forEach((element: number) => {
                    defaultStoresArr.push(element)
                });
            } else {
                setIsDefaultStores(false)
            }
            // 2.设置已存在属性
            setAlreadyStoreId(tempObj)
            form.setFieldsValue({
                store_ids: [...record.listing_stores?.map(item => {
                    return item.store_id
                }), ...defaultStoresArr]
            })
        } else {
            return
        }
    }, [isModalVisible])
    const getHistoryData = () => {
        const params:any = {
            id: record.vendor_id,
            vendor_sku: record.vendor_sku
        }
        setHistoryDataLoading(true)
        log_vendor_quantity_and_price_change(params).then(res => {
            if(res.code){
                let priceHistoryData: any = []
                let quantityHistoryData: any = []
                res.data.log_vendor_price_change.forEach((item: {
                    add_datetime: string;
                    after: string;
                    before: string;
                }) => {
                    priceHistoryData.push({
                        name: 'after',
                        time: item.add_datetime,
                        price: parseFloat(item.after)
                    })
                    priceHistoryData.push({
                        name: 'before',
                        time: item.add_datetime,
                        price: parseFloat(item.before)
                    })
                })
                res.data.log_vendor_quantity_change.forEach((item: {
                    add_datetime: string;
                    after: string;
                    before: string;
                }) => {
                    quantityHistoryData.push({
                        name: 'after',
                        time: item.add_datetime,
                        price: parseFloat(item.after)
                    })
                    quantityHistoryData.push({
                        name: 'before',
                        time: item.add_datetime,
                        price: parseFloat(item.before)
                    })
                })
                setHistoryData({log_vendor_price_change: priceHistoryData, log_vendor_quantity_change:quantityHistoryData})
            } else {
                throw res.msg
            }
        }).catch((e:string) => {
            message.error(e)
        }).finally(() => {
            setHistoryConfirmLoading(false)
            setHistoryDataLoading(false)
        })
    }
    useEffect(() => {
        if (matchlVisible) {
            matchForm.setFieldsValue({
                match_amazon: record.match_amazon,
                match_ebay: record.match_ebay,
                match_walmart: record.match_walmart,
                match_newegg: record.match_newegg
            })
        } else {
            return
        }
    }, [matchlVisible])
    return (
        <>
             {getListBotton()}
            {getMatchButton()}
            <DeleteComponent id={record.id} initData={refresh} />
            {isAuth && getAuthButton()}
            <Button style={{width: '110px',marginTop: '10px' }} size='small' onClick={() => {
                    handleOpenView()
                }}><BarChartOutlined />history data</Button>
            <Modal
                title="price and quantity history data"
                width={800}
                bodyStyle={{height: '600px'}}
                confirmLoading={historyConfirmLoading}
                visible={historyVisible}
                onOk={handleOpenViewCancel}
                onCancel={handleOpenViewCancel}>
                    <Spin spinning={historyDataLoading}>
                        <DemoColumn data={historyData} />
                    </Spin>
            </Modal>
            <Modal
                title="Match Modal"
                width={300}
                confirmLoading={confirmMatchLoading}
                visible={matchlVisible}
                onOk={onMatchFinish}
                onCancel={handleMatchModalCancel}>
                <Form
                    name="matchform"
                    form={matchForm}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    onFinish={onMatchFinish}
                >
                    {getKesGroup('marketPlaceData')?.map((item: {
                        id: number,
                        marketplace: string
                    }) => {
                        return (
                            <Form.Item name={`match_${item.marketplace.toLowerCase()}`} label={item.marketplace}>
                                <Select
                                    size="small"
                                    style={{ width: "150px" }}
                                    placeholder={`select ${item.marketplace}`}
                                    allowClear
                                >
                                    <Select.Option key={`match_${item.marketplace}-1`} value={-1}>None</Select.Option>
                                    <Select.Option key={`match_${item.marketplace}0`} value={0}>not Match</Select.Option>
                                    <Select.Option key={`match_${item.marketplace}1`} value={1}>Match</Select.Option>
                                </Select>
                            </Form.Item>
                        )
                    })}
                </Form>
            </Modal>
            <Modal
                title="list"
                confirmLoading={confirmLoading}
                visible={isModalVisible}
                onOk={onFinish}
                onCancel={handleCancel}>
                <Form
                    name="validate_other"
                    form={form}
                    {...formItemLayout}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="store_ids"
                        label="store"
                        rules={[{ required: true, message: 'Please select store!' }]}>
                        <Checkbox.Group>
                            <Row gutter={[0, 0]} style={{ width: "342px" }}>
                                {getKesGroup('storeData').map((item: {
                                    id: number,
                                    name: string,
                                    ip: string,
                                }) => {
                                    return (
                                        <Col key={`${item.id}checkbox`} span={8}>
                                            <Checkbox key={`${item.id}checkbox`} value={item.id} style={{ lineHeight: '32px' }} disabled={alreadyStoreId[item.id]}>
                                                {item.name}
                                            </Checkbox>
                                        </Col>
                                    )
                                })}
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                </Form>
                
                <Checkbox checked={isDefaultStores} onChange={(e) => {
                    if(e.target.checked){
                        Modal.confirm({
                            title: 'Confirm',
                            icon: <ExclamationCircleOutlined />,
                            content: 'If you tick, you will directly select these contents next time',
                            okText: 'OK',
                            cancelText: 'Cancel',
                            onOk: () => {
                                if(!form.getFieldValue('store_ids')?.length){
                                    message.warning('No setting item')
                                    setIsDefaultStores(false)
                                } else {
                                    localStorage.setItem('defaultStore', JSON.stringify(form.getFieldValue('store_ids')))
                                    setIsDefaultStores(true)
                                }
                                
                            }
                          });
                    } else {
                        localStorage.removeItem('defaultStore')
                        setIsDefaultStores(false)
                    }
                }}>Remember my choice</Checkbox>
            </Modal>
        </>
    )
}

const ParagraphText = (props: { content: string, width: number }) => {
    const [ellipsis] = React.useState(true);
    const { content, width } = props
    return (
        <Text
            style={ellipsis ? { width: width, display: "inline" } : undefined}
            ellipsis={ellipsis ? { tooltip: content } : false}
        >
            {content}
        </Text>
    )
}


export const columns = (api: apiItem,refresh?: () => void, isAuth?: boolean | undefined): ProColumns<any>[] => {
    const {updateApi, listingApi, deleteApi} = api
    return [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            align: 'center'
        },
        {
            title: 'Product',
            dataIndex: 'id',
            search: false,
            width: 450,
            sorter: true,
            render: (_, record: any) => {
                const getAuth = (status: number) => {
                    switch(status){
                        case -1:
                            return 'none'
                        case 1:
                            return <Tag color="#87d068">Authorized</Tag>
                        case 0:
                            return <ParagraphText content={'Either Not Authorized / Need User Info / Call to Order'} width={330} />
                    }
                }
                const getCountryImg = (countryName: string) => {
                    switch(countryName){
                        case 'UK':
                            return <img width='20' src={'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=1640819749,3704395080&fm=58&app=83&f=JPG?w=200&h=132&s=7097A97266B303A3091E6AEC0300A006'} style={{verticalAlign: 'inherit'}} />
                        case 'US':
                            return <img width='20' src={'https://dss2.baidu.com/6ONYsjip0QIZ8tyhnq/it/u=806796136,1072976903&fm=58&app=83&f=JPEG?w=200&h=132&s=7063B1546F9C31EBB6AD4FDD03001006'} style={{verticalAlign: 'inherit'}} />
                    }
                }
                const countryName = getKesValue('countryData', record.country_id).country
                return (
                    <>
                        <Space direction="vertical">
                            <Text type="secondary">ID:
                            <a target="_blank" rel="noreferrer" href={`${getTargetHref(record.vendor_id)}${record.vendor_sku}`}>{record.vendor_sku}</a>{record.notes && <Info content={record.notes} />}</Text>
                            {record.asin && (<Text type="secondary"><span><AmazonOutlined />Asin</span>:<a target="_Blank" href={`${getAsonHref(record.country_id)}${record.asin}`}>{record.asin}</a></Text>)}
                            {record.newegg_id && (<Text type="secondary"><span>Newegg</span>:<a target="_Blank" href={`${getNewEggHref(record.newegg_id)}`}>{record.newegg_id}</a></Text>)}
                            <Text type="secondary">Country: <Text>{getCountryImg(countryName)}{countryName}</Text></Text>
                            {isAuth && (<Text type="secondary">Is auth: <Text>{getAuth(record.is_auth)}</Text></Text>)}
                            {record.dimweight && (<Text type="secondary">dimweight: <Text>{record.dimweight}</Text></Text>)}
                            <Text type="secondary">Tag Name: <ParagraphText content={getKesValue('tagsData', record.tag_id).tag_name} width={340} /></Text>
                            <Text type="secondary">Description: <ParagraphText content={record.title} width={340} /></Text>
                        </Space>
                    </>
                )
            }
        },
        {
            title: 'Match',
            dataIndex: 'match',
            search: false,
            width: 200,
            render: (_, record: any) => {
                const getStatusTag = (status: number) => {
                    switch(status){
                        case -1:
                            return  'none'
                        case 0:
                            return 'not match'
                        case 1:
                            return (<span style={{color: '#87d068'}}>match</span>)
                    }
                }
                return (<>
                 <Space direction="vertical">
                            <Text type="secondary">Amazon match:<Text> {getStatusTag(record.match_amazon)}</Text></Text>
                            <Text type="secondary">Ebay match:{getStatusTag(record.match_ebay)}</Text>
                            <Text type="secondary"> Newegg match:{getStatusTag(record.match_newegg)}</Text>
                            <Text type="secondary">Walmart match:{getStatusTag(record.match_walmart)}</Text>
                        </Space>
                </>)
            }
        },
        {
            title: 'title',
            dataIndex: 'title',
            hideInTable: true
        },
        {
            title: "Amazon match",
            dataIndex: 'match_amazon',
            onFilter: true,
            hideInTable: true,
            align: 'center',
            valueEnum: {
                "-1": { text: 'none', status: 'Default' },
                "0": { text: 'not match', status: 'Processing' },
                "1": { text: 'match', status: 'Success' },
            },
        },
        {
            title: "Ebay match",
            dataIndex: 'match_ebay',
            onFilter: true,
            hideInTable: true,
            align: 'center',
            valueEnum: {
                "-1": { text: 'none', status: 'Default' },
                "0": { text: 'not match', status: 'Processing' },
                "1": { text: 'match', status: 'Success' },
            },
        },
        {
            title: "Newegg match",
            dataIndex: 'match_newegg',
            onFilter: true,
            hideInTable: true,
            align: 'center',
            valueEnum: {
                "-1": { text: 'none', status: 'Default' },
                "0": { text: 'not match', status: 'Processing' },
                "1": { text: 'match', status: 'Success' },
            },
        },
        {
            title: "Walmart match",
            dataIndex: 'match_walmart',
            onFilter: true,
            hideInTable: true,
            align: 'center',
            valueEnum: {
                "-1": { text: 'none', status: 'Default' },
                "0": { text: 'not match', status: 'Processing' },
                "1": { text: 'match', status: 'Success' },
            },
        },
        {
            title: "Is auth",
            dataIndex: 'is_auth',
            valueType: 'select',
            align: 'center',
            search: isAuth ? true : false,
            hideInTable: true,
            request: async () => [
                {
                    label: 'none',
                    value: -1,
                },
                {
                    label: 'Authorized',
                    value: 1,
                },
                {
                    label: <ParagraphText content={'Either Not Authorized / Need User Info / Call to Order'} width={80} />,
                    value: 0,
                },
            ]
        },
        {
            title: "is_set_asin",
            dataIndex: 'is_set_asin',
            valueType: 'select',
            hideInTable: true,
            request: async () => [
                {
                    label: 'non-existent',
                    value: 0,
                },
                {
                    label: 'existent',
                    value: 1,
                },
            ]
        },
        {
            title: "is_set_newegg_id",
            dataIndex: 'is_set_newegg_id',
            valueType: 'select',
            hideInTable: true,
            request: async () => [
                {
                    label: 'non-existent',
                    value: 0,
                },
                {
                    label: 'existent',
                    value: 1,
                },
            ]
        },
        {
            title: 'time',
            dataIndex: 'time',
            search: false,
            width: 230,
            render: (_, record: any) => {
                return (
                    <>
                        <Space direction="vertical">
                            <Text type="secondary">update_at:
                            {record.update_at? (<a onClick={() => {
                                history.push(`/log/OperationLog?batch_id=${record.batch_id}`)
                            }}>{(record.update_at && moment(parseInt(record.update_at + '000')).format("YYYY-MM-DD HH:mm:ss")) || 'not yet'}</a>) : 'not yet'}    
                            </Text>
                            <Text type="secondary">add_time:<Text>{(record.add_time && moment(parseInt(record.add_time + '000')).format("YYYY-MM-DD HH:mm:ss")) || 'not yet'} </Text></Text>
                            <Text type="secondary">price_and_quantity_change_time:<Text>{(record.price_and_quantity_change_time && moment(parseInt(record.price_and_quantity_change_time + '000')).format("YYYY-MM-DD HH:mm:ss")) || 'not yet'} </Text></Text>
                        </Space>
                    </>
                )
            }
        },
        {
            title: "Tag Name",
            dataIndex: 'tag_id',
            valueType: 'select',
            hideInTable: true,
            request: async () => {
                return [...getKesGroup('tagsData').map((item:tags) => {
                    return {
                        label: (<>
                            <ParagraphText content={item.tag_name} width={150} />
                        </>),
                        value: item.id,
                    }
                })]
            }
        },
        {
            title: "Store(S)",
            dataIndex: 'listing_stores',
            search: false,
            width: 200,
            align: 'center',
            render: (stores: any) => {
                const getStoreStatus = (key: number): string => {
                    switch (key) {
                        case 1:
                            return 'pendingListing'
                        case 2:
                            return 'Listed'
                        case 3:
                            return 'Unlisted'
    
                    }
                    return ""
                }
                return (
                    <>
                        <Space direction="vertical">
                            {[stores?.map((item: any) => {
                                return `${getKesValue('storeData',item.store_id).name}(${getStoreStatus(item.listing_status)})`
                            })].toString() || "-"}
                        </Space>
                    </>
                )
            }
        },
        {
            title: 'walmart',
            dataIndex: 'upc',
            width: 200,
        },
        {
            title: 'vendor_sku',
            dataIndex: 'vendor_sku',
            hideInTable: true
        },
        {
            title: 'listing_filter',
            dataIndex: 'listing_filter',
            hideInTable: true,
            valueType: 'select',
            request: async () => [
                {
                    label: 'listed',
                    value: 'listed',
                },
                {
                    label: 'unlisted',
                    value: 'unlisted',
                },
                {
                    label: 'pending_listing',
                    value: 'pending_listing',
                },
            ]
        },
        {
            title: "Deleted state",
            dataIndex: 'is_delete',
            valueType: 'select',
            width: 150,
            hideInTable: true,
            valueEnum: {
                0: { text: 'Not deleted', status: 'Success' },
                1: { text: 'deleted', status: 'Error' },
              },
        },
        {
            title: 'action',
            valueType: 'option',
            fixed: 'right',
            width: 150,
            align: 'center',
            render: (text, record: any, _, action) => {
                return (
                    <>
                        <ButtonGroup key="allBtn" record={record} refresh={refresh} api={{listingApi, updateApi,deleteApi}} isAuth={isAuth} />
                    </>
                )
            }
        },
    ];
}