import * as Line from './line/index';
import * as Notify from './line/users/notification';

// Real names of functions decleared here

// ===================DEALER =======================//
export const d_sendMsg = Line.msgToDealer;
export const u_webhook = Line.userMainHook;
export const u_getDb = Line.getDB;
export const notification = Notify.notify;
// export const notify = Notify.notify;
