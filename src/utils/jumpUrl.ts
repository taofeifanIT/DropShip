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
    7: `https://order.petra.com/product/?search=${sku}`,
    8: `https://www.malabs.com/product/${sku}`,
    9: `https://www.dandh.com/v4/view?pageReq=MProductDetail&item=${sku}`,
    10: `https://www.newegg.com/p/pl?d=${sku}`,
    11: `https://www.scansource.com/product?sku=${sku}`,
    12: `https://ec.synnex.com/ecx/part/techNote.html?skuNo=${sku}`
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
