import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import type { ResponseError, RequestOptionsInit } from 'umi-request';
import { currentUser as queryCurrentUser } from './services/user';
import { getToken, getPublicParams, removeToken, setPublicKeys } from './utils/cookes';
import { getMenu, throwMenu, findIndexPage } from './utils/utils';
import { indexRouterMap } from '../config/router.config';
import { getAllPop } from './services/publicKeys';
// const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading tip="loading。。。" />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  fetchUserInfo?: () => Promise<any | undefined>;
  pageHeight?: number;
  menuList?: any;
  publicParams?: any | undefined;
  listTimes?:
    | {
        getAmazonListingDeliverTime: number;
        getAmazonNormalDeliverTime: number;
      }
    | undefined;
  conText?: any;
  indexPage?: string;
}> {
  const pageHeight = document.body.clientHeight - 48 - 24 - 24;
  localStorage.setItem('umi_locale', 'en-US');

  let allPop: any = {};
  try {
    allPop = await getAllPop();
    setPublicKeys(allPop);
  } catch (error) {
    removeToken();
    console.log(error);
    history.push('/user/login');
  }
  const fetchUserInfo = async () => {
    try {
      const currentUser: any = await queryCurrentUser();
      localStorage.setItem('current', currentUser.data.adminuser.username);
      const menuList: any = getMenu(currentUser.data.menus).sort(
        (a: any, b: any) => a.sort_num - b.sort_num,
      );
      const historyPath = history.location.pathname;
      const checkUrl = historyPath === '/' ? '/dashboard/Anlysis' : historyPath;
      if (!throwMenu(menuList, checkUrl) && historyPath !== '/largeScreen/DataComparison' && historyPath !== '/distributors/EbayProductInfo') {
        let mainPage = findIndexPage(menuList);
        history.location.pathname = mainPage
      }
      return {
        ...currentUser.data.adminuser,
        name: currentUser.data.adminuser.username,
        menuList,
        indexPage: findIndexPage(menuList),
      };
    } catch (error) {
      console.log(error);
      removeToken();
      history.push('/user/login');
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (!getToken()) {
    return {
      fetchUserInfo,
      settings: {},
      menuList: [],
    };
  }
  if (history.location.pathname !== '/user/login') {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      pageHeight,
      menuList: currentUser.menuList,
      settings: {},
      indexPage: currentUser.indexPage,
    };
  }
  return {
    fetchUserInfo,
    pageHeight,
    settings: {},
  };
}

// https://umijs.org/zh-CN/plugins/plugin-layout
export const layout = ({ initialState }: any) => {
  const routers = initialState?.menuList;
  return {
    menuDataRender: () => (routers ? indexRouterMap(routers) : indexRouterMap([])),
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: localStorage.getItem('current'),
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!getToken() && location.pathname !== '/user/login') {
        history.push('/user/login');
      } else {
        // 如果不去登录页获取不去大屏页则处理无权限页面
        if (location.pathname !== '/user/login' && location.pathname !== '/largeScreen/DataComparison') {
          if (!throwMenu(routers, location.pathname)) {
            history.location.pathname = findIndexPage(routers);
          }
        }
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    logo: (
      <img
        style={{
          width: '151px',
          height: '85px',
          position: 'absolute',
          top: '-17px',
        }}
        src="/myLogo.svg"
      ></img>
    ),
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
    setTimeout(() => {
      history.push('/user/login');
    }, 1500)
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
    setTimeout(() => {
      history.push('/user/login');
    }, 1500)
  }
  throw error;
};
const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const token: string | undefined = getToken() || '';
  let authHeader = {};
  let tempParams = options.params;
  const tempOption = JSON.parse(JSON.stringify(options))
  // const basicParmas = JSON.parse(JSON.stringify(options.data))
  const publicParams: any = getPublicParams();
  authHeader = { token: token || '' };
  if (publicParams) {
    tempParams = { ...JSON.parse(publicParams), ...tempParams };
    tempOption.params = tempParams;
    tempOption.data = { ...options.data, ...tempParams };
  }
  
  if (token && url.indexOf('login') !== -1) {
    authHeader = {};
    tempOption.data = options.data
    tempOption.params = null
  }
  if (url.indexOf('logout') !== -1) {
    authHeader = { token: token || '' };
  }
  // header加上
  // console.log(options)\
  let lastUrl = url;
  // lastUrl = `http://api-multi.itmars.net${url.replace('/api', '')}`;
  if (process.env.NODE_ENV !== 'development') {
    lastUrl = `https://api-multi.itmars.net${url.replace('/api', '')}`;
  }
  return {
    url: `${lastUrl}`,
    options: { ...tempOption, interceptors: true, headers: authHeader,timeout: 15 * 1000 },
  };
};
// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorHandler,
  requestInterceptors: [authHeaderInterceptor],
};
