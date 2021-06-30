import { request } from 'umi';

export async function listingwuList(params: {
  asin: String | undefined;
  admin_id: Number | undefined;
  brand: String | undefined,
  sale_marketplace: String | undefined;
  page: number;
  limit: number;
  orderby: string | undefined;
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

 

  export function changePm(params:{admin_id: number;ids: number[] | Number[]}){
    return request('/api/export/change_pm',{
      method: 'POST',
      data: params
    })
  }
  export function listingTest(params:{store_ids: number[];ids: number[] | Number[]}){
    return request('/api/export/listing_test',{
      method: 'POST',
      data: params
    })
  }