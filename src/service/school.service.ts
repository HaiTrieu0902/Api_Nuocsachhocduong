import { Request, Response } from 'express';
import { MESSAGES_ERROR } from '../constant/error';
import News from '../models/news.model';
import User from '../models/user.model';
import { INews, ISchool } from '../types/interface';
import School from '../models/school.model';

export const SchoolService = {
  createSchool: async (schoolData: ISchool, req: Request) => {
    try {
      const school = await School.create(
        {
          ...schoolData,
        },
        { raw: true },
      );
      //   school.toJSON();
      return school.toJSON();
    } catch (error) {
      throw error;
    }
  },

  getDetailSchool: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await School.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'fullName'],
          },
        ],
      });
      if (!data) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      return data;
    } catch (error) {
      throw error;
    }
  },

  updateSchool: async (data: ISchool, req: Request) => {
    try {
      const school = await School.findByPk(data?.id);
      if (!school) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      Object.assign(school as never, data);
      await school?.save();
      return school?.dataValues;
    } catch (error) {
      throw error;
    }
  },

  deleteSchool: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const school = await School.findByPk(id);
      if (!school) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      school.isDelete = true;
      await school?.save();
      return school;
    } catch (error) {
      throw error;
    }
  },
};

export default SchoolService;
