import { request } from 'umi';

export async function products(params: any) {
  return request('/api/vendor/intracom_us/products',{
    method: 'POST',
    data: params,
  });
}

export async function listing(params: any) {
  return request('/api/vendor/Intracom_us/listing',{
    method: 'POST',
    data: params,
  });
}

export async function update(params: {
  id: number;
  match_amazon?: number;
}) {
  return request('/api/vendor/Intracom_us/update',{
    method: 'POST',
    data: params,
  });
}

export async function deleteItem(id:number) {
  return request(`/api/vendor/Intracom_us/delete?id=${id}`) 
}
export function downloadCsv() {
  return `http://api-multi.itmars.net/vendor/intracom_us/products`
}

export async function show() {
  return request(`/api/vendor/Intracom_us/dashboard`) 
}