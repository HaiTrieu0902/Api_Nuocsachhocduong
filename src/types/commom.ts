export interface IUserToken {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | number;
  role: string;
}

export interface IUser {
  id?: string;
  userName: string;
  email: string;
  phoneNumber: string;
  password: string;
  isVerify?: boolean;
  roleId?: string;
}

export type Parameters = {
  model: any;
  subModel: any;
  attributes: string[];
  as: string;
  exclude: string[];
};
