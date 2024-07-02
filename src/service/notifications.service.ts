import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { HttpStatusCode, SYSTEM_NOTIFICATION } from '../constant';
import Helper from '../helper/Helper';
import { Response } from 'express';

initializeApp({
  credential: applicationDefault(),
  projectId: 'nuocsachhocduong-977b6',
});
process.env.GOOGLE_APPLICATION_CREDENTIALS;

export interface IDataDevices {
  token: string;
  title: string | any;
  body: string | any;
}

const NotificationService = {
  createSingleNotiDevice: async (data: IDataDevices) => {
    const message = {
      notification: {
        title: data?.title,
        body: data?.body,
      },
      token: data?.token,
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
};

export default NotificationService;
