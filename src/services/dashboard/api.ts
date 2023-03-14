import { HttpService } from '@/utils/http.service';

export async function getDashboardSummary(  params: {
  type?: string;
  fromDate?: string;
  toDate?: string;
},) {
  const resp = await HttpService.get('/merchant/summaryPaymentBillsByTypeForCurrentMerchant',params);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  }
}

export async function getSummaryBillsByTime(
  params: {
    type?: string;
    fromDate?: string;
    toDate?: string;
  },
  options?: any
) {
  const resp = await HttpService.get(
    '/merchant/summaryPaymentBillsByTimeForCurrentMerchant',
    params,
    options,
  );
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
