import { Request, Response } from 'express';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';
import News from '../models/news.model';
import User from '../models/user.model';
import { NewsService } from '../service';
import { getListWithPaginationAssociations } from '../utils';

const NewsController = {
  GetListNews: async (req: Request, res: Response): Promise<Response> => {
    const Parameters = {
      model: News,
      subModel: User,
      attributes: ['id', 'fullName', 'email'],
      as: 'user',
      exclude: ['accountId'],
      searchFields: ['title', 'content'],
    };
    return getListWithPaginationAssociations(req, res, Parameters);
  },

  CreateNews: async (req: Request, res: Response): Promise<Response> => {
    try {
      const newNews = await NewsService.createNews(req.body, req);
      return res
        .status(HttpStatusCode.Created)
        .send(Helper.ResponseData(HttpStatusCode.Created, SYSTEM_NOTIFICATION?.SUCCESS, newNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  GetDetailNews: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await NewsService.getDetailNews(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  UpdateNews: async (req: Request, res: Response): Promise<Response> => {
    try {
      const updateNews = await NewsService.updateNews(req.body, req);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION?.SUCCESS, updateNews));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },

  DeleteNews: async (req: Request, res: Response): Promise<Response> => {
    try {
      const data = await NewsService.deleteNews(req, res as never);
      return res
        .status(HttpStatusCode.Ok)
        .send(Helper.ResponseData(HttpStatusCode.Ok, SYSTEM_NOTIFICATION.SUCCESS, data));
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default NewsController;
