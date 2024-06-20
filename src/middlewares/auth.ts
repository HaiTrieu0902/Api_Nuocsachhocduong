import { NextFunction, Request, Response } from 'express';
import Helper from '../helper/Helper';
import { MESSAGES_ERROR } from '../constant/error';
import { EROLE } from '../constant/enum';

const AuthMiddleware = {
  Authentication: (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers.authorization;
      const token = authToken?.split(' ')[1];
      if (!token) {
        return res.status(401).send(Helper.ResponseError(401, MESSAGES_ERROR.UNAUTHORIZED, ''));
      }

      const result = Helper.EtractToken(token!);
      if (!result) {
        return res.status(403).json({ message: MESSAGES_ERROR.TOKEN_VALID });
      }

      res.locals.role = result?.role;
      next();
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  SuperAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = res.locals.role;
      if (roleId !== EROLE.SUPER_ADMIN) {
        return res.status(403).send(Helper.ResponseError(403, MESSAGES_ERROR.BAN, ''));
      }
      next();
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },

  RoleAdmin: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = res.locals.role;
      if (roleId === EROLE.STAFF || roleId === EROLE.PRINCIPAL) {
        return res.status(403).send(Helper.ResponseError(403, MESSAGES_ERROR.BAN, ''));
      }
      next();
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },
  RolePrincipal: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roleId = res.locals.role;
      if (roleId === EROLE.PRINCIPAL) {
        return res.status(403).send(Helper.ResponseError(403, MESSAGES_ERROR.BAN, ''));
      }
      next();
    } catch (error) {
      return res.status(500).send(Helper.ResponseError(500, '', error));
    }
  },
};

export default AuthMiddleware;
