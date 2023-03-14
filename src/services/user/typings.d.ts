declare namespace API {
  type UserItem = {
    _id?: string;
    fullName?: string;
    avatar?: string;
    dob?: string;
    phone?: string;
    phonePrefix?: string;
    gender?: string;
    address?: object[];
    note: string;
    isActive?: boolean;
    isDelete?: boolean;
    createdAt?: Date;
    createBy?: string;
    lastUpdatedAt?: Date;
    lastUpdateBy?: Date;
  };

  type UserList = {
    data?: UserItem[];
    total?: number;
    success?: boolean;
  };
}
