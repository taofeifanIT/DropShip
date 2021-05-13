import { useEffect, useState } from 'react';
import { message } from 'antd';
import moment from 'moment';
import { useModel,history } from 'umi';
import NoticeIcon from './NoticeIcon';
import styles from './index.less';
import { cancelOrderTotal } from '../../services/order/order'
export type GlobalHeaderRightProps = {
  fetchingNotices?: boolean;
  onNoticeVisibleChange?: (visible: boolean) => void;
  onNoticeClear?: (tabName?: string) => void;
};


const NoticeIconView = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const [notices, setNotices] = useState<any[]>([])
  const [errorInfo, setError] = useState<any[]>([])
  let tempNoticesInfo: any[] = []
  let tempErrorInfo:any[] = []
  const changeReadState = (id: string) => {
    cancelOrderTotal().then(res => {
      if (res.code) {
        if(id !== 'message'){
          setNotices([])
        } else {
          setError([])
        }
        message.success(`All cleared!`);
      } else {
        throw res.msg
      }
    }).catch(() => {
      message.error(`clear faild!`);
    })
  };
  const setInfos = (pop: any) => {
  // voiceAnnouncements(`You have ${pop.NewOrderTotal} new orders`);
    const noticesObj = [{
      id: moment().format('X'),
      avatar: 'https://i-1-lanrentuku.qqxzb-img.com/2020/10/27/34cb1163-184e-4795-b3f9-60a08e6d8e3f.png?imageView2/2/w/500/',
      title: `You have ${pop.AmazonNewOrderTotal} new orders from Amazon`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'Amazon',
    }, 
    {
      id: moment().format('X'),
      avatar: 'https://i-1-lanrentuku.qqxzb-img.com/2020/10/27/34cb1163-184e-4795-b3f9-60a08e6d8e3f.png?imageView2/2/w/500/',
      title: `You have ${pop.AmazonReturnsTotal} returned orders`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'AmazonReturn',
    },{
      id: moment().format('X'),
      avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3422433930,2354587291&fm=26&gp=0.jpg',
      title: `You have ${pop.EbayNewOrderTotal} new orders from Ebay`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'Ebay',
    }, 
    {
      id: moment().format('X'),
      avatar: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3422433930,2354587291&fm=26&gp=0.jpg',
      title: `You have ${pop.EbayReturnsTotal} returned orders`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'EbayReturn',
    },{
      id: moment().format('X'),
      avatar: 'https://c1.neweggimages.com/WebResource/Themes/Nest/logos/logo_424x210.png',
      title: `You have ${pop.NewEggOrderTotal} new orders`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'NewEgg',
    }, 
    {
      id: moment().format('X'),
      avatar: 'https://c1.neweggimages.com/WebResource/Themes/Nest/logos/logo_424x210.png',
      title: `You have ${pop.NewEggReturnsTotal} returned orders`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'NewEggReturn',
    },{
      id: moment().format('X'),
      avatar: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3373182569,2386066999&fm=26&gp=0.jpg',
      title: `You have ${pop.WalmartNewOrderTotal} new orders`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'Walmart',
    }, 
    {
      id: moment().format('X'),
      avatar: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3373182569,2386066999&fm=26&gp=0.jpg',
      title: `You have ${pop.WalmartReturnsTotal} returned orders`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'WalmartReturn',
    }]
    const errorObj = {
      id: moment().format('X') + 'e',
      title: 'Log Level',
      avatar: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1949023656,1845515095&fm=26&gp=0.jpg',
      description: `ALotAttention：${pop.LogLevel.LogLevelALotAttention} / 
                      Fulfilled：${pop.LogLevel.LogLevelFulfilled} /
                      Info：${pop.LogLevel.LogLevelInfo} /
                      LittleAttention：${pop.LogLevel.LogLevelLittleAttention} /
                      Shipped：${pop.LogLevel.LogLevelShipped} /
                      Urgent：${pop.LogLevel.LogLevelUrgent}`,
      datetime: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'message',
      clickClose: true,
    }
    tempNoticesInfo = noticesObj
    tempErrorInfo = [errorObj]
    setNotices(tempNoticesInfo)
    setError(tempErrorInfo)
  }
//   const voiceAnnouncements = (str: string) => {
//     //百度
//     var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);        // baidu
//     var n = new Audio(url);
//     n.src = url;
//     n.play();
//  }
  const getOccupancyRate = () => {
    const tempSockek: any = new WebSocket('ws://47.89.195.194:2345?token=' + localStorage.getItem('token'))
    tempSockek.onopen = function (webSocket: any) {
      console.log('WebSocket opened!');
    };
    tempSockek.onmessage = function (msg: any) {
      const pop = JSON.parse(msg.data)
      if (history.location.pathname === '/listed/ListedProducts'){
        setInitialState({
          ...initialState,
          listTimes: pop.DeliverTime
        })
      }
      setInfos(pop)
    };
    tempSockek.onerror = function (error: any) {
      console.log('Error: ' + error.name + error.number);
    };
    tempSockek.onclose = function () {
      console.log('WebSocket closed!');
    };
  }
  useEffect(() => {
    getOccupancyRate()
  }, []);
  return (
    <>
    <NoticeIcon
      className={styles.action}
      count={notices.length + errorInfo.length}
      onItemClick={(item:any) => {
        if(item.type === 'message'){
          history.push('/log/AlarmLog')
        } 
        if(item.type === 'Amazon') {
          history.push('/order/AmazonOrder')
        }
        if(item.type === 'AmazonReturn') {
          history.push('/returns/AmazonReturns')
        }
        if(item.type === 'NewEgg') {
          history.push('/order/NewEggOrder')
        }
        if(item.type === 'NewEggReturn') {
          history.push('/returns/NeweggReturns')
        }
        // if(item.type === 'returns') {
        //   history.push('/returns/Returns')
        // }
      }}
      onClear={(title: string, key: string) => {
        changeReadState(key);
      }}
      loading={false}
      clearText="clear"
      viewMoreText="All read"
      onViewMore={() => null}
      clearClose
    >
      <NoticeIcon.Tab
        tabKey="notification"
        count={notices.length}
        list={notices}
        title="Order notification"
        emptyText="You've seen all the notifications"
        showViewMore
      />
      <NoticeIcon.Tab
        tabKey="message"
        count={errorInfo.length}
        list={errorInfo}
        title="Abnormal"
        emptyText="You've seen all the notifications"
        showViewMore
      />
    </NoticeIcon>
  </>);
};

export default NoticeIconView;
