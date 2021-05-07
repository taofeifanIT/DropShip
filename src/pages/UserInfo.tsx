import { Upload, message,Form, Input, Button, Progress, Modal} from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {useState} from 'react'
import { history } from 'umi';
import { changePassword } from '../services/user'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

const Avatar = () => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
        setLoading(true)
        return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>{
        setImageUrl(imageUrl)
        setLoading(false)
      });
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
  );
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 8 },
  };
  const tailLayout = {
    wrapperCol: { offset: 21, span: 8 },
  };
  
  const Demo = () => {
    const [status, setStatus] = useState<{percent: number;status: string;}>({percent: 0, status: ''})
    const [loading, setLoading] = useState(false)
    const onFinish = (values: any) => {
    //   console.log('Success:', values);
    changePassword(values).then(res => { 
        setLoading(true) 
        if(res.code){
            let secondsToGo = 5;
            const modal = Modal.success({
                title: 'This is a notification message',
                content: `Password update successful, ${secondsToGo} seconds later log out of the system, please login again`,
                onOk: () => {
                    modal.destroy();
                    history.push('/user/login')
                    localStorage.removeItem("token")
                }
            });
            const timer = setInterval(() => {
                secondsToGo -= 1;
                modal.update({
                content: `Password update successful, ${secondsToGo} seconds later log out of the system, please login again`,
                });
            }, 1000);
            setTimeout(() => {
                clearInterval(timer);
                modal.destroy();
                history.push('/user/login')
                localStorage.removeItem("token")
            }, secondsToGo * 1000);
        }
    }).finally(() => {
        setLoading(false)
    })
    };
  
    const onFinishFailed = (errorInfo: any) => {
      console.log('Failed:', errorInfo);
    };
    const checkPwd = (pwd: string) => {
        var m = status.percent;   
        //匹配数字
        if (pwd === '') {
            m = 0
        };
        if (/\d+/.test(pwd)) {
          m = 1
        };
        //匹配字母
        if (/[A-Za-z]+/.test(pwd)) {     
            m = 2
        };
        //匹配除数字字母外的特殊符号
        if (/[^0-9a-zA-Z]+/.test(pwd)) {      
            m = 3
        };
        
        if (pwd.length <= 6) { m = 1; }
        if (pwd.length <= 0) { m = 0; }    
        switch (m) {
          case 0:
            setStatus({percent: 0, status: 'normal'})
            break;
          case 1:
            setStatus({percent: 30, status: 'exception'})
            break;
          case 2:
            setStatus({percent: 60, status: 'active'})
            break;
          case 3:
            setStatus({percent: 100, status: 'success'})
            break;
        }
    }
    return (
      <Form
        {...layout}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {/* <Form.Item
          label="Username"
          name="username"
        >
          <Input />
        </Form.Item> */}
  
        <Form.Item
          label="Password"
          name="password"
        >
          <Input.Password onChange={(e) => {
              checkPwd(e.target.value)
          }} />
        </Form.Item>
        <Form.Item
          label="Safety level"
          name="Progress"
        >
          <Progress percent={status.percent} status={status.status} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" loading={loading} htmlType="submit">
            save
          </Button>
        </Form.Item>
      </Form>
    );
  };

export default function UserInfo(){
    return (<div style={{margin: '0 20%', background: '#fff', textAlign: 'center', boxShadow: '2px 0px 5px gray', padding: 10}}>
        <h1 style={{color: '#888383'}}>My information</h1>
        <br/>
        <br/>
        <br/>
        <br/>
        <Avatar />
        <p>Your picture</p>
        <br />
        <Demo />
    </div>)
}