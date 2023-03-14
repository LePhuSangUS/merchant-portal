declare namespace API {
  type Address = {
      detail?: string,
      residence?: string[],
  }

  type MerchantStoreItem = {
    _id?: string;
    name?: string;
    merchantId?: string;
    accountNumber?: string;
    accountBalance?: string;
    ewalletPhone?: string;
    address?: Address;
    createdAt?: string;
    transactionLimit?: number;
    id?: string;
    lastUpdatedAt: string;
    isActive: boolean;
    image?: string;
  };

  type MerchantStoreUserItem = {
    _id?: string;
    name?: string;
    phone?: string;
    shift_work?: boolean;
    shift_list?: string[];
    channel?: string;
    email?: string;
    id?: string;
    createdAt?: string;
    lastUpdatedAt?: string;
    timeList?: string[];
    timeWork?: boolean;
  };

  type NewPassWordItem = {
    newPassword?: string;
    userId?: string;
  }
}
