import { HttpService } from '@/utils/http.service';
import { message, translate } from '@/utils';

export async function getReconciliations(
  params: {
    current?: number;
    pageSize?: number;
    paymentBillId?: number;
  },
  options?: { [key: string]: any },
) {
  const resp = await HttpService.get('/merchant/reconciliation', params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit,
    pageIndex: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function exportReconciliation(data: any) {
  const resp = await HttpService.get(
    `/merchant/exportReconciliationReport/?reconcileCode=${data?.code}`,
  );
  if (resp?.code === 1) {
    await HttpService.getFile(`/excel/${resp.data}`);
    return message.success(translate('form.message.excel-export.success'));
  } else {
    return message.error(resp?.message||translate('form.message.excel-export.fail'));
  }
}

export async function getReconciliationsByMonth(
  params: {
    current?: number;
    pageSize?: number;
    paymentBillId?: number;
  },
  options?: { [key: string]: any },
) {
  const resp = await HttpService.get('/merchant/reconciliationReport', params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit,
    pageIndex: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function getTotalAmountReconcileUnPaid() {
  const resp = await HttpService.get('/merchant/totalAmountReconcileUnPaid');
  return {
    data: resp?.data || null,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}
export async function getReconcileReport(
  code: string | number,
  fileType?: 'excel'
) {
  return HttpService.getFileBlob(`/download/monthlyReconcileReport?code=${code || 'code'}&fileType=${fileType}`);
}

export async function downloadReconcileReport(
  code: string | number,
  fileType?: 'excel'
) {
  return HttpService.downloadFileBlob(`/download/monthlyReconcileReport?code=${code || 'code'}&fileType=${fileType}`);
}
