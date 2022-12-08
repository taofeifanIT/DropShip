/*
 * @Author: taofeifanIT 3553447302@qq.com
 * @Date: 2021-08-16 10:19:37
 * @LastEditors: taofeifanIT 3553447302@qq.com
 * @LastEditTime: 2022-07-28 15:19:42
 * @FilePath: \DropShip01\src\services\order\order.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
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
  is_trial: number;
  marketplace_id?: number;
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

export async function updateIssueTrack(data: { id: number; type: number,issue_tracking?: number, is_cancel?: number }) {
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

export async function getAmazonOrders(data: { day: 1 | 2 }) {
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

export async function autoOrder(params: { amazonOrderId: string,is_sure?: number }) {
  return request('/api/amazon/manual_order', {
    method: 'POST',
    data: params,
  });
}

export async function tagStatus(params: { amazonOrderId: string }) {
  return request('/api/amazon/tag_status', {
    method: 'POST',
    data: params,
  });
}

export async function setPurchasePrice(params: { id: string,purchase_price: string }) {
  return request('/api/amazon/setPurchasePrice', {
    method: 'POST',
    data: params,
  });
}


export async function getCancelOrder() {
  return request('/api/app/getCancelOrder', {
    method: 'POST'
  });
}

export async function updateCancelStatus(params: {id: number,marketplace_id: number,is_cancel: number}) {
  return request('/api/app/updateCancelStatus', {
    method: 'POST',
    data: params,
  });
}

export async function downloadFile(OrderItemId: string) {
  return request(`/api/amazon/download_template?OrderItemId=${OrderItemId}`, {
      method: 'post'
  });
}