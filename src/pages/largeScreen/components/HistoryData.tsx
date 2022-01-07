import React, { useEffect, useState } from 'react';
import { Spin, Tabs } from 'antd';
import { Line } from '@ant-design/charts';
import { storeRanking } from '../../../services/dashboard';


const DemoLine: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [howDay, setHowDay] = useState(15)
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

  const translateLine = (data: any[], name: string, key: string) => {
    var j = 0
    var a = data
    var day = howDay
    var tempTotalData: any = []
    for (j;j<a.length;j++){
          let sumvalue: number = 0
          let minLimit = j - day < 0 ? 0 : j - day
          for (var i=j; i>minLimit; i--){
              let keyValue = a[i][key]
              if (typeof keyValue !== 'number'){
                keyValue = parseInt(a[i][key])
              }
              sumvalue += keyValue
          }
          let dayValue: number = sumvalue / day
          tempTotalData = [
            ...tempTotalData,
            {
              name: name,
              gdp: parseFloat(dayValue.toFixed(2)),
              year: a[j].add_date
            },
          ];
      }
      return tempTotalData
  }

  const init = () => {
    setLoading(true);
    storeRanking()
      .then((res) => {
        let tempTotalData: any = [];
        let tempSalaryData: any = [];
        res.data.stores.forEach(
          (item: { name: string; total_order_duration: any; total_sales_duration: any }) => {
            tempTotalData = [...tempTotalData,...translateLine(item.total_order_duration, item.name, 'total')]
            tempSalaryData = [...tempSalaryData,...translateLine(item.total_sales_duration, item.name, 'sales')]
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
    style: { height: '34.5vh' },
    xAxis: { type: 'time' },
    smooth: true,
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
    style: { height: '34.5vh' },
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
  useEffect(() => {
    init()
  }, [howDay])
  return (
    <>
      <Spin spinning={loading}>
        <Tabs defaultActiveKey="2" tabBarExtraContent={(
        <select style={{background: '#37447a', color: '#fff'}} defaultValue={howDay} onChange={(val) => {
          setHowDay(parseInt(val.target.value))
        }}>
          <option  value={3}>3</option >
          <option  value={5}>5</option >
          <option  value={7}>7</option >
          <option  value={9}>9</option >
          <option  value={10}>10</option >
          <option  value={15}>15</option >
          <option  value={30}>30</option>
    </select>)}>
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
