import { request } from 'umi';

export async function products(params: any) {
  return request('/api/vendor/dandh/products', {
    method: 'POST',
    data: params,
  });
}

export async function listing(params: any) {
  return request('/api/vendor/dandh/listing', {
    method: 'POST',
    data: params,
  });
}

export async function update(params: { id: number; match_amazon?: number }) {
  return request('/api/vendor/dandh/update', {
    method: 'POST',
    data: params,
  });
}

export async function deleteItem(id: number) {
  return request(`/api/vendor/dandh/delete?id=${id}`);
}
export function downloadCsv() {
  return `http://api-multi.itmars.net/vendor/Twhouse_us/products`;
}

export async function show() {
  return request(`/api/vendor/dandh/dashboard`);
}

export async function batchList(data: {
  store_id: number;
  ids: number[]
}){
  return request('/api/vendor/dandh/batch_listing',{
    method: "POST",
    data
  })
}

export async function batchDelete(ids: number[]) {
  return request('/api/vendor/dandh/batch_delete', {
    method: 'POST',
    data: ids,
  });
}