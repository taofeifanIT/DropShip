export default [
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
            component: './User/login',
          },
        ],
      },
    ],
  },
  {
    name: 'UserInfo',
    path: '/UserInfo',
    component: './UserInfo',
  },
  {
    path: '/',
    redirect: '/dashboard/Anlysis',
  },
  {
    path: '/Dashboard',
    redirect: '/dashboard/Anlysis',
  },
  {
    name: 'Dashboard',
    path: '/Dashboard',
    routes: [
      {
        path: '/dashboard/Anlysis',
        name: 'Anlysis',
        icon: 'smile',
        component: './dashboard/Anlysis',
      },
      {
        name: 'Sales',
        path: '/dashboard/Sales',
        component: './dashboard/Sales',
      },
    ],
  },
  {
    layout: false,
    name: 'DataComparison',
    path: '/largeScreen/DataComparison',
    target: '_blank', // 点击新窗口打开
    component: './largeScreen/DataComparison',
  },
  {
    path: '/distributors',
    redirect: '/distributors/IngramMicro',
  },
  {
    path: '/distributors',
    name: 'Distributors',
    icon: 'SettingOutlined',
    routes: [
      {
        path: '/distributors/IngramMicro',
        name: 'IngramMicro',
        icon: 'smile',
        component: './distributors/IngramMicro',
      },
      {
        path: '/distributors/GraingerUS',
        name: 'GraingerUS',
        icon: 'smile',
        component: './distributors/GraingerUS',
      },
      {
        path: '/distributors/Intracom',
        name: 'Intracom',
        icon: 'smile',
        component: './distributors/Intracom',
      },
      {
        path: '/distributors/TwHouseUs',
        name: 'twHouseUs',
        icon: 'smile',
        component: './distributors/TwHouseUs',
      },
      {
        path: '/distributors/Petra',
        name: 'Petra',
        icon: 'smile',
        component: './distributors/Petra',
      },
      {
        path: '/distributors/Maleb',
        name: 'Maleb',
        icon: 'smile',
        component: './distributors/Maleb',
      },
      {
        path: '/distributors/Dnh',
        name: 'Dnh',
        component: './distributors/Dnh',
      },
      {
        path: '/distributors/NewEgg',
        name: 'NewEgg',
        component: './distributors/NewEgg',
      },
      {
        path: '/distributors/Scansource',
        name: 'Scansource',
        component: './distributors/Scansource',
      },
      {
        path: '/distributors/Synnex',
        name: 'Synnex',
        component: './distributors/Synnex',
      },
      {
        path: '/distributors/Ebay',
        name: 'Ebay',
        component: './distributors/Ebay',
      },
      {
        path: '/distributors/Eldorado',
        name: 'Eldorado',
        component: './distributors/Eldorado',
      },
    ],
  },
  {
    path: '/log',
    redirect: '/log/AlarmLog',
  },
  {
    path: '/log',
    name: 'log',
    routes: [
      {
        path: '/log/AlarmLog',
        name: 'AlarmLog',
        icon: 'smile',
        component: './log/AlarmLog',
      },
      {
        path: '/log/OperationLog',
        name: 'OperationLog',
        icon: 'smile',
        component: './log/OperationLog',
      },
      {
        path: '/log/Feedsubmission',
        name: 'Feedsubmission',
        icon: 'smile',
        component: './log/Feedsubmission',
      },
    ],
  },
  {
    path: '/priceManage',
    redirect: '/priceManage/TagPrice',
  },
  {
    path: '/priceManage',
    name: 'priceManage',
    icon: 'SettingOutlined',
    routes: [
      {
        name: 'tagPrice',
        icon: 'table',
        path: '/priceManage/TagPrice',
        component: './priceManage/TagPrice',
      },
    ],
  },
  {
    name: 'Listed Product',
    icon: 'table',
    path: '/listed/ListedProducts',
    component: './listed/ListedProducts',
  },
  {
    path: '/Returns',
    redirect: '/returns/AmazonReturns',
  },
  {
    name: 'Returns',
    path: '/Returns',
    icon: 'table',
    routes: [
      {
        name: 'AmazonReturns',
        icon: 'table',
        path: '/returns/AmazonReturns',
        component: './returns/AmazonReturns',
      },
      {
        name: 'NeweggReturns',
        icon: 'table',
        path: '/returns/NeweggReturns',
        component: './returns/NeweggReturns',
      },
    ],
  },
  {
    path: '/order',
    redirect: '/order/AmazonOrder',
  },
  {
    name: 'order',
    path: '/order',
    routes: [
      {
        name: 'AmazonOrder',
        icon: 'table',
        path: '/order/AmazonOrder',
        component: './order/AmazonOrder',
      },
      {
        name: 'NewEggOrder',
        icon: 'table',
        path: '/order/NewEggOrder',
        component: './order/NewEggOrder',
      },
      {
        name: 'EbayOrder',
        icon: 'table',
        path: '/order/EbayOrder',
        component: './order/EbayOrder',
      },
    ],
  },
  {
    path: '/marketProduct',
    redirect: '/marketProduct/AmazonListing',
  },
  {
    path: '/marketProduct',
    name: 'marketProduct',
    icon: 'SettingOutlined',
    routes: [
      {
        name: 'amazonListing',
        icon: 'table',
        path: '/marketProduct/AmazonListing',
        component: './marketProduct/AmazonListing',
      },
      {
        name: 'NewEggListing',
        component: './marketProduct/NewEggListing',
        path: '/marketProduct/NewEggListing',
      },
    ],
  },
  {
    path: '/setting',
    redirect: '/setting/menuManagement',
  },
  {
    path: '/setting',
    name: 'Setting',
    icon: 'SettingOutlined',
    routes: [
      {
        path: '/setting/role',
        name: 'role',
        icon: 'smile',
        component: './setting/role',
      },
      {
        path: '/setting/userManagement',
        name: 'userManagement',
        icon: 'smile',
        component: './setting/userManagement',
      },
      {
        path: '/setting/menuManagement',
        name: 'menuManagement',
        icon: 'smile',
        component: './setting/menuManagement',
      },
    ],
  },
  {
    name: 'Calculation',
    path: '/datacalculation/Calculation',
    component: './datacalculation/Calculation',
  },
  {
    component: './404',
  },
];
