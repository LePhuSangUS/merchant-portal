const BALANCE_CHANGE_TYPES = [
  {
    value: 'TRANSFER',
    label: {
      vi: 'Chuyển tiền',
      en: 'Transfer'
    }
  },
  {
    value: 'PAY',
    label: {
      vi: 'Thanh toán',
      en: 'Payment'
    }
  },
  {
    value: 'CASHIN',
    label: {
      vi: 'Nạp tiền',
      en: 'Cash in'
    }
  },
  {
    value: 'CASHOUT',
    label: {
      vi: 'Rút tiền',
      en: 'Cash out'
    }
  },
  {
    value: 'REFUND',
    label: {
      vi: 'Hoàn tiền',
      en: 'Refund'
    }
  }
]

const BALANCE_HISTORY_STATUS = [
  {
    value: 'PENDING',
    label: {
      vi: 'Đang xử lý',
      en: 'Processing'
    },
    color: 'processing'
  },
  {
    value: 'REJECTED',
    label: {
      vi: 'Thất bại',
      en: 'Failed'
    },
    color: 'error'
  },
  {
    value: 'DONE',
    label: {
      vi: 'Thành công',
      en: 'Success'
    },
    color: 'success'
  },
  {
    value: 'XXXX',
    label: {
      vi: 'Thành công',
      en: 'Success'
    },
    color: 'success'
  }
]
export {
  BALANCE_CHANGE_TYPES,
  BALANCE_HISTORY_STATUS
}
