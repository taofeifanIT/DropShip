import { request } from 'umi';

export async function products(params: any) {
  return request('/api/vendor/im/products', {
    method: 'POST',
    data: params,
  });
}

export async function listing(params: any) {
  return request('/api/vendor/im/listing', {
    method: 'POST',
    data: params,
  });
}

export async function update(params: {
  id: number;
  is_auth?: number;
  auth_info?: number;
  match_amazon?: number;
}) {
  return request('/api/vendor/im/update', {
    method: 'POST',
    data: params,
  });
}

export async function deleteItem(id: number) {
  return request(`/api/vendor/im/delete?id=${id}`);
}
export function downloadCsv() {
  return `http://api-multi.itmars.net/vendor/im/products`;
}

export async function log_vendor_quantity_and_price_change(params: {
  id: number;
  vendor_sku: string;
}) {
  return request(
    `/api/log/log_vendor_quantity_and_price_change?vendor_id=${params.id}&vendor_sku=${params.vendor_sku}`,
  );
}

export async function show() {
  return request(`/api/vendor/im/dashboard`);
}

export async function batchList(data: {
  store_id: number;
  ids: number[]
}){
  return request('/api/vendor/im/batch_listing',{
    method: "POST",
    data
  })
}