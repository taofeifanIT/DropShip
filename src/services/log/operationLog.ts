import { request } from 'umi';

type listItem = {
    page: number,
    limit: number,
    batch_id?: string,
    admin_id?: string,
    username?: string,
    // upc?: string,
    // asin?: string,
    // listing_status?: number,
}

export async function list(params: listItem) {
  return request('/api/log/log_admin_operation',{
    method: 'get',
    params: params,
  });
}
