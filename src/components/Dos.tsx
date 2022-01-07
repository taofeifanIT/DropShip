import styles from './Dos.less';
import React, { useEffect, useState } from 'react';
import Draggable from 'react-draggable';
import {Button,Modal} from 'antd'
import { EyeOutlined,CloseOutlined } from '@ant-design/icons';



const Gui = (props: {setVisible: (visible: boolean) => void}) => {
    const [val, setVal] = useState("")
    const closeModel = () => {
        props.setVisible(false)
    }
    return (<>
        <div className={styles.window}> 
            <div style={{
                backgroundColor: '#08246B',
                color: 'white'
            }}> 
                <span style={{paddingLeft: '4px'}}>Drop ship Dos</span> 
                <Button className={styles.closeBtn} icon={<CloseOutlined  />}  onClick={closeModel} />
            </div> 
            <div className={styles.text}> 
                <ul className={styles.ul}> 
                <li style={{color: 'white'}}>Welcome...</li> 
                </ul> 
                <span contentEditable className={styles.editSpan}  style={{display: 'inline-block'}} /><span className={styles.cursor}>_</span>
            </div> 
        </div> 
    </>)
}

export default () => {
    const [visible, setVisible] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [bounds, setBounds] = useState<{left: number, top: number, bottom: number, right: number}>({ left: 0, top: 0, bottom: 0, right: 0 })
    const draggleRef:any = React.createRef();
    const showModal  = () => {
      setVisible(true)
    }
    const handleOk = () => {
      setVisible(false)
    }
    const handleCancel = () => {
      setVisible(false)
    }
    const onStart = (event: HTMLAreaElement, uiData: any) => {
      const { clientWidth, clientHeight } = window.document.documentElement;
      const targetRect = draggleRef.current?.getBoundingClientRect();
      if (!targetRect) {
        return;
      }
      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      })
    };
    useEffect(() => {
      document.onkeydown = function(e) {
        var keyCode = e.keyCode || e.which || e.charCode;
        var ctrlKey = e.ctrlKey || e.metaKey;
        if(ctrlKey && keyCode == 68) {
          setVisible(true)
        }
        if(ctrlKey && keyCode == 83) {
          setVisible(false)
        }
        e.preventDefault();
        return false;
    }
    })
    return (<>
      {/* <Button type="primary" size='large' style={{
          position: 'fixed',
          bottom: '10%',
          right: '3%',
        }} shape="circle" icon={<EyeOutlined/>} onClick={showModal} /> */}
         <EyeOutlined style={{marginRight: '10px'}} onClick={showModal} />
         <Modal
            closable={false}
            mask={false}
            width={680}
            bodyStyle={{
              height: '452px',
              padding: 0
            }}
            title={null}
            visible={visible}
            onOk={handleOk}
            footer={null}
            onCancel={handleCancel}
            modalRender={modal => (
              <Draggable
                disabled={disabled}
                bounds={bounds}
                onStart={(event: any, uiData) => onStart(event, uiData)}
              >
                <div ref={draggleRef}>{modal}</div>
              </Draggable>
            )}
          >
            <Gui setVisible={setVisible} />
          </Modal>
    </>)
  }