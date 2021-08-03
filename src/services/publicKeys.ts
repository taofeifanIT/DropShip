import { request } from 'umi';

export async function getMarketPlaceList() {
  return request('/api/marketplace/lists');
}

export async function getVendorList() {
  return request('/api/vendor/vendor/lists');
}

export async function getStoreList() {
  return request('/api/store/lists');
}

export async function getCompanyList() {
  return request('/api/company/lists', {
    method: 'GET',
    redirect: 'follow',
  });
}

export async function getCountryList() {
  return request('/api/country/lists');
}

export async function getTagList() {
  return request('/api/tag/lists');
}

export async function getAllKeysValue() {
  return request('/api/app/onlond');
}

export type allPopType = {
  companyData: company[];
  countryData: country[];
  marketPlaceData: marketplaces[];
  vendorData: vendors[];
  storeData: stores[];
  tagsData: tags[];
  configsData: configs[];
  priceAlgorithmsData: priceAlgorithms[];
  listing_sort_field: listing_sort_field;
};
export type stores = {
  id: number;
  name: string;
};
export type company = {
  id: number;
  name: string;
};
export type country = {
  id: number;
  country: string;
};
export type vendors = {
  id: number;
  vendor_name: string;
};
export type tags = {
  id: number;
  tag_name: string;
  is_assigned: boolean;
};
export type marketplaces = {
  id: number;
  marketplace: string;
};
export type configs = {
  developer_tel: string;
  operation_tel: string;
  order_quantity_limit: string;
};
export type priceAlgorithms = {
  id: number;
  name: string;
};

export type listing_sort_field = any
export const getAllPop = async (): Promise<allPopType> => {
  const keys: Promise<
    | {
        companys: company[];
        vendors: vendors[];
        countrys: country[];
        marketplaces: marketplaces[];
        stores: stores[];
        tags: tags[];
        configs: configs[];
        price_algorithms: priceAlgorithms[];
        listing_sort_field: listing_sort_field[];
      }
  > = new Promise((resolve) => {
    getAllKeysValue().then((res) => {
      resolve(res.data);
    });
  });
  const tempKeys = await keys;
  const companyData = tempKeys?.companys;
  const countryData = tempKeys?.countrys;
  const marketPlaceData = tempKeys?.marketplaces;
  const vendorData= tempKeys?.vendors;
  const storeData = tempKeys?.stores;
  const tagsData= tempKeys?.tags;
  const configsData = tempKeys?.configs;
  const priceAlgorithmsData = tempKeys?.price_algorithms;
  const listing_sort_field = tempKeys?.listing_sort_field;
  return {
    companyData,
    countryData,
    marketPlaceData,
    vendorData,
    storeData,
    tagsData,
    configsData,
    priceAlgorithmsData,
    listing_sort_field
  };
};
