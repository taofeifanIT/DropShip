import { Tag, Space, Popover, Form, Select, Button,notification} from 'antd';
import { ControlOutlined,BellOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import NoticeIconView from '@/components/NoticeIcon/index';
import styles from './index.less';
import { getPublicParams, setPublicParams } from '@/utils/cookes';
import { getKesGroup } from '@/utils/utils';
import { checkIssueOrder,updateIssueTrack} from '@/services/order/order';
// import Dos from '@/components/Dos'
// const TestContext= createContext();
export type SiderTheme = 'light' | 'dark';

type OrderMessage = {
  order_id: number,
  amazon_order_id: string,
  vendor_sku: string,
  vendor_quantity: number
}

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const GlobalHeaderRight: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  // const count = useContext(TestContext)  //得到count
  if (!initialState || !initialState.settings) {
    return null;
  }
  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const handleVisibleChange = (visible: boolean) => {
    setVisible(visible);
  };
  const onFinish = (fieldsValue: any) => {
    // Should format date value before submit.
    setPublicParams(fieldsValue);
    setVisible(false);
    setInitialState({
      ...initialState,
      conText: fieldsValue,
    });
  };

  const openNotification = (item:OrderMessage) => {
    const key = `open${item.order_id}`;
    const btn = (
      <Button type="primary" size="small" onClick={() => {
        updateIssueTrack({
          id: item.order_id,
          issue_tracking: 0
        }).then(res => {
          if(res.code){
            notification.close(key)
          }
        }).finally(() => {
          notification.close(key)
        })
      }}>
        Confirm
      </Button>
    );
    notification.open({
      message: 'The order in question is in stock',
      description: (<>
       <div>sku: {item.vendor_sku}</div>
       <div>quantity: {item.vendor_quantity}</div>
       <div>order Id: {item.amazon_order_id}</div>
      </>),
      btn,
      key,
      duration: null,
      icon: <BellOutlined  style={{ color: '#108ee9' }} />,
      onClose: close,
    });
  };
  const getCheckIssueOrder = () => {
    checkIssueOrder().then(res => {
      if(res.data.length > 0){
        res.data.forEach((item:OrderMessage) => {
          openNotification(item)
        })
      }
    })
  }

  var loopTask: any = null
  const loopGetOrder = () => {
    var currentUser = initialState?.currentUser
    if(currentUser){
      if(currentUser.auth_group?.title == 'Super Admin'){
        console.log(currentUser.auth_group?.title)
         if(!loopTask){
          getCheckIssueOrder();
          loopTask = setInterval(() => {
            getCheckIssueOrder();
          }, 1000 * 60 * 3);
        } 
      } else {
        window.clearInterval(loopTask)
      }
    }
    
  }
  React.useEffect(() => {
    let publicParms = getPublicParams();
    if (publicParms && visible) {
      let fields = JSON.parse(publicParms || '');
      form.setFieldsValue({
        ...fields,
      });
      // form.setFields(JSON.parse(getPublicParams() || ""))
    }
  }, [visible]);
  React.useEffect(() => {
    loopGetOrder()
  }, []);
  return (
    <Space className={className}>
      {/* <Dos /> */}
      <Tag color="#108ee9">{initialState?.currentUser?.auth_group?.title}</Tag>
      {initialState?.currentUser?.auth_group?.title !== 'Outsourcer' ? (
        <span style={{ margin: '0 12px' }}>
          <NoticeIconView />
        </span>
      ) : null}
      <Popover
        id="popPopover"
        placement="bottomRight"
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
        content={
          <div style={{ padding: '8px' }}>
            <Form
              name="control-ref"
              form={form}
              initialValues={{
                company_id: 0,
                country_id: 0,
                marketplace_id: 0,
                store_id: 0,
                vendor_id: 0,
              }}
              {...formItemLayout}
              onFinish={onFinish}
            >
              <Form.Item name="company_id" label="company">
                <Select
                  size="small"
                  style={{ width: '150px' }}
                  placeholder="Select company"
                  allowClear
                >
                  <Select.Option key={'companyAll'} value={0}>
                    All companies
                  </Select.Option>
                  {getKesGroup('companyData')?.map((item: { id: number; name: string }) => {
                    return (
                      <Select.Option key={'company' + item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="country_id" label="country">
                <Select
                  size="small"
                  style={{ width: '150px' }}
                  placeholder="Select country"
                  allowClear
                >
                  <Select.Option key={'countryAll'} value={0}>
                    All countrys
                  </Select.Option>
                  {getKesGroup('countryData')?.map((item: { id: number; country: string }) => {
                    return (
                      <Select.Option key={'country' + item.id} value={item.id}>
                        {item.country}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item name="marketplace_id" label="market">
                <Select
                  size="small"
                  style={{ width: '150px' }}
                  placeholder="Select marketPlace"
                  allowClear
                >
                  <Select.Option key={'marketPlaceAll'} value={0}>
                    All markets
                  </Select.Option>
                  {getKesGroup('marketPlaceData')?.map(
                    (item: { id: number; marketplace: string }) => {
                      return (
                        <Select.Option key={'market' + item.id} value={item.id}>
                          {item.marketplace}
                        </Select.Option>
                      );
                    },
                  )}
                </Select>
              </Form.Item>
              {/* <Form.Item name="store_id" label="store">
              <Select
                size="small"
                style={{ width: "150px" }}
                placeholder="Select store"
                allowClear
              >
                <Select.Option key={'storeAll'} value={0}>All stores</Select.Option>
                {initialState.allPop?.storeData?.map((item: {
                  id: number,
                  name: string
                }) => {
                  return <Select.Option key={'store' + item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item name="vendor_id" label="vendor">
              <Select
                size="small"
                style={{ width: "150px" }}
                placeholder="Select vendor"
                allowClear
              >
                <Select.Option key={'vendorAll'} value={0}>All vendors</Select.Option>
                {initialState.allPop?.vendorData?.map((item: {
                  id: number,
                  vendor_name: string
                }) => {
                  return <Select.Option key={'vendor' + item.id} value={item.id}>{item.vendor_name}</Select.Option>
                })}
              </Select>
            </Form.Item> */}
              <Form.Item
                wrapperCol={{
                  xs: { span: 24, offset: 0 },
                  sm: { span: 16, offset: 8 },
                }}
              >
                <Button type="primary" size="small" htmlType="submit">
                  Submit
                </Button>
                <Button style={{ marginLeft: '10px' }} type="default" size="small">
                  reset
                </Button>
              </Form.Item>
            </Form>
          </div>
        }
      >
        <ControlOutlined />
      </Popover>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      {/* <SelectLang className={styles.action} /> */}
    </Space>
  );
};
export default GlobalHeaderRight;
