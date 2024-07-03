import axios from 'axios';
import admin from 'firebase-admin';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { JWT } from 'google-auth-library';
import { serviceAccount } from '../firebase/serviceKeys';
import Notification from '../models/notification.model';
import { Request, Response } from 'express';
import { MESSAGES_ERROR } from '../constant/error';
import { INotificationMessage } from '../types/interface';

const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});
const clientUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

initializeApp({
  // credential: applicationDefault(),
  credential: admin.credential.cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string),
  projectId: 'nuocsachhocduong-977b6',
});

export interface INotification {
  id?: string;
  accountId: string;
  receiverId: string;
  data?: any;
  type?: string;
  isRead?: boolean;
}

const getAccessToken = async (): Promise<string> => {
  return new Promise(function (resolve, reject) {
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens?.access_token as never);
    });
  });
};

const cloneObj = (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

const NotificationService = {
  createSingleNotiDevice: async (data: INotificationMessage) => {
    const message = {
      notification: {
        title: data?.message?.notification?.title,
        body: data?.message?.notification?.body,
      },
      token: data?.message?.token,
      // data: data?.message?.data,
    };
    await getMessaging()
      .send(message)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });

    return message;
  },

  sendMessageForUser: async (message: INotificationMessage) => {
    try {
      const accessToken = await getAccessToken();

      const headers = {
        Authorization: 'Bearer ' + accessToken,
      };
      const response = await axios.post(clientUrl, cloneObj(message), {
        headers,
      });

      console.log('FCM response: ', JSON.stringify(response.data));
    } catch (error: any) {
      console.log('error: ', error?.error);
    }
  },

  /********************    NOTIFICATION   **************************/
  createNotification: async (data: INotification) => {
    try {
      const notification = await Notification.create(
        {
          ...data,
        },
        { raw: true },
      );
      return notification.toJSON();
    } catch (error) {
      throw error;
    }
  },
  updateNotification: async (data: INotification) => {
    try {
      const notification = await Notification.findByPk(data?.id);
      if (!notification) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      Object.assign(notification as never, data);
      notification.save();
      return notification?.dataValues;
    } catch (error) {
      throw error;
    }
  },
  deleteNotification: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const notification = await Notification.findByPk(id);
      if (!notification) {
        throw MESSAGES_ERROR.NOT_EXITS;
      }
      await notification?.destroy();
      return notification;
    } catch (error) {
      throw error;
    }
  },
};

export default NotificationService;
