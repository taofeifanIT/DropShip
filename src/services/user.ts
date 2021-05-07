import { request } from 'umi';

type requestItem = {
    password: string;
}
export async function changePassword(params: requestItem) {
  return request('/api/adminuser/change_password',{
    method: 'POST',
    params: params,
  });
}

export async function currentUser() {
  return request('/api/adminuser/info');
}

export async function outLogin() {
  return request('/api/login/logout');
}

export async function login(params: {
  username: string,
  password: string
}) {
  return request('/api/login/login',{
    method: 'POST',
    data: params,
  });
}
