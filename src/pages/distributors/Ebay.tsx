import { useState } from 'react';
import { getPageHeight } from '@/utils/utils';
import { LockOutlined  } from '@ant-design/icons';
import {userAuth} from '@/services/distributors/ebay'
import {
    Button,
    Tooltip,
    Select,
    message 
  } from 'antd';

const { Option } = Select;
export default () => {
    const [store, setStore] = useState("");
    const [loading, setLoading] = useState(false);
    const handleChange = (value: string) => {
        setStore(value)
    }
    const getAuthUrl = () => {
        setLoading(true)
        userAuth(store).then(res => {
            if(res.code){
                window.location.href = res.data.redirect_url
            } else {
                throw res.msg
            }
        }).catch((e:string) => {
            message.error(e)
        }).finally(() => {
            setLoading(false)
        })
    }
    return (
      <div style={{background: "#fff", height: getPageHeight() + 'px', padding: '12px'}}>
    <span>store：</span>      
    <Select allowClear style={{ width: 120 }} onChange={handleChange}>
      <Option value="7">ebay</Option>
    </Select>
         <div style={{lineHeight: getPageHeight() + 'px', textAlign: 'center'}}>
            <Tooltip title="to grant authorization">
                <Button
                    loading={loading}
                    disabled={!store}
                    style={{width: '10vw',height: '10vw'}}
                    type="primary"
                    shape="circle"
                    icon={<LockOutlined style={{fontSize: '5vw'}} 
                    onClick={getAuthUrl}
                />} />
            </Tooltip>
         </div>
      </div>
    );
  };
  