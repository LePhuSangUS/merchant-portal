import { HttpService } from '@/utils/http.service';

const parseChannelList = (list: any) => (
  list?.length
    ? [ ...list ]
    : list?.id
      ? [ list ]
      : []
)

export async function getDetailPGConfig() {
  const resp = await HttpService.get('/merchant/getCurrentMerchantPaymentGw');
  return {
    data: {
      ...resp?.data,
      regChannels: parseChannelList(resp?.data?.regChannels)
    },
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function getFeeConfig() {
  const resp = await HttpService.get('/merchant/rules/merchant-reconcile/fee');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function saveDraftPGConfig(data?: { [key: string]: any }) {
  const resp = await HttpService.put('/merchant/saveDraftMerchantPaymentGw', data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function requestApprovePGConfig(data?: { [key: string]: any }) {
  const resp = await HttpService.put('/merchant/requestApproveMerchantPaymentGw', data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function getMerchantMemberList(data?: { [key: string]: any }) {
  // const resp = await HttpService.put('/merchant/requestApproveMerchantPaymentGw', data);
  const resp = {
    data: [ {
      name: "nguyen son tung ",
      email: "tung@gmail.com",
      phone: "0977273749",
      role: "Chu doanh nghiep",
      isActive: true
    }, 
    {
      name: "nguyen son tung a",
      email: "tung123@gmail.com",
      phone: "0974173749",
      role: "Ke toan",
      isActive: true
    } ],
    code: 1,
    message: "success"
  }
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function updateIPNForMerchantGw(data: {
  _id: string;
  ipnURL: string;
}) {
  const resp = await HttpService.put('/merchant/updateIPNForMerchantGw', data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function paymentsConfigSFTP(data:any) {
  const resp = await HttpService.put('/merchant/payments/config/sftp',data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}
export async function getConfigSFTP() {
  const resp = await HttpService.get('/merchant/payments/config/sftp');
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function checkConfigSFTP(data:any) {
  const resp = await HttpService.post('/merchant/payments/config/sftp/test',data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}