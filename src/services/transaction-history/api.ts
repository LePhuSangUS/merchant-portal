import { HttpService } from '@/utils/http.service';
import { message, translate } from '@/utils';

export async function getTransactionHistoryList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/getPaymentBillsForCurrentMerchant',
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
export async function getPaymentHistoryByTransactionId(
  params: {
    current?: number;
    pageSize?: number;   
    paymentBillId: any,
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    `/merchant/payments`,params,
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


export async function getTransactionHistoryDetail(_id?: string) {
  const params = { _id };
  const resp = await HttpService.get('/merchant/getPaymentBillForCurrentMerchant', params);
  const { data, message } = resp || {};
  return {
    data,
    message,
  };
}

export async function createRequestPaymentForMerchant(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/createRequestPaymentForMerchant',
    params,
    options,
  );
  const { data, message, code } = resp || {};
  return {
    data,
    message,
    success: code === 1
  };
}

export async function exportTransactionHistory(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const export_result = await HttpService.get(
    '/merchant/exportPaymentBillsForCurrentMerchant',
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

export async function updatePaymentBills(id: string, params: {
  state: string,
  note: string
}) {
  const resp = await HttpService.put(`/merchant/paymentBills/${id}`, params);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function getRefundTransInBill(billId: string) {
  const resp = await HttpService.get(`/merchant/${billId}/refunds`);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}