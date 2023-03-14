import type { Effect, Reducer } from 'umi';

import { queryCurrent, query as queryUsers } from '@/services/user';
import { getMerchantProfile } from '@/services/profile/api';

export type CurrentUser = {
  avatar?: string;
  name?: string;
  userId?: string,
  org?: object,
  app?: object,
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
};

export type CurrentMerchant = {
  name?: string,
  [key: string]: any
}

export type UserModelState = {
  currentUser?: CurrentUser;
  currentMerchant?: CurrentMerchant;
};

export type UserModelType = {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchCurrent: Effect;
    fetchCurrentMerchant: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveCurrentMerchant: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
};

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    currentMerchant: {}
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchCurrentMerchant(_, { call, put }) {
      const response = yield call(getMerchantProfile);
      yield put({
        type: 'saveCurrentMerchant',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    saveCurrentMerchant(state, action) {
      return {
        ...state,
        currentMerchant: action.payload.data || {},
      };
    },
  },
};

export default UserModel;
