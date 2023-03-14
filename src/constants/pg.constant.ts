const PG_STATE_LIST = {
  INITIAL: 'INITIAL', // Lưu nháp.
  PENDING: 'PENDING', // Chờ duyệt.
  APPROVED: 'APPROVED', // Duyệt.
  REJECTED: 'REJECTED', // Từ chối duyệt.
}

const PG_STATUS_LIST = [
  {
    value: 'INITIAL',
    label: {
      vi: 'Khởi tạo',
      en: 'Initial',
    },
    color: 'default',
  },
  {
    value: 'PENDING',
    label: {
      vi: 'Chờ duyệt',
      en: 'Pending',
    },
    color: 'warning',
  },
  {
    value: 'APPROVED',
    label: {
      vi: 'Đã duyệt',
      en: 'Approved',
    },
    color: 'success',
  },
  {
    value: 'REJECTED',
    label: {
      vi: 'Bị từ chối',
      en: 'Rejected',
    },
    color: 'error',
  },
]

const PG_MERCHANT_TYPES = [
  {
    value: 'TYPE1',
    label: {
      vi: 'Sàn giao dịch TMĐT',
      en: 'E-Commerce Exchange'
    }
  },
  {
    value: 'TYPE2',
    label: {
      vi: 'Website TMĐT',
      en: 'E-Commerce Website'
    }
  },
  {
    value: 'TYPE3',
    label: {
      vi: 'Chuỗi cửa hàng',
      en: 'Chain of Stores'
    }
  }
]

const PG_USER_ROLES = {
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  ADMIN: 'ADMIN',
  BUSINESS_OWNER: 'BUSINESS_OWNER'
}


// ! only two payment when golive 27/05/2022
const PG_CHANNELS_LIST = [
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

const CURRENCY_LIST = [
  {
    value: 'VND',
    label: {
      vi: 'VND',
      en: 'VND'
    }
  },
  {
    value: 'USD',
    label: {
      vi: 'USD',
      en: 'USD'
    }
  }
]

export {
  PG_STATE_LIST,
  PG_STATUS_LIST,
  PG_MERCHANT_TYPES,
  PG_USER_ROLES,
  PG_CHANNELS_LIST,
  CURRENCY_LIST
}
