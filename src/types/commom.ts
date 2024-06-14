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
