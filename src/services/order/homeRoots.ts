import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  store_id?: string,
  country_id?: string,
  orderId?: number,
  sku?: string,
  title?: string,
  vendor_id?: number,
};
export async function homeRootsOrders(params: listItem) {
  return request('/api/ebay/homeRoots_order_items', {
    method: 'get',
    params: params,
  });
}
