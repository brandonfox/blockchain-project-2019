import * as DealerHook from './dealers/index';
import * as UserHook from './users/index';

export const msgToDealer = DealerHook.messageToDealer;

export const userMainHook = UserHook.userWebhook;
export const getDB = UserHook.getAllDoc;
