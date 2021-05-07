import { request } from 'umi';

export async function lists() {
  return request('/api/price_algorithm/lists');
}

export async function changeTagPriceAlgorithm(params: {
    price_algorithm_id: number;
    tag_id: number;
}) {
    return request('/api/tag/change_tag_price_algorithm',{
        method: "GET",
        params: params
    });
}
