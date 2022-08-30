/*
 * @Author: taofeifanIT 3553447302@qq.com
 * @Date: 2021-08-16 10:19:37
 * @LastEditors: taofeifanIT 3553447302@qq.com
 * @LastEditTime: 2022-07-29 10:09:09
 * @FilePath: \DropShip01\src\utils\jumpUrl.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const getHref = (contryId: number) => {
  let srcObj = {};
  // eslint-disable-next-line default-case
  switch (contryId) {
    case 1:
      srcObj = {
        im: 'https://usa.ingrammicro.com/Site/Search#keywords:',
        grainger: 'https://www.grainger.com/search?searchBar=true&searchQuery=',
        inracom: 'https://portal.icintracom.com/shop?order=&search=',
        Tw: 'https://www.twhouse.com/?s=',
      };
      break;
    case 2:
      srcObj = {
        im: 'https://uk-new.ingrammicro.com/Site/Search#keywords:',
        grainger: 'https://www.grainger.com/search?searchBar=true&searchQuery=',
        inracom: 'https://portal.icintracom.com/shop?order=&search=',
        Tw: 'https://www.twhouse.com/?s=',
      };
      break;
  }
  return srcObj;
};

export const getTargetHref = (venderId: number | string, sku: string) => {
  const srcObj = {
    1: `https://usa.ingrammicro.com/Site/Search#keywords:${sku}`,
    2: `https://www.grainger.com/search?searchBar=true&searchQuery=${sku}`,
    3: `https://portal.icintracom.com/shop?order=&search=${sku}`,
    4: `https://uk-new.ingrammicro.com/Site/Search#keywords:${sku}`,
    5: `https://www.twhouse.com/?s=${sku}`,
    6: `https://old.eldorado.net/index.php?main_page=advanced_search_result&search_in_description=1&keyword=${sku}`,
    7: `https://order.petra.com/product/?search=${sku}`,
    8: `https://www.malabs.com/product/${sku}`,
    9: `https://www.dandh.com/v4/view?pageReq=MProductDetail&item=${sku}`,
    10: `https://vl-multi.itmars.net/distributors/EbayProductInfo?vendor_sku=${sku}`,
    11: `https://www.scansource.com/product?sku=${sku}`,
    12: `https://ec.synnex.com/ecx/part/techNote.html?skuNo=${sku}`,
    13: `https://www.zoro.com/search?q=${sku.replace("-zoro","")}`,
    14: `https://www.homeroots.co/inventory/${sku}`,
    17: `https://www.asipartner.com/partneraccess/search.aspx?skey=${sku}`,
    18: `https://www.fragrancex.com/widgets/topmenu/search.html?k=${sku}`,
  };
  return srcObj[venderId];
};

export const getAsonHref = (contryId: number) => {
  let jumpUrl = 'https://www.amazon.com/dp/';
  if (contryId === 2) {
    jumpUrl = 'https://www.amazon.co.uk/dp/';
  }
  return jumpUrl;
};

export const getNewEggHref = (newEggId: string) => {
  return `https://www.newegg.com/p/pl?d=${newEggId}`;
};
