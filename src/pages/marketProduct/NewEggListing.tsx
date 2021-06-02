import { useRef } from 'react';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { neweggListing } from '../../services/amazonListing/newEggListing';
import { getNewEggHref } from '../../utils/jumpUrl';
import { getStoreList } from '../../services/publicKeys';
import moment from 'moment';
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
  },
  {
    title: 'SellerPartNumber',
    dataIndex: 'SellerPartNumber',
  },
  {
    title: 'Newegg',
    dataIndex: 'NeweggItemNumber',
    render: (text: string) => {
      return (
        <a target="_Blank" href={getNewEggHref(text)}>
          {text}
        </a>
      );
    },
  },
  {
    title: 'marketplace_and_db_diff',
    dataIndex: 'marketplace_and_db_diff',
    valueType: 'select',
    hideInTable: true,
    valueEnum: {
      '1': { text: 'InmarketplaceNotInDb', status: 'Error' },
    },
  },
  {
    title: 'Inventory',
    dataIndex: 'Inventory',
    width: 200,
    search: false,
    render: (Inventory) => {
      return (
        <>
          <span>{Inventory}</span>
        </>
      );
    },
  },
  {
    title: 'Store',
    dataIndex: 'store_id',
    valueType: 'select',
    request: async (): Promise<any> => {
      return await getTagName();
    },
  },
  {
    title: 'update_at',
    dataIndex: 'update_at',
    search: false,
    render: (text) => {
      return moment(parseInt(text + '000')).format('YYYY-MM-DD HH:mm:ss');
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
            neweggListing(tempParams).then((res) => {
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
        headerTitle={<>newEgg Listing</>}
      />
    </>
  );
};
