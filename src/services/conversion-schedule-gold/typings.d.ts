declare namespace API {
  type TrustInvestmentItem = {
    _id?: string;
    transactionId?: string;
    neopayId?: string;
    investors?: string;
    method?: string;
    createdAt?: string;
    updatedAt?: string;
    amount?: number;
    transactionMethod?: string;
    status?: string;
  };

  type TrustInvestmentList = {
    data?: TrustInvestmentItem[];
    total?: number;
    success?: boolean;
  };

}
