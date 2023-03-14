import { HttpService } from '@/utils/http.service';

export async function getMerchantStoreList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/merchantStore',
    params,
    options,
  );
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    success: resp?.code === 1,
    pageSize: resp?.data?.limit || 20,
    current: resp?.data?.page || 1,
    message: resp?.message || '',
  };
}

export async function getMerchantStoreDetail(id: string | number) {
  const resp = await HttpService.get(`/merchant/merchantStore/${id}`);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function createUserInStore(
  params: {
    storeId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    passwordForApp?: string;
    passwordForWeb?: string;
    channelWorks?: string[];
    workingTimes?: string[];
  }
) {
  const resp = await HttpService.post(
    '/merchant/stores/cashiers',
    params
  );
  const { data, message, code } = resp || {};
  return {
    data,
    message,
    success: code === 1
  };
}

export async function updateUserInStore(
  params: {
    storeId?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    passwordForApp?: string;
    passwordForWeb?: string;
    channelWorks?: string[];
    workingTimes?: string[];
  }
) {
  const resp = await HttpService.put(
    '/merchant/stores/cashiers',
    params
  );
  const { data, message, code } = resp || {};
  return {
    data,
    message,
    success: code === 1
  };
}

export async function removeUserInStore(data: any) {
  const resp = await HttpService.delete('/merchant/stores/cashiers', data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message,
  };
}

export async function createMerchantStore(body: API.MerchantStoreItem) {
  const resp = await HttpService.post('/merchant/merchantStore',body);
  const { data, message, code } = resp || {};
  return {
    data,
    message,
    success: code === 1
  };
}

export async function updateMerchantStore( body: API.MerchantStoreItem ) {
  const resp = await HttpService.put('/merchant/merchantStore', body);
  const { data, message } = resp || {};
  return {
    data,
    message,
    success: resp?.code === 1,
  }
}

export async function removeMerchantStore(data: any) {
  const resp = await HttpService.delete('/merchant/merchantStore', data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function merchantStoreUserList(
    params: {
      current?: number;
      pageSize?: number;
    },
    options?: Record<string, any>,
    id?: string | number
  ) {
  const resp = await HttpService.get(`/merchant/stores/${id}/cashiers`, params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    success: resp?.code === 1,
    pageSize: resp?.data?.limit || 20,
    current: resp?.data?.page || 1,
    message: resp?.message || '',
  };
}

export async function getUserAllStore(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/cashiers',
    params,
    options,
  );
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    success: resp?.code === 1,
    pageSize: resp?.data?.limit || 20,
    current: resp?.data?.page || 1,
    message: resp?.message || '',
  };
}

export async function changeUserPassword(params: { userId: string, newPassword: string, email?: string, phone?: string }) {
  const resp = await HttpService.put('/merchant/userAuth/changeUserAuthPassword', params);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

