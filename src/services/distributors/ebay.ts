import { request } from 'umi';

export async function userAuth(id: string) {
    return request(`/api/store/ebay_user_auth?store_id=${id}`);
}

export async function aspectRequired(id: number) {
    return request(`/api/ebay/aspectRequired`,{
        method: 'POST',
        data: {store_id: id}
    });
}


