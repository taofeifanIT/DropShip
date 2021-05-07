import { request } from 'umi';

type listItem = {
    page: number,
    limit: number,
    // upc?: string,
    // asin?: string,
    // listing_status?: number,
}

export async function neweggListing(params: listItem) {
  return request('/api/newegg/newegg_listing',{
    method: 'get',
    params: params,
  });
}

  