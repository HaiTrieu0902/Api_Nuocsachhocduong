import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import OtpConfig from '../config/generateOTP';
import { mailerCheckOTP } from '../config/mail.config';
import { MESSAGES_ERROR } from '../constant/error';
import Helper from '../helper/Helper';
import Role from '../models/role.model';
import User from '../models/user.model';
import { ILogin } from '../types/interface';
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
      if (user?.isDelete) {
        throw new Error(MESSAGES_ERROR?.ACCOUNT_DEACTIVE);
      }
      const token = Helper.GenerateToken({
        id: user.id,
        userName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role?.role,
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
        throw new Error(MESSAGES_ERROR?.EMAIL_NOT_EXITS);
      }
      if (params?.password === params?.confirmPassword) {
        const hashed = await Helper?.PasswordHasing(params?.password);
        user.password = hashed;
        user.codeOTP = '';
        await user.save();
        const userDataWithoutPassword = { ...user?.dataValues };
        delete userDataWithoutPassword.password;
        return userDataWithoutPassword;
      } else {
        throw new Error(MESSAGES_ERROR?.PASS_NOT_MATCH);
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
      if (!user) {
        throw new Error(MESSAGES_ERROR?.USER_NOT_EXIST);
      }
      const otp = await OtpConfig?.generateOTPAuth(email);
      user.codeOTP = otp;
      await user.save();
      const data = await mailerCheckOTP(email, user?.fullName || '', otp);
      return data;
    } catch (error) {
      throw error;
    }
  },

  verifyOTP: async (email: string, otp: string) => {
    try {
      const user = await User.findOne({
        where: { email },
      });
      if (!user) {
        throw new Error(MESSAGES_ERROR?.USER_NOT_EXIST);
      }
      if (user?.codeOTP === otp) {
        return true;
      } else {
        return false;
      }
      // const isOTPValid = await OtpConfig?.verifyOTP(email, otp);
      // if (isOTPValid) {
      //   return true;
      // } else {
      //   return false;
      // }
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
