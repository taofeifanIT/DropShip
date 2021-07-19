import { request } from 'umi';

export async function products(params: any) {
  return request('/api/vendor/newegg_vendor/products', {
    method: 'POST',
    data: params,
  });
}

export async function listing(params: any) {
  return request('/api/vendor/newegg_vendor/listing', {
    method: 'POST',
    data: params,
  });
}

export async function update(params: { id: number; match_amazon?: number }) {
  return request('/api/vendor/newegg_vendor/update', {
    method: 'POST',
    data: params,
  });
}

export async function deleteItem(id: number) {
  return request(`/api/vendor/newegg_vendor/delete?id=${id}`);
}
export function downloadCsv() {
  return `http://api-multi.itmars.net/vendor/newegg_vendor/products`;
}

export async function show() {
  return request(`/api/vendor/newegg_vendor/dashboard`);
}

export async function batchList(data: {
  store_id: number;
  ids: number[]
}){
  return request('/api/vendor/newegg_vendor/batch_listing',{
    method: "POST",
    data
  })
}

export async function batchDelete(ids: number[]) {
  return request('/api/vendor/newegg_vendor/batch_delete', {
    method: 'POST',
    data: ids,
  });
}