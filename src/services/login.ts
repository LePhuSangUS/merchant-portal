import { HttpService } from '@/utils/http.service';
import { APP_ID } from '@/constants';

export type LoginParamsType = {
  userName: string;
  password: string;
};

export async function login(params: LoginParamsType) {
  // TODO: call api login
  const { userName, password } = params;
  const resp = await HttpService.post('/merchant/auth/signin', {
    userName,
    password,
    appId: APP_ID
  });
  const { code, data, message } = resp || {};
  if (code === 1) {
    const user = data || {};
    return {
      user,
      code,
      message,
      currentAuthority: 'admin',
      status: 'ok',
      type: 'account',
    };
  }
  if (code) {
    return {
      code,
      message,
      status: 'error',
      type: 'account',
      currentAuthority: 'guest',
    };
  }
  return {
    message,
    status: 'failed',
    type: 'account',
    currentAuthority: 'guest',
  };
}

// Kiểm tra thông tin ví
export async function checkWallet() {
  const resp = await HttpService.get('/merchant/getCurrentMerchantAfterSignin');
  if (resp?.code === 1) {
    return {
      wallet: {
        canLink: !!resp?.data?.canLinkWallet,
        isLinked: !!resp?.data?.isLinkWallet
      }
    };
  }
  return { wallet: null };
}
