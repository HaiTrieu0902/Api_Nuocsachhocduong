import bcrypt from 'bcrypt';
import { Request } from 'express';
import Helper from '../helper/Helper';
import jwt from 'jsonwebtoken';
import { ILogin, IUser } from '../types/commom';
import User from '../models/user.model';
import Role from '../models/role.model';
import { Op } from 'sequelize';
import { MESSAGES_ERROR } from '../constant/error';
import { mailerCheckOTP, mailerOptions, tranporter } from '../config/mail.config';
import OtpConfig from '../config/generateOTP';
export const AuthService = {
  loginUser: async (params: ILogin) => {
    try {
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: params?.email }, { phoneNumber: params?.email }],
        },
        include: [{ model: Role, as: 'role', attributes: ['role'] }],
        attributes: { exclude: ['roleId'] },
      });

      if (!user) {
        const error = new Error();
        (error as any).statusCode = 404;
        (error as any).message = MESSAGES_ERROR.LOGIN_ERROR;
        throw error;
      }

      const isPasswordMatch = await bcrypt.compare(params.password, user.password);
      if (!isPasswordMatch) {
        throw new Error(MESSAGES_ERROR?.LOGIN_PASS);
      }
      const token = Helper.GenerateToken({
        id: user.id,
        userName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      });

      const userDataWithoutPassword = { ...user?.dataValues };
      delete userDataWithoutPassword.password;

      return { ...userDataWithoutPassword, token: token };
    } catch (error: any) {
      throw error;
    }
  },

  forgotPassWordUser: async (params: { email: string; password: string; confirmPassword: string }) => {
    try {
      const user = await User.findOne({
        where: {
          email: params?.email,
        },
      });
      if (!user) {
        throw new Error('Email not found');
      }
      if (params?.password === params?.confirmPassword) {
        const hashed = await Helper?.PasswordHasing(params?.password);
        user.password = hashed;
        user.save();
        const userDataWithoutPassword = { ...user?.dataValues };
        delete userDataWithoutPassword.password;
        return userDataWithoutPassword;
      } else {
        throw new Error('New Password and Confirm Password not match');
      }
    } catch (error) {
      throw error;
    }
  },

  sendOTPToEmail: async (email: string) => {
    try {
      const user = await User.findOne({
        where: { email },
      });
      const otp = await OtpConfig?.generateOTPAuth(email);
      const data = await mailerCheckOTP(email, user?.fullName || '', otp);
      return data;
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const isOTPValid = await OtpConfig?.verifyOTP(email, otp);
      if (isOTPValid) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
