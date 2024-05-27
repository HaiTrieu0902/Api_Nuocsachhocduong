import bcrypt from 'bcrypt';
import { Request } from 'express';
import Helper from '../helper/Helper';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/commom';
import User from '../models/user.model';

export const AuthService = {
  //   registerUser: async (userData: IUser, req: Request) => {
  //     try {
  //       const { userName, email, phoneNumber, password } = userData;
  //       const hashedPassword = await Helper.PasswordHasing(password);
  //       const newUser = await User.create(
  //         {
  //           userName,
  //           email,
  //           phoneNumber,
  //           password: hashedPassword,
  //           isVerify: false,
  //           roleId: '410d947d-8dd0-45d3-bd22-313054f50183',
  //         },
  //         { raw: true },
  //       );
  //       const tokenEmail = Helper.GenerateToken({ email });
  //       tranporter.sendMail(
  //         mailerOptions(tokenEmail, newUser?.email, newUser?.userName, req?.headers.host),
  //         function (err, info) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             console.log('Verify email sent successfully');
  //           }
  //         },
  //       );
  //       const { password: omitPassword, ...userWithoutPassword } = newUser.toJSON();
  //       return userWithoutPassword;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   loginUser: async (email: string, password: string) => {
  //     try {
  //       const user = await User.findOne({
  //         where: {
  //           email: email,
  //         },
  //         include: [{ model: Role, as: 'role', attributes: ['role'] }],
  //         attributes: { exclude: ['roleId'] },
  //       });
  //       if (!user) {
  //         const error = new Error();
  //         (error as any).statusCode = 404;
  //         (error as any).message = 'Email not found';
  //         throw error;
  //       }
  //       const isPasswordMatch = await bcrypt.compare(password, user.password);
  //       if (!isPasswordMatch) {
  //         throw new Error('Incorrect password, try again');
  //       }
  //       const token = Helper.GenerateToken({
  //         id: user.id,
  //         userName: user.userName,
  //         email: user.email,
  //         phoneNumber: user.phoneNumber,
  //       });
  //       const userDataWithoutPassword = { ...user?.dataValues };
  //       delete userDataWithoutPassword.password;
  //       return { ...userDataWithoutPassword, token: token };
  //     } catch (error: any) {
  //       throw error;
  //     }
  //   },
  //   forgotPassWordUser: async (params: { email: string; password: string; confirmPassword: string }) => {
  //     try {
  //       /* check verify email in here may be later update  */
  //       const user = await User.findOne({
  //         where: {
  //           email: params?.email,
  //         },
  //       });
  //       if (!user) {
  //         throw new Error('Email not found');
  //       }
  //       if (params?.password === params?.confirmPassword) {
  //         const hashed = await Helper?.PasswordHasing(params?.password);
  //         user.password = hashed;
  //         user.save();
  //         const userDataWithoutPassword = { ...user?.dataValues };
  //         delete userDataWithoutPassword.password;
  //         return userDataWithoutPassword;
  //       } else {
  //         throw new Error('New Password and Confirm Password not match');
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   changePasswordUser: async (params: {
  //     email: string;
  //     currentPassword: string;
  //     newPassword: string;
  //     confirmPassword: string;
  //   }) => {
  //     try {
  //       const user = await User.findOne({
  //         where: {
  //           email: params?.email,
  //         },
  //       });
  //       if (!user) {
  //         throw new Error('Email not exits');
  //       }
  //       const match = await bcrypt.compare(params?.currentPassword, user.password);
  //       if (!match) {
  //         throw new Error('Your current password is incorrect');
  //       }
  //       if (params?.newPassword === params?.confirmPassword) {
  //         const hashed = await Helper?.PasswordHasing(params?.newPassword);
  //         user.password = hashed;
  //         user.save();
  //         const userDataWithoutPassword = { ...user?.dataValues };
  //         delete userDataWithoutPassword.password;
  //         return userDataWithoutPassword;
  //       } else {
  //         throw new Error('New Password and Confirm Password not match');
  //       }
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
  //   verifyEmailUser: async (token: string) => {
  //     try {
  //       const secretKey: string = process.env.JWT_TOKEN as string;
  //       let response: any;
  //       await jwt.verify(token as string, secretKey, (err, decoded) => {
  //         if (err) {
  //           response = null;
  //         } else {
  //           response = decoded;
  //         }
  //       });
  //       const user = await User.findOne({
  //         where: {
  //           email: String(response?.email),
  //         },
  //       });
  //       if (!user) {
  //         throw new Error('Email not Exist');
  //       }
  //       return user;
  //     } catch (error) {
  //       throw error;
  //     }
  //   },
};

export default AuthService;
