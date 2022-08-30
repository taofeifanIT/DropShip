import { Tag, Space, Popover, Form, Select, Button,notification} from 'antd';
import { ControlOutlined,BellOutlined,FrownOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import NoticeIconView from '@/components/NoticeIcon/index';
import styles from './index.less';
import { getPublicParams, setPublicParams } from '@/utils/cookes';
import { getKesGroup,getKesValue } from '@/utils/utils';
import { checkIssueOrder,updateIssueTrack} from '@/services/order/order';
export type SiderTheme = 'light' | 'dark';

type OrderMessage = {
  order_id: number,
  amazon_order_id: string,
  vendor_sku: string,
  vendor_quantity: number,
  is_cancel:number,
  type: number
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
  const { initialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [visible, setVisible] = React.useState(false);
  const {
    country_id = 0,
    company_id = 0,
    marketplace_id = 0
  } = getPublicParams() || {
    country_id:0,
    company_id:0,
    marketplace_id:0
  }

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
    setPublicParams(fieldsValue);
    setVisible(false);
    history.go(0)
  };

  const onReset = () => {
    form.resetFields();
    setPublicParams({})
    history.go(0)
  };
  const openNotification = (item:OrderMessage) => {
    const key = `open${item.order_id}`;
    const btn = item.type === 1 ? (
      <Button type="primary" size="small" onClick={() => {
        updateIssueTrack({
          id: item.order_id,
          issue_tracking: 0,
          type: item.type
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
    ) : (<Button onClick={() => {
      updateIssueTrack({
        id: item.order_id,
        is_cancel: 2,
        type: item.type
      }).then(res => {
        if(res.code){
          notification.close(key)
        }
      }).finally(() => {
        notification.close(key)
      })
    }} style={{ color: '#ff5e44' }} >Close</Button>)
    let message = item.type === 1 ? "The order in question is in stock" : "One order was cancelled by a customer"
    let icon = item.type === 1 ? <BellOutlined  style={{ color: '#108ee9' }} /> : <FrownOutlined style={{ color: '#ff5e44' }}  />
    notification.open({
      message,
      description: (<>
       <div>sku: {item.vendor_sku}</div>
       <div>quantity: {item.vendor_quantity}</div>
       <div>order Id: {item.amazon_order_id}</div>
      </>),
      btn,
      key,
      duration: null,
      icon,
      onClose: close,
    });
  };
  const getCheckIssueOrder = () => {
    checkIssueOrder().then(res => {
      if(res.data.length > 0){
        res.data.forEach((item:OrderMessage) => {
          if(item.type === 1 || (item.type === 2 && item.is_cancel === 1)){
            openNotification(item)
          }
        })
      }
    })
  }
  var loopTask: any = null
  const loopGetOrder = () => {
    var currentUser = initialState?.currentUser
    try {
      if(currentUser){
        if(currentUser.auth_group?.title == 'Super Admin'){
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
    } catch (error) {
      console.info(error)
    }
  }
  React.useEffect(() => {
    let publicParms = getPublicParams();
    if (publicParms && visible) {
      form.setFieldsValue(publicParms);
    }
  }, [visible]);
  React.useEffect(() => {
    loopGetOrder()
  }, []);
  return (
    <Space className={className}>
      {/* <Dos /> */}
      <Tag color="#108ee9">{initialState?.currentUser?.auth_group?.title}</Tag>
      {!!country_id && <Tag color="#2db7f5">{getKesValue("countryData",country_id).country}</Tag>}
      {!!company_id && <Tag color="magenta">{getKesValue("companyData",company_id).name}</Tag>}
      {!!marketplace_id && <Tag color="geekblue">{getKesValue("marketPlaceData",marketplace_id).marketplace}</Tag>}
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
                <Button style={{ marginLeft: '10px' }} type="default" size="small" onClick={onReset}>
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
