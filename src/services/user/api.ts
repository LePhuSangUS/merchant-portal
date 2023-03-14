import { HttpService } from '@/utils/http.service';
import moment from 'moment';
import { env } from "@/env";

export async function getUser(userId: string) {
  const resp = await HttpService.get(`/merchant/user/${userId}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function handleChangePassword(dataUpdate: any) {
  const resp = await HttpService.put(`/merchant/userAuth/changePassword`, dataUpdate);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function checkEmailExisted(email: string) {
  const resp = await HttpService.get(`/merchant/checkEmailApproved`,{
    email,
  });
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export  function ocrAndCompareDocumentWithFace(data:any) {
  return  HttpService.postBase(`${env.API_E_KYC_URL}/ocrAndCompare`, data);
}
export  function ocrDocument(data:any) {
  return  HttpService.postBase(`${env.API_E_KYC_URL}/ocr/id`, data);
}


export async function getProfile() {
  const resp = await HttpService.get('/merchant/user/profile');
  const res = {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message
  };
  res.data.dob = moment(res.data.dob);
  return res;
}

export async function updateProfile(data: any) {
  const resp = await HttpService.put('/merchant/user/profile', data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function getPasswordPolicy() {
  const resp = await HttpService.get('/merchant/passwordPolicy');
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function verifyActivationToken(token: string) {
  const resp = await HttpService.post('/merchant/merchantRegistration/verifyActiveToken', { token });
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function accountActivation(data: any) {
  const { token, password } = data || {};
  const resp = await HttpService.post('/merchant/merchantRegistration/active', { token, password });
  return {
    data: resp?.data,
    success: resp?.code === 1,
    message: resp?.message
  };
}

export async function getBusinessLines() {
  const resp = await HttpService.get('/merchant/businessLine');
  return {
    data: resp?.data || [],
    success: resp?.code === 1,
    message: resp?.message  || ''
  };
}

export async function userRegister(data: any) {

  //  const {
  //   businessType, merchantEmail, merchantPhone, merchantAddress, merchantName,
  //    businessLine, otherBusinessLine, businessLicense,
  //    gender,
  // } = data || {};
  const resp = await HttpService.post('/merchant/merchantRegistrationWithKycs', {
    // businessType,
    // merchantEmail,
    // merchantPhone,
    // merchantAddress,
    // merchantName,
    // businessLine,
    // gender,
    ...data,
    registrationChannel: 'WEB'
  });
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function updateRegister(data: any) {
  const resp = await HttpService.put(`/merchant/merchantRegistration/${data?._id}`, data);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}

export async function getUserRegister(id: string) {
  // const {
  //   businessType, merchantEmail, merchantPhone, merchantAddress, merchantName,
  //   businessLine, otherBusinessLine, businessLicense, identityType, identityImg, avatar,
  //   identityNumber, identityName, identityDob, identityAddress, identityIssuedAt,
  //   identityIssuedBy, identityGender, identityValidDate
  // } = data || {};
  const resp = await HttpService.get(`/merchant/recheckMerchantRegistration/${id}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}


// request forgot password: { appId, email }
export async function requestForgotPassword(options?: { [key: string]: any }) {
  const resp = await HttpService.post('/merchant/forgotPassword', options);
  return {
    data: resp,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

// verify token: { appId, token }
export async function verifyToken(options?: { [key: string]: any }) {
  const resp = await HttpService.post('/merchant/verifyResetPasswordToken', options);
  return {
    data: resp,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

// reset password: { appId, token, newPassword }
export async function resetPassword(options?: { [key: string]: any }) {
  const resp = await HttpService.put('/merchant/resetPassword', options);
  return {
    data: resp,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

// get notifications
export async function getNotifications(params: {
  pageIndex?: number;
  pageSize?: number;
}) {
  const resp = await HttpService.get('/merchant/notices', params);
  return {
    data: resp?.data?.docs || [],
    total: resp?.data?.totalDocs || 0,
    pageSize: resp?.data?.limit,
    pageIndex: resp?.data?.page || 1,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function getNoticesCount() {
  const resp = await HttpService.get('/merchant/notices/total');
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function setNoticeRead(id: string) {
  const resp = await HttpService.put(`/merchant/notices/${id}`);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}


export async function trackingOnboarding(params: Record<string, any>) {
  const resp = await HttpService.post('/merchant/tracking/onboarding', params);
  return {
    data: resp,
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}

export async function updateVisibleAvatar(params: {
  avatar: string;
}) {
  const resp = await HttpService.put(`/merchant/updateVisibleAvatar`, params);
  return {
    data: resp?.data || {},
    success: resp?.code === 1,
    message: resp?.message || '',
  };
}
// Lấy cấu hình
export async function getConfigsByKeyType(keyType:string) {
  const resp = await HttpService.get('/merchant/sysconfig',{keyType});
  return {
    data:resp?.data,
    success: resp?.code === 1,
    message: resp?.message || ''
  };
}
