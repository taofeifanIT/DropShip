import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  // upc?: string,
  // asin?: string,
  // listing_status?: number,
};

export async function newEggListing(params: listItem) {
  return request('/api/newegg/newegg_order_items', {
    method: 'get',
    params: params,
  });
}
