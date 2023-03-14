declare namespace API {
  type RefundItem = {
    _id?: string;
    paymentBillId?: string,
    merchantId?: string;
    refundType?: string;
    refundAmount?: number,
    refundCurrency?: string,
    state?: string;
    note?: string;
    createdBy?: string,
    createdAt?: string;
    updatedBy?: string,
    updatedAt?: string;
  };

  type RefundList = {
    data?: RefundItem[];
    total?: number;
    success?: boolean;
  };
}


type ApproveRefundType = {
  refundReqId: string,
  isAuto: boolean,
  transId: string
}
type RejectRefundType = {
  refundReqId: string,
  reasonCode: string,
  reasonNote: string,
  transId: string
}