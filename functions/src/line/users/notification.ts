import * as functions from 'firebase-functions';
import * as Web3Utils from '../../web3/index';

// import * as UserLine from '../users/index';

// const UserClient = UserLine.UserClient;
let instance: any;
Web3Utils.initWeb3().then(deployed => {
  instance = deployed;
});

export const notify = functions.pubsub
  .schedule('every 1 mins')
  .timeZone('Asia/Bangkok')
  .onRun(async context => {
    const listOfServicesAndTime = await instance.getServices();
    console.log(listOfServicesAndTime);

    return null;
  });
