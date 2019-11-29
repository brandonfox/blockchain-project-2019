import * as functions from 'firebase-functions';
import * as Web3Utils from '../../web3/index';

// import * as UserLine from '../users/index';

// const UserClient = UserLine.UserClient;

export const notify = functions.pubsub
  .schedule('every 1 mins')
  .timeZone('Asia/Bangkok')
  .onRun(async context => {
    const instance = await Web3Utils.initWeb3();
    const accounts = await Web3Utils.web3.eth.getAccounts();
    const listOfServices = await instance.getServices();

    const allUsers = await instance.getAllUsers({ from: accounts[0] });
    if (allUsers.length === 0) {
      console.log('no active user found');
      return new Date();
    } else {
      allUsers.forEach((element: any) => {
        instance.getLastServiceTimes(element).then((list: any) => {
          list.forEach((lastServiceTime: number, serviceIndex: number) => {
            if (lastServiceTime !== 0) {
              const serviceName = listOfServices[serviceIndex];
              instance.notificationTimes(serviceName).then((time: number) => {
                const result = new Date().getTime() - (lastServiceTime + time);
                console.log(result);
              });
            }
          });
        });
      });
    }

    return new Date().getTime();
  });
