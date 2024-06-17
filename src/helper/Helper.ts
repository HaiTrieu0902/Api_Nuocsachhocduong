import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserToken } from '../types/interface';

/* handle Response Data */
const ResponseData = (status: number, message: string, data: any) => {
  const res = {
    status,
    message,
    data: data,
  };
  return res;
};

/* handle Response Error Data */
const ResponseError = (status: number, message: string, error: any) => {
  if (error !== null && error instanceof Error) {
    const res = {
      status: status,
      message: error.message,
      errors: error,
    };
    return res;
  } else {
    const res = {
      status,
      message,
      error: error,
    };
    return res;
  }
};

/* password hassing */
const PasswordHasing = async (password: string): Promise<string> => {
  const result = await bcrypt.hash(password, 10);
  return result;
};

/*  password compare*/
const PasswordCompare = async (password: string, passwordHash: string): Promise<boolean> => {
  const matched = await bcrypt.compare(password, passwordHash);
  return matched;
};

const omitPassword = (userData: any): any => {
  const { password, ...userWithoutPassword } = userData;
  return userWithoutPassword;
};

///////////////////////////////////////////////////////////////////////////////////
/* ---------------------------------- TOKEN ----------------------------------  */
const EtractToken = (token: string): IUserToken | null => {
  const secretKey: string = process.env.JWT_TOKEN as string;
  let data: any;
  const res = jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      data = null;
    } else {
      data = decoded;
    }
  });
  if (data) {
    const result: IUserToken = <IUserToken>data;
    return result;
  }

  return null;
};

const GenerateToken = (data: any) => {
  const token = jwt.sign(data, process.env.JWT_TOKEN as string);
  return token;
};

const RefreshToken = (data: any) => {
  const token = jwt.sign(data, process.env.JWT_REFRESH_TOKEN as string);
  return token;
};

export default {
  ResponseError,
  ResponseData,
  PasswordHasing,
  PasswordCompare,
  GenerateToken,
  RefreshToken,
  EtractToken,
  omitPassword,
};
