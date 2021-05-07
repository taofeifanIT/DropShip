import React, { useRef, useState } from 'react';
import {AmazonOutlined,LockOutlined, BellOutlined  } from '@ant-design/icons';
import { Button, Typography, Space, Form, Modal, InputNumber, message, Tag, Tooltip } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { list, saleLimit } from '../../services/order/order'
import { getPageHeight } from '../../utils/utils'
import { getTargetHref, getAsonHref } from '../../utils/jumpUrl'
import { getKesGroup, getKesValue } from '../../utils/utils'
import { vendors, configs } from '../../services/publicKeys'
import moment from 'moment';
import styles from './style.less'
const { Text,Paragraph } = Typography;
type GithubIssueItem = {
    url: string;
    id: number;
    number: number;
    title: string;
    labels: {
        name: string;
        color: string;
    }[];
    state: string;
    comments: number;
    created_at: string;
    updated_at: string;
    closed_at?: string;
};


const ParagraphText = (props: { content: string, width: number }) => {
    const [ellipsis] = React.useState(true);
    const { content, width } = props
    return (
        <Text
            style={ellipsis ? { width: width, display: "inline" } : undefined}
            ellipsis={ellipsis ? { tooltip: content } : false}
        >
            {content}
        </Text>
    )
}

const columns: ProColumns<GithubIssueItem>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'Marketplace',
        dataIndex: 'Marketplace',
        search: false,
        width: 235,
        render: (_,record:{
            country_id: number;
            title: string;
            AmazonOrderId: string;
            ASIN: string;
            Title: string;
            SellerSKU: string;
            listing: any;
            OrderItemTotal: number;
        }) => {
            return (
                <>
                     <Space direction="vertical">
                        <Text type="secondary"><AmazonOutlined />Asin: <a target='_blank' href={`${getAsonHref(record.country_id)}${record.ASIN}`}>{record.ASIN}</a><Paragraph style={{display: 'inline'}}  copyable={{ text: record.ASIN }}></Paragraph></Text>
                        <Text type="secondary">Sku : 
                            <Text>
                                {
                                    record?.listing && (<><a target="_blank" rel="noreferrer" href={`${getTargetHref(record?.listing?.vendor_id)}${record.SellerSKU}`}>{record.SellerSKU}</a><Paragraph style={{display: 'inline'}}  copyable={{ text: record.SellerSKU }}></Paragraph></>)
                                }
                            </Text>
                        </Text>
                        <Text type="secondary">order : <Tooltip placement="top" title={record.OrderItemTotal > 1 ? 'Repeat order!': undefined}>
                                                            <Text copyable
                                                                style={record.OrderItemTotal > 1 ? { color: 'red', width: '160px' } : undefined}
                                                                >{record.AmazonOrderId}</Text>
                                                      </Tooltip>
                        </Text>
                        <Text type="secondary">title : <ParagraphText content={record.Title} width={400} /></Text>
                    </Space>
                </>
            )
        }
    },
    {
        title: 'Pii',
        dataIndex: 'Pii',
        search: false,
        width: 305,
        render: (_,record:{
            Name: string;
            City: string;
            AddressType: string;
            PostalCode: string;
            StateOrRegion: string;
            CountryCode: string;
            AddressLine1: string;
        }) => {
            return (
                <>
                     <Space direction="vertical">
                        <Text type="secondary">Name : <Text copyable>{record.Name}</Text></Text>
                        <Text type="secondary">AddressLine1 : <Text copyable>{record.AddressLine1}</Text></Text>
                        <Text type="secondary">PostalCode : <Text copyable>{record.PostalCode}</Text></Text>
                        <Text type="secondary">City : <Text copyable>{record.City}</Text></Text>
                        <Text type="secondary">StateOrRegion : <Text>{record.StateOrRegion}</Text></Text>
                        <Text type="secondary">
                            <Tag color="#2db7f5">{record.CountryCode}</Tag>
                            {record.AddressType === "Commercial" ? (<Tag color="warning">{record.AddressType}</Tag>) : (<Tag color="#87d068">{record.AddressType}</Tag>)}
                        </Text>
                    </Space>
                </>
            )
        }
    },
    {
        title: 'Date',
        dataIndex: 'time',
        valueType: 'date',
        width: 250,
        search: false,
        render: (_,record:{
            order_amazon: {
                PurchaseDate: string;
            };
            update_at: string
        }) => {
            return (
                <>
                     <Space direction="vertical">
                        <Text type="secondary">Purchase Date : <Text>{moment(parseInt(record.order_amazon.PurchaseDate + '000')).format("YYYY-MM-DD HH:mm:ss")}</Text></Text>
                        <Text type="secondary">update_at : <Text>{moment(parseInt(record.update_at + '000')).format("YYYY-MM-DD HH:mm:ss")}</Text></Text>
                    </Space>
                </>
            )
        }
    },
    {
        title: 'Quantity ordered',
        dataIndex: 'QuantityOrdered',
        align: 'center',
        width: 150,
    },
    {
        title: 'Store',
        dataIndex: 'store_id',
        valueType: 'select',
        width: 200,
        request: async (): Promise<any> =>  {
            const tempData = getKesGroup('storeData').map((item: {
                id: number;
                name: string;
            }) => {
                return {
                    label:item.name,
                    value: item.id,
                }
            })
            return tempData
        },
    },
    {
        title: 'Vendor',
        dataIndex: 'vendor',
        width: 150,
        valueType: 'select',
        request: async () => {
            return [...getKesGroup('vendorData').map((item:vendors) => {
                return {
                    label: item.vendor_name,
                    value: item.id,
                }
            })]
        },
        render: (text, record: {
            Name: string;
            AddressLine1: string;
            City: string;
            StateOrRegion: string;
            PostalCode: string;
            SellerSKU: string;
            QuantityOrdered: string;
            vendor_price: string;
            AmazonOrderId: string;
            vendor: number;
        }) => {
            let str = 'Order 1:\n'+
                '\n'+
                'Ship to:\n'+
                ''+record.Name+'\n'+
                ''+record.AddressLine1+'\n'+
                ''+record.City+', '+record.StateOrRegion+' '+record.PostalCode+'\n'+
                 '\n'+
                'SKU: '+record.SellerSKU+'\n'+
                'QTY: '+record.QuantityOrdered+'\n'+
                'Price: $'+record.vendor_price+'\n'+
                 '\n'+
                'Reference Number: '+record.AmazonOrderId.split('-')[record.AmazonOrderId.split('-').length -1]+'\n'
            return (record.vendor === 5 ? (<Paragraph copyable={{ text: str }}>{text}</Paragraph>) : (<>{text}</>))
        }
    },
    {
        title: 'Vendor price',
        dataIndex: 'vendor_price',
        width: 100,
        align: 'center',
        search: false,
    },
    {
        title: 'After algorithm price',
        valueType: 'money',
        width: 200,
        dataIndex: 'after_algorithm_price',
        align: 'center',
        render: (_, record: {
            listing: {
                after_algorithm_price: string;
            }
        }) => {
            return (<>
                {record?.listing && record.listing.after_algorithm_price}
            </>)
        }
    },
    {
        title: 'OrderStatus',
        dataIndex: 'OrderStatus',
        width: 150,
        render: (_,record) => {
            return record.order_amazon.OrderStatus
        }
    },
    {
        title: 'ItemPrice amount',
        dataIndex: 'ItemPriceAmount',
        width: 150,
    },
    {
        title: 'ASIN',
        dataIndex: 'ASIN',
        hideInTable: true
    },
    {
        title: 'AmazonOrderId',
        dataIndex: 'AmazonOrderId',
        hideInTable: true
    },
];


export default () => {
    const actionRef = useRef<ActionType>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmLoading,setConfirmLoading] = useState(false);
    const [from] = Form.useForm();
    const [currentRow, setCurrentRow] = useState(-1)
    const [limit , setLimit] = useState<configs>(getKesValue('configsData', 'order_quantity_limit'))

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        from
        .validateFields()
        .then(async (updatedValues:any) => {
            setConfirmLoading(true)
            saleLimit(updatedValues).then(res => {
                if(res.code){
                    message.success('operation successful!')
                    setLimit(updatedValues['order_quantity_limit'])
                } else {
                    throw res.msg
                }
            }).catch(e => {
                message.error(e)
            }).finally(() => {
                setConfirmLoading(false);
                setIsModalVisible(false);
            })
        })
    };
    return (
        <>
            <ProTable<GithubIssueItem>
                size="small"
                columns={columns}
                actionRef={actionRef}
                className={styles.tableStyle}
                request={async (
                    params = {},
                    sort,
                    ) =>
                    new Promise((resolve) => {
                        let sortParams:{
                            sort_by?: string;
                            sort_field?: string;
                        } = {}
                        if(sort){
                            for (let key in sort) {
                                sortParams.sort_by = sort[key] === 'descend' ? 'desc' : 'asc'
                                sortParams.sort_field = key
                            }
                        }
                        let tempParams:any = {
                            ...params,
                            ...sortParams,
                            page: params.current,
                            limit: params.pageSize
                        }
                        list(tempParams).then(res => {
                            const tempData = res.data.list.map((item: {
                                listing:{
                                    vendor_id: number;
                                    vendor_price: number;
                                }
                                order_amazon: {
                                    ShippingAddress: string;
                                    OrderItemTotal: string;
                                }
                            }) => {
                                return {
                                    ...item,
                                    vendor_price: item.listing ? item?.listing.vendor_price : '-',
                                    vendor: item.listing ? item?.listing.vendor_id : -10000,
                                    City: JSON.parse(item.order_amazon.ShippingAddress)['City'] || '-',
                                    AddressType: JSON.parse(item.order_amazon.ShippingAddress)['AddressType'] || '-',
                                    PostalCode: JSON.parse(item.order_amazon.ShippingAddress)['PostalCode'] || '-',
                                    StateOrRegion: JSON.parse(item.order_amazon.ShippingAddress)['StateOrRegion'] || '-',
                                    CountryCode: JSON.parse(item.order_amazon.ShippingAddress)['CountryCode'] || '-',
                                    Name: JSON.parse(item.order_amazon.ShippingAddress)['Name'] || '-',
                                    AddressLine1: JSON.parse(item.order_amazon.ShippingAddress)['AddressLine1'] || '-',
                                    OrderItemTotal: item.order_amazon.OrderItemTotal
                                }
                            })
                            resolve({
                                data: tempData,
                                // success 请返回 true，
                                // 不然 table 会停止解析数据，即使有数据
                                success: !!res.code,
                                // 不传会使用 data 的长度，如果是分页一定要传
                                total: res.data.total,
                            });
                        })
                    })
                }
                onRow={(record:{
                    id: number;
                }) => {
                    return {
                      onClick: event => {
                         setCurrentRow(record.id) 
                      },
                    };
                  }}
                rowClassName={(record) => {
                    return record.id === currentRow ? 'clickRowStyl' : '';
                }}
                editable={{
                    type: 'multiple',
                }}
                rowKey="id"
                search={{
                    labelWidth: 'auto',
                    span: {
                        xs: 14,
                        sm: 24,
                        md: 12,
                        lg: 12,
                        xl: 8,
                        xxl: 6,
                    },
                }}
                pagination={{
                    pageSize: 50,
                }}
                options={{
                    search: false,
                }}
                scroll={{ x: columns.reduce((sum, e) => sum + Number(e.width || 0), 0), y: getPageHeight() - 250 }}
                dateFormatter="string"
                headerTitle={<><BellOutlined /> orders  <span style={{marginLeft: "20px",fontSize: '16px'}}>Current quantity limit： {limit}</span></>}
                toolBarRender={() => [
                   <Button key="ImportOutlined" icon={<LockOutlined/>} onClick={() => {
                       showModal()
                   }}>Change Limit</Button>,
                ]}
            />
            <Modal
                title="Quantity Limit" 
                visible={isModalVisible} 
                onOk={handleOk} 
                confirmLoading={confirmLoading}
                onCancel={() => {
                setIsModalVisible(false)
                }}>
                <Form
                form={from}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
                initialValues={{
                    order_quantity_limit: limit
                }}
                layout="horizontal"
                >
                <Form.Item label="quantity limit">
                    <Form.Item
                    name="order_quantity_limit"
                    noStyle
                    rules={[{ required: true, message: 'Please input your order quantity limit!' }]}
                    >
                    <InputNumber style={{width: "200px"}}></InputNumber>
                    </Form.Item>
                </Form.Item>
                </Form>
            </Modal>
        </>
    );
};