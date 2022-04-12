import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Input, List, Spin, Tabs, DatePicker, Select,Badge } from 'antd';
import { Rose, Line, Column,G2,Pie } from '@ant-design/charts';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
import {
  matchAndListing,
  NewMarketplaceRanking,
  total,
  storeRanking,
  saleRanking,
  tagRanking,
  mqDataStatus
} from '../../services/dashboard';
import moment from 'moment';
import {
  MoneyCollectOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { getKesGroup } from '@/utils/utils';
const { RangePicker } = DatePicker;

const { Text } = Typography;


const DemoColumn: React.FC = () => {
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [data, setData] = useState([]);
  const [params, setParams] = useState<{
    afterTime: number;
    beforeTime: number;
    tagId?: number;
  }>({ afterTime: moment('1980-12-12').unix(), beforeTime: moment().unix() });
  const init = (afterTime: number, beforeTime: number, tagId?: number) => {
    setLoading(true);
    matchAndListing({ after_at: afterTime, before_at: beforeTime, tag_id: tagId || undefined })
      .then((res) => {
        const tempData: any = [];
        res.data.adminusers?.forEach(
          (item: {
            username: string;
            period_listing_count: number;
            period_not_match_count: number;
            period_match_count: number;
            add_time: number;
          }) => {
            tempData.push({
              name: 'listing count',
              time: item.username,
              number: item.period_listing_count,
            });
            tempData.push({
              name: 'not match count',
              time: item.username,
              number: item.period_not_match_count,
            });
            tempData.push({
              name: 'match count',
              time: item.username,
              number: item.period_match_count,
            });
          },
        );
        setData(tempData);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  var config: any = {
    data: data,
    isGroup: true,
    xField: 'time',
    yField: 'number',
    style: { height: '35vh', marginRigth: '5px' },
    seriesField: 'name',
    label: {
      position: 'middle',
      layout: [
        { type: 'interval-adjust-position' },
        { type: 'interval-hide-overlap' },
        { type: 'adjust-color' },
      ],
    },
    slider: {
      start: 0,
      end: 1,
    },
  };
  useEffect(() => {
    init(params.afterTime, params.beforeTime, params.tagId);
  }, [params]);
  useEffect(() => {
    init(params.afterTime, params.beforeTime);
  }, []);
  return (
    <>
      <Spin spinning={loading}>
        <Select
          showSearch
          style={{ width: 200, position: 'absolute', top: '-11px', right: 420, zIndex: 100 }}
          onChange={(e: number) => {
            setParams({
              ...params,
              tagId: e,
            });
          }}
          placeholder="Selec a tag"
          optionFilterProp="children"
          filterOption={(input, option: any) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {[{ id: undefined, tag_name: 'all' }, ...getKesGroup('tagsData')].map((item: any) => {
            return (
              <Select.Option key={item.id + 'tag'} value={item.id}>
                {item.tag_name}
              </Select.Option>
            );
          })}
        </Select>
        <RangePicker
          showTime
          style={{ position: 'absolute', top: '-11px', right: '0', zIndex: 100 }}
          onChange={(e: any) => {
            if (e) {
              const afterTime = e[0].unix();
              const beforeTime = e[1].unix();
              setParams({
                ...params,
                afterTime: afterTime,
                beforeTime: beforeTime,
              });
            } else {
              setParams({
                ...params,
                afterTime: moment('1980-12-12').unix(),
                beforeTime: moment().unix(),
              });
            }
          }}
        />
        <Column {...config} />
      </Spin>
    </>
  );
};

const TagMatchData = () => {
  const ProcessMap = (val: number) => {
    const type = {
      close: 'normal',
      running: 'active',
      online: 'success',
      error: 'exception',
    };
    if (val >= 100) {
      return type.online;
    }
    if (val >= 50 && val < 100) {
      return type.running;
    }
    if (val < 50 && val > 0) {
      return type.running;
    }
    if (val <= 0) {
      return type.running;
    }
    return  type.running;
  };

  const columns: ProColumns[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: 'ID',
      dataIndex: 'id',
      width: 48,
    },
    {
      title: 'Tag name',
      dataIndex: 'tag_name',
      valueType: 'select',
      width: 400,
      ellipsis: true,
    },
    {
      title: 'Total sales',
      dataIndex: 'total_sales',
      sorter: true,
    },
    {
      title: 'Total order',
      dataIndex: 'total_order',
      sorter: true,
    },
    {
      title: 'Total listing',
      dataIndex: 'total_listing',
      sorter: true,
    },
    {
      title: 'Match Rate',
      dataIndex: 'matchRate',
      width: 200,
      valueType: (item: { matchRate: number }) => ({
        type: 'progress',
        status: ProcessMap(item.matchRate),
      }),
    },
    {
      title: 'add_time',
      dataIndex: 'add_time',
      sorter: true,
      render: (text: number) => {
        return moment(parseInt(text + '000')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];
  return (
    <ProTable
      size="small"
      columns={columns}
      request={async (params = {}, sort) =>
        new Promise((resolve) => {
          let sortParams: {
            sort_by?: string;
            sort_field?: string;
          } = {};
          if (sort) {
            for (let key in sort) {
              sortParams.sort_by = sort[key] === 'descend' ? 'desc' : 'asc';
              sortParams.sort_field = key;
            }
          }
          let tempParams: any = {
            ...params,
            ...sortParams,
            page: params.current,
            limit: params.pageSize,
          };

          tagRanking(tempParams).then((res) => {
            let tempTags = res.data.tags.map((item: any) => {
              return {
                ...item,
                matchRate: Math.ceil((item.total_match / item.total_product) * 100),
              };
            });
            resolve({
              data: tempTags,
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
      headerTitle={
        <>
          <Input.Search placeholder="please enter your tag" enterButton></Input.Search>
        </>
      }
      toolBarRender={() => []}
    />
  );
};

const DemoLine: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [obj, setobj] = useState<{
    totalData: any[];
    salaryData: any[];
    maxValue: number;
    maxTotal: number;
  }>({ totalData: [], salaryData: [],maxValue: 0,maxTotal:0 });
  G2.registerShape('point', 'breath-point', {
    draw: function draw(cfg, container) {
      var data: any = cfg.data;
      var point = {
        x: cfg.x,
        y: cfg.y,
      };
      var group = container.addGroup();
      if (data.gdp === obj.maxValue || data.gdp === obj.maxTotal) {
        var decorator1 = group.addShape('circle', {
          attrs: {
            x: point.x,
            y: point.y,
            r: 10,
            fill: cfg.color,
            opacity: 0.5,
          },
        });
        var decorator2 = group.addShape('circle', {
          attrs: {
            x: point.x,
            y: point.y,
            r: 10,
            fill: cfg.color,
            opacity: 0.5,
          },
        });
        var decorator3 = group.addShape('circle', {
          attrs: {
            x: point.x,
            y: point.y,
            r: 10,
            fill: cfg.color,
            opacity: 0.5,
          },
        });
        decorator1.animate(
          {
            r: 20,
            opacity: 0,
          },
          {
            duration: 1800,
            easing: 'easeLinear',
            repeat: true,
          },
        );
        decorator2.animate(
          {
            r: 20,
            opacity: 0,
          },
          {
            duration: 1800,
            easing: 'easeLinear',
            repeat: true,
            delay: 600,
          },
        );
        decorator3.animate(
          {
            r: 20,
            opacity: 0,
          },
          {
            duration: 1800,
            easing: 'easeLinear',
            repeat: true,
            delay: 1200,
          },
        );
        group.addShape('circle', {
          attrs: {
            x: point.x,
            y: point.y,
            r: 6,
            fill: cfg.color,
            opacity: 0.7,
          },
        });
        group.addShape('circle', {
          attrs: {
            x: point.x,
            y: point.y,
            r: 1.5,
            fill: cfg.color,
          },
        });
      }
      return group;
    },
  });
  useEffect(() => {
    init();
  }, []);
  const init = () => {
    setLoading(true);
    storeRanking()
      .then((res) => {
        let tempTotalData: any = [];
        let tempSalaryData: any = [];
        res.data.stores?.forEach(
          (item: { name: string; total_order_duration: any[]; total_sales_duration: any[] }) => {
            tempTotalData = [
              ...tempTotalData,
              ...item.total_order_duration.map((items: { add_date: string; total: string }) => {
                return {
                  name: item.name,
                  gdp: items.total,
                  year: items.add_date,
                };
              }),
            ];
            tempSalaryData = [
              ...tempSalaryData,
              ...item.total_sales_duration.map((items: { add_date: string; sales: string }) => {
                return {
                  name: item.name,
                  gdp: parseFloat(items.sales),
                  year: items.add_date,
                };
              }),
            ];
          },
        );
        var maxValue = Math.max.apply(Math,tempSalaryData.map(item => { return item.gdp }))
        var maxTotal = Math.max.apply(Math,tempTotalData.map(item => { return item.gdp }))
        setobj({ totalData: tempTotalData, salaryData: tempSalaryData,maxValue: maxValue,maxTotal: maxTotal });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  var config = {
    data: obj.totalData,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
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
    tooltip: { showMarkers: false },
    point: { shape: 'breath-point' },
  };
  var salaryConfig = {
    data: obj.salaryData,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    xAxis: { type: 'time' },
    style: { height: '200px' },
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
    tooltip: { showMarkers: false },
    point: { shape: 'breath-point' },
  };
  return (
    <>
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Store sales" key="1">
            <Line {...salaryConfig} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Store order quantity" key="2" style={{ height: 200 }}>
            <Line {...config} />
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </>
  );
};

const HistoryInventory = (props: {
  data: any
}) => {
  const config: any = {
    data:props.data.data,
    padding: 'auto',
    xField: 'time',
    yField: 'value',
    seriesField: 'category',
    style: {
      height: '260px'
    },
  };

  return <>
  <h3>{props.data.type} inventory historical data</h3>
  <Line {...config} />
  </>;
};

const DemoRose: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [subLine, setSubLine] = useState({type:"",data: []})
  const ref: any = React.useRef()
  const initSubLine = () => {
    if(!data.length){
      return
    }
    setSubLine(data[0])
  }
  const init = () => {
    setLoading(true);
    NewMarketplaceRanking()
      .then((res) => {
        const tempData: any = Object.keys(res.data).map(key => {
          let tempHistoryData: any[] = []
          res.data[key]?.history?.forEach(({online_num,offline_num,total_num,current_date,after_algorithm_price}: any) => {
            let obj = {online_num,offline_num,total_num,average_price:after_algorithm_price}
            Object.keys(obj).forEach(key => {
              tempHistoryData.push({
                time:current_date,
                value: obj[key],
                category: key
              })
            })
          })
          return {
            type: key,
            value: res.data[key].total,
            data: tempHistoryData
          }
        })
        setData(tempData);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const config = {
    data,
    xField: 'type',
    yField: 'value',
    seriesField: 'type',
    radius: 0.9,
    style: { height: '35vh' },
    label: { offset: -15 },
  };
  const onReadyColumn = (plot: any) => {
    plot.on('plot:click', (evt) => {
      const { x, y } = evt;
      const tooltipData = plot.chart.getTooltipItems({ x, y });
      if(!tooltipData[0]){
        return
      }
      setSubLine(tooltipData[0].data)
    });
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    initSubLine();
  }, [data]);
  return (
    <>
      <h4>Active products of each market</h4>
      <Spin spinning={loading}>
        <Rose {...config} onReady={onReadyColumn} ref={ref}  />
        <HistoryInventory data={subLine} />
      </Spin>
    </>
  );
};

const RankingList = () => {
  const [data, setData] = useState<
    {
      ts_sku: string;
      Title: string;
      total: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const init = () => {
    setLoading(true);
    saleRanking()
      .then((res) => {
        setData(res.data?.ts_sku_ranking);
      })
      .finally(() => {
        setLoading(false);
      });
  };
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
  const witchNoeStyle: React.CSSProperties = {
    borderRadius: '20px',
    width: '20px',
    height: '20px',
    display: 'inline-block',
    textAlign: 'center',
    marginRight: '10px',
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <>
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
            actions={[
              <Text type="secondary" key={item.ts_sku}>
                {item.total}
              </Text>,
            ]}
          >
            <div>
              {index < 3 ? (
                <div style={orderStyle}>{index + 1}</div>
              ) : (
                <div style={witchNoeStyle}>{index + 1}</div>
              )}
              <Text style={{ width: '12vw' }} ellipsis>
                {item.Title}
              </Text>
            </div>
          </List.Item>
        )}
      />
    </>
  );
};

const DemoPie = () => {
  const [data, setData] = useState<any>([])
  const [loading,setLoading] = useState(false)
  let initTimer: any =null
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'key',
    radius: 0.8,
    legend: false,
    style: {
      height: 200
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        fill: '#fff',
        fontSize: 18,
        textAlign: 'center',
      },
    },
    pieStyle: ({ key }) => {
      if (key === 'mq_count') {
        return {
          fill: 'p(a)https://gw.alipayobjects.com/zos/antfincdn/FioHMFgIld/pie-wenli1.png',
        };
      }
      return {
        fill: 'p(a)https://gw.alipayobjects.com/zos/antfincdn/Ye2DqRx%2627/pie-wenli2.png',
      };
    },
    interactions: [
      {
        type: 'element-single-selected',
      },
    ],
  };
  const getRate = () => {
    setLoading(true);
    mqDataStatus()
      .then((res) => {
        let tempData = Object.keys(res.data).map(key => {
          return {
            key,
            value: res.data[key]
          }
        })
        setData(tempData);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getRate();
    initTimer = setInterval(() => {
      getRate();
    }, 1000 * 60 * 10);
    return () => {
      clearInterval(initTimer)
    }
  }, []);
  return (<Spin spinning={loading}>
    <Card title='Task queue execution status' size='small' bordered={false} style={{marginTop: '5px'}}>
    <Row>
                      <Col span={14}>
                        <Pie {...config} />
                      </Col>
                      <Col span={10}>
                      <br />
                      <Badge color="#2db7f5" text={`Number of queue tasks ${data[0]?.value}`} />
                      <br />
                      <br />
                      <Badge color="#ff0000" text={`Number of tasks to be performed ${data[1]?.value}`} />
                      <br />
                      <br />
                      </Col>
                  </Row>
                </Card>
  </Spin>);;
};


export default () => {
  const [totalObj, setTotalObj] = useState<{
    order_total: number;
    order_total_sales: number;
    total_store: number;
    total_tag: number;
    total_vendor: number;
    order_total_today: number;
    order_total_sales_today: number;
  }>({
    order_total: 0,
    order_total_sales: 0,
    total_store: 0,
    total_tag: 0,
    total_vendor: 0,
    order_total_today: 0,
    order_total_sales_today: 0,
  });
  const [totalLoading, setTotalLoading] = useState(false);
  const GetCard = (props: {
    one_level_title: string | JSX.Element;
    one_level_number: number | string;
    color: string;
    info?: boolean | number | string;
    fontColor?: string;
    BigIcon?: any;
    bgImg?: string;
  }) => {
    const { one_level_title, one_level_number, info, bgImg } = props;
    const style: React.CSSProperties = {
      height: '142px',
      padding: '20px 20px 8px',
      boxShadow: '#c3bcbc 1px 0px 10px',
      borderRadius: '10px',
    };
    const cardBodyStyle: React.CSSProperties = { padding: 0, backgroundImage: `url(${bgImg})` };
    return (
      <>
        {/* <Card style={{ ...style }} bodyStyle={cardBodyStyle} hoverable>
                <div style={{ width: '50%', height: '100px', display: 'inline-block', verticalAlign: 'inherit', paddingTop: '0px' }}>
                    <BigIcon style={{ fontSize: '4vw', color: color }} />
                </div>
                <div style={{ width: '50%', height: '100px', display: 'inline-block', paddingLeft: '1vw' }}>
                    <Statistic title={<span style={{ color: fontColor }}>{one_level_title}</span>} value={one_level_number} valueStyle={{ ...valueStyle, color: fontColor }} />
                    {info && <span style={{ color: fontColor, width: '105px', position: 'absolute' }}>{info}</span>}
                </div>
            </Card> */}
        <div style={{ ...cardBodyStyle, ...style }}>
          <p
            style={{
              fontSize: '2vw',
              color: 'aliceblue',
              fontFamily: 'fantasy',
              marginBottom: 0,
            }}
          >
            {one_level_title}：{one_level_number}
          </p>
          {info && (
            <p
              style={{
                fontSize: '1.2vw',
                color: 'aliceblue',
                fontFamily: 'fantasy',
              }}
            >
              {info}
            </p>
          )}
        </div>
      </>
    );
  };
  const getTotal = () => {
    setTotalLoading(true);
    total()
      .then((res) => {
        setTotalObj(res.data);
      })
      .finally(() => {
        setTotalLoading(false);
      });
  };
  useEffect(() => {
    getTotal();
  }, []);
  return (
    <div style={{ minWidth: '1472px' }}>
      <Row gutter={24}>
        <Col className="gutter-row" span={5}>
          <Spin spinning={totalLoading}>
            <GetCard
              one_level_title={<span style={{fontSize: '1.5vw'}}>Total orders</span>}
              one_level_number={totalObj.order_total}
              color="#f4516c"
              info={`Day order: ${  totalObj.order_total_today}`}
              BigIcon={MoneyCollectOutlined}
              bgImg="https://d301.paixin.com/thumbs/5000011/78531214/staff_1024.jpg?imageView2/2/w/450/format/webp"
            />
          </Spin>
        </Col>
        <Col className="gutter-row" span={5}>
          <Spin spinning={totalLoading}>
            <GetCard
              one_level_title={<span style={{fontSize: '1.5vw'}}>Total sales</span>}
              one_level_number={totalObj.order_total_sales.toFixed(0)}
              color="#eef082"
              info={`Day sales: ${  totalObj.order_total_sales_today}`}
              BigIcon={DollarOutlined}
              bgImg="https://d302.paixin.com/thumbs/13349494/159688778/staff_1024.jpg?imageView2/2/w/450/format/webp"
            />
          </Spin>
        </Col>
        <Col className="gutter-row" span={5}>
          <Spin spinning={totalLoading}>
            <GetCard
              one_level_title={'Total stores'}
              one_level_number={totalObj.total_store}
              color="#36a3f7"
              BigIcon={ShopOutlined}
              bgImg="https://d301.paixin.com/thumbs/2124221/468176598/staff_1024.jpg?imageView2/2/w/450/format/webp"
            />
          </Spin>
        </Col>
        <Col className="gutter-row" span={5}>
          <Spin spinning={totalLoading}>
            <GetCard
              one_level_title={'Total suppliers'}
              one_level_number={totalObj.total_vendor}
              color="#34bfa3"
              BigIcon={ShoppingCartOutlined}
              bgImg="https://d300.paixin.com/thumbs/3008028/37517325/staff_1024.jpg?imageView2/2/w/450/format/webp"
            />
          </Spin>
        </Col>
        <Col className="gutter-row" span={4}>
          <Spin spinning={totalLoading}>
            <GetCard
              one_level_title={'Total tag'}
              one_level_number={totalObj.total_tag}
              color="#657798"
              BigIcon={TagOutlined}
              bgImg="https://d302.paixin.com/thumbs/13324256/167504798/staff_1024.jpg?imageView2/2/w/450/format/webp"
            />
          </Spin>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col className="gutter-row" span={24}>
          <Card bodyStyle={{ paddingTop: '10px' }}>
            <Row gutter={16}>
              <Col className="gutter-row" span={6}>
              {/* <DemoLiquid /> */}
              <DemoPie />
              </Col>
              <Col className="gutter-row" span={12}>
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
      <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col className="gutter-row" span={24}>
          <Card>
            <Row gutter={16}>
              <Col className="gutter-row" span={16}>
                <div style={{ height: '35vh' }}>
                  <DemoColumn></DemoColumn>
                </div>
                <TagMatchData />
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
      {/* <Row gutter={16} style={{ marginTop: '10px' }}>
        <Col className="gutter-row" span={24}>
          <TagMatchData />
        </Col>
      </Row> */}
    </div>
  );
};
