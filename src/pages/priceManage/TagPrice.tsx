import React, { useRef, useState } from 'react';
import { Button, Select, Form, Modal, message, InputNumber } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import usePopInfo from '../../hooks/usePopInfo'
import { getTagList } from '../../services/publicKeys'
import { edit } from '../../services/priceManage/tagPrice'
import { getKesGroup } from '../../utils/utils'
import { priceAlgorithms } from '../../services/publicKeys'
const { Option } = Select
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



const columns = (editFn: (visible: boolean, id: number) => void): ProColumns<GithubIssueItem>[] => [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: 'Tag name',
        dataIndex: 'tag_name',
        render: (_, record: any) => {
            return record.tag_name
        }
    },
    {
        title: 'vendor',
        dataIndex: 'vendor',
        render: (_, record: {
            vendor: {
                vendor_name: string
            }
        }) => {
            return record.vendor.vendor_name
        }
    },
    {
        title: 'Price algorithm',
        dataIndex: 'price_algorithm',
        render: (_, record: {
            price_algorithm: {
                name: string
            }
        }) => {
            return record.price_algorithm.name
        }
    },
    {
        title: 'quantity_offset',
        dataIndex: 'quantity_offset',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        render: (_, record: any) => {
            return (
                <>
                    <Button size="small" onClick={() => {
                        editFn(true, record)
                    }}>Edit</Button>
                </>
            )
        }
    }
];

const BatchPriceModal = (props: {
    batchPriceModalVisible: boolean;
    setBatchPriceModalVisible: (visible: boolean) => void;
    listingId: any;
    refresh: () => void;
}) => {
    const { batchPriceModalVisible, setBatchPriceModalVisible, listingId, refresh } = props
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [from] = Form.useForm();
    const handleCancel = () => {
        setBatchPriceModalVisible(false);
        from.resetFields()
    }
    const onEmit = () => {
        setConfirmLoading(true)
        // do something
        from
            .validateFields()
            .then((updatedValues: any) => {
                edit({
                    tag_id: listingId.id,
                    ...updatedValues
                }).then((res: {
                    code: number;
                    msg: string;
                    data: any;
                }) => {
                    if (res.code) {
                        message.success("opetaion successful!")
                    } else {
                        throw res.msg
                    }
                }).catch(e => {
                    message.error(e)
                }).finally(() => {
                    setConfirmLoading(false)
                    setBatchPriceModalVisible(false)
                    refresh()
                })
            })
    };
    React.useEffect(() => {
        if (batchPriceModalVisible && listingId) {
            from.setFieldsValue({
                price_algorithm_id: listingId['price_algorithm_id'],
                quantity_offset: listingId['quantity_offset']
            })
        } else {
            return
        }
    }, [batchPriceModalVisible])
    return (
        <Modal title="edit" visible={batchPriceModalVisible} onOk={onEmit} onCancel={handleCancel} confirmLoading={confirmLoading}>
            <Form
                form={from}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 14 }}
            >
                <Form.Item
                    label="Price algorithm"
                    name="price_algorithm_id"
                    rules={[{ required: true, message: 'Please input your price algorithm!' }]}
                >
                    <Select
                        placeholder="Select a option and change input text above"
                        allowClear
                    >
                        {getKesGroup('priceAlgorithmsData').map((item: priceAlgorithms) => {
                            return <Option key={`option${item.id}`} value={item.id}>{item.name}</Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="quantity_offset"
                    name="quantity_offset"
                    rules={[{ required: true, message: 'Please input your quantity_offset!' }]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default () => {
    const actionRef = useRef<ActionType>();
    const [visible, setVisible] = useState(false)
    const [listId, setListId] = useState({})
    // 生成 intl 对象
    // const enUSIntl = createIntl('en_US', enUS);
    const refresh = (): void => {
        actionRef.current?.reload()
    }
    const editFn = (comlounVisible: boolean, listId: any) => {
        setVisible(comlounVisible)
        setListId(listId)
        console.log(listId)
    }
    return (
        <>
            <ProTable<GithubIssueItem>
                size="small"
                columns={columns(editFn)}
                actionRef={actionRef}
                request={async (
                    params = {},
                    sort,
                ) =>
                    new Promise((resolve) => {
                        getTagList().then(res => {
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
                search={false}
                pagination={{
                    pageSize: 50,
                }}
                options={{
                    search: false,
                }}
                dateFormatter="string"
                headerTitle={'Tag'}
                toolBarRender={() => [
                    //    <Button key="ImportOutlined" icon={<ImportOutlined/>}>Batch unlist</Button>,
                    //    <Button key="uploadAndDown" icon={<TableOutlined/>}>CSV Upload / Download with tags</Button>
                ]}
            />
            <BatchPriceModal batchPriceModalVisible={visible} setBatchPriceModalVisible={setVisible} listingId={listId} refresh={refresh} />
        </>
    );
};