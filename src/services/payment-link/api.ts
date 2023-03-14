import { HttpService } from '@/utils/http.service';
import { message, translate } from '@/utils';

export async function getPaymentLinkList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const resp = await HttpService.get(
    '/merchant/getPaymentLinksForCurrentMerchant',
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

export async function exportPaymentLinksForCurrentMerchant(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const export_result = await HttpService.get(
    '/merchant/exportPaymentLinksForCurrentMerchant',
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

export async function checkOrderIdForCurrentMerchant(
  orderCode: string
) {
  const resp = await HttpService.get(`/merchant/checkOrderIdForCurrentMerchant/${orderCode}`);
  const { data, message, code } = resp || {};
  return {
    data,
    message,
    success: code === 1
  };
}