pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./AppointmentHandler.sol";

contract NotificationHandler is AppointmentHandler {

    mapping(string => uint) public notificationTimes;
    mapping(bytes32 => uint[]) private userNotificationTime;

    function insertRecord(bytes32 dealerId, bytes32 id, string memory noPlate,
     string[] memory services, string[] memory subservices, string memory comment, uint timeStamp)
        public verified(dealerId) {
        super.insertRecord(dealerId,id,noPlate,services,subservices,comment,timeStamp);
        for(uint i = 0; i < services.length; i++){
            uint8 serviceIndex = getIndexOfService(services[i]);
            userNotificationTime[id][serviceIndex] = timeStamp;
        }
    }

    function setServiceNotificationTime(string memory serviceName, uint time) public ownerOnly {
        notificationTimes[serviceName] = time;
    }
}