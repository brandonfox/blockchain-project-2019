import * as functions from 'firebase-functions';
import * as line from '@line/bot-sdk';
const cors = require('cors');

const coreHandler = cors({ origin: true });
// import * as request from "request-promise-native";

const DealerClient = new line.Client({
  channelAccessToken:
    'zCyEDn4jZWQ5n7CPdK8lIy0leAQoE5QF3/uY53ND6hQP4C45g9royk/A8r7/p4PhJ9CKEjVgICZ0m7yH8RbX0is5UfMeogWS/Gxhfn3Q7U9Ry9/z8IWeEHjvHmeoSJjXEC/AmfcLUFYpaF0Ecdn5QgdB04t89/1O/w1cDnyilFU='
});

export const messageToDealer = functions
  .region('asia-east2')
  .https.onRequest(async (request, response) => {
    coreHandler(request, response, async () => {
      const _userId = request.body.userId;
      const message = request.body.message;

      const messageLine: line.TextMessage = {
        type: 'text',
        text: message
      };
      DealerClient.pushMessage(_userId, messageLine)
        .then(response_ => response.send('send message'))
        .catch(err => response.send('err'));
    });
  });

export const notifyDealerAppointment = async (
  dealerId: string,
  appointment: any,
  ThaiTime: any
) => {
  // const { carPlate } = appointment;

  const message: line.TextMessage = {
    type: 'text',
    text: 'คุณมีการนัดหมายใหม่'
  };
  return DealerClient.pushMessage(dealerId, message);
};
