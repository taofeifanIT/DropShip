import { request } from 'umi';

interface userPop {
    name: string;
    tel: string;
    email: string;
    role_id: string
}

export async function addUser(params: userPop) {
    return request(`/api/adminuser/add_adminuser`, {
        method: 'POST',
        data: params,
    });
}

export async function updateUser(params: any) {
    return request(`/api/adminuser/edit_adminuser`, {
        method: 'POST',
        data: params,
    })
}

export async function deleteUser(id: any) {
    return request(`/api/adminuser/delete_adminuser?id=${id}`,{
      method: 'GET'
    })
  }