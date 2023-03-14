import { HttpService } from '@/utils/http.service';
import { message, translate } from '@/utils';

export async function getRefunds(
  params: {
    current?: number;
    pageSize?: number;
    paymentBillId?: number;
  },
  options?: { [key: string]: any },
) {
  const resp = await HttpService.get('/merchant/getListCurrentRefundRequests', params, options);
  const { code, data } = resp || {};
  return {
    data: data?.docs || [],
    total: data?.totalDocs,
    success: code === 1,
    pageSize: data?.limit,
    current: data?.page,
    message: resp?.message || ''
  };
}

export async function exportRefunds(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {

  const export_result = await HttpService.get(
    '/merchant/exportListCurrentRefundRequests',
    params,
    options,
  );
  if (export_result.code === 1) {
    await HttpService.getFile(`/excel/${export_result.data}`);
    message.success(translate('form.message.excel-export.success'));
    return true
  } else {
    message.error(translate('form.message.excel-export.fail'));
    return false
  }
}

export async function getRefund(id: string) {
  const params = { id };
  const resp = await HttpService.get('/merchant/getDetailCurrentRefundRequest', params);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function addRefund(formdata: any) {
  const resp = await HttpService.post('/merchant/createRefundRequest', formdata);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function updateRefund(formdata: any) {
  const resp = await HttpService.put('/merchant/updateRefundRequest', formdata);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function sendApproveRefundRequest(id: string) {
  const resp = await HttpService.put('/merchant/sendApproveRefundRequest', id);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function removeRefund(formdata: any) {
  const resp = await HttpService.put('/merchant/deleteRefundRequest', formdata);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function getOrderInfo(trackingId: string) {
  const resp = await HttpService.get(`/merchant/paymentBill/tracking/${trackingId}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function getPaymentInfo(paymentId: string) {
  const resp = await HttpService.get(`/merchant/payments/${paymentId}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function getAccountNameByBank(params:{
    cardNo: string,
    bankCode: string

}) {
  const resp = await HttpService.get('/merchant/bank/account-query', params);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function getRefundTrans(transId: string) {
  const resp = await HttpService.get(`/merchant/refunds/${transId}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}