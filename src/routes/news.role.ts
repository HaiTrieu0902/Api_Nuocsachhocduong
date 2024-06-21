import { NewsController } from '../controllers';
import AuthMiddleware from '../middlewares/auth';

const express = require('express');
const routeNews = express.Router();

routeNews.get('/get-list-news', AuthMiddleware.Authentication, NewsController.GetListNews);

routeNews.get('/get-detail-news/:id', AuthMiddleware.Authentication, NewsController.GetDetailNews);
routeNews.post('/create-news', AuthMiddleware.Authentication, AuthMiddleware.RoleAdmin, NewsController.CreateNews);
routeNews.put('/update-news', AuthMiddleware.Authentication, AuthMiddleware.RoleAdmin, NewsController.UpdateNews);
routeNews.delete(
  '/delete-news/:id',
  AuthMiddleware.Authentication,
  AuthMiddleware.RoleAdmin,
  NewsController.DeleteNews,
);

export default routeNews;
