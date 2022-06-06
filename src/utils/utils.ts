import { routerConfigs } from '../../config/router.config';
import * as Icon from '@ant-design/icons';
import React from 'react';
import { getPublicKey } from './cookes';
import { exportExcel } from '@/utils/excelHelper';
import moment from 'moment';
/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export function getMenu(params: Array<any>): any {
  return params.map((item) => {
    let routeObj: any = {
      sort_num: item.sort_num,
      hideInMenu: !item.is_show,
      icon: item.icon && React.createElement(Icon[item.icon.replace(/\s+/g, '')]),
      routes: item.children
        ? getMenu(item.children).sort((a: any, b: any) => a.sort_num - b.sort_num)
        : [],
    };
    if (!routeObj.routes.length) {
      routeObj = {
        ...routerConfigs[item.component],
        ...routeObj,
      };
      delete routeObj.routes;
    } else {
      routeObj.redirect = routeObj.routes[0].path;
      routeObj.name = item.name;
      routeObj.path = '/' + item.name;
    }
    return routeObj;
  });
}

export function createDownload(fileName: string, url: any) {
  // const type = isBinary ? 'application/octet-stream' : ''
  // const blob = new Blob([content])
  if ('download' in document.createElement('a')) {
    // 非IE下载
    const elink = document.createElement('a');
    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = url + '&token=' + localStorage.getItem('token');
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  }
}

export function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return false;
}

export function getKesGroup(
  parentKey:
    | 'companyData'
    | 'countryData'
    | 'marketPlaceData'
    | 'vendorData'
    | 'storeData'
    | 'tagsData'
    | 'configsData'
    | 'priceAlgorithmsData'
    | 'listing_sort_field',
) {
  const allKeys = JSON.parse(getPublicKey());
  return allKeys[parentKey];
}

export function getKesValue(
  parentKey:
    | 'companyData'
    | 'countryData'
    | 'marketPlaceData'
    | 'vendorData'
    | 'storeData'
    | 'tagsData'
    | 'configsData'
    | 'priceAlgorithmsData'
    | 'listing_sort_field',
  key: string | number,
) {
  const allKeys = JSON.parse(getPublicKey());
  const group = allKeys[parentKey];
  if (group instanceof Array) {
    return group.find((item) => item.id === key);
  } else {
    return group[key];
  }
}

export function getPageHeight() {
  const pageHeight = document.body.clientHeight - 48 - 24 - 24;
  return pageHeight;
}

export function throwMenu(Arr: Array<any>, ID: string): any {
  var _result = null;
  for (let i = 0; i < Arr.length; i++) {
    if (Arr[i].path == ID) return Arr[i];
    if (Arr[i].routes) _result = throwMenu(Arr[i].routes, ID);
    if (_result != null) return _result;
  }
  return _result;
}

export function enterF11() {
  var docElm: any = document.documentElement;
  try {
    if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    }
  } catch (error) {
    console.log(error);
  }
}

export function findIndexPage(arr: any[]) {
  let path = '';
  arr.forEach((item) => {
    if (!item.routes) {
      path = item['path'];
    } else {
      path = item.routes[0]['path'];
    }
  });
  return path;
}

export function getPurchaseFromTitle(key:number){
  const excelStore = {
    10: '[Tels] Newegg',
    5: '[Tels] TWHouse',
    7: '[Tels] Petra Industries',
    8: '[Tels] MA Labs',
    6: '[Tels] Eldorado',
    2: '[Tels] Grainger',
    9: '[Tels] D&H Distributing',
    11: '[Tels] Scansource',
    13: '[Tels] Zoro',
    1: '[Tels] Ingram Micro USA',
  };
  return excelStore[key]
}

const otherHeader = [
  { title: 'Date', dataIndex: 'Date', key: 'Date' },
  { title: 'Marketplace', dataIndex: 'Marketplace', key: 'Marketplace' },
  { title: 'OrderID', dataIndex: 'OrderID', key: 'OrderID' },
  { title: 'SKU', dataIndex: 'SKU', key: 'SKU' },
  { title: 'PricePerUnit', dataIndex: 'PricePerUnit', key: 'PricePerUnit',type: 'n'},
  { title: 'QTY', dataIndex: 'QTY', key: 'QTY',type: 'n'},
  { title: 'TotalRevenue', dataIndex: 'TotalRevenue', key: 'TotalRevenue'},
  { title: 'AmazonFee', dataIndex: 'AmazonFee', key: 'AmazonFee' },
  { title: 'PurchasePrice', dataIndex: 'PurchasePrice', key: 'PurchasePrice'},
  { title: 'Profit', dataIndex: 'Profit', key: 'Profit' },
  { title: 'PurchasedFrom', dataIndex: 'PurchasedFrom', key: 'PurchasedFrom' },
  { title: 'Notes', dataIndex: 'Notes', key: 'Notes' },
  { title: 'tagName', dataIndex: 'tagName', key: 'tagName' }
]

const amazonHeader = [
  { title: 'Order ID', dataIndex: 'OrderID', key: 'OrderID' },
  { title: 'Date', dataIndex: 'Date', key: 'Date' },
  { title: 'Marketplace', dataIndex: 'Marketplace', key: 'Marketplace' },
  { title: 'SKU', dataIndex: 'SKU', key: 'SKU' },
  { title: 'PricePerUnit', dataIndex: 'PricePerUnit', key: 'PricePerUnit', type: 'n' },
  { title: 'QTY', dataIndex: 'QTY', key: 'QTY',type: 'n'},
  { title: 'TotalRevenue', dataIndex: 'TotalRevenue', key: 'TotalRevenue' },
  { title: 'AmazonFee', dataIndex: 'AmazonFee', key: 'AmazonFee' },
  { title: 'Purchase Price', dataIndex: 'PurchasePrice', key: 'PurchasePrice', type: 'number' },
  { title: 'Profit', dataIndex: 'Profit', key: 'Profit' },
  { title: 'Purchased From', dataIndex: 'PurchasedFrom', key: 'PurchasedFrom' },
  { title: 'Notes', dataIndex: 'Notes', key: 'Notes' },
  { title: 'tagName', dataIndex: 'tagName', key: 'tagName' },
  { title: 'ack_status', dataIndex: 'ack_status', key: 'ack_status' },
  { title: 'ShipperTrackingNumber', dataIndex: 'ShipperTrackingNumber', key: 'ShipperTrackingNumber' },
]

const shopifyHeader = [
  { title: 'Source order ID', dataIndex: 'sourceOrderID', key: 'sourceOrderID' },
  { title: 'Date', dataIndex: 'Date', key: 'Date' },
  { title: 'Marketplace', dataIndex: 'Marketplace', key: 'Marketplace' },
  { title: 'SKU', dataIndex: 'SKU', key: 'SKU' },
  { title: 'PricePerUnit', dataIndex: 'PricePerUnit', key: 'PricePerUnit', type: 'n' },
  { title: 'QTY', dataIndex: 'QTY', key: 'QTY',type: 'n'},
  { title: 'TotalRevenue', dataIndex: 'TotalRevenue', key: 'TotalRevenue' },
  { title: 'AmazonFee', dataIndex: 'AmazonFee', key: 'AmazonFee' },
  { title: 'Purchase Price', dataIndex: 'PurchasePrice', key: 'PurchasePrice', type: 'number' },
  { title: 'Profit', dataIndex: 'Profit', key: 'Profit' },
  { title: 'Purchased From', dataIndex: 'PurchasedFrom', key: 'PurchasedFrom' },
  { title: 'Notes', dataIndex: 'Notes', key: 'Notes' },
  { title: 'tagName', dataIndex: 'tagName', key: 'tagName' },
  { title: 'ack_status', dataIndex: 'ack_status', key: 'ack_status' },
  { title: 'ShipperTrackingNumber', dataIndex: 'ShipperTrackingNumber', key: 'ShipperTrackingNumber' },
  { title: 'Source', dataIndex: 'source', key: 'source' },
  { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
]

export function exportReport(data: any, store = 0) {
  let header:any = otherHeader
  if(store === 1) header = amazonHeader;
  if(store === 2) header = shopifyHeader;
  exportExcel(header, data, `Orders ${moment().format('MMDD')}.xlsx`);
}
