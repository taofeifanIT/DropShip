import React, { useEffect, useState } from 'react'
import {Spin, Tabs } from 'antd';
import { Line } from '@ant-design/charts';
import { storeRanking } from '../../../services/dashboard'
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
    style: {height: '30vh'},
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
    style: {height: '30vh'},
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
      <Tabs.TabPane tab={<span style={{color: '#fff'}}>Store order quantity</span>} key="1">
      <Line {...config} />
      </Tabs.TabPane>
      <Tabs.TabPane tab={<span style={{color: '#fff'}}>Store sales</span>} key="2">
      <Line {...salaryConfig} />
      </Tabs.TabPane>
    </Tabs>
    </Spin>
        </>);
};

export default DemoLine