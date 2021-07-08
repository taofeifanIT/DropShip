import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message } from 'antd';
import React, { useState } from 'react';
import { RocketOutlined } from '@ant-design/icons';
import ProForm, { ProFormCheckbox, ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, SelectLang, useModel } from 'umi';
import { setToken } from '../../../utils/cookes';
import Footer from '@/components/Footer';
import { login, currentUser } from '@/services/user';
import styles from './index.less';
import { getMenu, findIndexPage } from '../../../utils/utils';
import { getAllPop } from '../../../services/publicKeys';
// const isDev = process.env.NODE_ENV === 'development';
import { setPublicKeys } from '../../../utils/cookes';

/** 此方法会跳转到 redirect 参数所在的位置 */
let INDEX_PAGE: string = '';
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    history.push(INDEX_PAGE);
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState, refresh } = useModel('@@initialState');
  const intl = useIntl();
  const fetchUserInfo = async () => {
    const userInfo: any = await currentUser();
    const menuList: any = getMenu(userInfo.data.menus).sort(
      (a: any, b: any) => a.sort_num - b.sort_num,
    );
    INDEX_PAGE = findIndexPage(menuList);
    let allPop = await getAllPop();
    setPublicKeys(allPop);
    if (userInfo) {
      localStorage.setItem('current', userInfo.data.adminuser.username);
      setInitialState({
        ...initialState,
        currentUser: { ...userInfo.data.adminuser, name: userInfo.data.adminuser.username },
        menuList: menuList,
      });
      setTimeout(() => {
        refresh();
      }, 1000);
    }
  };
  const handleSubmit = async (values: { username: string; password: string }) => {
    setSubmitting(true);

    try {
      const msg: any = await login({
        username: values.username,
        password: values.password,
      });

      if (msg.code) {
        // removeCookies("token")
        setToken(msg.data.token);
        message.success('Login successful!');
        await fetchUserInfo();
        goto();
        return;
      }
    } catch (error) {
      message.error('Login failed, please try again！');
    }

    setSubmitting(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.lang}>{SelectLang && <SelectLang />}</div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <h1
                style={{
                  color: '#919191',
                  fontFamily: 'fantasy',
                  fontSize: '3vw',
                }}
              >
                <RocketOutlined />
                Wei Yu
              </h1>
              {/* <img alt="logo" className={styles.logo} src="/Logo_new.svg" /> */}
            </Link>
          </div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: intl.formatMessage({
                  id: 'pages.login.submit',
                  defaultMessage: 'Login in',
                }),
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: submitting,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              handleSubmit(values as API.LoginParams);
            }}
          >
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="username"
                rules={[
                  {
                    required: true,
                    message: 'User name is required！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: 'password: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: 'password is required',
                  },
                ]}
              />
            </>
            <div
              style={{
                marginBottom: 24,
              }}
            >
              <ProFormCheckbox noStyle name="autoLogin">
                automatic logon
              </ProFormCheckbox>
              <a
                style={{
                  float: 'right',
                }}
              >
                Forget the password ?
              </a>
            </div>
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
