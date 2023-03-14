const BILL_STATUS_LIST = [
  {
    value: 'NOT_PAID',
    label: {
      vi: 'Chưa thanh toán',
      en: 'Unpaid',
    },
    color: 'warning'
  },
  {
    value: 'PROCESSING',
    label: {
      vi: 'Đang xử lý',
      en: 'Processing',
    },
    color: 'processing'
  },
  {
    value: 'PAID',
    label: {
      vi: 'Đã thanh toán',
      en: 'Paid',
    },
    color: 'success'
  },
  {
    value: 'EXPIRED',
    label: {
      vi: 'Đã hết hạn',
      en: 'Expired',
    },
    color: 'warning'
  },
  {
    value: 'CLOSED',
    label: {
      vi: 'Thất bại',
      en: 'Failed',
    },
    color: 'error'
  },
  {
    value: 'CANCELED',
    label: {
      vi: 'Hủy bỏ',
      en: 'Cancelled'
    },
    color: 'default'
  },
  {
    value: 'REFUNDED',
    label: {
      vi: 'Đã hoàn tiền',
      en: 'Refunded'
    },
    color: 'success'
  },
  {
    value: 'SUCCESS',
    label: {
      vi: 'Thành công',
      en: 'Success',
    },
    color: 'success'
  }
]

const BILL_HISTORY_STATUS = [
  {
    value: 'INITIAL',
    label: {
      vi: 'Khởi tạo',
      en: 'Initial'
    },
    color: 'default'
  },
  {
    value: 'SUCCESS',
    label: {
      vi: 'Thành công',
      en: 'Success'
    },
    color: 'success'
  },
  {
    value: 'FAILED',
    label: {
      vi: 'Thất bại',
      en: 'Failed'
    },
    color: 'error'
  }
]

const BILL_STATUS_CHART = [
  {
    name: 'PAID',
    label: {
      vi: 'Đã thanh toán',
      en: 'Paid',
    },
    color: '#52c41a',
    marker : {style: {fill: '#52c41a'}},
    order: 1
  },
  {
    name: 'NOT_PAID',
    label: {
      vi: 'Chưa thanh toán',
      en: 'Unpaid',
    },
    color: '#f54242',
    marker : {style: {fill: '#f54242'}}
  },
  {
    name: 'PAID',
    label: {
      vi: 'Đã thanh toán',
      en: 'Paid',
    },
    color: 'success',
    marker : {style: {fill: 'success'}}
  },
  {
    name: 'EXPIRED',
    label: {
      vi: 'Đã hết hạn',
      en: 'Expired',
    },
    color: '#fa8c16',
    marker : {style: {fill: '#fa8c16'}},
    order: 4
  },
  {
    name: 'CLOSED',
    label: {
      vi: 'Thất bại',
      en: 'Failed',
    },
    color: 'error',
    marker : {style: {fill: 'error'}}
  },
  {
    name: 'CANCELED',
    label: {
      vi: 'Đã hủy bỏ',
      en: 'Cancelled'
    },
    color: 'purple',
    marker : {style: {fill: 'purple'}},
    order: 3
  },
  {
    name: 'REFUNDED',
    label: {
      vi: 'Đã hoàn tiền',
      en: 'Refunded'
    },
    color: '#c41d7f',
    marker : {style: {fill: '#c41d7f'}},
    order: 2
  },
  {
    name: 'SUCCESS',
    label: {
      vi: 'Thành công',
      en: 'Success',
    },
    color: '#52c41a',
    marker : {style: {fill: '#52c41a'}},
    order: 1
  },
  {
    name: 'PROCESSING',
    label: {
      vi: 'Đang xử lý',
      en: 'Processing',
    },
    color: '#1890ff',
    marker : {style: {fill: '#1890ff'}},
    order: 2
  },
  {
    name: 'FAILED',
    label: {
      vi: 'Thất bại',
      en: 'Failed',
    },
    color: '#f5222d',
    marker : {style: {fill: '#f5222d'}},
    order: 3
  },
  {
    name: 'ACTIVATED',
    label: {
      vi: 'Đang hoạt động',
      en: 'Activated',
    },
    color: '#1890ff',
    marker : {style: {fill: '#1890ff'}},
    order: 1
  }
]

export {
  BILL_STATUS_LIST,
  BILL_HISTORY_STATUS,
  BILL_STATUS_CHART
}
