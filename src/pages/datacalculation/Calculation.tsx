import React, { useEffect, useState } from 'react'
import { List, Typography, Divider, message } from 'antd';
import { ImportOutlined,ArrowUpOutlined,ArrowDownOutlined,RetweetOutlined,UpOutlined  } from '@ant-design/icons';
import { Form, Input, Button, Pagination, Spin, Upload,Radio,BackTop  } from 'antd';
import { listingwuList } from '../../services/calculation'
import ParagraphText from '@/components/ParagraphText'
const data = [
  'Racing car sprays burning fuel into crowd.',
];
const { Text } = Typography


const orderStyle: React.CSSProperties = {
  backgroundColor: '#314659',
  color: '#fff',
  borderRadius: '20px',
  width: '20px',
  height: '20px',
  display: 'inline-block',
  textAlign: 'center',
  marginRight: '10px',
};

type itemPop = {
  id: Number,
  pm: String,
  ns_sku: String,
  brand: String,
  sale_marketplace: String,
  asin: String,
  description: String,
  sale_price: String,
  purchase_price: String,
  import_tariff_rate: String,
  shipping_fee: String,
  platform_fee: String,
  reference_price: String,
  gross_margin: String,
  buybox_info: String,
  update_at: String,
}
export default () => {
  const [form] = Form.useForm();
  const [params, setParams] = useState<{
    asin: String | undefined;
    pm: String | undefined;
    page: number;
    limit: number;
    orderby: string | undefined;
  }>({
    asin: undefined,
    pm: undefined,
    page: 1,
    limit: 10,
    orderby: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [dataObj, setDataObj] = useState<{
    data: Array<itemPop>;
    total: number;
  }>({
    data: [],
    total: 0,
  })
  const initData = () => {
    setLoading(true)
    listingwuList(params).then(res => {
      if (res.code) {
        setDataObj({
          ...dataObj,
          data: res.data.list,
          total: res.data.total
        })
      } else {
        throw res.msg
      }
    }).catch(e => {
      message.error(e)
    }).finally(() => {
      setLoading(false)
    })
  }

  const props = {
    name: 'file',
    action: 'http://api-multi.itmars.net/export/upload_listing_file',
    // customRequest: (option: any) => {
    //     const formData = new FormData();
    //       formData.append('file',option.file);
    //       importTemplate(formData).then(res => {
    //           console.log(res)
    //       })

    // },
    interceptors: true,
    headers: {
      token: localStorage.getItem('token'),
    },
    onChange(info: any) {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        if (info.file?.response.code) {
          message.success(`${info.file.name} file uploaded successfully`);
          initData()
        } else {
          message.error(`${info.file?.response.msg}`);
        }

      } else if (info.file.status === 'error') {
        // message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const search = () => {
    form.validateFields().then(values => {
      setParams({
        ...params,
        ...values,
        page: 1
      })
    })
  }
  useEffect(() => {
    initData()
  }, [])
  useEffect(() => {
    initData()
  }, [params])
  return (<>
    <div style={{ margin: 8, padding: '0 15%' }}>
      <div style={{ padding: '12px', background: '#fff', borderRadius: '10px' }}>
        <Form
          layout='inline'
          form={form}
        >
          <Form.Item name="pm" label="PM">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item name="asin" label="ASIN">
            <Input placeholder="input placeholder" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" loading={loading} onClick={search}>search</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => {
              form.resetFields()
            }}>reset</Button>
          </Form.Item>
          <Form.Item>
          <Radio.Group onChange={e => {
            setParams({
              ...params,
              orderby: e.target.value !== 'null' ? `gross_margin ${e.target.value}` : undefined
            })
          }}>
          <Radio.Button value="asc"><ArrowUpOutlined /></Radio.Button>
          <Radio.Button value="desc"><ArrowDownOutlined /></Radio.Button>
          <Radio.Button value="null"><RetweetOutlined  /></Radio.Button>
        </Radio.Group>
          </Form.Item>
          <Upload {...props}><Button icon={<ImportOutlined />} type="primary">Import</Button></Upload>
        </Form>
      </div>
      <Spin spinning={loading}>
        {dataObj.data.map((items: itemPop, index) => {
          return (<List
            key={'list' + index}
            header={<div><h3><Text type='secondary'>PM：</Text>{items.pm}</h3></div>}
            footer={<div style={{ textAlign: 'right' }}>
              <Text type='secondary'>毛利率：
                <Text style={{ fontSize: '21px' }}>{(parseFloat(items.gross_margin + '') * 100).toFixed(2)}%</Text>
              </Text></div>}
            style={{ background: '#fff', borderRadius: '10px', marginTop: '10px' }}
            bordered
            size='small'
            dataSource={data}
            renderItem={item => (
              <List.Item key={'index5' + index}>
                <div style={orderStyle} key={'index' + index}>{index + 1}</div>
                <Divider type='vertical' style={{ height: '70px' }} />
                <div style={{ display: 'inline-block', width: '240px' }} key={'content' + index}>
                  <Text type='secondary'>
                    Asin: <a
                      target="_blank"
                      rel="noreferrer"
                    >
                      {items.asin}
                    </a>
                  </Text><br />
                  <Text type='secondary'>
                    品牌: <Text>{items.brand}</Text>
                  </Text><br />
                  <Text type='secondary'>
                    描述: <ParagraphText content={items.description+''} width={500} />
                  </Text>
                </div>
                <Divider type='vertical' style={{ height: '70px' }} />
                <div style={{ display: 'inline-block' }}>
                  <Text type='secondary'>
                    销售平台: <Text>{items.sale_marketplace}</Text>
                  </Text><br />
                  <Text type='secondary'>
                    NS SKU: <Text>{items.ns_sku}</Text>
                  </Text><br />
                </div>
                <Divider type='vertical' style={{ height: '70px' }} />
                <div style={{ display: 'inline-block' }} key={'index1' + index}>
                  <Text type='secondary'>
                    预计销售单: <Text>${items.sale_price}</Text>
                  </Text><br />
                  <Text type='secondary'>
                    采购单价: <Text>${items.purchase_price}</Text>
                  </Text><br />
                </div>
                <Divider type='vertical' style={{ height: '70px' }} />
                <div style={{ display: 'inline-block' }} key={'index2' + index}>
                  <Text type='secondary'>
                    平台手续费率: <Text>{items.platform_fee}%</Text>
                  </Text><br />
                  <Text type='secondary'>
                    进口关税率: <Text>{items.import_tariff_rate}%</Text>
                  </Text><br />
                  <Text type='secondary'>
                    运费(全程运费): <Text>{items.shipping_fee}</Text>
                  </Text><br />
                </div>
                <Divider type='vertical' style={{ height: '70px' }} />
                <div style={{ display: 'inline-block' }} key={'index3' + index}>
                  <Text type='secondary'>
                    参考价格: <Text>${items.reference_price}(buy box)</Text>
                  </Text><br />
                </div>
              </List.Item>
            )}
          />)
        })}
      </Spin>
    </div>
    <div style={{ textAlign: 'center' }}>
      <Pagination defaultCurrent={1} total={dataObj.total} pageSize={params.limit} onChange={(page) => {
        setParams({
          ...params,
          page: page
        })
      }} />
    </div>
    <BackTop>
        <div
          style={{
            border: '1px solid #dcdcdc',
            width: '50px',
            height: '50px',
            textAlign: 'center',
            lineHeight: '50px',
            position: 'fixed',
            right: '5vw',
            bottom: '6vw',
            zIndex: 100,
            background: 'rgb(220, 220, 220)',
            cursor: 'pointer',
          }}
        >
          <UpOutlined />
        </div>
      </BackTop>
  </>)
};