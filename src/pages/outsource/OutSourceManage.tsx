import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { update,settle } from '@/services/outsource'
import { request } from 'umi';
import { message,Popconfirm, InputNumber, Statistic, Row, Col} from 'antd';
import { getPageHeight } from '@/utils/utils';
import styles from '@/pages/order/style.less';

const waitTime = (data: DataSourceType) => {
  return new Promise((resolve,reject) => {
    update({
        id: data.id,
        total_paid_money: data.total_paid_money,
        total_paid_data: data.total_paid_data,
        processed_data: data.processed_data,
        rates: data.rates
    }).then(res => {
        if(res.code){
            message.success('Saved!')
            resolve(true);
        } else {
            message.error(res.msg)
            reject(false);
        }
    })
  });
};

type DataSourceType =  {
    id: number;
    user_id: number;
    total_paid_money: string;
    total_paid_data: number;
    processed_data: number;
    shouled_pay_money: number;
    latest_paid_money: number;
    latest_paid_date?: number;
    latest_paid_data?: number;
    rates: number;
    created_at: string;
    updated_at: string;
    adminuser: {
        username: string;
    }
}

const PayBtn = (props: {row: DataSourceType, fn: () => void}) =>{
    const [shouldPayMoney,setShouldPayMoney] = useState(props.row.shouled_pay_money)
    const [shouldPayData,setShouldPayData] = useState<number>()
    const [visible, setVisible] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const handleOk = () => {
        setConfirmLoading(true);
        settle({
            id: props.row.id,
            latest_paid_money: shouldPayMoney,
            latest_paid_data: shouldPayData
        }).then(res => {
            if(res.code){
                message.success('Pay for success!')
                props.fn()
            } else {
                throw res.msg
            }
        }).catch(e => {
            message.error(e)
        }).finally(() => {
            setVisible(false);
            setConfirmLoading(false);
        })
      };
    const showPopconfirm = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        setVisible(false);
      };
    return (<>
    <Popconfirm 
        key={props.row.id + 'Popconfirm'}
        title={<><InputNumber value={shouldPayMoney} onChange={e => {
            setShouldPayMoney(e)
        }} /><span> </span><InputNumber value={shouldPayData} placeholder='The number of' onChange={(val: number) => {
            setShouldPayData(val)
        }} /></>} 
        okText="Yes" 
        cancelText="No"
        visible={visible}
        okButtonProps={{ loading: confirmLoading }}
        onCancel={handleCancel}
        onConfirm={handleOk}>
            <a key="paya" onClick={showPopconfirm}>pay</a>
      </Popconfirm>
    </>)
}

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<DataSourceType[]>([]);
  const [total,setTotal] =  useState(0);
  const [CumulativePaymentAmount, setCumulativePaymentAmount] = useState(0)
  const [currentRow, setCurrentRow] = useState(-1);
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: 'user',
      dataIndex: 'adminuser',
      width: '100px',
      editable:  false,
      render: (text:any) => {
          return text.username
      }
    },
    {
        title: 'total_paid_money',
        dataIndex: 'total_paid_money',
        width: '100px',
        valueType: 'digit',
    },
    {
        title: 'total_paid_data',
        dataIndex: 'total_paid_data',
        width: '100px',
        valueType: 'digit',
    },
    {
        title: 'processed_data',
        dataIndex: 'processed_data',
        width: '100px',
        valueType: 'digit',
        editable:  false,
    },
    {
        title: 'shouled_pay_money',
        dataIndex: 'shouled_pay_money',
        width: '100px',
        editable:  false,
    },
    {
        title: 'latest_paid_money',
        dataIndex: 'latest_paid_money',
        width: '100px',
        editable:  false,
    },
    {
        title: 'latest_paid_date',
        dataIndex: 'latest_paid_date',
        width: '100px',
        editable:  false,
    },
    {
        title: 'rates',
        dataIndex: 'rates',
        width: '100px',
        valueType: 'digit',
    },
    {
      title: 'action',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
          <PayBtn row={record} fn={action.reload} />
        ,
        <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        edit
      </a>
      ],
    },
  ];

  return (
    <>
    <EditableProTable<DataSourceType>
        rowKey="id"
        className={styles.tableStyle}
        headerTitle={
            <Row gutter={24} style={{width: '660px'}}>
            <Col span={8}>
              <Statistic title="Cumulative payment amount" value={CumulativePaymentAmount} />
            </Col>
            <Col span={8}>
             <Statistic title="Number of outsourcing" value={total} precision={0} />
            </Col>
          </Row>
        }
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        columns={columns}
        rowClassName={(record) => {
          return record.id === currentRow ? 'clickRowStyl' : '';
        }}
        onRow={(record: DataSourceType) => {
          return {
            onClick: () => {
              setCurrentRow(record.id);
            },
          };
        }}
        request={async (params = {}) => 
          new Promise((resolve) => {
            params = {
                ...params,
                page: params.current,
                limit: params.pageSize,
              };
            request<{
              data: DataSourceType[];
            }>('/api/outsourcing_money/getList', {
              params,
            }).then((res: any) => {
              setTotal(res.data.total)
              setCumulativePaymentAmount(res.data.data.reduce((num: number,item: DataSourceType) =>  num + parseFloat(item.total_paid_money || '0'),0))
              resolve({
                data: res.data.data.map((item:DataSourceType) => {
                    return {
                        ...item,
                        shouled_pay_money: (item.processed_data - item.total_paid_data) * parseFloat(item.rates+'')
                    }
                }),
                // success 请返回 true，
                // 不然 table 会停止解析数据，即使有数据
                success: !!res.code,
                // 不传会使用 data 的长度，如果是分页一定要传
                total: res.data.total,
              });
            });
          })
        }
        value={dataSource}
        onChange={setDataSource}
        editable={{
          editableKeys,
          onSave: async (rowKey, data) => {
            await waitTime(data);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
        pagination={{
            pageSize: 50,
          }}
        scroll={{
            y: getPageHeight() - 200,
          }}
      />
    </>
  );
};