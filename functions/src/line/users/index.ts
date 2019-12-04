import * as functions from 'firebase-functions';
import * as line from '@line/bot-sdk';
import * as request from 'request-promise-native';
import { locationTemplate } from './design';
import * as GeoLocation from 'geolocation-utils';
import * as ThaiTime from './datetimeUtils';
import * as LineDealer from '../dealers/index';
import { db } from '../../firebase-config';
import * as web3Utils from '../../web3/index';

declare type ResultFirestore = {
  id: string;
  data: FirebaseFirestore.DocumentData;
};

const DB_REF = db.collection('Dealers');
const dialogflowWebhook =
  'https://bots.dialogflow.com/line/623fc13c-919c-4ae8-8404-6077291b3856/webhook';
export const UserClient = new line.Client({
  channelAccessToken:
    'hwM3ymw21vj2lhcWZhjvxWtN3XizPUctMfdh1tx8RrY5yhL5AYZMLR3dfNBa2RyFIEWmyxToyGXoOoEUwEcaNBjZZvD2eemiFYIcLCRCmRb9ERVhAWa1Olpydc4PGXstmwYBRYUSOOaroHX8VpTTVAdB04t89/1O/w1cDnyilFU='
});

// ================= Variable needed ==================================

function replyLocation(replyToken: string, payload: any) {
  const locationMessage: line.LocationMessage = {
    type: 'location',
    address: `${payload.addr}`,
    title: `${payload.dealerName}`,
    latitude: payload.location._latitude,
    longitude: payload.location._longitude
  };
  return UserClient.replyMessage(replyToken, locationMessage);
}

function processDateTime(datetime: string): number {
  const [date, time] = datetime.split('T'); // 2019-11-27T22:19 => ['2019-11-27', '22:19']
  const [year, month, day] = date.split('-');
  const [hour] = time.split(':');
  return parseInt(`${year + month + day + hour}`);
}

// This is the most important function. It handles all the actions.
async function handlePostback(
  replyToken: string,
  userId: string,
  postback: any,
  instance: any,
) {
  const { data } = postback;
  const parameter = data.split('&');
  const [, action] = parameter[0].split('='); // this will give you the action = 'make_appointment' , 'send_location

  // PARAMETER[1] DATA FROM FIRESTORE
  const payload: { id: string; data: any } = JSON.parse(parameter[1]); //
  let date_time_from_param;
  let car_plate_chosen;

  if (parameter[2]) {
    // if there is the date time
    date_time_from_param = parameter[2];
  }

  if (parameter[3]) {
    // if there is the car choosen
    car_plate_chosen = parameter[3];
  }

  const dealerId = payload.id;
  const { dealerName } = payload.data; // object of payload
  const accountPromised = web3Utils.web3.eth.getAccounts();
  const init_web3 = web3Utils.initWeb3();
  // Smart contract

  switch (action) {
    // return promise
    case 'send_phone':
      return UserClient.replyMessage(replyToken, {
        type: 'text',
        text: `${payload.data.phoneNo}`
      });

    case 'make_appointment':
      // wait_for_confirm
      const { datetime } = postback.params;
      const { day, month, time } = ThaiTime.convertToThai(datetime);
      return UserClient.replyMessage(replyToken, {
        type: 'template',
        altText: `ยืนการการนัดหมาย กับ ${dealerName} `,
        template: {
          type: 'confirm',
          actions: [
            {
              type: 'postback',
              label: 'ใช่',
              displayText: 'กรุณารอสักครู่...',
              data: `action=choose_car_plate&${parameter[1]}&${datetime}`
            },
            {
              type: 'message',
              label: 'ไม่',
              text: 'ยกเลิกนัดหมาย'
            }
          ],
          text: `ยืนยันการนัดหมาย กับ ${dealerName} วันที่ ${day} ${month} เวลา ${time}`
        }
      });
    case 'send_location':
      return replyLocation(replyToken, payload.data);

    case 'choose_car_plate':
      
      
  
      const promisedInit = await init_web3;
      const userHash = await promisedInit.getHash(userId)
      const car_plates = await promisedInit.getCarPlates(userHash);

      
      const car_owned = car_plates.length;
      if (!car_plate_chosen) {
        if (car_owned === 1) {
          car_plate_chosen = car_plates[0];
        } else if (car_owned > 0) {
          const firstThree = car_plates.slice(0, 3);
          return UserClient.replyMessage(replyToken, {
            type: 'template',
            altText: 'เลิือกรถที่ท้านต้องการเข้ารับบริการ',
            template: {
              type: 'buttons',
              actions: firstThree.map((carPlate: string) => ({
                type: 'postback',
                label: `${carPlate}`,
                displayText: 'กรุณารอสักครู่... ',
                data: `action=choose_car_plate&${parameter[1]}&${parameter[2]}&${carPlate}`
              })),
              text: `เลือกรถที่ท้านต้องการเข้ารับบริการกับ ${dealerName}`
            }
          });
        }
      }

    case 'confirm_appointment':
      const formattedTime = processDateTime(date_time_from_param);
      const sendToDealer = ThaiTime.convertToThai(date_time_from_param); // YYYYMMDDHH
      const chosenDealerHash = await promisedInit.getHash(dealerId);
      const appointmentTemplate = {
        userId: userHash,
        dealerId: chosenDealerHash,
        carPlate: `${car_plate_chosen ? car_plate_chosen : ''}`,
        time: formattedTime
      };

      const accounts = await accountPromised;
      try {
        const result = await promisedInit.createAppointment(appointmentTemplate, {
          from: accounts[0]
        });
        if (result.receipt.status) {
          // notify the dealer that they have a new coming appointment.
          return Promise.all([
            UserClient.replyMessage(replyToken, {
              type: 'text',
              text: `นัดหมายกับ ${dealerName} เรียบร้อย`
            }),
            LineDealer.notifyDealerAppointment(
              dealerId,
              appointmentTemplate,
              sendToDealer
            )
          ]);
        } else {
          return UserClient.replyMessage(replyToken, {
            type: 'text',
            text:
              'การนัดหมายไม่สำเร็จ กรุณาลองใหม่อีกครั้ง หรือติดต่อ ดีลเลอร์โดยตรง'
          });
        }
      } catch (err) {
        console.log(err);
        return UserClient.replyMessage(replyToken, {
          type: 'text',
          text: 'ดีลเลอร์ที่คุณเลือกยังไม่ได้รับการยืนยัน'
        });
        // Unverified dealer should not even be in this list.
      }

    default:
      throw new Error(`Unknown message: ${JSON.stringify(postback)}`);
  }
}

async function getClosestInTenKmLocation(center: any) {
  const location: any = [];
  const snap = await DB_REF.get();
  snap.forEach(snapshot =>
    location.push({ id: snapshot.id, data: snapshot.data() })
  );
  return location.filter((loca: any) =>
    GeoLocation.insideCircle(
      { lat: loca.data.location._latitude, lon: loca.data.location._longitude },
      center,
      10000
    )
  );
}

async function findBestTen(
  location: { latitude: string; longitude: string },
  replyToken: string
) {
  const { latitude, longitude } = location; // This gives the lat and lon
  const inRangeDealers = await getClosestInTenKmLocation({
    lat: latitude,
    lon: longitude
  });
  if (inRangeDealers.length === 0) {
    return UserClient.replyMessage(replyToken, {
      type: 'text',
      text: 'ไม่มี ดีลเลอร์อยู่ใกล้ท่าน'
    });
  }
  const cols: line.TemplateColumn[] = [];

  inRangeDealers.forEach((dealer: any) => {
    const { data } = dealer;
    const { _latitude, _longitude } = data.location;
    cols.push({
      title: data.dealerName,
      text: `${Math.ceil(
        GeoLocation.distanceTo(
          {
            lat: parseFloat(latitude),
            lon: parseFloat(longitude)
          },
          { lat: _latitude, lon: _longitude }
        ) / 1000
      )} km`,
      actions: [
        {
          type: 'datetimepicker',
          label: 'นัดหมาย',
          data: `action=make_appointment&${JSON.stringify({
            ...dealer,
            data: {
              location: dealer.data.location,
              dealerName: dealer.data.dealerName,
              phoneNo: dealer.data.phoneNo,
              addr: dealer.data.addr
            }
          })}`,
          mode: 'datetime'
        },
        {
          type: 'postback',
          label: 'สถานที่ตั้ง',
          displayText: 'กรุณารอสักครู่...',
          data: `action=send_location&${JSON.stringify({
            ...dealer,
            data: {
              location: dealer.data.location,
              addr: dealer.data.addr,
              dealerName: dealer.data.dealerName
            }
          })}`
        },
        {
          type: 'postback',
          label: 'โทร',
          displayText: 'กรุณารอสักครู่...',
          data: `action=send_phone&${JSON.stringify({
            ...dealer,
            data: {
              phoneNo: dealer.data.phoneNo
            }
          })}`
        }
      ]
    });
  });

  const templateCarousel: line.TemplateCarousel = {
    type: 'carousel',
    columns: []
  };
  const cloneTemplate = { ...locationTemplate };
  cloneTemplate.template = templateCarousel;
  cloneTemplate.template.columns = cols;

  return UserClient.replyMessage(replyToken, cloneTemplate);
}

export const getAllDoc = functions
  .region('asia-east2')
  .https.onRequest(async (req, res) => {
    try {
      // find best possible location given latitude and longtitude
      const p: Array<ResultFirestore> = [];

      const snap = await DB_REF.get();
      snap.forEach(doc => p.push({ id: doc.id, data: doc.data() }));

      res.status(200).send(JSON.stringify(p));
    } catch (err) {
      res.status(404).send(err);
    }
  });
// == Uncomment the 2 line below to make a function you think would be executed by our js file
// const cors = require("cors");
// const coreHandler = cors({ origin: true });

const replyText = (token: string, texts: any) => {
  const texts2 = Array.isArray(texts) ? texts : [texts];
  return UserClient.replyMessage(
    token,
    texts2.map((text: string) => ({ type: 'text', text }))
  );
};

const handleLocation = async (message: any, replyToken: string) => {
  return findBestTen(
    { latitude: message.latitude, longitude: message.longitude },
    replyToken
  );
};

// This is the main webhook that gets connected through line.
const handleText = (
  message: any,
  replyToken: string,
  source: any,
  req: functions.Request
) => {
  switch (message.text) {
    case 'ยกเลิกนัดหมาย':
      return UserClient.replyMessage(replyToken, {
        type: 'text',
        text: 'ยกเลิกการนัดหมายแล้วครับ'
      });
    case 'profile':
      if (source.userId) {
        return UserClient.getProfile(source.userId).then(profile =>
          replyText(replyToken, [
            `Display name: ${profile.displayName}`,
            `Status message: ${profile.statusMessage}`,
            `userId: ${source.userId}`
          ])
        );
      } else {
        return replyText(
          replyToken,
          "Bot can't use profile API without user ID"
        );
      }
    default:
      // Send to dialog flow

      return request.post({
        uri: dialogflowWebhook,
        headers: req.headers,
        body: req.body,
        json: true
      });
  }
};

const handleEvent = (event: any, req: functions.Request) => {
  if (event.replyToken && event.replyToken.match(/^(.)\1*$/)) {
    console.log('Test hook recieved: ' + JSON.stringify(event.message));
    return;
  }

  switch (event.type) {
    case 'message':
      const message = event.message;
      switch (message.type) {
        case 'text':
          req.headers.host = 'bots.dialogflow.com';
          return handleText(message, event.replyToken, event.source, req);
        case 'location':
          return handleLocation(message, event.replyToken);
        default:
          throw new Error(`Unknown message: ${JSON.stringify(message)}`);
      }
    case 'postback':
      const { userId } = event.source;
      const { postback } = event;
      const instance = web3Utils.initWeb3();
      return handlePostback(event.replyToken, userId, postback, instance);

    case 'follow':
      return replyText(
        event.replyToken,
        `สวัสดีครับ Oranoss Bot ยินดีต้อนรับครับ`
      );

    default:
      throw new Error(`Unknown event: ${JSON.stringify(event)}`);
  }
};

export const userWebhook = functions
  .region('asia-east2')
  .https.onRequest((req, res) => {
    if (req.body.destination) {
      console.log('Destination User ID: ' + req.body.destination);
    }

    // req.body.events should be an array of events
    if (!Array.isArray(req.body.events)) {
      res.status(500).end();
      return;
    }

    // handle events separately
    Promise.all(req.body.events.map((event: any) => handleEvent(event, req)))
      .then(() => res.end())
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  });
