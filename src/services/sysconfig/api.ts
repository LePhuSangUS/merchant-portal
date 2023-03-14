import { HttpService } from '@/utils/http.service';

export async function getListConfigByType(keyType: string) {
  const result = await HttpService.get(`/merchant/sysconfig-by-type`, { keyType });
  return {
    data: result?.data || [],
    success: result?.code === 1,
    message: result?.message || ''
  };
}

export async function getSysConfig(keyType: string) {
  const result = await HttpService.get(`/merchant/sysconfig`, { keyType });
  return {
    data: result?.data?.docs || [],
    success: result?.code === 1,
    message: result?.message || ''
  };
}
