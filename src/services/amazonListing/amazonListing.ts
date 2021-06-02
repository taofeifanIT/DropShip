import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  // upc?: string,
  // asin?: string,
  // listing_status?: number,
};

export async function amazonListing(params: listItem) {
  return request('/api/amazon/amazon_listing', {
    method: 'get',
    params: params,
  });
}

export async function amazonListingDiff(params: listItem) {
  return request('/api/amazon/amazon_listing_diff', {
    method: 'get',
    params: params,
  });
}
