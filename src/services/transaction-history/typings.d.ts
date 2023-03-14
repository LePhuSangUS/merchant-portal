declare namespace API {
  type TransactionItem = {
    _id?: string;
    name?: string;
    account?: number[];
    transaction_type?: string;
    code?: number[];
    shortDesc?: string;
    amount?: number[];
    state?: string;
    c_number: string;
    createTime?: string;
    expireTime?: string,
    updateTime?: string,
    merchantInfo?: object;
    currencies?: string;
    merchantTransId?: string;
    orderId?: string;
    infomation?: string;
    linkPaymentGateway?: string;
    qrdata?: string;
  };
}
