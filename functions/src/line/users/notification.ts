import * as functions from 'firebase-functions';
import * as Web3Utils from '../../web3/index';

// import * as UserLine from '../users/index';

// const UserClient = UserLine.UserClient;
let instance: any;
let ownerAccount: any;
Web3Utils.initWeb3()
  .then(deployed => {
    instance = deployed;
    console.log('done initialied contract');
    return Web3Utils.web3.eth.getAccounts();
  })
  .then(_accounts => {
    console.log('dont intilised accounted');
    ownerAccount = _accounts[0];
  })
  .catch(console.error);

export const notify = functions.pubsub
  .schedule('every 1 mins')
  .timeZone('Asia/Bangkok')
  .onRun(async context => {
    const listOfServices = await instance.getServices();

    const allUsers = await instance.getAllUsers({ from: ownerAccount });
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
