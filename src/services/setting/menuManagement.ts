import { request } from 'umi';

export async function listRules() {
  return request('/api/adminuser/list_rules');
}

export async function addRule(params: Object) {
  return request('/api/adminuser/add_rule', {
    method: 'POST',
    data: params,
  });
}

export async function authority() {
  return request('/api/authority');
}

export async function deleteRule(id: any) {
  return request(`/api/adminuser/delete_rule?id=${id}`, {
    method: 'get',
  });
}

export async function editRule(params: any) {
  return request(`/api/adminuser/edit_rule/${params.id}`, {
    method: 'POST',
    data: params,
  });
}
