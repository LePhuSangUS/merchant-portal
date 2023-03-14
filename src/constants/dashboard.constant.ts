export const CUSTOMER_STATUS_CHART = [
    {
        name: 'ACTIVATED',
        label: {
            vi: 'Đang hoạt động',
            en: 'Activated',
        },
        color: '#1890ff',
        marker: { style: { fill: '#1890ff' } },
        order: 1
    }
]

export const BILL_STATUS_CHART = [

    {
        name: 'PAID',
        label: {
            vi: 'Thành công',
            en: 'Paid',
        },
        color: '#b7eb8f',
        marker: { style: { fill: '#b7eb8f' } },
        order: 1
    },
    {
        name: 'NOT_PAID',
        label: {
            vi: 'Chưa thanh toán',
            en: 'Unpaid',
        },
        color: '#ffe58f',
        marker: { style: { fill: '#ffe58f' } }
    },
    {
        name: 'PROCESSING',
        label: {
            vi: 'Đang xử lý',
            en: 'Processing',
        },
        color: '#deccff',
        marker: { style: { fill: '#deccff' } },
        order: 2
    },
    {
        name: 'EXPIRED',
        label: {
            vi: 'Đã hết hạn',
            en: 'Expired',
        },
        color: '#ffe58f',
        marker: { style: { fill: '#ffe58f' } },
        order: 4
    },
    {
        name: 'CANCELED',
        label: {
            vi: 'Hủy bỏ',
            en: 'Cancelled'
        },
        color: 'gray',
        marker: { style: { fill: 'gray' } },
        order: 3
    },

]

export const TRANS_HIS_STATUS_CHART = [
    {
        name: 'SUCCESS',
        label: {
            vi: 'Thành công',
            en: 'Success',
        },
        color: '#52c41a',
        marker: { style: { fill: '#52c41a' } },
        order: 1
    },
    {
        name: 'PROCESSING',
        label: {
            vi: 'Đang xử lý',
            en: 'Processing',
        },
        color: '#1890ff',
        marker: { style: { fill: '#1890ff' } },
        order: 2
    },
    {
        name: 'FAILED',
        label: {
            vi: 'Thất bại',
            en: 'Failed',
        },
        color: '#f5222d',
        marker: { style: { fill: '#f5222d' } },
        order: 3
    },
]