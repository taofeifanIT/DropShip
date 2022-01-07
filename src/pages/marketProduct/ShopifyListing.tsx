import { useRef } from 'react';
import { AmazonOutlined } from '@ant-design/icons';
import { Typography, Space } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { getListing } from '@/services/amazonListing/shopifyListing';
import { getStoreList } from '@/services/publicKeys';
import ParagraphText from '@/components/ParagraphText'
import moment from 'moment';
const { Text } = Typography;
type GithubIssueItem = {
    product_id: string;
    ts_sku: number;
    price: number;
    quantity: string;
    title: string;
    status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
    store_id: number;
    update_at: string;
    listind_id: string;
    store?: {
        id: number;
        name: string;
        ip: string;
        port: string;
        marketplace_id: number;
        company_id: number;
        country_id: number;
        belong_to_drop_ship: number;
        add_time: number;
        update_at: number;
    };
    shopify_response: string;
};

type collections = {
    collections: {
        edges: Array<{
            node: {
                title: string
            }
        }>
    }
}

const getTagName = () => {
    return new Promise((resolve: any) => {
        getStoreList().then((res) => {
            const temp = res.data.list.map((item: any) => {
                return {
                    label: item.name,
                    value: item.id,
                };
            });
            resolve(temp);
        });
    });
};

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
        render: (_, record) => {
            let collection: collections = JSON.parse(record.shopify_response)
            let url = collection.collections.edges[1].node.title.toLowerCase().replace(',',"").replace(/\s+/g,"-").replace(new RegExp("\\&","g"),"-").replace(/\|/g, '-');
            return (
                <>
                    <Space direction="vertical">
                        <Text type="secondary">
                            ts_sku: <Text><a target="_Blank" href={`https://itmars.com/collections/${url}/products/${record.ts_sku}`}>{record.ts_sku}</a></Text>
                        </Text>
                        <Text type="secondary">
                            Description: <ParagraphText content={record.title} width={180} />
                        </Text>
                    </Space>
                </>
            );
        },
    },
    {
        title: 'ts_sku',
        dataIndex: 'ts_sku',
        hideInTable: true,
    },
    {
        title: 'marketplace_and_db_diff',
        dataIndex: 'marketplace_and_db_diff',
        valueType: 'select',
        hideInTable: true,
        width: 250,
        valueEnum: {
            '1': { text: 'In marketplace not in Db', status: 'Error' },
            '2': { text: 'In Db not in marketplace', status: 'Error' },
        },
    },
    {
        title: 'Price',
        dataIndex: 'price',
        width: 200,
        valueType: 'money',
        search: false,
        render: (price, record: any) => {
            return (
                <>
                    <span>{price}</span>
                </>
            );
        },
    },
    {
        title: 'quantity',
        dataIndex: 'quantity',
        width: 200,
        search: false,
        render: (price, record: any) => {
            return (
                <>
                    <span>{price}</span>
                </>
            );
        },
    },
    {
        title: 'Store',
        dataIndex: 'store_id',
        valueType: 'select',
        width: 228,
        request: async (): Promise<any> => {
            return await getTagName();
        },
    },
    {
        title: 'update_at',
        dataIndex: 'update_at',
        width: 228,
        render: (text) => {
            return moment(parseInt(text + '000')).format('YYYY-MM-DD HH:mm:ss');
        },
    },
    {
        title: 'Status',
        dataIndex: 'status',
        valueType: 'select',
        width: 228,
        valueEnum: {
            DRAFT: {
                text: 'DRAFT ',
                status: 'Error',
            },
            ARCHIVED: {
                text: 'ARCHIVED ',
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
                request={async (params = {}, sort) =>
                    new Promise((resolve) => {
                        let sortParams: {
                            sort_by?: string;
                            sort_field?: string;
                        } = {};
                        if (sort) {
                            for (let key in sort) {
                                sortParams.sort_by = sort[key] === 'descend' ? 'desc' : 'asc';
                                sortParams.sort_field = key;
                            }
                        }
                        let tempParams: any = {
                            ...params,
                            ...sortParams,
                            page: params.current,
                            limit: params.pageSize,
                        };
                        getListing(tempParams).then((res) => {
                            resolve({
                                data: res.data.list,
                                // success 请返回 true，
                                // 不然 table 会停止解析数据，即使有数据
                                success: !!res.code,
                                // 不传会使用 data 的长度，如果是分页一定要传
                                total: res.data.total,
                            });
                        });
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
                headerTitle={
                    <>
                        <AmazonOutlined /> Amazon Listing
                    </>
                }
            />
        </>
    );
};
