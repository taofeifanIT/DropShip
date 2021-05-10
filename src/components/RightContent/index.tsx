import { Tag, Space, Popover, Form, Select, Button } from 'antd';
import { ControlOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import NoticeIconView from '../../components/NoticeIcon/index'
import styles from './index.less';
import { getPublicParams, setPublicParams } from '../../utils/cookes'
import { getKesGroup } from '../../utils/utils'
// const TestContext= createContext();
export type SiderTheme = 'light' | 'dark';

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
  const [visible, setVisible] = React.useState(false)
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
    setVisible(visible)
  };
  const onFinish = (fieldsValue: any) => {
    // Should format date value before submit.
    setPublicParams(fieldsValue)
    setVisible(false)
    setInitialState({
      ...initialState,
      conText: fieldsValue
    })
    // console.log(count)
  };
  React.useEffect(() => {
    if(getPublicParams() && visible){
      let fields = JSON.parse(getPublicParams() ||"")
      form.setFieldsValue({
        ...fields
      })
      // form.setFields(JSON.parse(getPublicParams() || ""))
    }
  }, [visible])
  return (
    <Space className={className}>
      <span style={{margin: "0 12px"}}>
        {localStorage.getItem('current') !== 'operator' ? (<NoticeIconView/>) : null}
      </span>
      <Popover
        id="popPopover"
        placement="bottomRight" 
        trigger="click"
        visible={visible}
        onVisibleChange={handleVisibleChange}
        content={
        <div
          style={{ padding: "8px" }}
        >
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
                style={{ width: "150px" }}
                placeholder="Select company"
                allowClear
              >
                <Select.Option key={'companyAll'} value={0}>All companies</Select.Option>
                {getKesGroup('companyData')?.map((item: {
                  id: number,
                  name: string
                }) => {
                  return <Select.Option key={'company' + item.id} value={item.id}>{item.name}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item name="country_id" label="country">
              <Select
                size="small"
                style={{ width: "150px" }}
                placeholder="Select country"
                allowClear
              >
                <Select.Option key={'countryAll'} value={0}>All countrys</Select.Option>
                {getKesGroup('countryData')?.map((item: {
                  id: number,
                  country: string
                }) => {
                  return <Select.Option key={'country' + item.id} value={item.id}>{item.country}</Select.Option>
                })}
              </Select>
            </Form.Item>
            <Form.Item name="marketplace_id" label="market">
              <Select
                size="small"
                style={{ width: "150px" }}
                placeholder="Select marketPlace"
                allowClear
              >
                <Select.Option key={'marketPlaceAll'} value={0}>All markets</Select.Option>
                {getKesGroup('marketPlaceData')?.map((item: {
                  id: number,
                  marketplace: string
                }) => {
                  return <Select.Option key={'market' + item.id} value={item.id}>{item.marketplace}</Select.Option>
                })}
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
              <Button style={{marginLeft: "10px"}} type="default" size="small">
                reset
              </Button>
            </Form.Item>
          </Form>
        </div>
      }>
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
