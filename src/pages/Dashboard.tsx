import React, { useEffect, useState } from 'react'
import { Row, Col, Card, Typography, Statistic, Input, List, Spin, Tabs, DatePicker } from 'antd';
import { Rose, Line, Column } from '@ant-design/charts';
import ProTable from '@ant-design/pro-table';
import { matchAndListing, total, storeRanking, saleRanking, tagRanking, marketplaceRanking } from '../services/dashboard'
import moment from 'moment';
import { MoneyCollectOutlined,ShopOutlined, ShoppingCartOutlined,TagOutlined  } from '@ant-design/icons';


const { Text } = Typography;
const cardBodyStyle = { padding: 0 }


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
const DemoColumn: React.FC = () => {
    const [loading, setLoading] = useState<boolean | undefined>(false)
    const [data, setData] = useState([])
    const init = (time: string) => {
        setLoading(true)
        matchAndListing({ after_at: time }).then(res => {
            const tempData: any = []
            res.data.adminusers.forEach((item: {
                username: string;
                period_listing_count: number;
                period_not_match_count: number;
                period_match_count: number;
                add_time: number;
            }) => {
                tempData.push({
                    name: 'listing count',
                    time: item.username,
                    number: item.period_listing_count
                })
                tempData.push({
                    name: 'not match count',
                    time: item.username,
                    number: item.period_not_match_count
                })
                tempData.push({
                    name: 'match count',
                    time: item.username,
                    number: item.period_match_count
                })
            })
            setData(tempData)
        }).finally(() => {
            setLoading(false)
        })
    }
    var config = {
        data: data,
        isGroup: true,
        xField: 'time',
        yField: 'number',
        style: { height: '35vh' },
        seriesField: 'name',
        label: {
            position: 'middle',
            layout: [
                { type: 'interval-adjust-position' },
                { type: 'interval-hide-overlap' },
                { type: 'adjust-color' },
            ],
        },
    };
    useEffect(() => {
        init(moment('1980-12-12').format('X'))
    }, [])
    return (<>
        <Spin spinning={loading}>
            <DatePicker style={{position: 'absolute', top: '-11px', right: '0',zIndex: 100}} onChange={(e: any) => {
                let dateStr: string = e.startOf('day').format('x').slice(0,10)
                init(dateStr)
            }} />
            <Column {...config} />
        </Spin>
    </>);
};


const TagMatchData = () => {
      const ProcessMap = (val: number) => {
        const type = {
            close: 'normal',
            running: 'active',
            online: 'success',
            error: 'exception',
        }
        if(val >= 100){
            return type.online
        }
        if(val>=50 && val <100){
            return type.running
        }
        if(val < 50 && val > 0){
            return type.error
        }
        if(val <= 0){
            return type.close
        }
      };
      
    const columns: any = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
            align: 'center'
        },
        {
            title: "ID",
            dataIndex: 'id',
            width: 48,
        },
        {
            title: "Tag name",
            dataIndex: 'tag_name',
            valueType: 'select',
            width: 400,
            render: (text: string) => {
                return <ParagraphText content={text} width={380} />
            }
        },
        {
            title: "Total sales",
            dataIndex: 'total_sales',
            width: 150,
            sorter: true,
        },
        {
            title: "Total order",
            dataIndex: 'total_order',
            width: 150,
            sorter: true,
        },
        {
            title: "Total listing",
            dataIndex: 'total_listing',
            width: 150,
            sorter: true,
        },
        {
            title: 'Match Rate',
            dataIndex: 'matchRate',
            with: 300,
            valueType: (item:{
                matchRate: number;
            }) => ({
                type: 'progress',
                status: ProcessMap(item.matchRate),
              }),
          },
        {
            title: "add_time",
            dataIndex: 'add_time',
            render: (text: number) => {
                return moment(parseInt(text + '000')).format('YYYY-MM-DD HH:mm:ss')
            }
        }
    ]
    return (
        <ProTable
            size="small"
            columns={columns}
            request={async (
                params = {},
                sort
                ) =>
                new Promise((resolve) => {
                    let sortParams:{
                        sort_by?: string;
                        sort_field?: string;
                    } = {}
                    if(sort){
                        for (let key in sort) {
                            sortParams.sort_by = sort[key] === 'descend' ? 'desc' : 'asc'
                            sortParams.sort_field = key
                        }
                    }
                    let tempParams: any = {
                        ...params,
                        ...sortParams,
                        page: params.current,
                        limit: params.pageSize
                    }
                    
                    tagRanking(tempParams).then(res => {
                        let tempTags = res.data.tags.map((item: any) => {
                            return{
                                ...item,
                                matchRate: Math.ceil((item.total_match / item.total_product) * 100)
                            }
                        })
                        resolve({
                            data: tempTags,
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
            search={false}
            form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return {
                            ...values,
                            created_at: [values.startTime, values.endTime],
                        };
                    }
                    return values;
                },
            }}
            pagination={{
                pageSize: 10,
            }}
            options={{
                search: false,
            }}
            scroll={{ y: 180 }}
            dateFormatter="string"
            headerTitle={<><Input.Search placeholder='please enter your tag' enterButton></Input.Search></>}
            toolBarRender={() => [
            ]}
        />
    )
}

const DemoLine: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [obj, setobj] = useState<{
        totalData: any[];
        salaryData: any[];
    }>({totalData:[], salaryData: []})
  useEffect(() => {
    init()
  }, []);
  const init = () => {
    setLoading(true)
    storeRanking().then(res => { 
        let tempTotalData: any = []
        let tempSalaryData: any = []
        res.data.stores.forEach((item: {
            name: string;
            total_order: any;
            total_sales: any;
        }) => {
            for(let totalObj in item.total_order){
                tempTotalData.push({
                        category: item.name,
                        value: item.total_order[totalObj],
                        year: totalObj
                })
            }
            for(let salaryObj in item.total_sales){
                tempSalaryData.push({
                    category: item.name,
                    value: item.total_sales[salaryObj],
                    year: salaryObj
                })
            }
        })
        setobj({totalData: tempTotalData, salaryData: tempSalaryData})
    }).finally(() => {
        setLoading(false)
    })
  }
  var config = {
    data: obj.totalData,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: { type: 'time' },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
  };
  var salaryConfig = {
    data: obj.salaryData,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: { type: 'time'},
    style: {height: '200px'},
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
        // min: 0,
        // max: 1000
    },
  };
    return (<>
    <Spin spinning={loading}>
    <Tabs defaultActiveKey="1" >
      <Tabs.TabPane tab="Store order quantity" key="1" style={{ height: 200 }}>
      <Line {...config} />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Store sales" key="2">
      <Line {...salaryConfig} />
      </Tabs.TabPane>
    </Tabs>
    </Spin>
        </>);
};


const DemoRose: React.FC = () => {
    const [data,setData] = useState([])
    const [loading, setLoading] = useState(false)
    const init = () => {
        setLoading(true)
        marketplaceRanking().then(res => {
            let tempData: any = []
            for(let market in res.data){
                tempData.push({
                    type: market,
                    value: res.data[market]
                })
            }
            setData(tempData)
        }).finally(() => {
            setLoading(false)
        })
    }
    var config = {
        data: data,
        xField: 'type',
        yField: 'value',
        seriesField: 'type',
        radius: 0.9,
        style:{height: '35vh'},
        label: { offset: -15 },
    };
    useEffect(() => {
        init()
    }, [])
    // Product volume of each market
    return (<>
        <h4>Product volume of each market</h4>
        <Spin spinning={loading}>
            <Rose {...config} />
        </Spin>
    </>);
};

const RankingList = () => {
    const [data ,setData] = useState<{
        ts_sku: string;
        Title: string;
        total: string;
    }[]>([])
    const [loading, setLoading] = useState(false)
    const init = () => {
        setLoading(true)
        saleRanking().then(res => {
            setData(res.data.ts_sku_ranking)
        }).finally(() => {
            setLoading(false)
        })
    }
    const orderStyle:React.CSSProperties= {
        backgroundColor: '#314659',
        color: '#fff',
        borderRadius: '20px',
        width: '20px',
        height: '20px',
        display: 'inline-block',
        textAlign: 'center',
        marginRight: '10px'
    }
    const witchNoeStyle:React.CSSProperties = {
        borderRadius: '20px',
        width: '20px',
        height: '20px',
        display: 'inline-block',
        textAlign: 'center',
        marginRight: '10px'
    }
    useEffect(() => {
        init()
    }, [])
    return (<>
        <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            dataSource={data}
            size="small"
            style={{ overflow: 'auto', height: '262px' }}
            header={<span style={{ fontWeight: 500 }}>Ranking list</span>}
            renderItem={(item, index) => (
                <List.Item
                    actions={[<Text type='secondary' key={item.ts_sku}>{item.total}</Text>]}
                >
                   <div>
                   {index < 3 ? (<div style={orderStyle}>{index + 1}</div>) : (<div style={witchNoeStyle}>{index + 1}</div>)}
                    <ParagraphText content={item.Title} width={190} />
                   </div>
                </List.Item>
            )}
        />
    </>)
}
export default () => {
    const [totalObj, setTotalObj] = useState<{
        order_total: number;
        order_total_sales: number;
        total_store: number;
        total_tag: number;
        total_vendor: number;
    }>({ order_total: 0, order_total_sales: 0, total_store: 0, total_tag: 0, total_vendor: 0 })
    const [totalLoading, setTotalLoading] = useState(false)
    const GetCard = (props: {
        one_level_title: string;
        one_level_number: number | string;
        color: string;
        info?: boolean | number;
        fontColor?: string;
        BigIcon?: any;
    }) => {
        const { one_level_title, one_level_number, color, info, fontColor, BigIcon } = props
        const style = { height: '142px', padding: '20px 24px 8px', boxShadow: '#c3bcbc 1px 0px 10px' };
        const valueStyle = { fontSize: "2.8rem",fontWeight: '500' }
        return (<>
            <Card style={{ ...style }} bodyStyle={cardBodyStyle} hoverable>
                <div style={{ width: '50%',height: '100px', display: 'inline-block', verticalAlign: 'top', paddingTop: '0px'}}>
                    <BigIcon style={{fontSize: '5vw', color: color}} />
                </div>
                <div style={{ width: '50%',height: '100px', display: 'inline-block', paddingLeft: '4vw' }}>
                    <Statistic title={<span style={{ color: fontColor}}>{one_level_title}</span>} value={one_level_number} valueStyle={{ ...valueStyle, color: fontColor }} />
                    {info && <span style={{ color: fontColor, float: 'right',width: '130px'}}>Total sales: {info}</span>}
                </div>
            </Card>
        </>)
    }
    const getTotal = () => {
        setTotalLoading(true)
        total().then(res => {
            setTotalObj(res.data)
        }).finally(() => {
            setTotalLoading(false)
        })
    }
    useEffect(() => {
        getTotal()
    }, [])
    return (
        <div style={{minWidth: '1472px'}}>
            <Row gutter={16}>
                <Col className="gutter-row" span={6}>
                    <Spin spinning={totalLoading}>
                        <GetCard one_level_title={'Total orders'} one_level_number={totalObj.order_total} color='#f4516c' info={totalObj.order_total_sales} BigIcon={MoneyCollectOutlined} />
                    </Spin>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Spin spinning={totalLoading}>
                        <GetCard one_level_title={'Total stores'} one_level_number={totalObj.total_store} color='#36a3f7' BigIcon={ShopOutlined} />
                    </Spin>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Spin spinning={totalLoading}>
                        <GetCard one_level_title={'Total suppliers'} one_level_number={totalObj.total_vendor} color='#34bfa3'  BigIcon={ShoppingCartOutlined} />
                    </Spin>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Spin spinning={totalLoading}>
                        <GetCard one_level_title={'Total tag'} one_level_number={totalObj.total_tag} color='#657798' BigIcon={TagOutlined} />
                    </Spin>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col className="gutter-row" span={24}>
                    <Card bodyStyle={{paddingTop: '10px'}}>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={18}>
                                <div>
                                    <DemoLine />
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div style={{ height: '27vh' }}>
                                    <RankingList />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col className="gutter-row" span={24}>
                    <Card>
                        <Row gutter={16}>
                            <Col className="gutter-row" span={16}>
                                <div style={{ height: '35vh' }}>
                                    <DemoColumn></DemoColumn>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={8}>
                                <div style={{ height: '35vh' }}>
                                    <DemoRose />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "10px" }}>
                <Col className="gutter-row" span={24}>
                    <TagMatchData />
                </Col>
            </Row>
        </div>
    )
}