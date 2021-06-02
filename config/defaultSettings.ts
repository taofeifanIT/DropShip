import { Settings as LayoutSettings } from '@ant-design/pro-layout';
const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string | null;
} = {
  navTheme: 'light',
  primaryColor: '#1890ff',
  layout: 'top',
  contentWidth: 'Fixed',
  fixedHeader: false,
  fixSiderbar: true,
  title: ' ',
  pwa: false,
  logo: null,
  iconfontUrl: '',
  splitMenus: false,
};
// let a=  {
//   navTheme: "light",
//   primaryColor: "#1890ff",
//   layout: "top",
//   contentWidth: "Fixed",
//   fixedHeader: false,
//   fixSiderbar: true,
//   title: "Drop Ship Multi",
//   pwa: false,
//   iconfontUrl: "",
//   menu: {
//     "locale": true
//   },
//   headerHeight: 48,
//   splitMenus: false
// }
export default Settings;
