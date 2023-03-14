const RECONCILE_STATUS_LIST = [
  {
    value: 'UNPAID',
    label: {
      vi: 'Chưa thanh toán',
      en: 'Unpaid',
    },
    color: 'processing',
  },
  {
    value: 'PAID',
    label: {
      vi: 'Đã thanh toán',
      en: 'Paid',
    },
    color: 'success',
  },
  {
    value: 'PROCESSING',
    label: {
      vi: 'Chưa hoàn tất',
      en: 'Processing',
    },
    color: 'warning',
  },
]
export const RECONCILE_SFTP_STATUS = [
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
  RECONCILE_STATUS_LIST,
  
}
