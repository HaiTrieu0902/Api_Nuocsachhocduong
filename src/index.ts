import express, { Request, Response, json } from 'express';
import routerInit from './routes';
const cors = require('cors');
const dotenv = require('dotenv');

// import { initializeApp, applicationDefault } from 'firebase-admin/app';
// import { getMessaging } from 'firebase-admin/messaging';

const app = express();

/* Parser */
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  return res.status(200).send({ message: 'Server is running' });
});

/* Router Init */
// app.use(routerInit);
routerInit(app);

/* firebase */
// initializeApp({
//   credential: applicationDefault(),
//   projectId: 'nuocsachhocduong-977b6',
// });
// process.env.GOOGLE_APPLICATION_CREDENTIALS;

// app.post('/sendNoti', function (req: Request, res: Response) {
//   const receivedToken = req.body.token;
//   const message = {
//     notification: {
//       title: 'Testing nah',
//       body: 'cek',
//     },
//     token: receivedToken,
//   };
//   getMessaging()
//     .send(message)
//     .then((response) => {
//       res.status(200).json({
//         message: 'Success',
//         token: receivedToken,
//       });
//     })
//     .catch((error) => {
//       res.status(500).json({
//         message: error,
//       });
//     });
// });

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});
