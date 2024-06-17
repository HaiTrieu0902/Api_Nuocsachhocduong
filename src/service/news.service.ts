import { Request, Response } from 'express';
import { MESSAGES_ERROR } from '../constant/error';
import News from '../models/news.model';
import User from '../models/user.model';
import { INews } from '../types/interface';

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

  deleteNews: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const news = await News.findByPk(id);
      if (!news) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      const res = await news?.destroy();
      return res;
    } catch (error) {
      throw error;
    }
  },
};

export default NewsService;
