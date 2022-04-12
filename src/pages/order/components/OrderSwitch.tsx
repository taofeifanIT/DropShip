import { useEffect, useState } from 'react';
import {
    Modal,
    message,
    Switch,
  } from 'antd';
  import { ExclamationCircleOutlined } from '@ant-design/icons'
  export default (props: {
    params: any;
    targetKey: string;
    targetValue: number;
    checkedChildren: string;
    unCheckedChildren: string;
    api: any;
    isFalseDisbled?: boolean;
    isTrueDisbled?: boolean;
    needConfirm?: boolean;
  }) => {
    const {
      params,
      targetKey,
      targetValue,
      checkedChildren,
      unCheckedChildren,
      api,
      isFalseDisbled = false,
      isTrueDisbled = false
    } = props;
    const [issueStatus, setIssueStatus] = useState<boolean>(!!targetValue);
    const [switchLoading, setSwaitchLoading] = useState(false);
    let inlineDisabled = false
    if (isFalseDisbled && !issueStatus) {
      inlineDisabled = true
    }
    if (isTrueDisbled && issueStatus) {
      inlineDisabled = true
    }
    function showPromiseConfirm(resMsg: {order_price: number,vendor_price:number}) {
      Modal.confirm({
        title: 'Do you confirm that you need to place the order?',
        icon: <ExclamationCircleOutlined />,
        content: `The price of the order is quite different from that of the supplier \nOrder price:${resMsg.order_price}\nVendor price:${resMsg.vendor_price}`,
        onOk() {
          return new Promise((resolve, reject) => {
            params["is_sure"] = 1
            api(params).then((res:any) => {
              if(res.code){
                setIssueStatus(true);
                message.success('operation successful!');
                resolve(true)
              } else {
                reject(res.msg)
              }
            })
          }).catch((e) =>{
            message.error(e)
          });
        },
        onCancel() {},
      });
    }
    const changeIssueType = (val: number) => {
      params[targetKey] = val
      setSwaitchLoading(true);
      api(params)
        .then((res: any) => {
          if(res.code === 2){
            showPromiseConfirm(res.data)
          }
          if (res.code === 1) {
            message.success('operation successful!');
            setIssueStatus(!!val);
          } 
          if(!res.code){
            message.error(res.msg)
          }
        })
        .finally(() => {
          setSwaitchLoading(false);
        });
    };
    useEffect(() => {
      setIssueStatus(!!targetValue);
    }, [targetValue]);
    return (
      <div>
        <Switch
          checkedChildren={checkedChildren}
          unCheckedChildren={unCheckedChildren}
          loading={switchLoading}
          checked={issueStatus}
          disabled={inlineDisabled}
          style={{ width: 90 }}
          onChange={() => {
            changeIssueType(+!issueStatus);
          }}
        />
      </div>
    );
  };