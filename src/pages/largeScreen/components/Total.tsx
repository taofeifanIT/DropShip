import { Row, Col, Statistic, Spin } from 'antd';
import { total } from '../../../services/dashboard';
import { useState, useEffect } from 'react';
import WorldMap from './Map';
const Tatal = () => {
  const [totalObj, setTotalObj] = useState<{
    order_total: number;
    order_total_sales: number;
    total_store: number;
    total_listing: number;
    total_vendor: number;
    total_listing_today: number;
    order_total_sales_today: number;
    total_listing_active: number;
  }>({
    order_total: 0,
    order_total_sales: 0,
    total_store: 0,
    total_listing: 0,
    total_vendor: 0,
    total_listing_today: 0,
    order_total_sales_today: 0,
    total_listing_active: 0
  });
  const [loading, setLoading] = useState(false);
  const GetCard = (props: {
    one_level_title: string;
    one_level_number: number | string;
    color: string;
    info?: boolean | string;
    fontColor?: string;
  }) => {
    const { one_level_title, one_level_number, info, fontColor } = props;
    const style: any = {
      height: '130px',
      padding: '20px 24px 8px',
      margin: '10px',
      boxSizing: 'border-box',
      boxShadow: '#c3bcbc 1px 0px 10px',
    };
    const valueStyle = { fontSize: '3rem' };
    return (
      <>
        <div style={{ ...style }}>
          <div style={{ textAlign: 'center' }}>
            <Statistic
              title={<span style={{ color: fontColor }}>{one_level_title}</span>}
              value={(one_level_number as number).toFixed(0)}
              valueStyle={{ ...valueStyle, color: fontColor }}
            />
            {info && (
              <span
                style={{
                  color: fontColor,
                  position: 'absolute',
                  bottom: 7,
                  left: '5%',
                  width: '200px',
                }}
              >
                {info}
              </span>
            )}
          </div>
        </div>
      </>
    );
  };
  const getTotal = () => {
    setLoading(true);
    total()
      .then((res) => {
        setTotalObj(res.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getTotal();
    setInterval(() => {
      getTotal();
    }, 1000 * 60 * 5);
  }, []);
  return (
    <>
      <div style={{ height: '150px', width: '100%', position: 'absolute', bottom: '302px' }}>
        <Row>
          <Col span={18}>
            <WorldMap />
          </Col>
          <Col span={6}>
            <Row>
              <Col span={24}>
                <GetCard
                  one_level_number={totalObj.order_total_sales}
                  one_level_title={'Total sales'}
                  color={'red'}
                  fontColor={'white'}
                  info={`Day sales: ${totalObj.order_total_sales_today}`}
                />
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <GetCard
                  one_level_number={totalObj.total_listing_today}
                  one_level_title={'Total listing today'}
                  color={'red'}
                  fontColor={'white'}
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Spin spinning={loading}>
          <Row>
            <Col span={6}>
              <GetCard
                one_level_number={totalObj.order_total}
                one_level_title={'Total orders'}
                color={'red'}
                fontColor={'white'}
              />
            </Col>
            <Col span={6}>
              <GetCard
                one_level_number={totalObj.total_store}
                one_level_title={'Total stores'}
                color={'red'}
                fontColor={'white'}
              />
            </Col>
            <Col span={6}>
              <GetCard
                one_level_number={totalObj.total_vendor}
                one_level_title={'Total suppliers'}
                color={'red'}
                fontColor={'white'}
              />
            </Col>
            <Col span={6}>
              <GetCard
                one_level_number={totalObj.total_listing}
                one_level_title={'Total listing'}
                color={'red'}
                fontColor={'white'}
                info={`total listing active:${totalObj.total_listing_active}`}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </>
  );
};

export default Tatal;
