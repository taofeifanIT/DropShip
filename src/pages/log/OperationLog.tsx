import React, { useRef, useState } from 'react';
import { Typography, Space, Button } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { list } from '../../services/log/operationLog';
import usePopInfo from '../../hooks/usePopInfo';
import { getQueryVariable } from '../../utils/utils';
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

const columns = (
  refresh: () => void,
  getMarkey: (id: number, key: string) => any,
): ProColumns<GithubIssueItem>[] => [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
    align: 'center',
  },
  {
    dataIndex: 'username',
    title: 'User name',
    width: 150,
    copyable: true,
  },
  {
    dataIndex: 'request_url',
    title: 'Request url',
    copyable: true,
    width: 300,
    search: false,
  },
  {
    dataIndex: 'param',
    title: 'param',
    search: false,
    copyable: true,
    valueType: 'code',
  },
  {
    dataIndex: 'controller_action',
    title: 'Controller action',
    copyable: true,
    search: false,
  },
  {
    dataIndex: 'add_time',
    title: 'time',
    copyable: true,
    search: false,
    render: (_, record: { add_time: number }) => {
      const time = moment(parseInt(record.add_time + '000')).format('YYYY-MM-DD HH:mm:ss');
      return time;
    },
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  const getMarkey = usePopInfo();

  const [batchId, setBatchId] = useState(getQueryVariable('batch_id') || undefined);
  // 生成 intl 对象
  // const enUSIntl = createIntl('en_US', enUS);
  const refresh = (): void => {
    actionRef.current?.reload();
  };

  return (
    <>
      <ProTable<GithubIssueItem>
        size="small"
        columns={columns(refresh, getMarkey)}
        actionRef={actionRef}
        bordered
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
              batch_id: batchId,
              page: params.current,
              limit: params.pageSize,
            };
            list(tempParams).then((res) => {
              resolve({
                data: res.data.logs,
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
        headerTitle="Operation log"
        toolBarRender={() => [
          <Button
            key="ImportOutlined"
            icon={<RollbackOutlined />}
            type="primary"
            disabled={!batchId}
            onClick={() => {
              history.back();
            }}
            danger
          >
            back
          </Button>,
        ]}
      />
    </>
  );
};
