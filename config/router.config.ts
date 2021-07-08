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
  EbayOrders: { name: 'EbayOrders', component: './order/AmazonOrder', path: '/order/EbayOrders' },
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
  }
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
