import * as functions from 'firebase-functions';
import * as Web3Utils from '../../web3/index';
import * as User from '../users/index'
import { db } from '../../firebase-config';



async function asyncForEach(array: any, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}


async function notifyThisUser(userId: any) {
  const result =  await db.collection('UsersHashToIds').doc(userId).get();
  if (result.exists){
    const data = result.data();
    if (data !== undefined) {
      const userIdd: any = data.user_id;
      return User.UserClient.pushMessage(userIdd, {type: 'text', text: 'รถของท้านถึงเวลาเข้าศูนย์แล้วครับ'})
    } 
  }
    return null 
}

export const notify = functions
.region('asia-east2')
.pubsub.schedule('0 10 * * *')
  .timeZone('Asia/Bangkok')
  .onRun(async context => {
    const instance = await Web3Utils.initWeb3();
    const accounts = await Web3Utils.web3.eth.getAccounts();
    const BN = Web3Utils.web3.utils.BN;
    const listOfServices = await instance.getServices();
    const allUsers = await instance.getAllUsers({ from: accounts[0] });
    if (allUsers.length === 0) {
      console.log('no active user found');
      return null
    } else {
      return asyncForEach(allUsers, async (userId: any) => {
        const getArray = await instance.getLastServiceTimes(userId);
        return asyncForEach(getArray, async (time: any, index: any) => {
          const convertedNumber = new BN(time);
          if (!convertedNumber.isZero()) {
            
            const serviceName = listOfServices[index];
            const timeSetByOranoss = new BN(await instance.notificationTimes(serviceName));
            const rightNow = new BN(new Date().getTime());    
            const shouldNotify = (rightNow.sub(convertedNumber)).gt(timeSetByOranoss);
            if (shouldNotify) {
               return notifyThisUser(userId);
            } 
            return null;
          
          }
          return null;
          
        })
      
      })
    }});
