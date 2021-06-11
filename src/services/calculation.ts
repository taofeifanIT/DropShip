import { request } from 'umi';

export async function listingwuList(params: {
  asin: String | undefined;
  pm: String | undefined;
  page: number;
  limit: number;
}) {
    return request('/api/export/listingwu_list', {
      method: 'GET',
      params: params,
    });
  }

  export function importTemplate (data:any) {
    return request('/api/export/upload_listing_file',{
      method: 'POST',
      // headers: {'Content-Type':'multipart/form-data'},
      data: data
    })
  }