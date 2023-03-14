import { HttpService } from '@/utils/http.service';
import { message, translate } from '@/utils';
import _ from "lodash"

export async function getDisbursementConfigAPI() {
  const resp = await HttpService.get('/merchant/configs/disbursement');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function getDisbursementRequestDetail(id: string) {
  const resp = await HttpService.get(`/merchant/disbursementRequests/${id}`)
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  }
}

export async function getDisbursementRequestDetailTrans(id: string) {
  const resp = await HttpService.get(`/merchant/disbursementTransactionRequests/${id}`)
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || '',
  }
}

export async function getBalanceAPI() {
  const resp = await HttpService.get('/merchant/disbursements/balance');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}


export async function disbursementRegistrationAPI(data:any) {
  const resp = await HttpService.post('/merchant/disbursements/wallet/request',data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function updateWalletAPI(data: any) {
  const {id, ...dataSubmit}= data;
  const resp = await HttpService.put(`/merchant/disbursements/wallet/request/${id}`,dataSubmit);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function getHistoriesTopupAPI(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/disbursement/topupTrans',
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
export async function getDisbursementTransactions(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/disbursementTransactions',
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
export async function getDisbursementTransactionDetail(params: any) {
  const { id } = params;
  const resp = await HttpService.get(
    `/merchant/disbursementTransactions/${id}`,);
    return {
      data: resp?.data,
      success: resp?.code === 1,
      message: resp?.message
    };
}
export async function configUseApiAPI(data:any) {
  const resp = await HttpService.put('/merchant/disbursements/callback',data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function disbursementActiveAPI(data:any) {
  const resp = await HttpService.put('/merchant/disbursements/active',data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function getMerchantConfigAPI() {
  const resp = await HttpService.get('/merchant/merchant-configs');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function exportDisbursementTransaction(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
   message.info(translate("Coming soon"))
  // const export_result = await HttpService.get(
  //   '/merchant/disbursementTransactions/export',
  //   params,
  //   options,
  // );
  // if (export_result.code === 1) {
  //   await HttpService.getFile(`/excel/${export_result.data}`);
  //   return message.success(translate('form.message.excel-export.success'));
  // } else {
  //   return message.error(translate('form.message.excel-export.fail'));
  // }
}

export async function exportDisbursementHistories(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const export_result = await HttpService.get(
    '/merchant/disbursementRequests/export',
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

export async function exportDisbursementRequest(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const export_result = await HttpService.get(
    '/merchant/disbursementRequests/export',
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


export async function getReconcileLimitAPI(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/disbursements/reconciles',
    params,
    options,
  );
  return {
    data: _.isArray(resp?.data?.docs) ? resp?.data?.docs?.map((item:any,index:number)=>({...item,key:index.toString()})) : [],
    total: resp?.data?.totalDocs || 0,
    success: resp?.code === 1,
    pageSize: resp?.data?.limit || 20,
    current: resp?.data?.page || 1,
    message: resp?.message || '',
  };
}


export async function exportReconciles(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const export_result = await HttpService.get(
    '/merchant/disbursements/reconciles/export',
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

export async function exportDisbursementReconcileById(id:string) {
  const export_result = await HttpService.get(`/merchant/disbursements/reconciles/export/${id}`,);
  if (export_result.code === 1) {
    await HttpService.getFile(`/excel/${export_result.data}`);
    message.success(translate('form.message.excel-export.success'));
    return true;
  }
  message.error(translate('form.message.excel-export.fail'));
  return false;
}



export async function getDisbursementRequestListAPI(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/disbursementRequests',
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


export async function exportCollectionServicecAccounts(
  params: {
    current?: number;
    pageSize?: number;
  },
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

export async function exportTemplate({fileName}:{fileName:string}) {

    await HttpService.getFile(`/excel/${fileName}`);
    return message.success(translate('form.message.excel-export.success'));

}


export async function importImportDisbursementRequest(params: ObjectType) {
  const resp = await HttpService.post('/merchant/disbursementRequests', params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function  getDisbursementRequestCurrencyAPI(params: ObjectType) {
  const resp = await HttpService.get('/merchant/disbursements/wallet/request', params);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}


//SFTP

export async function disbursementConfigSFTP(data:any) {
  const resp = await HttpService.put('/merchant/disbursements/config/sftp',data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function getConfigSFTP() {
  const resp = await HttpService.get('/merchant/disbursements/config/sftp');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function checkConfigSFTP(data:any) {
  const resp = await HttpService.post('/merchant/disbursements/config/sftp/test',data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}