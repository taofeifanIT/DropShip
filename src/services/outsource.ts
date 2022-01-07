import { request } from 'umi';

export type requestItem = {
  limit: number | undefined;
  page: number | undefined;
  user_id?: number | undefined;
};

type updateItem = {
    id: number;
    total_paid_money: string;
    total_paid_data: number;
    processed_data: number;
    rates: number;
}

type settleItem = {
    id: number;
    latest_paid_money: number;
    latest_paid_data: number | undefined;
}
export async function getList(params: requestItem) {
  return request('/api/outsourcing_money/getList', {
    method: 'GET',
    params: params,
  });
}

export async function update(params: updateItem) {
  return request('/api/outsourcing_money/update', {
    method: 'POST',
    data: params,
  });
}

export async function settle(params: settleItem) {
    return request('/api/outsourcing_money/settle', {
      method: 'POST',
      data: params,
    });
  }
