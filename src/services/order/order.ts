import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  // upc?: string,
  // asin?: string,
  // listing_status?: number,
};

export async function list(params: listItem) {
  return request('/api/amazon/amazon_order_items', {
    method: 'get',
    params: params,
  });
}

export async function cancelOrderTotal() {
  return request('/api/order/cancel_order_total');
}

export async function getConfigs() {
  return request('/api/config/getConfigs');
}
export async function saleLimit(data: { order_quantity_limit: number }) {
  return request('/api/config/sale_limit', {
    method: 'POST',
    data,
  });
}
