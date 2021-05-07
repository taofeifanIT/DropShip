import React, { useRef } from 'react';
import { Typography, Space } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { list, getLogLevel } from '../../services/log/alarmLog'
import usePopInfo from '../../hooks/usePopInfo'
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
        getLogLevel().then(res => {
            const levelData = res.data.log_level
            const temp = []
            for(let key  in levelData){
                temp.push({
                    label: levelData[key],
                    value: key,
                })
            }
            resolve(temp);
        })
      });
} 


const columns = (refresh: () => void, getMarkey: (id: number, key: string) => any): ProColumns<GithubIssueItem>[] => [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
        align: 'center'
    },
    {
        dataIndex: 'msg',
        title: 'message',
        width: 308,
    },
    {
        dataIndex: 'data',
        title: 'error log',
        width: 300,
        search: false,
        valueType: 'code',
        // render: (_, record: any) => {
        //     return (
        //         <>
        //             <Space direction="vertical">
        //                 <ParagraphText content={record.data} width={1500} />
        //             </Space>
        //         </>
        //     )
        // }
    },
    {
        dataIndex: 'level',
        title: 'level',
        search: false
    },
    {
        dataIndex: 'log_level',
        title: 'log_level',
        valueType: 'select',
        hideInTable: true,
        width: 200,
        request: async (): Promise<any> => { return await getTagName() }
    },
    {
        dataIndex: 'log_group',
        title: 'log_group',
        search: false
    },
    {
        dataIndex: 'add_date',
        title: 'add_date',
        search: false
    }
];


export default () => {
    const actionRef = useRef<ActionType>();
    

    const getMarkey = usePopInfo()
    // 生成 intl 对象
    // const enUSIntl = createIntl('en_US', enUS);
    const refresh = (): void => {
        actionRef.current?.reload()
    }
    return (
        <>
            <ProTable<GithubIssueItem>

                size="small"
                columns={columns(refresh, getMarkey)}
                actionRef={actionRef}
                bordered
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
                        if(params.log_level){
                            params['log_level[]'] = params.log_level
                            delete params.log_level
                        }
                        let tempParams: any = {
                            ...params,
                            ...sortParams,
                            page: params.current,
                            limit: params.pageSize
                        }
                        list(tempParams).then(res => {
                            resolve({
                                data: res.data.logs,
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
                headerTitle="Alarm Log"
            />
        </>
    );
};