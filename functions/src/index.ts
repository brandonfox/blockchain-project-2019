import * as Line from './line/index';
import * as functions from 'firebase-functions';

// Real names of functions decleared here

// ===================DEALER =======================//
export const d_confirm = Line.confirmationHook;
export const u_webhook = Line.userMainHook;
export const u_getDb = Line.getDB;

export const s = functions
  .region('asia-east2')
  .https.onCall((data, context) => {
    console.log('data', data);
    console.log('context', context);
    return 'love';
  });
