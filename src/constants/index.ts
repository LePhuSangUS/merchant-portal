export const APP_ID = '611942dc171baf1ca4c4a28b'
export { languages } from './languages.constant'
export * as location from './location.constant'
export const STORAGE_KEY = "MERCHANT_PORTAL";

export {
  BALANCE_HISTORY_STATUS,
  BALANCE_CHANGE_TYPES
} from '@/constants/balance.constant'

export {
  IDENTITY_TYPES,
  BUSINESS_TYPES,
  IDENTITY_GENDERS,
  PAYMENT_PAGE_CONFIG_STATE
} from '@/constants/user.constant'

export {
  BILL_STATUS_LIST,
  BILL_STATUS_CHART,
  BILL_HISTORY_STATUS
} from '@/constants/bill.constant'

export {
  MIN_REFUND_AMOUNT,
  REFUND_STATUS_LIST
} from '@/constants/refund.constant'

export {
  TRANSACTION_STATUS_LIST,
  TRANSACTION_CHANNELS_LIST,
  TRANSACTION_TYPES_LIST,
  WITHDRAWAL_STATUS_LIST,
  PAYMENT_HISTORY_STATUS,
  MERCHANT_TRANSACTION_STATUS_LIST
} from '@/constants/transaction.constant'

export {
  RECONCILE_STATUS_LIST
} from './reconcile.constant'

export {
  PG_STATE_LIST,
  PG_STATUS_LIST,
  PG_CHANNELS_LIST,
  PG_MERCHANT_TYPES,
  PG_USER_ROLES,
  CURRENCY_LIST
} from './pg.constant'

export {
  STORE_STATUS_LIST
} from '@/constants/store.constant'

export {
  SUPPORT_STATUS_LIST,
  SUPPORT_TYPE_LIST
} from '@/constants/support.constant'


export {
  GOLD_CERTIFICATE_TRANSACTION_METHOD,
  GOLD_CERTIFICATE_TRANSACTION_PAYMENT_METHOD,
  CONVERSION_STATUS_LIST

} from './gold-certificate.constants'
export * from './disbursement.constants'



export const MODAL_TYPE = {
  CREATE: "CREATE",
  EDIT:"EDIT",
  VIEW:"VIEW",
}
export const STYLE_STATUS= {
  SUCCESS: {
    value: "SUCCESS",
    type: "SUCCESS",
    color: "#5dda99",
    background:"#eefbf4"
  },
  PROCESSING: {
    value: "PROCESSING",
    type: "PROCESSING",
    color: "#74caf9",
    background:"f1f9fe", 
  },
  ERROR: {
    value: "ERROR",
    type: "ERROR",
    color: "#f76176",
    background:"#feeff1"
  },
  WARNING: {
    value: "WARNING",
    type: "WARNING",
    color: "#fdaf43",
    background:"#fef7ec"
  },
  DEFAULT: {
    value: "DEFAULT",
    type: "DEFAULT",
    color: "#88888e",
    background:"#f3f3f9"
  },
}
export const MEMBER_STATUS_LIST = [
  {
    value: true,
    label: {
      vi: 'Đã Kích hoạt',
      en: 'Activated',
    },
    style: STYLE_STATUS.SUCCESS
  },
  {
    value: false,
    label: {
      vi: 'Vô hiệu hóa',
      en: 'Inactivated',
    },
    style: STYLE_STATUS.ERROR
  }
]


export const AUTHORIZATION_MANAGEMENT_USER_ROLES = {
  USER_MANAGEMENT: 'USER_MANAGEMENT',
  ADMIN: 'ADMIN',
  BUSINESS_OWNER: 'BUSINESS_OWNER'
}