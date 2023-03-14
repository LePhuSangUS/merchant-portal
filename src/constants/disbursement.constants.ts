
export const DISBURSEMENT_HISTORIES_TRANSACTION_STATUS = [
    {
      value: 'WAITING_PROCESS',
      label: {vi: "Chờ xử lý", en: "Waiting process"},
      color: 'processing'
    },
    {
      value: 'PROCESSING',
      label: {vi: "Đang xử lý", en: "Processing"},
      color: 'processing'
    },
    {
      value: 'SUCCESS',
      label: {vi: "Thành công", en: "success"},
      color: 'success'
    },
    {
      value: 'FAILED',
      label: { vi: "Thất bại", en: "Failed"},
      color: 'error'
    },
]
  
export const DISBURSEMENT_REQUEST_STATUS = [
  {
      value: "PASSED",
      label: {
          vi: "Chờ duyệt",
          en: "Waiting approve",
      },
      color: 'blue'
  },
  {
      value: "FAILED",
      label: {
          vi: "Thất bại",
          en: "Failed",
      },
      color: 'error'
  },
  {
      value: "APPROVED",
      label: {
          vi: "Duyệt",
          en: "Approved",
      },
      color: 'success'
  },
  {
      value: "REJECTED",
      label: {
          vi: "Từ chối",
          en: "Rejected",
      },
      color: 'error'
  },
]
  

export const SFTP_METHOD_CONNECT = [
  {
    value: "ACCOUNT",
    label: {
        vi: "Username/Password",
        en: "Username/Password",
    },
    color: 'error'
  },
  {
    value: "KEYPAIR",
    label: {
        vi: "Private key",
        en: "Private key",
    },
    color: 'error'
},
]




export const SFTP_STATUS = [
  {
    value: 'SUCCESS',
    label: {vi: "Thành công", en: "success"},
    color: 'success'
  },
  {
    value: 'FAILED',
    label: { vi: "Thất bại", en: "Failed"},
    color: 'error'
  },
]