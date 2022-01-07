import { Column } from '@ant-design/charts';
import {useState} from 'react';
import { log_vendor_quantity_and_price_change } from '@/services/distributors/ingramMicro';
import {Button,Modal,message,Spin} from 'antd';
import {BarChartOutlined} from '@ant-design/icons';
const HistoryChat = (props: { vendor_id: string; vendor_sku: string; style: any }) => {
    const { vendor_id, vendor_sku, style } = props;
    const [historyVisible, setHistoryVisible] = useState(false);
    const [historyConfirmLoading, setHistoryConfirmLoading] = useState(false);
    const [historyDataLoading, setHistoryDataLoading] = useState(false);
    const [historyData, setHistoryData] = useState({
      log_vendor_price_change: [],
      log_vendor_quantity_change: [],
    });
    const handleOpenView = () => {
      setHistoryVisible(true);
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      getHistoryData();
    };
    const handleOpenViewCancel = () => {
      setHistoryVisible(false);
    };
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const DemoColumn = (props: {
      data: { log_vendor_price_change: any[]; log_vendor_quantity_change: any[] };
    }) => {
      const config:any = {
        data: props.data.log_vendor_price_change,
        isGroup: true,
        xField: 'time',
        yField: 'price',
        seriesField: 'name',
        style: { height: '250px' },
        titile: 'price history',
        label: {
          position: 'middle',
          layout: [
            { type: 'interval-adjust-position' },
            { type: 'interval-hide-overlap' },
            { type: 'adjust-color' },
          ],
        },
      };
      const quantityConfig:any = {
        data: props.data.log_vendor_quantity_change,
        isGroup: true,
        style: { height: '250px' },
        xField: 'time',
        yField: 'price',
        seriesField: 'name',
        titile: 'quantiy history',
        label: {
          position: 'middle',
          layout: [
            { type: 'interval-adjust-position' },
            { type: 'interval-hide-overlap' },
            { type: 'adjust-color' },
          ],
        },
      };
      return (
        <>
          <h3>Price history data</h3>
          <Column {...config} />
          <h3>quantity history data</h3>
          <Column {...quantityConfig} />
        </>
      );
    };
  
  
    
    const getHistoryData = () => {
      const params: any = {
        id: vendor_id,
        vendor_sku,
      };
      setHistoryDataLoading(true);
      log_vendor_quantity_and_price_change(params)
        .then((res) => {
          if (res.code) {
            const priceHistoryData: any = [];
            const quantityHistoryData: any = [];
            res.data.log_vendor_price_change.forEach(
              (item: { add_datetime: string; after: string; before: string }) => {
                priceHistoryData.push({
                  name: 'before',
                  time: item.add_datetime,
                  price: parseFloat(item.before),
                });
                priceHistoryData.push({
                  name: 'after',
                  time: item.add_datetime,
                  price: parseFloat(item.after),
                });
              },
            );
            res.data.log_vendor_quantity_change.forEach(
              (item: { add_datetime: string; after: string; before: string }) => {
                quantityHistoryData.push({
                  name: 'before',
                  time: item.add_datetime,
                  price: parseFloat(item.before),
                });
                quantityHistoryData.push({
                  name: 'after',
                  time: item.add_datetime,
                  price: parseFloat(item.after),
                });
              },
            );
            setHistoryData({
              log_vendor_price_change: priceHistoryData,
              log_vendor_quantity_change: quantityHistoryData,
            });
          } else {
            throw res.msg;
          }
        })
        .catch((e: string) => {
          message.error(e);
        })
        .finally(() => {
          setHistoryConfirmLoading(false);
          setHistoryDataLoading(false);
        });
    };
    return (
      <>
        <Button
          icon={<BarChartOutlined />}
          size="small"
          style={{ ...style }}
          onClick={() => {
            handleOpenView();
          }}
        >
          history data
        </Button>
        <Modal
          title="price and quantity history data"
          width={800}
          bodyStyle={{ height: '600px' }}
          confirmLoading={historyConfirmLoading}
          visible={historyVisible}
          onOk={handleOpenViewCancel}
          onCancel={handleOpenViewCancel}
        >
          <Spin spinning={historyDataLoading}>
            <DemoColumn data={historyData} />
          </Spin>
        </Modal>
      </>
    );
  };

  



  export default HistoryChat