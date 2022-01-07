import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Column } from '@ant-design/charts';
import { matchAndListing } from '../../../services/dashboard';
import moment from 'moment';
const DemoColumn: React.FC = () => {
  const [loading, setLoading] = useState<boolean | undefined>(false);
  const [data, setData] = useState([]);

  const init = () => {
    setLoading(true);
    const time = moment('1980-12-12').format('X');
    matchAndListing({ after_at: time })
      .then((res) => {
        const tempData: any = [];
        res.data.adminusers.forEach(
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
  var config = {
    data: data,
    isGroup: true,
    xField: 'time',
    yField: 'number',
    style: { height: '36vh', width: '22vw' },
    seriesField: 'name',
    slider: {
      start: 0,
      end: 1,
    },
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
    init();
  }, []);
  return (
    <>
      <Spin spinning={loading}>
        <Column {...config} />
      </Spin>
    </>
  );
};

export default DemoColumn;
