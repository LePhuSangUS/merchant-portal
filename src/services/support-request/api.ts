import { HttpService } from '@/utils/http.service';


export async function createSupportRequest(data: {
  supportId: string,
  content: string,
  attachments: string[],
  priority: number
}) {
  const resp = await HttpService.post('/merchant/supportRequest', data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function getSupportRequests(
  params: {
    current?: number;
    pageSize?: number;
    paymentBillId?: number;
  },
  options?: { [key: string]: any },
) {
  const resp = await HttpService.get('/merchant/supportRequest', params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit,
    pageIndex: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function getSupportRequestDetail(ticketId: string) {
  const resp = await HttpService.get(`/merchant/supportRequest/${ticketId}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function getSupportCategory(params: {
  cateType?: string;
} = {cateType:"SUPPORT_TYPE" }) {
  const resp = await HttpService.get(`/merchant/supportRequest/categories`, params);
  return { 
    data: resp?.data || [],
    success: resp?.data?.resultCode === 1,
    message: resp?.message || ''
  };
}
