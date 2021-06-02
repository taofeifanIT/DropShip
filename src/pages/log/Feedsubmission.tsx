import { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { listIndex } from '../../services/log/feedsubmission';
import { getKesGroup } from '../../utils/utils';
import { stores } from '../../services/publicKeys';

const columns = (): ProColumns<any>[] => [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: 'FeedSubmissionId',
    dataIndex: 'FeedSubmissionId',
    copyable: true,
  },
  {
    title: 'FeedResultResponse',
    dataIndex: 'FeedResultResponse',
    search: false,
    valueType: 'code',
    width: 1681,
  },
  {
    title: 'Store',
    dataIndex: 'store_id',
    valueType: 'select',
    width: 108,
    request: async () => {
      return [
        ...getKesGroup('storeData').map((item: stores) => {
          return {
            label: item.name,
            value: item.id,
          };
        }),
      ];
    },
  },
  {
    title: 'ts_sku',
    dataIndex: 'ts_sku',
    copyable: true,
  },
  {
    title: 'Response Time',
    dataIndex: 'ResponseTime',
    search: false,
    width: 220,
  },
];

export default () => {
  const actionRef = useRef<ActionType>();
  return (
    <>
      <ProTable
        size="small"
        columns={columns()}
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
            listIndex(tempParams).then((res) => {
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
        scroll={{ x: columns().reduce((sum, e) => sum + Number(e.width || 0), 0) }}
        dateFormatter="string"
        headerTitle={<>Feedsinmission</>}
      />
    </>
  );
};
