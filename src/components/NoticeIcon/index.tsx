import { useEffect, useState } from 'react';
import { message, Tag, Button } from 'antd';
import moment from 'moment';
import { FrownOutlined,SmileFilled } from '@ant-design/icons';
import { useModel, history } from 'umi';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import { getKesValue } from '@/utils/utils';
import { getCancelOrder, updateCancelStatus } from '@/services/order/order';
export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};

let data: any[] = []
const NoticeIconView = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [notices, setNotices] = useState<any[]>([]);
  let listTimes = ""

  const getMarketTag = (marketplace_id: number) => {
    let color = {
      1: 'orange',
      2: 'magenta',
      3: 'lime',
      4: 'cyan',
      5: 'geekblue',
      6: 'red',
      7: 'volcano',
    }
    let marketplace = getKesValue("marketPlaceData", marketplace_id).marketplace
    return <Tag color={color[marketplace_id]}>{marketplace}</Tag>
  }


  const changeReadState = (item: any) => {
    updateCancelStatus({
      id: item.id,
      marketplace_id: item.marketplace_id,
      is_cancel: 2
    }).then(res => {
      if (res.code) {
        setNotices(
          data.map((item) => {
            let notice = { ...item };
            if (notice.id === item.id) {
              notice.read = true;
            }
            return notice;
          }),
        );
      } else {
        throw res.msg
      }
    }).catch(e=>{
      message.error(e)
    })
  };

  const toOrderPage = (marketplaceId: number, orderId: string) => {
    if (marketplaceId === 1) {
      history.push({
        pathname: '/order/AmazonOrder',
        query: {
          AmazonOrderId: orderId
        }
      });
    }
    if (marketplaceId === 2) {
      history.push({
        pathname: '/order/Walmart',
        query: {
          AmazonOrderId: orderId
        }
      });
    }
    if (marketplaceId === 3) {
      history.push({
        pathname: '/order/EbayOrder',
        query: {
          AmazonOrderId: orderId
        }
      });
    }
    if (marketplaceId === 4) {
      history.push({
        pathname: '/order/NewEggOrder',
        query: {
          NeweggItemNumber: orderId
        }
      });
    }
    if (marketplaceId === 5) {
      history.push({
        pathname: '/order/ShopifyOrder',
        query: {
          AmazonOrderId: orderId
        }
      });
    }
    if (marketplaceId === 6) {
      history.push({
        pathname: '/order/Amazon-SP-API',
        query: {
          AmazonOrderId: orderId
        }
      });
    }
  }
  const getNotice = () => {
    getCancelOrder().then(res => {
      if (res.code) {
        data = res.data.map((item: any) => {
          return {
            ...item,
            id: item.id,
            avatar: item.is_cancel === 1 ?<FrownOutlined style={{ color: '#ff5e44' }} /> : <SmileFilled  />,
            title: <>Order <a onClick={() => toOrderPage(item.marketplace_id, item.order_id)}>{item.order_id}</a> has been cancelled <br></br>{getMarketTag(item.marketplace_id)}</>,
            datetime: moment(item.cancel_time * 1000).format('YYYY-MM-DD HH:mm:ss'),
            read: item.is_cancel === 2,
            type: item.marketplace_id,
            extra: <Button size='small' disabled={item.is_cancel === 2} onClick={() => changeReadState(item)}>processed</Button>
          }
        })
        setNotices(data)
        if(data.filter(item => item.is_cancel !==2).length > 0){
          setTimeout(() => {
            getNotice()
          }, 1000 * 10);
        }
      }
    })
  }

  const getOccupancyRate = () => {
    const tempSockek: any = new WebSocket(
      'wss://api-multi.itmars.net:2345?token=' + localStorage.getItem('token'),
    );
    tempSockek.onopen = function (webSocket: any) {
      console.log('WebSocket opened!');
    };
    tempSockek.onmessage = function (msg: any) {
      const pop = JSON.parse(msg.data);
      if (history.location.pathname === '/listed/ListedProducts' && pop.DeliverTime.getAmazonNormalDeliverTime !== listTimes) {
        setInitialState({
          ...initialState,
          listTimes: pop.DeliverTime,
        });
        listTimes = pop.DeliverTime.getAmazonNormalDeliverTime
      }
    };
    tempSockek.onerror = function (error: any) {
      console.log('Error: ' + error.name + error.number);
    };
    tempSockek.onclose = function () {
      console.log('WebSocket closed!');
    };
  };

  const clearReadState = (title: string, key: string) => {
    setNotices([{
      id:'none'
    }]);
    // message.success(`${'cleal'} ${title}`);
  };
  useEffect(() => {
    getNotice();
    getOccupancyRate();
  }, []);
  return (
    <>
      <NoticeIcon
        className={styles.action}
        count={notices.filter(item=> item.is_cancel===1).length}
        onClear={(title: string, key: string) => clearReadState(title, key)}
        loading={false}
        clearText="clear"
        viewMoreText="refresh"
        onViewMore={() => getNotice()}
      >
        {/* @ts-ignore */}
        <NoticeIcon.Tab
          tabKey="notification"
          count={notices.length}
          list={notices}
          title="Order notification"
          emptyText="You've seen all the notifications"
          showViewMore
        />
      </NoticeIcon>
    </>
  );
};

export default NoticeIconView;
