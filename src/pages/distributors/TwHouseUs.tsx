import { useEffect, useRef, useState } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Statistic, Row, Col, Tooltip, Table, Spin } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { products, listing, update, deleteItem, downloadCsv, show } from '../../services/distributors/twHouseUs'
import type { FormInstance } from 'antd';
import { useModel } from 'umi'; 
import { createDownload } from '../../utils/utils'
import Notes from '../../components/Notes'
import { columns } from './supplierFunction'
// import pop from '../../hooks/getMarket'
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
const Head = () => {
    const [data, setData] = useState<{
        total: number;
        total_deleted: number;
        total_listed: number;
    }>()
    const [loading, setLoading] = useState(false)
    const init = () => {
        show().then(res => {
            setData(res.data)
        }).finally(() => {
            setLoading(false)
        })
    }
    useEffect(() => {
        init()
    }, [])
    return (<>
         <Spin spinning={loading}>
         <Row gutter={24} style={{ background: "#fff", margin: "0", marginBottom: "15px", padding: "12px" }}>
                <Tooltip
                    title='Operation data of the day'
                >
                    <InfoCircleOutlined style={{ marginLeft: 8, position: 'absolute', zIndex: 100000, cursor: 'pointer' }} />
                </Tooltip>
                <Col span={8} style={{ textAlign: "center" }}>
                    <Statistic title="Total" value={data?.total} />
                </Col>
                <Col span={8} style={{ textAlign: "center" }}>
                    <Statistic title="Deleted" value={data?.total_deleted}/>
                </Col>
                <Col span={8} style={{ textAlign: "center" }}>
                    <Statistic title="Listed" value={data?.total_listed} />
                </Col>
            </Row>
         </Spin>
    </>)
}
export default () => {
    const actionRef = useRef<ActionType>();
    const ref = useRef<FormInstance>();
    const { initialState } = useModel('@@initialState');
    const [drawerVisible, setDrawerVisible] = useState(false)
    const [record, setRecord] = useState<any>()
    // 生成 intl 对象
    // const enUSIntl = createIntl('en_US', enUS);
    const refresh = (): void => {
        actionRef.current?.reload()
    }
      useEffect(() => {
        refresh()
      }, [initialState?.conText])
    return (
        <>
            <Head />
            <Notes visible={drawerVisible} setVisible={setDrawerVisible} {...record} refresh={refresh} updateApi={update} />
            <ProTable<GithubIssueItem>
                rowSelection={{
                    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
                }}
                size="small"
                bordered
                columns={columns({updateApi: update, listingApi: listing, deleteApi: deleteItem}, refresh)}
                actionRef={actionRef}
                formRef={ref}
                request={async (
                    params = {},
                    sort,
                ) =>
                    new Promise((resolve) => {
                        let sortParams: {
                            sort_by?: string;
                            sort_field?: string;
                        } = {}
                        if (sort) {
                            for (let key in sort) {
                                sortParams.sort_by = sort[key] === 'descend' ? 'desc' : 'asc'
                                sortParams.sort_field = key
                            }
                        }
                        let tempParams = {
                            ...params,
                            ...sortParams,
                            page: params.current,
                            limit: params.pageSize
                        }
                        products(tempParams).then(res => {
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
                    pageSize: 30,
                }}
                options={{
                    search: false,
                }}
                onRow={(record:{
                    id: number;
                    notes: string;
                    vendor_sku: string;
                    ts_sku: string;
                }) => {
                    return {
                      onDoubleClick: event => {
                        setDrawerVisible(true)
                        setRecord({
                            id: record.id,
                            content: record.notes || '',
                            title: record.ts_sku
                        })
                      }, 
                      onClick: event => {
                        if(drawerVisible){
                            setRecord({
                                id: record.id,
                                content: record.notes || '',
                                title: record.ts_sku
                            })
                        }
                      },
                    };
                  }}
                dateFormatter="string"
                headerTitle="Tw house"
                toolBarRender={() => [
                    <Button onClick={() => {
                        // console.log()
                        const valObj = ref.current?.getFieldsValue()
                        let tempParams: any = ''
                        let index = 0
                        for(let key in valObj){
                            if(valObj[key]){
                                let paramsStr = `${key}=${valObj[key]}`
                                if(index === 1){
                                    tempParams += `${paramsStr}`
                                } else {
                                    tempParams += '&'+paramsStr
                                }
                            }
                            index ++
                        }
                        if(tempParams){
                            tempParams = downloadCsv() + '?' + tempParams + '&is_download=1'
                        } else {
                            tempParams = downloadCsv()+ '?is_download=1'
                        }
                        createDownload(`test.csv`, tempParams)
                        // console.log(tempParams)
                        
                    }}>
                    Download
                  </Button>
                ]}
            />
        </>
    );
};