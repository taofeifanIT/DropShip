import { Row, Col, Card, Spin, Tabs, Table, Typography,Select,Radio} from 'antd';
import ProTable from '@ant-design/pro-table';
import { Line, Pie,G2 } from '@ant-design/charts';
import {
  total,
  orderItem,
  store_ranking,
  vendor_ranking,
  tag_ranking,
} from '@/services/dashboard';
import React, { useState, useEffect, useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { getKesGroup,getKesValue } from '@/utils/utils';
import { ShopOutlined, TagOutlined, SkinOutlined,RiseOutlined, FallOutlined } from '@ant-design/icons';
import { vendors,tags } from '@/services/publicKeys';
import type { ProColumns } from '@ant-design/pro-table';
// import Dos from '@/components/Dos'

const { Text } = Typography;
import moment from 'moment';
// const { Option } = Select;

const riseOutlinedStyle: React.CSSProperties = {
  fontSize: '26px',
  position: 'absolute',
  bottom: '8px',
  right: '9px',
  color: 'red',
  transform: 'rotate(-20deg)'
}

const fallOutlineddStyle: React.CSSProperties = {
  fontSize: '26px',
  position: 'absolute',
  bottom: '8px',
  right: '9px',
  color: 'green',
  transform: 'rotate(10deg)'
}

type Total = {
  compare_lastweek_order: number;
  compare_lastmonth_order: number;
  compare_lastyear_order: number;
  compare_lastweek_return: number;
  compare_lastmonth_return: number;
  compare_lastyear_return: number;
  compare_lastweek_sales: number;
  compare_lastmonth_sales: number;
  compare_lastyear_sales: number;
  order_total: number;
  order_total_month: number;
  order_total_week: number;
  order_total_sales: number;
  order_total_sales_today: number;
  total_order_sales_week: number;
  total_order_sales_month: number;
  total_order_sales_year: number;
  order_total_today: number;
  return_total: number;
  return_total_today: number;
  order_total_year: number;
  return_total_month: number;
  return_total_week:  number;
  return_total_year: number;
  lineData: any[];
  maxValue: number;
  status_data: any[];
}

type showValueTyle = {
  title: string;
  value: number;
  compared: number;
}

const { TabPane } = Tabs;

const HeadCard = (props: 
      {
          all: number; 
          day: number;
          week: number;
          month: number;
          year: number; 
          rate: number;
          monthRate: number;
          yearRate: number;
          title: string;
      }
  ) => {
  const {all,day,week,month,year,rate,monthRate,yearRate,title} = props
  const [tab, setTab] = useState<string>('Day')
  const [showValue, setShowValue]= useState<showValueTyle>({
    value: day,
    title: 'Day sales',
    compared: rate
  })
  const getShowValue = (type = tab):showValueTyle =>  {
    var value = 0
    var showTitle = ""
    var thanValue = 0
    switch(type){
      case 'Day':
        value = day
        showTitle = 'Day '
        thanValue = rate
      break;
        case 'Week':
        value = week
        showTitle = 'Week '
        thanValue = rate
        break;
      case 'Month':
        value = month
        showTitle = 'Monthly '
        thanValue = monthRate
        break;
      case 'Year':
        value = year
        showTitle = 'Annual '
        thanValue = yearRate
        break;
      default:
        value = day
        showTitle = 'Day '
        thanValue = rate
    }
    return {
      value: value,
      title: showTitle + title,
      compared: thanValue
    }
  }
  const handleChange = (value: any) => {
    setTab(value.target.value)
  }
  useEffect(() => {
    setShowValue(getShowValue(tab))
  }, [tab,day,month,year])
  return (
    <>
      <Card
        style={{ margin: '8px' }}
        size='small'
        bodyStyle={{ paddingTop: '20px', paddingBottom: '0px' }}
        title={<>
          <Radio.Group value={tab} size='small' onChange={handleChange}>
              <Radio.Button value="Day">Day</Radio.Button>
              <Radio.Button value="Week">Week</Radio.Button>
              <Radio.Button value="Month">Month</Radio.Button>
              <Radio.Button value="Year">Year</Radio.Button>
          </Radio.Group>
        </>}
      >
        <p style={{ textAlign: 'center' }}>
          Total {title}：<span style={{ fontWeight: 'bold', fontSize: '1.3vw' }}>{all}</span>
        </p>
        <p style={{ textAlign: 'center' }}>
          {showValue.title}：<span style={{ fontWeight: 'bold', fontSize: '1.3vw' }}>{showValue.value}</span>
        </p>
        <p style={{ textAlign: 'right', fontSize: '12px', paddingRight: '20px' }}>
          Compared with last {tab === "Day" ? 'week' : tab} {Math.round(showValue.compared * 100)}%
          {Math.round(showValue.compared * 100) > 100 ? ( <RiseOutlined style={riseOutlinedStyle}/>) : (<FallOutlined style={fallOutlineddStyle} />)}
        </p>
      </Card>
    </>
  );
}

export default () => {
  const [loading, setLoading] = useState(false);
  const [topObj, setTopObj] = useState<Total>({
    compare_lastweek_order: 0,
    compare_lastweek_return: 0,
    compare_lastweek_sales: 0,
    compare_lastmonth_order: 0,
    compare_lastmonth_return: 0,
    compare_lastmonth_sales: 0,
    compare_lastyear_order: 0,
    compare_lastyear_return: 0,
    compare_lastyear_sales: 0,
    order_total: 0,
    order_total_month: 0,
    order_total_week: 0,
    order_total_year:0,
    order_total_sales: 0,
    order_total_sales_today: 0,
    total_order_sales_week: 0,
    total_order_sales_month: 0,
    total_order_sales_year: 0,
    order_total_today: 0,
    return_total: 0,
    return_total_today: 0,
    return_total_month: 0,
    return_total_week: 0,
    return_total_year: 0,
    lineData: [],
    maxValue:0,
    status_data: [],
  });


  const init = () => {
    setLoading(true);
    total()
      .then((res) => {
        let data = { ...res.data };
        data.lineData = [
          ...res.data.sales_data.map((item: { add_date: string; sales: string }) => {
            return {
              name: 'sales volume',
              gdp: parseFloat(item.sales),
              year: item.add_date,
            };
          }),
          ...res.data.gross_profit_data.map((item: { add_date: string; gross_profit: string }) => {
            return {
              name: 'Net profit',
              gdp: parseFloat(item.gross_profit),
              year: item.add_date,
            };
          }),
        ];
       var maxValue = Math.max.apply(Math,data.lineData.map((item:any) => { return item.gdp }))
       data.maxValue = maxValue
        setTopObj(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    init();
    setInterval(() => {
      init();
    }, 1000 * 60 * 5);
  }, []);
  return (
    <div style={{ background: '#fff', padding: '8px' }} id="salsePage">
      <Spin spinning={loading}>
        <Row>
          <Col span={16}>
            <Row>
              <Col span={8}>
                <HeadCard
                    all={topObj.order_total} 
                    day={topObj.order_total_today} 
                    week={topObj.order_total_week}
                    month={topObj.order_total_month}
                    year={topObj.order_total_year}
                    rate={topObj.compare_lastweek_order} 
                    monthRate={topObj.compare_lastmonth_order}
                    yearRate={topObj.compare_lastyear_order}
                    title={'order'} />
              </Col>
              <Col span={8}>
                <HeadCard 
                    all={topObj.order_total_sales} 
                    day={topObj.order_total_sales_today} 
                    week={topObj.total_order_sales_week}
                    month={topObj.total_order_sales_month}
                    year={topObj.total_order_sales_year}
                    rate={topObj.compare_lastweek_sales} 
                    monthRate={topObj.compare_lastmonth_sales}
                    yearRate={topObj.compare_lastyear_sales}
                    title={'sales'} />
              </Col>
              <Col span={8}>
                <HeadCard 
                    all={topObj.return_total} 
                    day={topObj.return_total_today} 
                    week={topObj.return_total_week}
                    month={topObj.return_total_month}
                    year={topObj.return_total_year}
                    rate={topObj.compare_lastweek_return} 
                    monthRate={topObj.compare_lastmonth_return}
                    yearRate={topObj.compare_lastyear_return}
                    title={'return orders'} />
              </Col>
            </Row>
            <Row style={{height: '100%'}}>
              <Col span={24} style={{ padding: '8px' }}>
                <Card title="dimagram" size="small" style={{height: '61%',zIndex: 10}}>
                  <DemoLine data={topObj.lineData} maxValue={topObj.maxValue} />
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <DemoRose data={topObj.status_data} />
          </Col>
        </Row>
        <Row>
          <Col span={14}>
            <OrderTable />
          </Col>
          <Col span={10}>
            <Card title={null} bodyStyle={{ paddingTop: '10px' }} style={{ margin: '8px' }}>
              <PopSales />
            </Card>
          </Col>
        </Row>
      </Spin>
      {/* <Dos /> */}
    </div>
  );
};



const PopSales = () => {
  const [dataObj, setDataObj] = useState<{
    storeData: any[];
    vendorData: any[];
    tagData: any[];
  }>({
    storeData: [],
    vendorData: [],
    tagData: [],
  });
  const [loading, setLoading] = useState(false);
  const publicCol = [
    {
      title: 'Total order/Day order',
      dataIndex: 'allAndDay',
      key: 'allAndDay',
      width: 170,
      render: (_, record: any) => {
        return (
          <>
            {record.total_order} / {record.total_order_today}
          </>
        );
      },
    },
    {
      title: 'Total sales/Day sales',
      dataIndex: 'allAndsales',
      key: 'allAndsales',
      width: 170,
      render: (_, record: any) => {
        return (
          <>
            {record.total_sales} / {record.total_sales_today}
          </>
        );
      },
    },
    {
      title: 'Total net profit/Day net profit',
      dataIndex: 'allAndnetprofit',
      key: 'allAndnetprofit',
      width: 300,
      render: (_, record: any) => {
        return (
          <>
            {record.total_gross_profit} / {record.total_gross_profit_today}
          </>
        );
      },
    },
  ];
  const StoreColumns = [
    {
      title: 'store Name',
      dataIndex: 'name',
      key: 'name',
      width: 150
    },
    ...publicCol,
  ];
  const tagColumns = [
    {
      title: 'Tag name',
      dataIndex: 'tag_name',
      key: 'name',
      width: 150,
      render: (text: string) => {
        return (
          <Text style={{ width: '10vw' }} ellipsis title={text}>
            {text}
          </Text>
        );
      },
    },
    ...publicCol,
  ];
  const vendorColumns = [
    {
      title: 'vendor Name',
      dataIndex: 'vendor_name',
      key: 'vendor_name',
      width: 150
    },
    ...publicCol,
  ];
  const setPopData = (key: string, resKey: string, api: any, page?: number) => {
    let pop = { ...dataObj };
    setLoading(true);
    api({
      page: page || undefined,
      limit: 10,
    })
      .then((res: any) => {
        pop[key] = res.data[resKey];
        setDataObj(pop);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    setPopData('vendorData', 'vendors', vendor_ranking);
  }, []);
  return (
    <>
      <Tabs
        defaultActiveKey="2"
        style={{height: '590px'}}
        onTabClick={(key) => {
          let api: any = store_ranking;
          let popKey = 'storeData';
          let reskey = 'stores';
          switch (key) {
            case '1':
              api = store_ranking;
              popKey = 'storeData';
              reskey = 'stores';
              break;
            case '2':
              api = vendor_ranking;
              popKey = 'vendorData';
              reskey = 'vendors';
              break;
            case '3':
              api = tag_ranking;
              popKey = 'tagData';
              reskey = 'tags';
              break;
          }
          setPopData(popKey, reskey, api, 1);
        }}
      >
        <TabPane
          tab={
            <span>
              <SkinOutlined />
              vendor
            </span>
          }
          key="2"
        >
          <Table
            size="small"
            scroll={{ y: 590 }}
            columns={vendorColumns}
            loading={loading}
            dataSource={dataObj.vendorData}
            onChange={(page: any) => {
              setPopData('vendorData', 'vendors', vendor_ranking, page.current);
            }}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShopOutlined />
              store
            </span>
          }
          key="1"
        >
          <Table
            size="small"
            scroll={{ y: 590 }}
            columns={StoreColumns}
            loading={loading}
            dataSource={dataObj.storeData}
          />
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
          <Table
            size="small"
            scroll={{ y: 590 }}
            columns={tagColumns}
            loading={loading}
            dataSource={dataObj.tagData}
            pagination={{
              pageSize: 10,
            }}
            onChange={(page: any) => {
              setPopData('tagData', 'tags', tag_ranking, page.current);
            }}
          />
        </TabPane>
      </Tabs>
    </>
  );
};

const OrderTable = () => {
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: 'orderId',
      dataIndex: 'marketplace_order_id',
      width: 160
    },
    {
      title: 'Tag name',
      dataIndex: 'tag_id',
      valueType: 'select',
      width: 260,
      render: (_, record) => {
        const tagTitle = getKesValue('tagsData', record.tag_id)?.tag_name;
        return (<Text style={{ width: '260px' }} title={tagTitle} ellipsis>
        {tagTitle}
      </Text>)
      },
      renderFormItem: (_, { type, defaultRender, formItemProps, fieldProps}, form) => {
        if (type === 'form') {
          return null;
        }
        const status = form.getFieldValue('state');
        if (status !== 'open') {
          return (
            // value 和 onchange 会通过 form 自动注入。
            <Select
            {...fieldProps}
              showSearch
              style={{ width: '530px' }}
              placeholder="Select a tag"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {getKesGroup('tagsData').map((item: tags) => {
            return <Select.Option key={`op${item.id}`} value={item.id}>{item.tag_name}</Select.Option>;
          })}
            </Select>
          );
        }
        return defaultRender(_);
      }
    },
    {
      title: 'amount',
      dataIndex: 'amount',
      key: 'amount',
      valueType: 'money',
      width: 80,
      search: false,
    },
    {
      title: 'vendor',
      dataIndex: 'vendor_id',
      valueType: 'select',
      width: 100,
      request: async () => {
        return [
          ...getKesGroup('vendorData').map((item: vendors) => {
            return {
              label: item.vendor_name,
              value: item.id,
              key: item.id
            };
          }),
        ];
      },
    },
    {
      title: 'marketPlace',
      dataIndex: 'marketplace_id',
      valueType: 'select',
      width: 100,
      request: async () => {
        return [
          ...getKesGroup('marketPlaceData').map((item: any) => {
            return {
              label: item.marketplace,
              value: item.id,
              key: item.id,
            };
          }),
        ];
      },
    },
    {
      title: 'time',
      dataIndex: 'order_time',
      key: 'order_time',
      search: false,
      width: 160,
      render: (_, record: any) => {
        return (
          (record.add_time &&
            moment(parseInt(record.order_time + '000')).format('YYYY-MM-DD HH:mm:ss')) ||
          'not yet'
        );
      },
    },
    {
      title: 'status',
      dataIndex: 'status',
      search: false,
      key: 'status',
    },
    {
      title: 'title',
      dataIndex: 'title',
      search: false,
      key: 'title',
      width: 500,
      render: (text: any) => {
        return (<Text style={{ width: '500px' }} title={text} ellipsis>
        {text}
      </Text>)
      },
    },
  ];
  return (
    <>
      <ProTable
        size="small"
        style={{height: '100%'}}
        columns={columns}
        actionRef={actionRef}
        request={async (params = {}) =>
        new Promise((resolve) => {
          let tempParams = {
            ...params,
            // ...sortParams,
            page: params.current,
            limit: params.pageSize,
          };
          orderItem(tempParams).then(
            (res: {
              data: {
                list: any[];
                total: number;
              };
              code: number;
            }) => {
              resolve({
                data: res.data.list,
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: !!res.code,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: res.data.total,
              });
            },
          );
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
        scroll={{ x: 800 }}
        options={{
          search: false,
        }}
        dateFormatter="string"
        headerTitle="All Order"
      />
    </>
  );
};

const DemoRose = (props: { data: any[] }) => {
  const { data } = props;
  var weeks = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
  var currentWeek = weeks[moment().day()]
  const [currentTime, setCurrentTime] = useState(moment().format('YYYY-MM-DD HH:mm:ss') + ' ' + currentWeek)
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
  const refreshTime = setInterval(() => {
    if(document.getElementById("salsePage") === null){
      clearInterval(refreshTime); return;
    } else {
      setCurrentTime(moment().format('YYYY-MM-DD HH:mm:ss')+ ' ' + currentWeek)
    }
  }, 1000)
  return (<Card
            title="order status diagram" 
            size="small"
            style={{ margin: '8px',height: '100%'}} 
            extra={currentTime}>
              <Pie {...config} />
          </Card>);
};

const DemoLine = (props: { data: any[],maxValue: number }) => {
  const { data,maxValue } = props;
  G2.registerShape('point', 'breath-point', {
    draw: function draw(cfg, container) {
      var data = cfg.data;
      var point = {
        x: cfg.x,
        y: cfg.y,
      };
      var group = container.addGroup();
      if (data.gdp === maxValue) {
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
  var config = {
    data: data || [],
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return v;
        },
      },
    },
    legend: { position: 'top' },
    smooth: true,
    style: {
      width: '100%',
      height: '226px',
    },
    // slider: {
    //   start: 0,
    //   end: 1,
    // },
    tooltip: { showMarkers: false },
    point: { shape: 'breath-point' },
  };
  return <Line {...config} />;
};

