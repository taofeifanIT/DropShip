import React, { useRef } from 'react';
import {WarningOutlined  } from '@ant-design/icons';
import {Typography, Space, Table } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { newEggReturns } from '../../services/returns'
import { getKesGroup } from '../../utils/utils'
import { stores } from '../../services/publicKeys'
import moment from 'moment';
const { Text } = Typography;



const columns = (): ProColumns<any>[] => [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    
    {
        title: 'RMA',
        dataIndex: 'RMA',
        search: false,
        width: 190,
        render: (_,record:{
            RMAStatus: string;
            RMANumber: string;
            RMAType: string;
            RMADate: string;
            RMAProcessedBy: string;
        }) => {
            return (
                <>
                     <Space direction="vertical">
                        <Text type="secondary">Status : <Text>{record.RMAStatus}</Text></Text>
                        <Text type="secondary">Number : <Text>{record.RMANumber}</Text></Text>
                        <Text type="secondary">Type : <Text>{record.RMAType}</Text></Text>
                        <Text type="secondary">Date : <Text>{record.RMADate}</Text></Text>
                        <Text type="secondary">ProcessedBy : <Text>{record.RMAProcessedBy}</Text></Text>
                    </Space>
                </>
            )
        }
    },
    {
        title: 'Store',
        dataIndex: 'store_id',
        valueType: 'select',
        width: 158,
        request: async () => {
            return [...getKesGroup('storeData').map((item:stores) => {
                return {
                    label: item.name,
                    value: item.id,
                }
            })]
        }
    },
    {
        title: 'NeweggItemNumber',
        dataIndex: 'NeweggItemNumber',
        hideInTable: true
    },
    {
        title: 'SellerPartNumber',
        dataIndex: 'SellerPartNumber',
        hideInTable: true
    },
    {
        title: 'OrderNumber',
        dataIndex: 'OrderNumber',
        width: 180,
    },
    {
        title: 'InvoiceNumber',
        dataIndex: 'InvoiceNumber',
        search: false,
        width: 180,
    },
    {
        title: 'OrderAmount',
        dataIndex: 'OrderAmount',
        search: false,
        width: 180,
    },
    {
        title: 'Quantity of goods',
        dataIndex: 'RMATransactionList',
        search: false,
        width: 180,
        render: (text: any[]) => {
            return (
                <>
                     {text.length}
                </>
            )
        }
    },
    {
        title: 'update_at',
        dataIndex: 'update_at',
        search: false,
        width: 180,
        render: (date) => {
            return date ? moment(parseInt(date + '000')).format('YYYY-MM-DD HH:mm:ss') : '-'
        }
    },
    {
        title: 'add_time',
        dataIndex: 'add_time',
        width: 180,
        search: false,
        render: (date) => {
            return date ? moment(parseInt(date + '000')).format('YYYY-MM-DD HH:mm:ss') : '-'
        }
    },
];


export default () => {
    const actionRef = useRef<ActionType>();
    const expandedRowRender = (record: {
        RMATransactionList: any[]
    }) => {
        const subTablecolumns: ProColumns<any>[] = [
            {
                dataIndex: 'index',
                valueType: 'indexBorder',
                width: 48,
                render: (_,record, index) => {
                    return index + 1
                }
            },
            {
                title: 'NeweggItemNumber',
                dataIndex: 'NeweggItemNumber',
                width: 180,
            },
            {
                title: 'SellerPartNumber',
                dataIndex: 'SellerPartNumber',
                width: 180,
            },
            {
                title: 'ItemReturnQty',
                dataIndex: 'ItemReturnQty',
                search: false,
                width: 180,
            },
            {
                title: 'RefundReasonDescription',
                dataIndex: 'RefundReasonDescription',
                search: false,
                width: 180,
            },
        ];
    
        const data = record.RMATransactionList.map((item:any) => {
            return {
                ...item,
                ItemReturnQty: item.RefundInfo.ItemReturnQty,
                RefundReasonDescription: item.RefundInfo.RefundReasonDescription
            }
        });
        return <Table columns={subTablecolumns} dataSource={data} pagination={false} />;
      };
    return (
        <>
            <ProTable
                size="small"
                columns={columns()}
                actionRef={actionRef}
                expandable={{ expandedRowRender }}
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
                        newEggReturns(tempParams).then(res => {
                            let data = []
                            data = res.data.list.map((item: {
                                RMATransactionList: any
                            }) => {
                                return {
                                    ...item,
                                    ...item.RMATransactionList
                                }
                            })
                            resolve({
                                data: data,
                                // success 请返回 true，
                                // 不然 table 会停止解析数据，即使有数据
                                success: !!res.code,
                                // 不传会使用 data 的长度，如果是分页一定要传
                                total: res.data.total,
                            });
                        })
                    })
                }
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
                scroll={{ x: columns().reduce((sum, e) => sum + Number(e.width || 0), 0) }}
                dateFormatter="string"
                headerTitle={<><WarningOutlined  /> Returns</>}
            />
        </>
    );
};