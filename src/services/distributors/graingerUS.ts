import { request } from 'umi';

export async function products(params: any) {
  return request('/api/vendor/grainger_us/products',{
    method: 'POST',
    data: params,
  });
}

export async function listing(params: any) {
  return request('/api/vendor/grainger_us/listing',{
    method: 'POST',
    data: params,
  });
}


export async function update(params: {
  id: number;
  match_amazon?: number;
}) {
  return request('/api/vendor/grainger_us/update',{
    method: 'POST',
    data: params,
  });
}

export async function deleteItem(id:number) {
  return request(`/api/vendor/grainger_us/delete?id=${id}`) 
}
export async function downloadCsv(id:number) {
  return `/api/vendor/grainger_us/download_csv?tag_id=${id}`
}

export async function show() {
  return request(`/api/vendor/Grainger_us/dashboard`) 
}