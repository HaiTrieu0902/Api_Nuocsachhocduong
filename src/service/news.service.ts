import { Request, Response } from 'express';
import Helper from '../helper/Helper';
import News from '../models/news.model';
import { INews, IUser } from '../types/commom';
import User from '../models/user.model';
import { MESSAGES_ERROR } from '../constant/error';

export const NewsService = {
  createNews: async (newsData: INews, req: Request) => {
    try {
      const news = await News.create(
        {
          ...newsData,
        },
        { raw: true },
      );
      //   news.toJSON();
      return news.toJSON();
    } catch (error) {
      throw error;
    }
  },

  getDetailNews: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = await News.findOne({
        where: { id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['fullName'],
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

  updateNews: async (newsData: INews, req: Request) => {
    try {
      const news = await News.findByPk(newsData?.id);
      if (!news) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      Object.assign(news as never, newsData);
      await news?.save();
      return news?.dataValues;
    } catch (error) {
      throw error;
    }
  },
};

export default NewsService;
