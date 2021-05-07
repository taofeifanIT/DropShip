import { request } from 'umi';



export async function matchAndListing(params: {after_at: number | string}) {
  return request('/api/dashboard/match_and_listing',{
    method: 'get',
    params: params,
  });
}

export async function total() {
    return request('/api/dashboard/total')
}
export async function storeRanking() {
    return request('/api/dashboard/store_ranking')
}
export async function saleRanking() {
  return request('/api/dashboard/sale_ranking')
}
export async function tagRanking(params: {
  page: number;
  limit:number;
}) {
  return request('/api/dashboard/tag_ranking',{
    params: params,
    method: 'GET'
  })
}

export async function marketplaceRanking() {
  return request('/api/dashboard/marketplace_ranking')
}

export async function countryRanking() {
  return request('/api/dashboard/country_ranking')
}