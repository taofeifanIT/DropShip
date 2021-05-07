import { request } from 'umi';

interface rolePop{
  name: string;
  permission: Array<Number>;
  display_name: string; 
  description: string
}

export async function roleList() {
  return request(`/api/adminuser/list_groups`);
}

export async function addRole(params: rolePop) {
  return request(`/api/adminuser/add_auth_group`,{
    method: 'POST',
    data: params,
  });
}

export async function updateRole(params: any) {
  return request(`/api/adminuser/edit_auth_group/${params.id}`,{
    method: 'POST',
    data: params,
  })
}

export async function deleteRole(id: any) {
  return request(`/api/role/${id}`,{
    method: 'DELETE'
  })
}