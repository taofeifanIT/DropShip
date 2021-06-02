import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  log_level?: number[];
  // upc?: string,
  // asin?: string,
  // listing_status?: number,
};

export async function list(params: listItem) {
  return request('/api/log/index', {
    method: 'get',
    params: params,
  });
}

export async function getLogLevel() {
  return request('/api/log/log_level');
}

export async function clear() {
  return request('/api/log/clear');
}
