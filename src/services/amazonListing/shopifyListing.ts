import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  store_id?: number;
  ts_sku?: number;
  status?: string
  marketplace_and_db_diff?: number
  product_id?: string
};

export async function getListing(params: listItem) {
  return request('/api/shopify/getListing', {
    method: 'get',
    params: params,
  });
}