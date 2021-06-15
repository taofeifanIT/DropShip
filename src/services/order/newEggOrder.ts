import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  // upc?: string,
  // asin?: string,
  // listing_status?: number,
};
type shipItem = {
  id: string;
  ShipCarrier: string;
  TrackingNumber: string;
  ShippedQty: number;
}

export async function newEggListing(params: listItem) {
  return request('/api/newegg/newegg_order_items', {
    method: 'get',
    params: params,
  });
}
export async function shipOrder(params: shipItem) {
  return request('/api/newegg/ship_order', {
    method: 'get',
    params: params,
  });
}