const SUPPORT_STATUS_LIST = [
  {
    value: 'OPENED',
    label: {
      vi: 'Chưa phản hồi',
      en: 'Pending',
    },
    color: 'warning',
  },
  {
    value: 'CLOSED',
    label: {
      vi: 'Đã phản hồi',
      en: 'Responsed',
    },
    color: 'success',
  }
]

const SUPPORT_TYPE_LIST = [
  {
    value: 'BANK_CONNECTION',
    label: {
      vi: 'Liên kết ngân hàng',
      en: 'Bank connection',
    },
  },
  {
    value: 'WITHDRAW_DEPOSIT',
    label: {
      vi: 'Nạp tiền/Rút tiền',
      en: 'Withdraw/Deposit',
    },
  },
  {
    value: 'TRANSFER',
    label: {
      vi: 'Chuyển tiền/Nhận tiền',
      en: 'Transfer',
    },
  },
  {
    value: 'ACCOUNT_MANAGEMENT',
    label: {
      vi: 'Quản lý tài khoản',
      en: 'Account management',
    },
  },
  {
    value: 'OTHER',
    label: {
      vi: 'Khác',
      en: 'Other',
    },
  }
]

export {
  SUPPORT_STATUS_LIST,
  SUPPORT_TYPE_LIST
}
