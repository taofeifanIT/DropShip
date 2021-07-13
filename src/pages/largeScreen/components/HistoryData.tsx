import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import { Line } from '@ant-design/charts';
import { storeRanking } from '../../../services/dashboard';

const DemoLine: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [obj, setobj] = useState<{
    totalData: any[];
    salaryData: any[];
  }>({ totalData: [], salaryData: [] });
  useEffect(() => {
    init();
    setInterval(() => {
      init();
    }, 1000 * 60 * 5);
  }, []);
  const init = () => {
    setLoading(true);
    storeRanking()
      .then((res) => {
        let tempTotalData: any = [];
        let tempSalaryData: any = [];
        res.data.stores.forEach(
          (item: { name: string; total_order_duration: any; total_sales_duration: any }) => {
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
        setobj({ totalData: tempTotalData, salaryData: tempSalaryData });
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const config = {
    data: obj.totalData,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    style: { height: '30vh' },
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
  const salaryConfig = {
    data: obj.salaryData,
    xField: 'year',
    yField: 'gdp',
    seriesField: 'name',
    xAxis: { type: 'time' },
    style: { height: '30vh' },
    yAxis: {
      label: {
        formatter: function formatter(v: string) {
          return ''.concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
      // min: 0,
      // max: 1000
    },
  };
  return (
    <>
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab={<span style={{ color: '#fff' }}>Store order quantity</span>} key="1">
            <Line {...config} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span style={{ color: '#fff' }}>Store sales</span>} key="2">
            <Line {...salaryConfig} />
          </Tabs.TabPane>
        </Tabs>
      </Spin>
    </>
  );
};

export default DemoLine;
