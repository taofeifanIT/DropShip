import { request } from 'umi';

type requestItem = {
    page: number;
    limit:number;
    store_id?: number;
    FeedSubmissionId?: string;
}
export async function listIndex(params: requestItem) {
  return request('/api/amazon/feedsubmission_id_list',{
    method: 'get',
    params: params,
  });
}