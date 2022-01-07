import { request } from 'umi';

export async function sensitiveWordsDeleteLists() {
    return request(`/api/sensitive_words/lists`);
  }
  
  export async function sensitiveWordsAdd(name: string,marketplace_id: number,substitute: string) {
    return request(`/api/sensitive_words/add?name=${name}&marketplace_id=${marketplace_id}&substitute=${substitute}`);
  }
  
  export async function sensitiveWordsDelete(id: string) {
    return request(`/api/sensitive_words/delete?id=${id}`);
  }


  export async function sensitiveCategoryLists() {
    return request(`/api/sensitive_category/lists`);
  }
  
  export async function sensitiveCategoryAdd(category_id: number,marketplace_id: number,substitute: number,type_name: string) {
    return request(`/api/sensitive_category/add?category_id=${category_id}&marketplace_id=${marketplace_id}&substitute=${substitute}&type_name=${type_name}`);
  }
  
  export async function sensitiveCategoryDelete(id: string) {
    return request(`/api/sensitive_category/delete?id=${id}`);
  }
