import axios from 'axios';
import { applicationDefault, initializeApp } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';
import { JWT } from 'google-auth-library';
import { serviceAccount } from '../firebase/serviceKeys';
const jwtClient = new JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
});
const clientUrl = `https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`;

initializeApp({
  credential: applicationDefault(),
  projectId: 'nuocsachhocduong-977b6',
});
process.env.GOOGLE_APPLICATION_CREDENTIALS;

export interface INotificationMessage {
  message: {
    token: string;
    notification: {
      title: string;
      body: string;
      image?: string;
    };
    data: any;
  };
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
      data: data?.message?.data,
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
    } catch (error) {
      console.log('error: ', error);
    }
  },

  /********************    NOTIFICATION   **************************/
};

export default NotificationService;
