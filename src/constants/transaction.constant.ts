

const TRANSACTION_STATUS_LIST = [
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
      vi: 'Thành công',
      en: 'Success',
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
const MERCHANT_TRANSACTION_STATUS_LIST = [

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
  },
  {
    value: 'PROCESSING',
    label: {
      vi: 'Đang xử lý',
      en: 'Processing',
    },
    color: 'processing'
  },
 

]

const TRANSACTION_CHANNELS_LIST = [
  {
    value: 'NEOPAY_WALLET',
    label: {
      vi: 'Ví NeoX',
      en: 'NeoX Wallet',
    },
  },
  {
    value: 'ATM',
    label: {
      vi: 'ATM nội địa',
      en: 'ATM Card',
    },
  },
  {
    value: 'CC',
    label: {
      vi: 'Visa/Master',
      en: 'Visa/Master',
    },
  },
  {
    value: 'BANK_TRANSFER',
    label: {
      vi: 'Chuyển khoản ngân hàng',
      en: 'Bank transfer',
    },
  }
]

const TRANSACTION_TYPES_LIST = [
  {
    value: 'PAY',
    label: {
      vi: 'Thanh toán',
      en: 'Payment'
    },
    color: '#47a2f7'
  },
  {
    value: 'TRANSFER',
    label: {
      vi: 'Chuyển tiền',
      en: 'Transfer'
    },
    color: '#cb56c2'
  },
  {
    value: 'CASHIN',
    label: {
      vi: 'Nạp tiền',
      en: 'Cash in'
    },
    color: '#71b94e'
  },
  {
    value: 'CASHOUT',
    label: {
      vi: 'Rút tiền',
      en: 'Cash out'
    },
    color: '#faad14'
  },
  {
    value: 'MERCHANT_REVENUE',
    label: {
      vi: 'Quyết toán doanh thu',
      en: 'Revenue settlement'
    },
    color: '#886ae5'
  },
  {
    value: 'MERCHANT_WITHDRAW',
    label: {
      vi: 'Yêu cầu rút tiền',
      en: 'Withdrawal request'
    },
    color: '#0ab7b7'
  },
  {
    value: 'MERCHANT_WITHDRAW_REFUND',
    label: {
      vi: 'Từ chối rút tiền',
      en: 'Withdrawal rejection'
    },
    color: '#ed4c71'
  },
  {
    value: 'REFUND',
    label: {
      vi: 'Hoàn tiền',
      en: 'Refund'
    },
    color: '#d368a8'
  },
  {
    value: 'REFUND_CASHIN',
    label: {
      vi: 'Hoàn tiền nạp tiền',
      en: 'Cash in refund'
    },
    color: '#b77783'
  },
  {
    value: 'BUY',
    label: {
      vi: 'Mua sản phẩm',
      en: 'Buy product'
    },
    color: '#6c87d3'
  },
  {
    value: 'SELL',
    label: {
      vi: 'Bán sản phẩm',
      en: 'Sell product'
    },
    color: '#eba11b'
  },
  {
    value: 'ADJUST',
    label: {
      vi: 'Điều chỉnh',
      en: 'Adjust'
    },
    color: '#607d8b'
  },
]

const WITHDRAWAL_STATUS_LIST = [
  {
    value: 'INITIAL',
    label: {
      vi: 'Khởi tạo',
      en: 'Initial',
    },
    color: 'default'
  },
  {
    value: 'PENDING',
    label: {
      vi: 'Chờ duyệt',
      en: 'Pending',
    },
    color: 'processing'
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
    value: 'DONE',
    label: {
      vi: 'Thành công',
      en: 'Success',
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
  },
  {
    value: 'REJECTED',
    label: {
      vi: 'Thất bại',
      en: 'Failed',
    },
    color: 'error'
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


const PAYMENT_HISTORY_STATUS = [
  {
    value: 'PROCESSING',
    label: {
      vi: 'Đang xử lý',
      en: 'Processing'
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

export {
  TRANSACTION_STATUS_LIST,
  TRANSACTION_CHANNELS_LIST,
  TRANSACTION_TYPES_LIST,
  WITHDRAWAL_STATUS_LIST,
  PAYMENT_HISTORY_STATUS,
  MERCHANT_TRANSACTION_STATUS_LIST
}
