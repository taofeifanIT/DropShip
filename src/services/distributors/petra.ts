import { request } from 'umi';

export async function products(params: any) {
  return request('/api/vendor/Petra/products', {
    method: 'POST',
    data: params,
  });
}

export async function listing(params: any) {
  return request('/api/vendor/Petra/listing', {
    method: 'POST',
    data: params,
  });
}

export async function update(params: { id: number; match_amazon?: number }) {
  return request('/api/vendor/Petra/update', {
    method: 'POST',
    data: params,
  });
}

export async function deleteItem(id: number) {
  return request(`/api/vendor/Petra/delete?id=${id}`);
}
export function downloadCsv() {
  return `http://api-multi.itmars.net/vendor/Petra/products`;
}

export async function show() {
  return request(`/api/vendor/Petra/dashboard`);
}

export async function batchList(data: {
  store_id: number;
  ids: number[]
}){
  return request('/api/vendor/Petra/batch_listing',{
    method: "POST",
    data
  })
}
export async function batchDelete(ids: number[]) {
  return request('/api/vendor/Petra/batch_delete', {
    method: 'POST',
    data: ids,
  });
}