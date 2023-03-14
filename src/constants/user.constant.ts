const BUSINESS_TYPES = [
  {
    value: 'INDIVIDUAL',
    label: {
      vi: 'Cá nhân (không có giấy phép)',
      en: 'Personal (Not Licensed)'
    }
  },
  {
    value: 'CORPORATION',
    label: {
      vi: 'Doanh nghiệp (có giấy phép)',
      en: 'Enterprise (Licensed)'
    }
  }
]

const IDENTITY_TYPES = [
  {
    value: 'CMND',
    label: {
      vi: 'Chứng minh nhân dân',
      en: 'Identity card'
    }
  },
  {
    value: 'CCCD',
    label: {
      vi: 'Căn cước công dân',
      en: 'Citizen ID'
    }
  },
  // {
  //   value: 'PASSPORT',
  //   label: {
  //     vi: 'Hộ chiếu',
  //     en: 'Passport'
  //   }
  // }
]

const IDENTITY_GENDERS = [
  {
    value: 'MALE',
    label: {
      vi: 'Nam',
      en: 'Male'
    }
  },
  {
    value: 'FEMALE',
    label: {
      vi: 'Nữ',
      en: 'Female'
    }
  }
]

const MEMBER_STATUS_LIST = [
  {
    value: 'true',
    label: {
      vi: 'Kích hoạt',
      en: 'Activated',
    },
    type: ''
  },
  {
    value: 'false',
    label: {
      vi: 'Vô hiệu hóa',
      en: 'Inactivated',
    },
    color: 'error'
  }
]

const PAYMENT_PAGE_CONFIG_STATE = [
  { value: 'INITIAL', label: { vi: 'Khởi tạo', en: 'Initial' }, color: 'default' },
  { value: 'PENDING', label: { vi: 'Chờ duyệt', en: 'Pending' }, color: 'processing' },
  { value: 'APPROVED', label: { vi: 'Đã duyệt', en: 'Approved' }, color: 'success' },
  { value: 'REJECTED', label: { vi: 'Từ chối duyệt', en: 'Rejected' }, color: 'error' },
]

export {
  BUSINESS_TYPES,
  IDENTITY_TYPES,
  IDENTITY_GENDERS,
  MEMBER_STATUS_LIST,
  PAYMENT_PAGE_CONFIG_STATE
}
