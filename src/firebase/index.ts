import firebase from 'firebase-admin';
import { keyAccount } from './serviceKeys';

firebase.initializeApp({
  credential: firebase.credential.cert(keyAccount as never),
});

module.exports = { firebase };
