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

export const getTargetHref = (venderId: number | string) => {
  const srcObj = {
    1: 'https://usa.ingrammicro.com/Site/Search#keywords:',
    2: 'https://www.grainger.com/search?searchBar=true&searchQuery=',
    3: 'https://portal.icintracom.com/shop?order=&search=',
    4: 'https://uk-new.ingrammicro.com/Site/Search#keywords:',
    5: 'https://www.twhouse.com/?s=',
    7: 'https://order.petra.com/product/?search=',
    8: 'https://www.malabs.com/product/',
    9: 'https://www.dandh.com/v4/view?pageReq=MProductDetail&item=',
    10: 'https://www.newegg.com/p/pl?d='
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
