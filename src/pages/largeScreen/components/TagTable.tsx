import styles from '../style.less';
import { tagRanking } from '../../../services/dashboard';
import { Spin } from 'antd';
import { useState, useEffect } from 'react';
import ParagraphText from '@/components/ParagraphText'
import moment from 'moment';



const TagData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = () => {
    setLoading(true);
    tagRanking({ page: 0, limit: 1000 })
      .then((res) => {
        let tempTags = res.data.tags.map((item: any) => {
          return {
            ...item,
            matchRate: Math.ceil((item.total_match / item.total_product) * 100) + '%',
          };
        });
        setData(tempTags);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      {/* <div className={styles.tagTitle}>Tag Info</div> */}
      <Spin spinning={loading}>
        <div style={{ overflow: 'auto', height: '396px' }}>
          <table width="100%">
            <thead>
              <tr className={styles.ocd}>
                <th style={{ width: '60px', textAlign: 'center' }}>ID</th>
                <th>Tag name</th>
                <th style={{width: 80}}>Total sales</th>
                {/* <th>Total order</th> */}
                <th style={{width: 92}}>Total listing</th>
                <th style={{width: 92}}>Match Rate</th>
                {/* <th>Add time</th> */}
              </tr>
            </thead>
            <tbody>
              {data.map((item: any, index) => {
                return (
                  <tr className={index % 2 === 0 ? styles.odd : styles.ocd}>
                    <th style={{ width: '60px', textAlign: 'center' }}>{index + 1}</th>
                    <th>
                      <ParagraphText content={item.tag_name} width={160} style={{color: '#fff'}} />
                    </th>
                    <th>{item.total_sales}</th>
                    {/* <th>{item.total_order}</th> */}
                    <th>{item.total_listing}</th>
                    <th>{item.matchRate}</th>
                    {/* <th>{moment(parseInt(item.add_time + '000')).format('YYYY-MM-DD HH:mm:ss')}</th> */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Spin>
    </>
  );
};

export default TagData;
