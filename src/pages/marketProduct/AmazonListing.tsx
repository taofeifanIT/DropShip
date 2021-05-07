import React, { useRef, useState } from 'react';
import {  AmazonOutlined  } from '@ant-design/icons';
import { Typography, Space,Modal, Button } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { amazonListing, amazonListingDiff } from '../../services/amazonListing/amazonListing'
import usePopInfo from '../../hooks/usePopInfo'
import { getAsonHref } from '../../utils/jumpUrl'
import { getStoreList } from '../../services/publicKeys'
import moment from 'moment';
const { Text } = Typography;
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

const getTagName = () => {
    return new Promise((resolve: any) => {
        getStoreList().then(res => {
            const temp = res.data.list.map((item: any) => {
                return {
                    label:item.name,
                    value: item.id,
                  };
              });
            resolve(temp);
        })
      });
}  

const columns: ProColumns<GithubIssueItem>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'Product',
        dataIndex: 'id',
        search: false,
        width: 400,
        sorter: true,
        render: (_, record: any) => {
            return (
                <>
                    <Space direction="vertical">
                        <Text type="secondary">ts_sku: <Text>{record.ts_sku}</Text></Text>
                        <Text type="secondary">Description: <ParagraphText content={record.title} width={220} /></Text>
                    </Space>
                </>
            )
        }
    },
    {
        title: 'ts_sku',
        dataIndex: 'ts_sku',
        hideInTable: true,
    },
    {
        title: "marketplace_and_db_diff",
        dataIndex: 'marketplace_and_db_diff',
        valueType: 'select',
        hideInTable: true,
        width: 250,
        valueEnum: {
            "1": { text: 'InmarketplaceNotInDb', status: 'Error' },
          }
    },
    {
        title: (<span><AmazonOutlined />Asin</span>),
        dataIndex: 'asin',
        copyable: true,
        width: 200,
        render: (_, record: any) => {
            return (
                <>
                    <Space direction="vertical">
                        <Text type="secondary">
                            <a target="_Blank"  href={`${getAsonHref(record.country_id)}${record.asin}`}>{record.asin}</a>
                        </Text>
                    </Space>
                </>
            )
        }
    },
    {
        title: "Price",
        dataIndex: 'price',
        width: 200,
        valueType: 'money',
        search: false,
        render: (price, record: any) => {
            return (
                <>
                    <span>{price}</span>
                </>
            )
        }
    },
    {
        title: "quantity",
        dataIndex: 'quantity',
        width: 200,
        search: false,
        render: (price, record: any) => {
            return (
                <>
                    <span>{price}</span>
                </>
            )
        }
    },
    {
        title: 'Store',
        dataIndex: 'store_id',
        valueType: 'select',
        width: 228,
        request: async (): Promise<any> =>  {return await getTagName()},
    },
    {
        title: 'update_at',
        dataIndex: 'update_at',
        width: 228,
        render: (text) => {
            return moment(parseInt(text + '000')).format('YYYY-MM-DD HH:mm:ss')
        }
    },
    {
        title: 'Status',
        dataIndex: 'status',
        valueType: 'select',
        width: 228,
        valueEnum: {
            Inactive: {
              text: 'Inactive',
              status: 'Error',
            },
            Active: {
              text: 'Active',
              status: 'Success',
            },
          },
    },
];

export default () => {
    const actionRef = useRef<ActionType>();
    // 生成 intl 对象
    // const enUSIntl = createIntl('en_US', enUS);
    return (
        <>
            <ProTable<GithubIssueItem>
                size="small"
                columns={columns}
                actionRef={actionRef}
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
                        amazonListing(tempParams).then(res => {
                            resolve({
                                data: res.data.list,
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
                dateFormatter="string"
                headerTitle={<><AmazonOutlined  /> Amazon Listing</>}
            />
        </>
    );
};