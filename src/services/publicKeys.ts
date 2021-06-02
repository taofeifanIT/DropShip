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
  companyData: any;
  countryData: any;
  marketPlaceData: any;
  vendorData: any;
  storeData: any;
  tagsData: any;
  configsData: any;
  priceAlgorithmsData: any;
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
export const getAllPop = async (): Promise<allPopType> => {
  var keys: Promise<
    | {
        companys: any;
        vendors: any;
        countrys: any;
        marketplaces: any;
        stores: any;
        tags: any;
        configs: any;
        price_algorithms: any;
      }
    | undefined
  > = new Promise((resolve) => {
    getAllKeysValue().then((res) => {
      resolve(res.data);
    });
  });
  const tempKeys = await keys;
  const companyData: company[] = tempKeys?.companys;
  const countryData: country[] = tempKeys?.countrys;
  const marketPlaceData: marketplaces[] = tempKeys?.marketplaces;
  const vendorData: vendors[] = tempKeys?.vendors;
  const storeData: stores[] = tempKeys?.stores;
  const tagsData: tags[] = tempKeys?.tags;
  const configsData: configs = tempKeys?.configs;
  const priceAlgorithmsData: priceAlgorithms[] = tempKeys?.price_algorithms;
  return {
    companyData,
    countryData,
    marketPlaceData,
    vendorData,
    storeData,
    tagsData,
    configsData,
    priceAlgorithmsData,
  };
};
