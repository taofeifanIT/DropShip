import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { Pie } from '@ant-design/charts';
import { marketplaceRanking } from '../../../services/dashboard'
const DemoPie: React.FC = () => {
  const [data, setData] = useState([])
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
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    textStyle: {
      fill: '#fff'
    },
    style: {height: 330, color: '#fff'},
    label: { type: 'outer',fill: '#fff' },
    interactions: [{ type: 'element-active' }],
  };
  useEffect(() =>{
    init()
  }, [])
  return (<>
    <Spin spinning={loading}>
    <Pie {...config} />;
    </Spin>
  </>)
};

export default DemoPie;