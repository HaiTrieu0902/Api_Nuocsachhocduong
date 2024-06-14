import { NextFunction, Request, Response } from 'express';
import Validator from 'validatorjs';
import Helper from '../../helper/Helper';
import User from '../../models/user.model';
import { HttpStatusCode } from '../../constant';
import { MESSAGES_ERROR } from '../../constant/error';
import { Op } from 'sequelize';

const validations = {
  RegisterValidation: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email, phoneNumber, password } = req.body;
      const data = {
        fullName,
        email,
        phoneNumber,
        password,
      };

      const rules: Validator.Rules = {
        fullName: 'required|string|max:255',
        email: 'required|email',
        password: 'required|min:8',
        phoneNumber: 'required',
        // role: 'required|same:password',
      };
      const validate = new Validator(data, rules);
      if (validate.fails()) {
        return res
          .status(HttpStatusCode.BadRequest)
          .send(Helper.ResponseError(HttpStatusCode.BadRequest, 'Bad Request', validate.errors));
      }
      /* check exist email */
      const user = await User.findOne({
        where: {
          [Op.or]: [{ email: data.email }, { phoneNumber: data.phoneNumber }],
        },
      });
      if (user) {
        return res
          .status(HttpStatusCode.InternalServerError)
          .send(Helper.ResponseError(HttpStatusCode.InternalServerError, MESSAGES_ERROR.EMAIL_PHONE_EXITS, ''));
      }
      next();
    } catch (error) {
      return res
        .status(HttpStatusCode.InternalServerError)
        .send(Helper.ResponseError(HttpStatusCode.InternalServerError, '', error));
    }
  },
};

export default validations;
