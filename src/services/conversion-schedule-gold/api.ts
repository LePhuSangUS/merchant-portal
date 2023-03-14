import { HttpService } from '@/utils/http.service';
import _ from 'lodash';
import { message, translate } from '@/utils';

export async function getConversionScheduleList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  const result = await HttpService.get('/merchant/goldAppointments', params, options);
  const res = {
    data: result?.data?.docs,
    total: result?.data?.totalDocs,
    success: result?.code === 1,
    pageSize: result?.data?.limit,
    current: result?.data?.page,
  };
  return res;
}

export async function getConversionScheduleDetailById(id: string) {
  const result:any = await HttpService.get(`/merchant/goldAppointments/${id}`);

  const res = {
    data: result?.data || {},
    success: result?.code === 1,
  };
  return res;
}


export async function exportExcel(
  params: {
    dateFr: string;
    dateTo: string;
    isActive: boolean;
  },
  options?: { [key: string]: any },
) {
  const export_result = await HttpService.get(
    '/merchant/exportGoldAppointments',
    params,
    options,
  );
  if (export_result.code === 1) {
    await HttpService.getFile(`/excel/${export_result.data}`);
    message.success(translate('form.message.excel-export.success'));
    return true;
  }
  message.error(translate('form.message.excel-export.fail'));
  return false;
}
export async function updateGoldExchangeAppointment(
  id:string,exchangeCode:string
) {
  const result = await HttpService.post(
    `/merchant/goldAppointments/${id}/confirm`, {
      exchangeCode
    }
  );
  const res = {
    data: result?.data || {},
    success: result?.code === 1,
  };
  return res;
}
export async function getGoldStore() {
  const result = await HttpService.get(
    '/merchant/goldStore',
  );
  const res = {
    data: result?.data || {},
    success: result?.code === 1,
  };
  return res;
}
