declare namespace API {
  type PaymentConfig = {
    _id?: string;
    state?: string,
    displayName?: string;
    logo?: string;
    hashKey?: string;
    ipnUrl?: string;
    regChannels?: any;
  };
}
