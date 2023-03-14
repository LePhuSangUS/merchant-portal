declare namespace API {
  type RefundItem = {
    _id?: string;
    code?: string,
    name?: string;
    desc?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type RefundList = {
    data?: RefundItem[];
    total?: number;
    success?: boolean;
  };

  type CreateRefund = {
    paymentId: string,
    note: string,
    amount: number,
    bankCode?: string,
    bankName?: string,
    accountNumber?: string,
    accountName?: string,
  }
}
