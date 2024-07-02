import firebase from 'firebase-admin';
import { serviceAccount } from './serviceKeys';

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount as never),
});

module.exports = { firebase };
