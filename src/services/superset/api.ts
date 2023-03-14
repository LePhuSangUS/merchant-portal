import { HttpService } from '@/utils/http.service';


export async function getRefunds(
  params: {
    current?: number,
    pageSize?: number,
    paymentBillId?: number | string
  },
  options?: { [key: string]: any },
) {
  const resp = await HttpService.get('/merchant/getListRefundRequests', params, options);
  return {
    data: resp?.data?.docs,
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit,
    pageIndex: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}


export async function getSupersetGuestToken(dashboardId: string) {
  const resp = await HttpService.get(`/merchant/superset/guest_token`, {dashboardId});
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}