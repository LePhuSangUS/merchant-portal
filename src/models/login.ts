import { stringify } from 'querystring';
import type { Effect, Reducer } from 'umi';
import { history } from 'umi';
import { getConfigsByKeyType } from '@/services/user/api';

import { login, checkWallet } from '@/services/login';
import { getValidationConfigs } from '@/services/profile/api';
import { signout } from '@/services/signout';
import { getPageQuery } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
import { mapRoutes, resetRoutes, setRoutes } from '@/utils/routes';
import { setUser } from '@/utils/storage';
import { STORAGE_KEY } from "@/constants";
import {DISBURSEMENT_SUPPORT_CURRENCY} from "@/constants/local-storage.const"
import _ from "lodash"
export type StateType = {
  status?: 'ok' | 'error' | 'failed';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
  code?: string | number;
  message?: string
};

export type LoginModelType = {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
};

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      const { status, user } = response;
      yield put({
        type: 'changeLoginStatus',
        payload: response
      });
      // Login successfully
      if (status === 'ok') {
        const { routes } = user;
        setUser(user);
        // localStorage.setItem('user', JSON.stringify(user));
        const wallet = yield call(checkWallet, payload);
        const rulesList = yield call(getValidationConfigs, payload);
        const rulesObject = _.keyBy(rulesList?.data || [], 'formType');
        const disbursementSysConfig = yield call(getConfigsByKeyType, "DISBURSEMENT");
        const disbursementSupportCurrencyData: any = disbursementSysConfig?.data?.docs.find((item: any) => item.key == "DISBURSEMENT_SUPPORT_CURRENCY");
        const disbursementSupportCurrencyOptions = Object.keys(disbursementSupportCurrencyData?.value || {}).sort().map((keyItem) => {
          return {
            value: keyItem,
            label:keyItem
          }
        })
        setUser({
          ...user,
          ...wallet, rules: rulesObject ,
          [DISBURSEMENT_SUPPORT_CURRENCY]:disbursementSupportCurrencyOptions||[],
        })
        










        const routesMapped = mapRoutes(routes);
        setRoutes(routesMapped);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        history.replace(redirect || '/');
      }
    },

    *logout({  }, { call,  }) {
      const { redirect } = getPageQuery();
      yield call(signout);
      localStorage.removeItem(STORAGE_KEY||"MERCHANT_PORTAL");
      resetRoutes();
      // Note: There may be security issues, please note
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
        code: payload.code,
        message: payload.message
      };
    },
  },
};

export default Model;
