import { Row, Col, Card, Spin, Tabs, Table,Typography } from 'antd';
import ProTable from '@ant-design/pro-table';
import { Line, Pie } from '@ant-design/charts';
import { total, orderItem, store_ranking, vendor_ranking, tag_ranking } from '../../services/dashboard'
import { useState, useEffect, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { getKesGroup } from '../../utils/utils'
import { ShopOutlined, TagOutlined, SkinOutlined } from '@ant-design/icons';
import { vendors } from '../../services/publicKeys'
import type { ProColumns } from '@ant-design/pro-table';
const {Text} = Typography
import moment from 'moment'
const { TabPane } = Tabs;
export default () => {
    const [loading, setLoading] = useState(false)
    const [topObj, setTopObj] = useState<{
        compare_lastweek_order: number;
        compare_lastweek_return: number;
        compare_lastweek_sales: number;
        order_total: number;
        order_total_sales: number;
        order_total_sales_today: number;
        order_total_today: number;
        return_total: number;
        return_total_today: number;
        lineData: any[];
        status_data: any[];
    }>({
        compare_lastweek_order: 0,
        compare_lastweek_return: 0,
        compare_lastweek_sales: 0,
        order_total: 0,
        order_total_sales: 0,
        order_total_sales_today: 0,
        order_total_today: 0,
        return_total: 0,
        return_total_today: 0,
        lineData: [],
        status_data: []
    })
    const headCard = (all: number, day: number, rate: number, title: string) => (<>
        <Card style={{ margin: '8px' }} bodyStyle={{ paddingTop: '20px', paddingBottom: '0px' }} title={null}>
            <p style={{ textAlign: 'center' }}>Total {title}：<span style={{ fontWeight: 'bold', fontSize: '1.3vw' }}>{all}</span></p>
            <p style={{ textAlign: 'center' }}>Day {title}：<span style={{ fontWeight: 'bold', fontSize: '1.3vw' }}>{day}</span></p>
            <p style={{ textAlign: 'right', fontSize: '12px' }}>Compared with last week {Math.round(rate * 100)}%</p>
        </Card>
    </>)
    const init = () => {
        setLoading(true)
        total().then(res => {
            let data = { ...res.data }
            data.lineData = [...res.data.sales_data.map((item: {
                add_date: string;
                sales: string;
            }) => {
                return {
                    name: 'sales volume',
                    gdp: parseFloat(item.sales),
                    year: item.add_date
                }
            }), ...res.data.gross_profit_data.map((item: {
                add_date: string;
                gross_profit: string;
            }) => {
                return {
                    name: 'Net profit',
                    gdp: parseFloat(item.gross_profit),
                    year: item.add_date
                }
            })]
            setTopObj(data)
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        init()
        setInterval(() => {
            init()
          }, 1000 * 60 * 5)
    }, [])
    return <div style={{ background: '#fff', padding: '8px' }}>
        <Spin spinning={loading}>
            <Row>
                <Col span={16}>
                    <Row>
                        <Col span={8}>
                            {headCard(topObj.order_total, topObj.order_total_today, topObj.compare_lastweek_order, 'order')}
                        </Col>
                        <Col span={8}>
                            {headCard(topObj.order_total_sales, topObj.order_total_sales_today, topObj.compare_lastweek_sales, 'sales')}
                        </Col>
                        <Col span={8}>
                            {headCard(topObj.return_total, topObj.return_total_today, topObj.compare_lastweek_return, 'return orders')}
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ padding: '8px' }}>
                            <Card title='dimagram' size='small'>
                                <DemoLine data={topObj.lineData} />
                            </Card>
                        </Col>
                    </Row>
                </Col>
                <Col span={8}>
                    <Card title='order status diagram' size='small' style={{ margin: '8px' }}>
                        <DemoRose data={topObj.status_data} />
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    <OrderTable />
                </Col>
                <Col span={13}>
                    <Card title={null} bodyStyle={{ paddingTop: '10px' }} style={{margin: '8px'}}>
                        <PopSales />
                    </Card>
                </Col>
            </Row>
        </Spin>
    </div>
}

const PopSales = () => {
    const [dataObj, setDataObj] = useState<{
        storeData: any[],
        vendorData: any[],
        tagData: any[]
    }>({
        storeData: [],
        vendorData: [],
        tagData: []
    })
    const [loading, setLoading] = useState(false)
    const publicCol = [
        
        {
            title: 'Total order/Day order',
            dataIndex: 'allAndDay',
            key: 'allAndDay',
            render: (_, record: any) => {
                return <>{record.total_order} / {record.total_order_today}</>
            }
        },
        {
            title: 'Total sales/Day sales',
            dataIndex: 'allAndsales',
            key: 'allAndsales',
            render: (_, record: any) => {
                return <>{record.total_sales} / {record.total_sales_today}</>
            }
        },
        {
            title: 'Total net profit/Day net profit',
            dataIndex: 'allAndnetprofit',
            key: 'allAndnetprofit',
            render: (_, record: any) => {
                return <>{record.total_gross_profit} / {record.total_gross_profit_today}</>
            }
        }
    ]
    const StoreColumns = [
        {
            title: 'store Name',
            dataIndex: 'name',
            key: 'name'
        },
       ...publicCol
    ]
    const tagColumns = [
        {
            title: 'Tag name',
            dataIndex: 'tag_name',
            key: 'name',
            render: (text: string) => {
                return <Text style={{width: '10vw'}} ellipsis title={text}>{text}</Text>
            }
        },
        ...publicCol
    ]
    const vendorColumns = [
        {
            title: 'vendor Name',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
        },
        ...publicCol
    ]
    const setPopData = (key: string, resKey: string, api: any, page?: number) => {
        let pop = {...dataObj}
        setLoading(true)
        api({
            page: page || undefined,
            limit: 10
        }).then((res: any) => {
            pop[key] = res.data[resKey]
            setDataObj(pop)
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        setPopData('storeData', 'stores', store_ranking)
    }, [])
    return (<>
        <Tabs defaultActiveKey="1" onTabClick={(key) => {
            let api: any = store_ranking
            let popKey = 'storeData'
            let reskey = 'stores' 
            switch(key){
                case '1':
                    api = store_ranking
                    popKey = 'storeData'
                    reskey = 'stores' 
                break;
                case '2':
                    api = vendor_ranking
                    popKey = 'vendorData'
                    reskey = 'vendors' 
                break;
                case '3':
                    api = tag_ranking
                    popKey = 'tagData'
                    reskey = 'tags' 
                break;
            }
             setPopData(popKey, reskey, api, 1)
        }}>
            <TabPane
                tab={
                    <span>
                        <ShopOutlined />
                        store
                    </span>
                }
                key="1"
            >
                <Table size='small' columns={StoreColumns} loading={loading} dataSource={dataObj.storeData} />
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <SkinOutlined />
                        vendor
                    </span>
                }
                key="2"
            >
               <Table size='small'  columns={vendorColumns} loading={loading} dataSource={dataObj.vendorData} onChange={(page: any) => {
                  setPopData('vendorData', 'vendors', vendor_ranking, page.current)
               }}/>
            </TabPane>
            <TabPane
                tab={
                    <span>
                        <TagOutlined />
                        tag
                    </span>
                }
                key="3"
            >
               <Table size='small' scroll={{ y: 210 }}  columns={tagColumns} loading={loading} dataSource={dataObj.tagData} onChange={(page: any) => {
                  setPopData('tagData', 'tags', tag_ranking, page.current)
               }} />
            </TabPane>
        </Tabs>
    </>)
}

const OrderTable = () => {
    const actionRef = useRef<ActionType>();
    const columns: ProColumns<any>[]  = [{
        title: 'orderId',
        dataIndex: 'marketplace_order_id',
    }, {
        title: 'amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 80,
        search: false
    }, {
        title: "vendor",
        dataIndex: 'vendor_id',
        valueType: 'select',
        request: async () => {
            return [...getKesGroup('vendorData').map((item: vendors) => {
                return {
                    label: item.vendor_name,
                    value: item.id,
                }
            })]
        }
    }, {
        title: "marketPlace",
        dataIndex: 'marketplace_id',
        valueType: 'select',
        width: 100,
        request: async () => {
            return [...getKesGroup('marketPlaceData').map((item: any) => {
                return {
                    label: item.marketplace,
                    value: item.id,
                }
            })]
        }
    }, {
        title: 'time',
        dataIndex: 'order_time',
        key: 'order_time',
        search: false,
        render: (_, record: any) => {
            return (record.add_time && moment(parseInt(record.order_time + '000')).format('YYYY-MM-DD HH:mm:ss')) || 'not yet'
        }
    }, {
        title: 'status',
        dataIndex: 'status',
        search: false,
        key: 'status',
    },]
    return (<>
        <ProTable
            size="small"
            bordered
            columns={columns}
            actionRef={actionRef}
            request={async (
                params = {},
            ) =>
                new Promise((resolve) => {
                    let tempParams = {
                        ...params,
                        // ...sortParams,
                        page: params.current,
                        limit: params.pageSize
                    }
                    orderItem(tempParams).then((res: {
                        data: {
                            list: any[];
                            total: number
                        },
                        code: number,
                    }) => {
                        resolve({
                            data: res.data.list,
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
                type: 'multiple',
            }}
            rowKey="id"
            search={{
                labelWidth: 'auto',
                filterType: 'light',
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
                pageSize: 10,
            }}
            scroll={{ y: 210 }}
            dateFormatter="string"
            headerTitle={'All orders'}
        />
    </>)
}

const DemoRose = (props: { data: any[] }) => {
    const { data } = props;
    var config = { 
        appendPadding: 10,
        data: data,
        angleField: 'total',
        colorField: 'status',
        radius: 0.8,
        label: {
            type: 'outer',
            content: '{name} {percentage}',
        },
        legend: { position: 'bottom' },
        interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
    };
    return <Pie {...config} />;
};
const DemoLine = (props: { data: any[] }) => {
    const { data } = props;
    var config = {
        data: data || [],
        xField: 'year',
        yField: 'gdp',
        seriesField: 'name',
        yAxis: {
            label: {
                formatter: function formatter(v) {
                    return v
                },
            },
        },
        legend: { position: 'top' },
        smooth: true,
        style: {
            width: '100%',
            height: '226px'
        },
        animation: {
            appear: {
                animation: 'path-in',
                duration: 8000,
            },
        },
    };
    return <Line {...config} />;
};