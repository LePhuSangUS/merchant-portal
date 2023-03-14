import { translate } from '@/utils';
import { MODAL_TYPE } from "@/constants"
import { message } from "antd";
import {accountAPI} from "@/new_service/merchantAPI"
export interface IModelType {
  namespace: string;
  effects: any;
  reducers: any;
  state: any,
  subscriptions: any
}

export const namespace = 'myProfile';

const ConditionConnector: IModelType = {
  namespace: namespace,
  state: {
    currentItem: {},
    modalType: MODAL_TYPE?.EDIT,
    modalVisible: false,

    currentMemberItem: {},
    modalMemberType: MODAL_TYPE?.VIEW,
    modalAddMemberVisible: false,

    modalViewPermissionVisible: false,
    
    reloadTable: false,
    merchantConfigData: {},
    merchantUserRoles: [],
    roleTableData:null,
  },

  subscriptions: {
    setup({ dispatch, history }: any) {
     
    },
  },

  effects: {
    *getMerchantConfig({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.getMerchantConfigAPI, payload);
        console.log(data,);
        if (success && data) {
          yield put({
            type: 'getMerchantConfigSuccess',
            payload: data,
          });
        }
      } catch (error:any) {
        message.error(error?.message || translate("Message: An error occurred"));
      }
    },
    *getMerchantUserRoles({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.getMerchantUserRolesAPI, payload);
        console.log(data,);
        if (success && data) {
          yield put({
            type: 'getMerchantUserRolesSuccess',
            payload: data,
          });
        }
      } catch (error:any) {
        message.error(error?.message || translate("Message: An error occurred"));
      }
    },
    *getRoleTable({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.getRoleTableAPI, payload);
        console.log(data,success);
       
        if (success && data) {
          
          yield put({
            type: 'getRoleTableSuccess',
            payload: data,
          });
        }
      } catch (error:any) {
        message.error(error?.message || translate("Message: An error occurred"));
      }
    },
    *toggleDisbursementActive({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.toggleDisbursementActiveAPI, payload);
        if (success && data) {
          message.success(translate("Success"));
          yield put({
            type: 'getMerchantConfig',
          });
        }
      } catch (error:any) {
        message.error(error?.message || translate("Message: An error occurred"));
      }

    },
    *updateMerchantInfo({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.updateMerchantInfoAPI, payload);
        if (success && data) {
          message.success(translate("Success"));
          yield put({
            type: 'user/fetchCurrentMerchant',
          });
          yield put({
            type: 'hideModal',
          });
        }
      } catch (error:any) {
        message.error(error?.message || translate("Message: An error occurred"));
      }

    },
    *addMember({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.addMemberAPI, payload);
        if (success && data) {
          message.success(translate("Success"));
          yield put({
            type: 'global/toggleReloadTable',
          });
          yield put({
            type: 'hideModalAddMember',
          });
        }
      } catch (error: any) {
        console.log(error)
        message.error(error?.response?.data?.message|| error?.message || translate("Message: An error occurred"));
      }
    },
    *editMember({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.editMemberAPI, payload);
        if (success && data) {
          message.success(translate("Success"));
          yield put({
            type: 'global/toggleReloadTable',
          });
          yield put({
            type: 'hideModalAddMember',
          });
        }
      } catch (error: any) {
        console.log(error)
        message.error(error?.response?.data?.message|| error?.message || translate("Message: An error occurred"));
      }
    },
    *setActiveMerchantUser({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.setActiveMerchantUserAPI, payload);
        if (success && data) {
        message.success(translate("Success"));
          yield put({
            type: 'global/toggleReloadTable',
          });
          yield put({
            type: 'global/hideModalRemind',
          });
        }
      } catch (error: any) {
        console.log(error)
        message.error(error?.response?.data?.message|| error?.message || translate("Message: An error occurred"));
      }
    },
    *deleteMerchantUser({ payload = {} }, { call, put, select }: any) {
      try {
        const { success, data } = yield call(accountAPI?.deleteMerchantUserAPI, payload);
        if (success && data) {
          message.success(translate("Success"));
          yield put({
            type: 'global/toggleReloadTable',
          });
          yield put({
            type: 'global/hideModalRemind',
          });
        }
      } catch (error: any) {
        console.log(error)
        message.error(error?.response?.data?.message|| error?.message || translate("Message: An error occurred"));
      }
    },
  },
  reducers: {
    getMerchantConfigSuccess(state: any, { payload }: any) {
      return { ...state, merchantConfigData: payload };
    },
    getMerchantUserRolesSuccess(state: any, { payload }: any) {
      return { ...state, merchantUserRoles: payload };
    },
    getRoleTableSuccess(state: any, { payload }: any) {
      return { ...state, roleTableData: payload };
    },




    //==========================
    showModal(state: any, { payload }: any) {
      return { ...state, ...payload, modalVisible: true };
    },
    hideModal(state: any) {
      return { ...state, modalVisible: false };
    },
    showModalAddMember(state: any, { payload }: any) {
      return { ...state,...payload, modalAddMemberVisible: true };
    },
    hideModalAddMember(state: any) {
      return { ...state, modalAddMemberVisible: false };
    },
    showModalViewPermission(state: any, { payload }: any) {
      return { ...state, ...payload, modalViewPermissionVisible: true };
    },
    hideModalViewPermission(state: any) {
      return { ...state, modalViewPermissionVisible: false };
    },
    toggleReloadTable(state: any) {
      return { ...state, reloadTable: !state?.reloadTable };
    },
  },
};

export default ConditionConnector;