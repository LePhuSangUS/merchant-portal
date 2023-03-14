const MIN_REFUND_AMOUNT = 10000

const REFUND_STATUS_LIST = [
  {
    value: 'PENDING',
    label: {
      vi: 'Chờ duyệt',
      en: 'Pending',
    },
    color: 'processing'
  },
  {
    value: 'APPROVED',
    label: {
      vi: 'Đã duyệt',
      en: 'Approved',
    },
    color: 'success'
  },
  {
    value: 'REJECTED',
    label: {
      vi: 'Từ chối',
      en: 'Rejected',
    },
    color: 'error'
  }
]

export const REFUND_TRANSACTION_STATUS = [
  {
    value: 'PROCESSING',
    label: {
      vi: 'Đang xử lý',
      en: 'Processing',
    },
    color: 'processing'
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

export {
  MIN_REFUND_AMOUNT,
  REFUND_STATUS_LIST
}
