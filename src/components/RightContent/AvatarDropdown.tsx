import React from 'react';
import { LogoutOutlined, InfoCircleOutlined, FundOutlined, UserOutlined  } from '@ant-design/icons';
import { Menu, Spin, Modal } from 'antd';
import { history, useModel } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/user';
import { removeToken } from '../../utils/cookes'
export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const loginOut = async (refresh: () => void,initialState: any,setInitialState: (params: any) => void) => {
  Modal.confirm({
    title: 'message',
    icon: <InfoCircleOutlined  />,
    content: 'Are you sure to log off the current user？',
    okText: 'ok',
    cancelText: 'cancel',
    onOk: () => {
      return new Promise(async (resolve, reject) => {
        setInitialState({ ...initialState,menuList: [], currentUser: undefined });
        const msg = await outLogin();
        resolve(msg)
        const { query = {} } = history.location;
        const { redirect } = query;
        removeToken()
        // Note: There may be security issues, please note
        if (window.location.pathname !== '/user/login' && !redirect) {
          history.push('/user/login')
        }
        localStorage.removeItem("token")
      })
    }
  });
  // await outLogin();
};


const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState, refresh } = useModel('@@initialState');

  const onMenuClick = (key: any) => {
    if(key.key === "toUserInfo") {
      history.push('/UserInfo')
    }
    if(key.key === "toScreen"){
      history.push('/largeScreen/DataComparison')
    } 
    if(key.key === "logout") {
      loginOut(refresh, initialState,setInitialState);
    }
  }

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!localStorage.getItem('current')) {
    return loading;
  }


  // if (!currentUser || !currentUser.name) {
  //   return loading;
  // }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="toUserInfo">
        <UserOutlined />
        Personal Center
      </Menu.Item>
        {localStorage.getItem('current') !== 'operator' ? (
      <Menu.Item key="toScreen">
        <FundOutlined />
        to Screen
      </Menu.Item>) : null}
      <Menu.Item key="logout">
        <LogoutOutlined />
        Log out
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
        <span className={`${styles.name} anticon`}>{localStorage.getItem('current')}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
