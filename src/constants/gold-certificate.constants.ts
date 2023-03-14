
export const CONVERSION_STATUS_LIST = [
  {
    value: 'PENDING',
    label: {vi: "Đặt lịch thành công", en: "Appointment successful"},
    color: 'processing'
  },
  {
    value: 'SUCCESS',
    label: {vi: "Quy đổi thành công", en: "Exchanged successful"},
    color: 'success'
  },
  {
    value: 'EXPIRED',
    label: { vi: "Hết hạn quy đổi", en: "Exchange expired"},
    color: 'error'
  },
  {
    value: 'CANCEL',
    label:  {vi: "Hủy lịch hẹn", en: "Cancel appointment"},
    color: 'error'
  },
]
export const GOLD_CERTIFICATE_TRANSACTION_METHOD = [
  {
    value: 'PURCHASE',
    label: {
      vi: 'Mua',
      en: 'Purchase',
    },
  },
  {
    value: 'SELL',
    label: {
      vi: 'Bán',
      en: 'Sell',
    },
  },
  {
    value: 'TRANSFER',
    label: {
      vi: 'Tặng',
      en: 'Transfer',
    },
  },
  {
    value: 'RECEIVE',
    label: {
      vi: 'Nhận',
      en: 'Receive',
    },
  },

]

export const GOLD_CERTIFICATE_TRANSACTION_PAYMENT_METHOD = [
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
    value: 'BANK_TRANSFER',
    label: {
      vi: 'Chuyển khoản ngân hàng',
      en: 'Bank transfer',
    },
  }
]