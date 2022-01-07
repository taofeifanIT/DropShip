import React, { useState, useEffect } from 'react';
import { Line } from '@ant-design/charts';
import { Spin, Tabs } from 'antd';
import { buyboxHistory } from '../../../services/dashboard';

type listType = { value: string; add_date: string; add_time: string,value_type: number }

const DemoLine: React.FC = () => {
  const [data, setData] = useState<listType[]>([]);
  const [loading, setLoading] = useState(false);
  const init = () => {
    setLoading(true);
    buyboxHistory()
      .then((res) => {
        let tempTotalData : listType[] = res.data.buybox_history.map((item: listType) => {
          return {
            ...item,
            value: parseInt(item.value)
          }
        })
        setData(tempTotalData);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    init();
  }, []);
  var config = {
    data: data,
    padding: 'auto',
    xField: 'add_date',
    yField: 'value',
    // seriesField: 'value_type',
    xAxis: { tickCount: 5 },
    style: { height: '34.5vh' },
    smooth: true,
    legend: false,
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return ''.concat(v + '%').replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return ''.concat(s, ',');
          });
        },
      },
    },
    color: '#FAA219',
  };
  return ( <Spin spinning={loading}>
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab={<span style={{ color: '#fff' }}>Historical bugbox data</span>} key="1">
        <Line {...config} />
      </Tabs.TabPane>
    </Tabs>
  </Spin>);
};

export default DemoLine;