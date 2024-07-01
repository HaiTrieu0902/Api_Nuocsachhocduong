import bcrypt from 'bcrypt';
import { Request } from 'express';
import { MESSAGES_ERROR } from '../constant/error';
import Helper from '../helper/Helper';
import Role from '../models/role.model';
import User from '../models/user.model';
import { IChangePassword, IUser } from '../types/interface';
import School from '../models/school.model';
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
        include: [
          {
            model: Role,
            as: 'role',
            attributes: ['role'],
          },
        ],
      });
      if (!data) {
        throw MESSAGES_ERROR.USER_NOT_EXIST;
      }
      const listSchool = await School.findAndCountAll();
      const userData = data.toJSON();
      const schools = userData?.schoolIds
        ?.map((schoolId: string) => {
          const school = listSchool.rows.find((s: any) => s.id === schoolId);
          return school
            ? {
                id: school.id,
                name: school.name,
                address: school.address,
                phoneNumber: school?.phoneNumber,
                email: school?.email,
              }
            : null;
        })
        .filter((school: any) => school !== null);

      return { ...userData, schools };
    } catch (error) {
      throw error;
    }
  },

  getDetailUserBySchool: async (req: Request, res: Response) => {
    try {
      const { schoolId } = req.params;
      const data = await User.findAndCountAll({
        where: { roleId: '1aaa4422-d200-4fd8-b259-78875e823d06' },
        order: [['createdAt', 'DESC']],
      });

      if (!data) {
        throw new Error(MESSAGES_ERROR.USER_NOT_EXIST);
      }

      const listSchool = await School.findAndCountAll();
      const userData = data.rows.map((user) => user.toJSON());
      const usersWithSchools = userData.map((user) => {
        const userSchools = user.schoolIds
          ?.map((schoolId: string) => {
            const school = listSchool.rows.find((s: any) => s.id === schoolId);
            return school ? { id: school.id, name: school.name } : null;
          })
          .filter((school: any) => school !== null);
        return {
          ...user,
          schools: userSchools,
        };
      });
      const filteredUsers = schoolId
        ? usersWithSchools.filter((user) => user?.schoolIds?.includes(schoolId))
        : usersWithSchools;
      return filteredUsers;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userData: IUser, req: Request) => {
    try {
      const user = await User.findByPk(userData?.id);
      if (!user) {
        throw MESSAGES_ERROR.USER_NOT_EXIST;
      }
      Object.assign(user as never, userData);
      await user?.save();
      const { password, ...rest } = user;
      return rest?.dataValues;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) {
        throw MESSAGES_ERROR.USER_NOT_EXIST;
      }
      user.isDelete = true;
      await user?.save();
      return user;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (params: IChangePassword) => {
    try {
      const user = await User.findOne({
        where: {
          email: params?.email,
        },
      });
      if (!user) {
        throw new Error(MESSAGES_ERROR.EMAIL_NOT_EXITS);
      }
      const match = await bcrypt.compare(params?.oldPassword, user.password);
      if (!match) {
        throw new Error(MESSAGES_ERROR?.PASSWORD_MATCH);
      }
      const hashed = await Helper?.PasswordHasing(params?.newPassword);
      user.password = hashed;
      user.save();
      const userDataWithoutPassword = { ...user?.dataValues };
      delete userDataWithoutPassword.password;
      return userDataWithoutPassword;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
