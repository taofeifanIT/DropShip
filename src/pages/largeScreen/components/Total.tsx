import { Row, Col, Statistic, Spin } from 'antd';
import { total } from '@/services/dashboard';
import { Pie, measureTextWidth } from '@ant-design/charts';
import { useState, useEffect } from 'react';
import { getKesValue } from '@/utils/utils';
import WorldMap from './Map';

type PieItem = Array<{ type: string; value: number }>;

const DemoPie = (props: { data: PieItem }) => {
  const { data } = props;
  function renderStatistic(containerWidth: any, text: any, style: any) {
    const { width: textWidth, height: textHeight } = measureTextWidth(text, style);
    const R = containerWidth / 2; // r^2 = (w / 2)^2 + (h - offsetY)^2

    let scale = 1;

    if (containerWidth < textWidth) {
      scale = Math.min(
        Math.sqrt(
          Math.abs(Math.pow(R, 2) / (Math.pow(textWidth / 2, 2) + Math.pow(textHeight, 2))),
        ),
        1,
      );
    }

    const textStyleStr = `width:${containerWidth}px;`;
    return `<div style="${textStyleStr};font-size:8px;line-height:${
      scale < 1 ? 1 : 'inherit'
    };">${text}</div>`;
  }
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.64,
    style: {
      with: 200,
      height: 130,
      paddingRight: 12,
    },
    meta: {
      value: {
        formatter: (v: any) => `${v} ¥`,
      },
    },
    label: {
      type: 'inner',
      offset: '-50%',
      style: {
        textAlign: 'center',
      },
      autoRotate: false,
      content: '{value}',
    },
    statistic: {
      title: {
        offsetY: -4,
        customHtml: (container: any, view: any, datum: any) => {
          const { width, height } = container.getBoundingClientRect();
          const d = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
          const text = datum ? datum.type : 'total';
          return renderStatistic(d, text, {
            fontSize: '5px',
            color: '#9fa8b3',
          });
        },
      },
      content: {
        offsetY: 4,
        style: {
          fontSize: '18px',
          textAlign: 'center',
          color: 'white',
        },
        customHtml: (container: any, view: any, datum: any, data: any) => {
          const { width } = container.getBoundingClientRect();
          const text = datum
            ? `${datum.value}`
            : `${data.reduce((r: any, d: any) => r + d.value, 0)}`;
          return renderStatistic(width, text, {
            fontSize: 12,
          });
        },
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
      {
        type: 'pie-statistic-active',
      },
    ],
  };
  return <Pie {...config} />;
};

type TotalItem = {
  order_total: number;
  order_total_sales: number;
  total_store: number;
  total_listing: number;
  total_vendor: number;
  total_listing_today: number;
  order_total_sales_today: number;
  total_listing_active: number;
  total_listing_active_market: {
    marketplace_id: number;
    num: number;
  }[];
  marketplace_data: PieItem; // 前端自己生成的属性
};

const Tatal = () => {
  const [totalObj, setTotalObj] = useState<TotalItem>({
    order_total: 0,
    order_total_sales: 0,
    total_store: 0,
    total_listing: 0,
    total_vendor: 0,
    total_listing_today: 0,
    order_total_sales_today: 0,
    total_listing_active: 0,
    total_listing_active_market: [],
    marketplace_data: [],
  });
  const [loading, setLoading] = useState(false);
  const GetCard = (props: {
    one_level_title?: string;
    one_level_number?: number | string;
    color?: string;
    info?: boolean | string;
    fontColor?: string;
    child?: any;
  }) => {
    const { one_level_title, one_level_number, info, fontColor, child } = props;
    const style: any = {
      height: '130px',
      padding: !child ? '20px 24px 8px' : '8 10px 8px',
      margin: '10px',
      boxSizing: 'border-box',
      boxShadow: '#c3bcbc 1px 0px 10px',
    };
    const valueStyle = { fontSize: '3rem' };
    return (
      <>
        <div style={{ ...style }}>
          <div style={{ textAlign: 'center' }}>
            {child && child}
            {one_level_title ? (
              <Statistic
                groupSeparator={''}
                title={<span style={{ color: fontColor }}>{one_level_title}</span>}
                value={(one_level_number as number).toFixed(0)}
                valueStyle={{ ...valueStyle, color: fontColor }}
              />
            ) : null}
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
        let tempData: TotalItem = res.data;
        setTotalObj({
          ...tempData,
          marketplace_data: tempData.total_listing_active_market.map((item) => {
            return {
              type: getKesValue('marketPlaceData', item.marketplace_id).marketplace,
              value: item.num,
            };
          }),
        });
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
                  one_level_number={totalObj.total_listing}
                  one_level_title={'Total listing'}
                  color={'red'}
                  fontColor={'white'}
                  info={`Total listing today:${totalObj.total_listing_today}`}
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
              <GetCard child={<DemoPie data={totalObj.marketplace_data} />} />
            </Col>
          </Row>
        </Spin>
      </div>
    </>
  );
};

export default Tatal;
