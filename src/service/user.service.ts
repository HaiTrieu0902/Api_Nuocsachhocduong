import { Request } from 'express';
import Helper from '../helper/Helper';
import User from '../models/user.model';
import { IUser } from '../types/commom';

export const UserService = {
  createUser: async (userData: IUser, req: Request) => {
    try {
      const hashedPassword = await Helper.PasswordHasing(userData?.password);
      const newUser = await User.create(
        {
          ...userData,
          password: hashedPassword,
        },
        { raw: true },
      );
      const { password: omitPassword, ...userWithoutPassword } = newUser.toJSON();
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  },

  getDetailUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await User.findOne({
        where: { id },
        attributes: { exclude: ['password'] },
      });
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
