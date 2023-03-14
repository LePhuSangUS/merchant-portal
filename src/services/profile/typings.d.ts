declare namespace API {
  type RulesLimitItem = {
    _id?: string;
    name?: string;
    desc?: string;
  };

  type MerchantProfile = {
    _id?: string;
    name?: string;
    merchantType?: string;
    address?: any;
    addressDetails?: {
      city?: string;
      countryCode?: string;
    };
    paymentGateway?: API.PaymentConfig | any;
    rulesLimit?: RulesLimitItem[] | any;
  };
}
