import { HttpService } from '@/utils/http.service';
import moment from 'moment';

const parseChannelList = (list: any) => (
  Array.isArray(list) ? (
    list?.length
      ? [...list]
      : []
  ) : (
    list?.id
      ? [list]
      : []
  )
)

// Lấy thông tin profile
export async function getMerchantProfile() {
  const resp = await HttpService.get('/merchant/getCurrentMerchant');
  return {
    data: {
      ...resp?.data,
      paymentGateway: {
        ...resp?.data?.paymentGateway,
        regChannels: parseChannelList(resp?.data?.paymentGateway?.regChannels)
      },
      payoutInfo: resp?.data?.payoutInfo?.banks?.[0] || {}
    },
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
// Lấy cấu hình hạn mức
export async function getValidationConfigs() {
  const resp = await HttpService.get('/merchant/validationConfigs');
  return {
    data:resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Cập nhật thông tin profile
export async function updateMerchantProfile(data?: { [key: string]: any }) {
  const resp = await HttpService.put('/merchant/updateCurrentMerchant', data);
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Lấy danh sách ngân hàng hỗ trợ
export async function getBanks() {
  const resp = await HttpService.get('/merchant/configs/banks');
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || '',
    code: resp?.code
  };
}
// Lấy danh sách ngân hàng hỗ trợ
export async function getBank() {
  const resp = await HttpService.get('/merchant/configs/banks');
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || '',
    code: resp?.code
  };
}

//Get data bank link
export async function getBankConfig() {
  const resp = await HttpService.get('/merchant/payoutBank');
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || '',
    code: resp?.code
  };
}

// Thêm ngân hàng liên kết
export async function addBank(data: any) {
  const { bankCode, bankAccount, accountName, branch, accountType } = data || {};
  const resp = await HttpService.post('/merchant/payoutConfigs/banks ', {
    bankCode,
    accountType,
    branch,
    bankAccount,
    accountName: accountName && accountName.toUpperCase(),
  });
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Xóa ngân hàng liên kết
export async function removeBank(id: any) {
  const resp = await HttpService.delete(`/merchant/payoutConfigs/banks/${id}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Lấy thông tin số dư
export async function getBalance() {
  const resp = await HttpService.get('/merchant/wallets');
  return {
    data: resp?.data || {},
    success: resp?.code === 1, // 2120: Chưa có ví
    message: resp?.message || '',
    code: resp?.code
  };
}

// Kiểm tra thông tin ví của merchant
export async function checkWalletInfo() {
  const resp = await HttpService.get('/merchant/getCurrentMerchantAfterSignin')
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
// Set rút tiền tự động
export async function setAutoWithdrawal(data: any) {
  const resp = await HttpService.put('/merchant/payoutConfigs', data)
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Kiểm tra thông tin ví của merchant
export async function checkWalletPhone(
  params: {
    phone: string;
  }
) {
  const resp = await HttpService.post('/merchant/merchant-link-wallet/check', params)
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Gen OTP
export async function genOTPLinkWallet(
  params: {
    phone: string;
  }
) {
  const resp = await HttpService.post('/merchant/genOtp', params)
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Gen OTP
export async function verifyOTPLinkWallet(
  params: {
    otp: string;
    phone: string;
  }
) {
  const resp = await HttpService.post('/merchant/merchant-link-wallet/verifyotp', params)
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Gen OTP
export async function linkNotExistWallet(
  params: {
    merchantId: string;
    phone: string;
    otp: string;
  }
) {
  const resp = await HttpService.post('/merchant/merchant-link-wallet/submitLinkWallet', params)
  return {
    data: resp?.data,
    code: resp?.code,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

// Lấy lịch sử thay đổi tài khoản
export async function getChangeHistory(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any }
) {
  const resp = await HttpService.get('/merchant/balanceHistory', params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit || 20,
    current: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}
// Lấy lịch sử thay đổi tài khoản
export async function getPayoutRequest(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any }
) {
  const resp = await HttpService.get('/merchant/payoutRequest', params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit || 20,
    current: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

// Lấy lịch sử yêu cầu rút tiền
export async function getWithdrawHistory(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any }
) {
  const resp = await HttpService.get('/merchant/transactions/green-wallet', params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit || 20,
    current: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

// Tạo yêu cầu rút tiền
export async function createPayoutRequest(data={}) {
  const resp = await HttpService.post('/merchant/payoutRequest',data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function getMerchantMemberList(
  params: {
    current?: number;
    pageSize?: number;
  },
  options?: { [key: string]: any }
) {
  const resp = await HttpService.get('/merchant/merchant-user', params, options);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit || 10,
    current: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function getMerchantUserRoles() {
  const resp = await HttpService.get('/merchant/merchant-user/roles');
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function updateMerchantUser(_id: string, data?: { [key: string]: any }) {
  const resp = await HttpService.put(`/merchant/merchant-user/${_id}`, data);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function createMerchantUser(data: any) {
  const resp = await HttpService.post(`/merchant/merchant-user`, data);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function deleteMerchantUser(_id: string) {
  const resp = await HttpService.delete(`/merchant/merchant-user/${_id}`);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function activeMerchantUser(_id: string) {
  const resp = await HttpService.put(`/merchant/merchant-user/set-active/${_id}`);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function getRoleTableData() {
  const resp = await HttpService.get(`/merchant/merchant-user/role-table`);
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function getPaymentPageConfig() {
  const resp = await HttpService.get('/merchant/merchant-payment-config');
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function sendApprovePaymentPageConfig(data?: { [key: string]: any }) {
  const resp = await HttpService.post('/merchant/merchant-payment-config', data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function updatePaymentMethod(data?: { [key: string]: any }) {
  const resp = await HttpService.put('/merchant/updatePaymentMethod', data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}
export async function exportExcel(
  params: {
    dateFr: string;
    dateTo: string;
    isActive: boolean;
  },
  options?: { [key: string]: any },
) {
  // const export_result = await HttpService.get(
  //   '/neopay-portal/payment/exportPaymentHistory',
  //   params,
  //   options,
  // );
  // if (export_result.code === 1) {
  //   await HttpService.getFile(`/excel/${export_result.data}`);
  //   message.success(translate('form.message.excel-export.success'));
  //   return true;
  // }
  // message.error(translate('form.message.excel-export.fail'));
  // return false;
}

// Get Wallet Info
export async function getWalletInfo() {
  const resp = await HttpService.get('/merchant/linkedWallet')
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
// Get Config Link Bank
export async function payoutConfigs() {
  const resp = await HttpService.get('/merchant/payoutConfigs')
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
// Get Config Link Bank
export async function getTransactionById(transactionId: string) {
  const resp = await HttpService.get(`/merchant/transaction/${transactionId}`)
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
// Get Fee Withdral
export async function getPayoutRequestFee(data: any) {
  const resp = await HttpService.get(`/merchant/payoutRequestFee`, data)
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
// Get Fee Withdral
export async function getConfigMaxMinPayoutRequest() {
  const resp = await HttpService.get(`/merchant/payoutRequest/configMinMax`)
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}