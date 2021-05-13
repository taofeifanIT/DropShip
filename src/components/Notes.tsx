import { useEffect, useState } from 'react';
import { Button,message, Drawer, Input, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
const Notes = (props: {
    id: number;
    content: string;
    title: string;
    visible: boolean;
    setVisible: (visible: boolean) => void;
    updateApi: (val: any) => Promise<any>;
    refresh: () => void;
}) => {
    const {visible, id,content,title, setVisible , refresh, updateApi} = props
    const [loading, setLoading] = useState(false)
    const onClose = () => {
        setVisible(false)
    }
    const onEmit = () => {
        setLoading(true)
        updateApi({
            id: id,
            notes: document.getElementById('noteInfo')?.value
        }).then(res => {
            if(res.code){
                message.success('Saved!')
                refresh()
            }
        }).finally(() =>{
            setLoading(false)
        })
    }
    useEffect(() => {
        if(document.getElementById('noteInfo')){
            document.getElementById('noteInfo').value = content
        }
    }, [id, content])
    return (
      <>
        <Drawer
          title={`notes space ${title}`}
          placement="right"
          closable={false}
          mask={false}
          maskStyle={{zIndex: -1000000000000000000000000000}}
          onClose={onClose}
          visible={visible}
          footer={
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <Button onClick={onClose} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button onClick={onEmit} loading={loading} type="primary">
                Submit
              </Button>
            </div>
          }
        >
            <Input.TextArea rows={30} id="noteInfo" />
        </Drawer>
      </>
    );
  };

  export function Info(props: {content: string}){
    return (<>
      <Tooltip title={props.content}>
        <InfoCircleOutlined />
    </Tooltip>
    </>)
  }

  //  

  export default Notes