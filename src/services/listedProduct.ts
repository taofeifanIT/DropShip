import { request } from 'umi';

type listItem = {
  page: number;
  limit: number;
  upc?: string;
  asin?: string;
  listing_status?: number;
};

export async function listIndex(params: listItem) {
  return request('/api/listing/index', {
    method: 'get',
    params,
  });
}

export async function listDelete(params: {listing_ids: number[]}) {
  return request('/api/listing/delete', {
    method: 'POST',
    data: params,
  });
}

export async function unlisting(params: { tag_id?: number; listing_ids?: number[] }) {
  return request('/api/listing/unlisting', {
    method: 'POST',
    data: params,
  });
}


export async function realUnlisting(params: { tag_id?: number; ids?: number[] }) {
  return request('/api/ebay/realUnlisting', {
    method: 'POST',
    data: params,
  });
}

export async function quantityOffset(params: { listing_id: number; quantity_offset: number }) {
  return request('/api/listing/quantity_offset', {
    method: 'POST',
    data: params,
  });
}

export async function priceOffset(params: { listing_id: number; price_offset: number }) {
  return request('/api/listing/price_offset', {
    method: 'POST',
    data: params,
  });
}

export async function batchChangeQuantity(params: { listing_ids: number[]; vendor_quantity?: number; quantity_offset?: number, custom_quantity?: number }) {
  return request('/api/listing/update_quantity_by_listing_ids', {
    method: 'POST',
    data: params,
  });
}


export async function update(params: { id: number; notes?: string; asin?: string }) {
  return request('/api/listing/update', {
    method: 'POST',
    data: params,
  });
}

export async function listBlackBrand() {
  return request(`/api/brand_black/lists`);
}

export async function addBlackBrand(name: string) {
  return request(`/api/brand_black/add?name=${name}`);
}

export async function deleteBlackBrand(id: string) {
  return request(`/api/brand_black/delete?id=${id}`);
}


export async function batchRelisting(params: { tag_id?: number; listing_ids?: number[] }) {
  return request('/api/listing/batch_relisting', {
    method: 'POST',
    data: params,
  });
}

export async function autolistBlackBrand() {
  return request(`/api/auto_order_blacklist/lists`);
}

export async function autoAddBlackBrand(name: string) {
  return request(`/api/auto_order_blacklist/add?name=${name}`);
}

export async function autoDeleteBlackBrand(id: string) {
  return request(`/api/auto_order_blacklist/delete?id=${id}`);
}

export async function asinBlacklists() {
  return request(`/api/asin_blacklist/lists`);
}

export async function asinBlackAdd(name: string) {
  return request(`/api/asin_blacklist/add?name=${name}`);
}

export async function asinBlackDelete(id: string) {
  return request(`/api/asin_blacklist/delete?id=${id}`);
}
