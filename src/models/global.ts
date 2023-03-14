import { queryNotices } from '@/services/user';
import type { ConnectState } from './connect.d';
import { publicAPI } from "@/new_service/merchantAPI";
import { message } from "antd";
import { translate } from '@/utils';

// export type NoticeItem = {
//   id: string;
//   type: string;
//   status: string;
// } & NoticeIconData;

// export type GlobalModelState = {
//   collapsed: boolean;
//   notices: NoticeItem[];
//   reloadTable:boolean,

// };

const GlobalModel: any = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    reloadTable: false,
    visibleModalRemind: false,
    modalRemindData: {
      icon:null,
      onConfirm: () => { },
      title: "",
      description: "",  
    },








    businessLineData:null,
  },

  subscriptions: {
    setup({ dispatch, history }: any) {
      dispatch({type:"getBusinessLine"})
    },
  },
  effects: {
    *getBusinessLine({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(publicAPI?.getBusinessLineAPI, payload);
        console.log(data,success);
        if (success && data) {
          yield put({
            type: 'getBusinessLineSuccess',
            payload: data,
          });
        }
      } catch (error:any) {
        message.error(error?.message || translate("Message: An error occurred"));
      }
    },
    *fetchNotices(_, { call, put, select }:any) {
      const data:any = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item):any => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }:any, { put, select }:any) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }:any, { put, select }:any) {
      const notices: any = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
  },

  reducers: {
    getBusinessLineSuccess(state: any, { payload }: any) {
      return { ...state, businessLineData: payload };
    },
    changeLayoutCollapsed(state = { notices: [], collapsed: true }, { payload }:any): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }:any): GlobalModelState {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },
    saveClearedNotices(state = { notices: [], collapsed: true }, { payload }:any): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
    toggleReloadTable(state :any): any {
      return { ...state,reloadTable:!state?.reloadTable};
    },
   //==========================
  showModalRemind(state: any, { payload }: any) {
    return { ...state,...payload, visibleModalRemind: true };
  },
  hideModalRemind(state: any) {
    return { ...state, visibleModalRemind: false };
  },
  },
};

export default GlobalModel;
