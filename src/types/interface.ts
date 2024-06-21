export interface IUserToken {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | number;
  role: string;
}

export interface IUser {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string | any;
  roleId?: string;
  avatar: string;
  dob?: Date;
  schoolIds?: any[];
}

export type Parameters = {
  model: any;
  subModel: any;
  attributes: string[];
  as: string;
  exclude: string[];
  conditions?: { [key: string]: any };
  searchFields?: string[];
};

export interface IChangePassword {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface ILogin {
  email: string;
  password: string;
  deviceLogin: string;
}

export interface INews {
  id?: string;
  title?: string;
  type?: boolean;
  content?: string;
  account?: string;
}

export interface IProduct {
  id?: string;
  code?: string;
  name?: string;
  price?: number;
  discount?: number;
  content?: string;
  categoryProductId?: string;
  images?: any[];
}

export interface ISchool {
  id?: string;
  name?: string;
  email?: string;
  address?: string;
  phoneNumber?: number;
  accountId?: string;
}
