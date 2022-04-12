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
export async function shopifyOrders(params: listItem) {
  return request('/api/shopify/shopify_order_items', {
    method: 'get',
    params: params,
  });
}


export async function manualOrder(data: {
  order_id: string;
  is_sure: number;
}) {
  return request('/api/shopify/manual_order', {
    method: 'POST',
    data
  });
}

export async function setPurchasePrice(params: { id: string,purchase_price: string }) {
  return request('/api/shopify/setPurchasePrice', {
    method: 'POST',
    data: params,
  });
}



export async function getList() {
  return request('/api/order_ack/getListForShopify');
}