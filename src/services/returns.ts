import { request } from 'umi';

type requestItem = {
  page: number;
  limit: number;
  store_id?: number;
  AmazonOrderId?: number;
  OrderNumber?: string;
  NeweggItemNumber?: string;
  SellerPartNumber?: string;
};


type updateReturnStatusItem = {
  id: number;
  status: number;
}

export async function listIndex(params: requestItem) {
  return request('/api/amazon/returns', {
    method: 'get',
    params: params,
  });
}

export async function newEggReturns(params: requestItem) {
  return request('/api/newegg/returns', {
    method: 'get',
    params: params,
  });
}

export async function updateReturnStatus(params: updateReturnStatusItem) {
  return request('/api/amazon/updateReturnStatus', {
    method: 'post',
    data: params,
  });
}

