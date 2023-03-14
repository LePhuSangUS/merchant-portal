export const TRANSACTION_STATE = [
    {
        value: 'SUCCESS',
        label: {
            vi: 'Thành công',
            en: 'Success',
        },
        color: 'success'
    },
    {
        value: 'FAILED',
        label: {
            vi: 'Thất bại',
            en: 'Failed',
        },
        color: 'error'
    }
]

export const COLLECTION_RECONCILE_STATE = [
    {
        value: 'RECONCILED',
        label: {
            vi: 'Đã đối soát',
            en: 'Reconciled',
        },
        // color: 'white'
    },
    {
        value: 'UNPAID',
        label: {
            vi: 'Chưa thanh toán',
            en: 'Unpaid',
        },
        color: 'blue'
    },
    {
        value: 'PAID',
        label: {
            vi: 'Đã thanh toán',
            en: 'Paid',
        },
        color: 'success'
    },
]

export const TRANSACTION_HISTORY_STATE = [
    {
        value: 'PROCESSING',
        label: {
            vi: 'Đang xử lý',
            en: 'Processing',
        },
        color: 'blue'
    },
    {
        value: 'SUCCESS',
        label: {
            vi: 'Thành công',
            en: 'Success',
        },
        color: 'success'
    },
    {
        value: 'FAILED',
        label: {
            vi: 'Thất bại',
            en: 'Failed',
        },
        color: 'error'
    }
]
export const TRANSACTION_HISTORY_TYPE = [
    {
        value: 'COL_MERCHANT_WITHDRAW',
        label: {
            vi: 'Yêu cầu rút tiền',
            en: 'Withdraw request',
        },
    },
    {
        value: 'COL_MERCHANT_REVENUE',
        label: {
            vi: 'Quyết toán thu hộ',
            en: 'Collection revenue',
        },
    },
    {
        value: 'ADJUST',
        label: {
            vi: 'Điều chỉnh',
            en: 'Adjust',
        },
    },
]


export const COLLECTION_VIRTUAL_ACCOUNT_STATE = [
    {
        value: 'ACTIVE',
        label: {
            vi: 'Hoạt động',
            en: 'Activated',
        },
        color: 'success'
    },
    {
        value: 'PROCESSING',
        label: {
            vi: 'Đang xử lý',
            en: 'Processing',
        },
        color: 'blue'
    },
]

export const COLLECTION_SFTP_CONNECTION_TYPE = [
    {
        value: 'ACCOUNT',
        label: {
            vi: 'Username/Password',
            en: 'Username/Password',
        },
    },
    {
        value: 'KEYPAIR',
        label: {
            vi: 'Private key',
            en: 'Private key',
        },
    },
]

export const COLLECTION_SFTP_STATUS = [
    {
        value: 'SUCCESS',
        label: {
            vi: 'Thành công',
            en: 'Success',
        },
        color: 'success'
    },
    {
        value: 'FAILED',
        label: {
            vi: 'Thất bại',
            en: 'Failed',
        },
        color: 'error'
    }
]