import * as functions from 'firebase-functions';
import * as Web3Utils from '../../web3/index';
// import * as UserLine from '../users/index';

// const UserClient = UserLine.UserClient;

export const notify = functions.pubsub
  .schedule('every 1 mins')
  .timeZone('Asia/Bangkok')
  .onRun(async context => {
    const instance = await Web3Utils.initWeb3();
    const listOfServicesAndTime = await instance.getServices();
    console.log(listOfServicesAndTime);

    return null;
  });
