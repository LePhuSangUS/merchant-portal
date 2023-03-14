import moment from 'moment';
import { disbursementRegistrationAPI,updateWalletAPI, getBalanceAPI,getMerchantConfigAPI,disbursementActiveAPI, getDisbursementConfigAPI, configUseApiAPI } from "@/services/disbursement/api"
import { getBanks } from "@/services/profile/api"
import _ from 'lodash';
import {message, translate} from "@/utils"
export const namespace = 'disbursement';

const DashboardModel = {
    namespace: namespace,
    state: {
        config: {},
        registration: {},
        banks: {},
        balance: {},
        transaction: {}

    },
    reducers: {
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },

    },
    subscriptions: {
    },
    effects: {
        *registration({ payload, callbackSuccess, callbackFailed }, { call, put }) {
            try {
                console.log("payload",payload)
                const data = yield call(disbursementRegistrationAPI, payload);
                if (data.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            registration: data,
                        },
                    });
                    _.isFunction(callbackSuccess) ? callbackSuccess() : {}
                } else {
                    _.isFunction(callbackFailed) ? callbackFailed() : {}
                }
            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },
        *updateWallet({ payload, callbackSuccess, callbackFailed }, { call, put }) {
            try {
                console.log("payload",payload)
                const data = yield call(updateWalletAPI, payload);
                if (data.success) {
                    _.isFunction(callbackSuccess) ? callbackSuccess() : {}
                } else {
                    _.isFunction(callbackFailed) ? callbackFailed() : {}
                }
            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },
        *getConfig({ state, payload }, { call, put }) {
            try {
                const data = yield call(getDisbursementConfigAPI);
                if (data.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            config: data,
                        },
                    });
                }

            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
                
            }


        },
        *getBankConfig({ state, payload }, { call, put }) {
            const data = yield call(getBanks);
            yield put({
                type: 'updateState',
                payload: {
                    banks: data,
                },
            });

        },
        *getHistoriesTopup({ state, payload }, { call, put }) {
            const data = yield call(getHistoriesTopupAPI);
            yield put({
                type: 'updateState',
                payload: {
                    banks: data,
                },
            });

        },
        *getBalance({ state, payload }, { call, put }) {

            try {
                const data = yield call(getBalanceAPI);
                if (data.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            balance: data,
                        },
                    });                      
                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))    
                }
    
            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },
        *configUseApi({ state, payload }, { call, put }) {

            try {
                const data = yield call(configUseApiAPI, payload);

                if (data.success) {
                    message.success(translate("message.success"))    
                      
                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))    
                }
    
            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },
        *getMerchantConfig({ state, payload }, { call, put }) {

            try {
                const data = yield call(getMerchantConfigAPI);

                if (data.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            merchantConfig: data,
                        },
                    });                      
                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))    
                }
    
            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }
        },
        *disbursementActive({ state, payload,callbackSuccess }, { call, put }) {

            try {
                const data = yield call(disbursementActiveAPI,payload);

                if (data.success) {
                    message.success(translate("message.success"))    
                    _.isFunction(callbackSuccess) ? callbackSuccess() : {}
                    
                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))    
                }
    
            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }
        },
    },
};

export default DashboardModel;