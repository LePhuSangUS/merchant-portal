import {
    collectionServiceRegistration,
    getMerchantConfig,
    switchCollectionServiceState,
    getCollectionConfig,
    updateCollectionServiceConfig,
    getTotalReceivedAmount,
    getCollectionBalance,
    saveCollectionSFTPConfig,
    getCollectionSFTPConfig
} from "@/services/collection-service/api";
import _ from 'lodash';
import { message, translate } from "@/utils";

const CollectionServiceModel = {
    namespace: 'collectionService',
    state: {
        config: {},
        registration: {},
        banks: {},
        balance: {},
        yellowWallet: {},
        greenWallet: {},
        transaction: {},
        merchantConfig: {},
        sftpConfig: {}
    },
    reducers: {
        updateState(state: ObjectType, { payload }: ObjectType) {
            return {
                ...state,
                ...payload
            };
        },

    },
    subscriptions: {
    },
    effects: {
        *registration({ state, payload, callbackSuccess, callbackFailed }, { call, put }) {
            try {
                const data = yield call(collectionServiceRegistration, payload);
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
        *getConfig({ state, payload }, { call, put }) {
            try {
                const data = yield call(getCollectionConfig);
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
        *updateCollectionServiceConfig({ state, payload }, { call, put }) {

            try {
                const data = yield call(updateCollectionServiceConfig, payload);

                if (data.success) {
                    message.success(translate("message.update.success"))

                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))
                }

            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },

        *getTotalReceivedAmount({ state, payload }, { call, put }) {

            try {
                const resp = yield call(getTotalReceivedAmount);
                if (resp.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            yellowWallet: resp?.data,
                        },
                    });
                } else {
                    message.error(resp.message || translate("message.An_Error_Occurred_Please_Try_Again"))
                }

            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },
        *getCollectionBalance({ state, payload }, { call, put }) {

            try {
                const resp = yield call(getCollectionBalance);
                if (resp.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            greenWallet: resp?.data,
                        },
                    });
                } else {
                    message.error(resp.message || translate("message.An_Error_Occurred_Please_Try_Again"))
                }

            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },

        *getMerchantConfig({ state, payload }, { call, put }) {

            try {
                const data = yield call(getMerchantConfig);

                if (data.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            merchantConfig: data.data,
                        },
                    });
                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))
                }

            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }
        },
        *switchCollectionServiceState({ state, payload, callbackSuccess }, { call, put }) {

            try {
                const data = yield call(switchCollectionServiceState, payload);

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
        // SFTP
        *saveSFTPConfig({ state, payload }, { call, put }) {

            try {
                const data = yield call(saveCollectionSFTPConfig, payload);

                if (data.success) {
                    message.success(translate("message.update.success"))

                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))
                }

            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }


        },
        *getSFTPConfig({ state, payload }, { call, put }) {
            try {
                yield put({ type: 'updateState', payload: { sftpConfig: {} } });

                const data = yield call(getCollectionSFTPConfig);
                if (data.success) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            sftpConfig: data.data,
                        },
                    });
                } else {
                    message.error(data.message || translate("message.An_Error_Occurred_Please_Try_Again"))
                }

            } catch (error) {
                message.error(error.message || translate("message.An_Error_Occurred_Please_Try_Again"))
            }
        },
    },
};

export default CollectionServiceModel;