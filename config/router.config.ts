export const routerConfigs = {
  setting: { name: 'setting' },
  order: { name: 'order' },
  role: { name: 'role', component: './setting/role', path: '/setting/role' },
  menuManagement: {
    name: 'menuManagement',
    component: './setting/menuManagement',
    path: '/setting/menuManagement',
  },
  userManagement: {
    name: 'userManagement',
    component: './setting/userManagement',
    path: '/setting/userManagement',
  },
  IngramMicro: {
    name: 'IngramMicro',
    component: './distributors/IngramMicro',
    path: '/distributors/IngramMicro',
  },
  GraingerUS: {
    name: 'GraingerUS',
    component: './distributors/GraingerUS',
    path: '/distributors/GraingerUS',
  },
  Intracom: {
    name: 'Intracom',
    component: './distributors/Intracom',
    path: '/distributors/Intracom',
  },
  Listed: {
    name: 'Listed Product',
    component: './listed/ListedProducts',
    path: '/listed/ListedProducts',
  },
  AmazonOrder: {
    name: 'AmazonOrder',
    component: './order/AmazonOrder',
    path: '/order/AmazonOrder',
  },
  WalMartOrders: {
    name: 'WalMartOrders',
    component: './order/WalMartOrders',
    path: '/order/WalMartOrders',
  },
  NewEggOrder: {
    name: 'NewEggOrder',
    component: './order/NewEggOrder',
    path: '/order/NewEggOrder',
  },
  EbayOrder: { name: 'EbayOrder', component: './order/EbayOrder', path: '/order/EbayOrder' },
  amazonListing: {
    name: 'amazonListing',
    path: '/marketProduct/AmazonListing',
    component: './marketProduct/AmazonListing',
  },
  WalMartListing: {
    name: 'WalMartListing',
    component: './marketProduct/WalMartListing',
    path: '/marketProduct/WalMartListing',
  },
  NewEggListing: {
    name: 'NewEggListing',
    component: './marketProduct/NewEggListing',
    path: '/marketProduct/NewEggListing',
  },
  EbayListing: {
    name: 'EbayListing',
    component: './marketProduct/EbayListing',
    path: '/marketProduct/EbayListing',
  },
  tagPrice: {
    name: 'tagPrice',
    path: '/priceManage/TagPrice',
    component: './priceManage/TagPrice',
  },
  Anlysis: { name: 'Anlysis', path: '/dashboard/Anlysis', component: './dashboard/Anlysis' },
  Sales: { name: 'Sales', path: '/dashboard/Sales', component: './dashboard/Sales' },
  AlarmLog: { path: '/log/AlarmLog', name: 'AlarmLog', component: './log/AlarmLog' },
  OperationLog: {
    path: '/log/OperationLog',
    name: 'OperationLog',
    component: './log/OperationLog',
  },
  twHouseUs: {
    path: '/distributors/TwHouseUs',
    name: 'twHouseUs',
    component: './distributors/TwHouseUs',
  },
  AmazonReturns: {
    name: 'AmazonReturns',
    path: '/returns/AmazonReturns',
    component: './returns/AmazonReturns',
  },
  NeweggReturns: {
    name: 'NeweggReturns',
    path: '/returns/NeweggReturns',
    component: './returns/NeweggReturns',
  },
  Feedsubmission: {
    path: '/log/Feedsubmission',
    name: 'Feedsubmission',
    component: './log/Feedsubmission',
  },
  Petra: { name: 'Petra', path: '/distributors/Petra', component: './distributors/Petra' },
  Calculation: {
    name: 'Calculation',
    path: '/datacalculation/Calculation',
    component: './datacalculation/Calculation',
  },
  Maleb:{
    path: '/distributors/Maleb',
    name: 'Maleb',
    component: './distributors/Maleb',
  },
  Dnh:  {
    path: '/distributors/Dnh',
    name: 'Dnh',
    component: './distributors/Dnh',
  },
  NewEgg: {
    path: '/distributors/NewEgg',
    name: 'NewEgg',
    component: './distributors/NewEgg',
  },
  Scansource: {
    path: '/distributors/Scansource',
    name: 'Scansource',
    component: './distributors/Scansource',
  },
  Synnex: {
        path: '/distributors/Synnex',
        name: 'Synnex',
        component: './distributors/Synnex',
  },
  Ebay: {
    path: '/distributors/Ebay',
    name: 'Ebay',
    component: './distributors/Ebay',
  },
  Eldorado: {
    path: '/distributors/Eldorado',
    name: 'Eldorado',
    component: './distributors/Eldorado',
  },
  Zoro:{
    path: '/distributors/Zoro',
    name: 'Zoro',
    component: './distributors/Zoro',
  },
  OutSourceManage:{
    path: '/outsource/OutSourceManage',
    name: 'OutSourceManage',
    component: './outsource/OutSourceManage',
  },
  MarketManagement: {
    path: '/setting/MarketManagement',
    name: 'MarketManagement',
    component: './setting/MarketManagement',
  },
  ShopifyListing: {
    name: 'ShopifyListing',
    component: './marketProduct/ShopifyListing',
    path: '/marketProduct/ShopifyListing',
  },
  HomeRoots: {
    name: 'HomeRoots',
    path: '/order/HomeRoots',
    component: './order/HomeRoots',
  },
  ShopifyOrder: {
    name: 'ShopifyOrder',
    path: '/order/ShopifyOrder',
    component: './order/ShopifyOrder',
  },
};
export const indexRouterMap = (routers: any) => {
  return [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user',
          routes: [
            {
              name: 'login',
              path: '/user/login',
              component: './user/login',
            },
          ],
        },
      ],
    },
    {
      path: '/exception/404',
      component: './exception/404',
    },
    {
      path: '/exception/403',
      component: './exception/403',
    },

    ...routers,
  ];
};
