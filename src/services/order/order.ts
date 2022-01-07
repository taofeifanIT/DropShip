import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  // upc?: string,
  // asin?: string,
  // listing_status?: number,
};

type updateItem = {
  vendor_id: number;
  vendor_sku: string;
  is_trial: number
}

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

export async function updateIssueTrack(data: {id: number; issue_tracking: number }) {
  return request('/api/amazon/update_issue_track', {
    method: 'POST',
    data,
  });
}

export async function checkIssueOrder() {
  return request('/api/amazon/checkIssueOrder');
}

export async function getList() {
  return request('/api/order_ack/getList');
}

export async function getAmazonOrders(data: {day: 1 | 2}) {
  return request('/api/amazon/getAmazonOrders', {
    method: 'POST',
    data,
  });
}

export async function updateTrial(params: updateItem) {
  return request('/api/amazon/updateTrial', {
    method: 'POST',
    data: params,
  });
}

export async function autoOrder(params: {amazonOrderId: string}) {
  return request('/api/amazon/auto_order', {
    method: 'POST',
    data: params,
  });
}
