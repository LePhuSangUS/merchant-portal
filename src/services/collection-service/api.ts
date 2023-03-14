import { HttpService } from '@/utils/http.service';
import { message, translate } from '@/utils';
import React from 'react';

// register collection area
export async function collectionServiceRegistration() {
  const resp = await HttpService.post('/merchant/collectionRegister', {});
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function getCollectionConfig() {
  const resp = await HttpService.get('/merchant/configs/collection');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function updateCollectionServiceConfig(data: UpdateCollectionServiceConfig) {
  const resp = await HttpService.post('/merchant/notifyBalanceConfigs', data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function switchCollectionServiceState(data: SwitchCollectionServiceState) {
  const resp = await HttpService.put('/merchant/collections/active', data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

// collection virtual account area

export async function getMerchantVirtualAccounts(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/collection/merchantVirtualAccounts',
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

export async function getMerchantVirtualAccountsDetail(id: React.ReactText) {
  const resp = await HttpService.get(`/merchant/collection/merchantVirtualAccounts/${id}`);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function exportCollectionServicecAccounts(
  params: ObjectType,
  options?: ObjectType,
) {
  const export_result = await HttpService.get(
    '/merchant/collection/virtualAccounts/export',
    params,
    options,
  );
  if (export_result.code === 1) {
    await HttpService.getFile(`/excel/${export_result.data}`);
    return message.success(translate('form.message.excel-export.success'));
  } else {
    return message.error(translate('form.message.excel-export.fail'));
  }
}

export async function updateVirtualAccount(params: ObjectType) {
  const { id, ...rest } = params;
  const resp = await HttpService.put(`/merchant/collection/merchantVirtualAccounts/${id}`, rest);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function exportImportVirtualAccountTemplate(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: ObjectType,
) {
  const export_result = await HttpService.get(
    '/merchant/collection/virtualAccounts/getTemplate',
    params,
    options,
  );
  if (export_result.code === 1) {
    await HttpService.getFile(`/excel/${export_result.data}`);
    return message.success(translate('form.message.excel-export.success'));
  } else {
    return message.error(translate('form.message.excel-export.fail'));
  }
}


export async function importImportVirtualAccounts(params: ObjectType) {
  const resp = await HttpService.post('/merchant/collection/virtualAccounts/import', params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function updateVirtualAccountForMerchantPortal(params: ObjectType) {
  const { id, ...restParams } = params;
  const resp = await HttpService.put(`/merchant/collection/virtualAccounts/${id}`, restParams);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}


// collection transaction area
export async function getCollectionTransactions(
  params: {
    current?: number;
    pageSize?: number;
  } & ObjectType,
  options?: Record<string, any>,
) {
  const resp = await HttpService.get('/merchant/collection/transactions', params, options,
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

export async function exportCollectionTransactions(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: ObjectType,
) {
  const export_result = await HttpService.get('/merchant/collection/transactionsExport', params, options,);
  if (export_result.code === 1) {
    await HttpService.getFile(`/excel/${export_result.data}`);
    return message.success(translate('form.message.excel-export.success'));
  } else {
    return message.error(translate('form.message.excel-export.fail'));
  }
}

// collection reconcile area
export async function getTotalReceivedAmount() {
  const resp = await HttpService.get('/merchant/collection/totalReceivedAmount');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function getCollectionReconciles(
  params: {
    current?: number;
    pageSize?: number;
  } & ObjectType,
  options?: Record<string, any>,
) {
  const resp = await HttpService.get('/merchant/collection/reconciles', params, options,
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

export async function exportCollectionReconcileRecord(id: string) {
  const export_result = await HttpService.get(`/merchant/collection/reconcile/export/${id}`);
  if (export_result.code === 1) {
    await HttpService.getFile(`/excel/${export_result.data}`);
    message.success(translate('form.message.excel-export.success'));
    return true;
  }
  message.error(translate('form.message.excel-export.fail'));
  return false;
}

// collection account info area

export async function getCollectionBalance() {
  const resp = await HttpService.get('/merchant/collection/balance');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function getTransactionsHistory(
  params: {
    current?: number;
    pageSize?: number;
  } & ObjectType,
  options?: Record<string, any>,
) {
  const resp = await HttpService.get('/merchant/collection/transactions/greenWallet', params, options,
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

// collection payout
export async function getCollectionPayoutConfigs() {
  const resp = await HttpService.get('/merchant/collection/payoutConfigs');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function addCollectionPayoutBank(data: any) {
  const resp = await HttpService.post('/merchant/collection/payoutConfigs/banks ', {
    ...data,
    accountName: data?.accountName?.toUpperCase(),
  });
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function removeCollectionPayoutBank(id: string) {
  const resp = await HttpService.delete(`/merchant/collection/payoutConfigs/banks/${id}`);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function createCollectionPayoutRequest(params: CollectionService.CreatePayoutRequest) {
  const resp = await HttpService.post(`/merchant/collection/payoutRequest`, params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function updateCollectionPayoutConfig(params: CollectionService.PayoutConfig) {
  const resp = await HttpService.put(`/merchant/collection/payoutConfigs`, params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

// 

export async function getMerchantConfig() {
  const resp = await HttpService.get('/merchant/merchant-configs');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}


// collection SFTP
export async function saveCollectionSFTPConfig(params: CollectionService.SFTPConfig) {
  const resp = await HttpService.post(`/merchant/collection/sftp`, params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function getCollectionSFTPConfig(params: ObjectType) {
  const resp = await HttpService.get(`/merchant/collection/sftp`, params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function checkSFTPConnection(params: ObjectType) {
  const resp = await HttpService.post(`/merchant/collections/config/sftp/test`, params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message,
    code: resp?.code
  };
}
