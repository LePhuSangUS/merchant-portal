declare namespace API {
  type InvoiceItem = {
    _id?: string;
    code?: string,
    name?: string;
    desc?: string;
    createdAt?: string;
    updatedAt?: string;
  };

  type InvoiceList = {
    data?: InvoiceItem[];
    total?: number;
    success?: boolean;
  };
}
