import * as Line from './line/index';
import * as Notify from './line/users/notification';

// Real names of functions decleared here

// ===================DEALER =======================//
export const d_confirm = Line.confirmationHook;
export const u_webhook = Line.userMainHook;
export const u_getDb = Line.getDB;
export const notify = Notify.notify;
