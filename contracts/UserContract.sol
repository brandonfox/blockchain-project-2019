pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./ServiceHandler.sol";

contract UserContract is ServiceHandler {

    struct RecordInternal {
        bytes32 dealerId;
        string[] services;
        string[] subservices;
        string comment;
        uint timeStamp;
    }
    struct UserInfo {
        string firstName;
        string lastName;
        string adr;
        string phNo;
        string email;
    }
    struct CarInfo{
        string brand;
        string model;
        string year;
    }

    //------------------------------------------------------------_Records_---------------------------------------------

    mapping(string => RecordInternal[]) private records;
    mapping(bytes32 => UserInfo) private userInfoRecords;
    mapping(bytes32 => string[]) private userCars;
    mapping(string => CarInfo) private carDetails;

    bytes32[] activeUsers;

    function getAllUsers() public view ownerOnly returns(bytes32[] memory){
        return activeUsers;
    }

    function getIndexOfUser(bytes32 user) internal view returns(uint){
        for(uint i = 0; i < activeUsers.length; i++){
            if(activeUsers[i] == user){
                return i;
            }
        }
        return uint(-1);
    }

    modifier carExists(string memory noPlate) {
        require(bytes(carDetails[noPlate].brand).length > 0,"That car does not exist in the chain");
        _;
    }

    function editUserInfo(bytes32 userId, UserInfo memory info) public {
        userInfoRecords[userId] = info;
    }

    function getUserInfo(bytes32 userId) public view returns(UserInfo memory) {
        return userInfoRecords[userId];
    }

    function editCarDetails(bytes32 userId, string memory noPlate, CarInfo memory carInfo) public{
        carDetails[noPlate] = carInfo;
        int index = getCarIndex(userId,noPlate);
        if(index < 0){
            userCars[userId].push(noPlate);
        }
        else{
            userCars[userId][uint(index)] = noPlate;
        }
    }

    function getCarIndex(bytes32 userId, string memory noPlate) internal view returns (int){
        for(uint128 i = 0; i < userCars[userId].length; i++) {
            if(encode(userCars[userId][i]) == encode(noPlate)) return i;
        }
        return -1;
    }

    function getCarPlates(bytes32 userId) public view returns (string[] memory) {
        return userCars[userId];
    }

    function getCars(bytes32 userId) public view returns(CarInfo[] memory){
        CarInfo[] memory cars = new CarInfo[](userCars[userId].length);
        for(uint i = 0; i < userCars[userId].length;i++) {
            cars[i] = carDetails[userCars[userId][i]];
        }
        return cars;
    }

    function getCarDetails(string memory noPlate) public view returns(CarInfo memory) {
        return carDetails[noPlate];
    }

    function insertRecord(bytes32 dealerId, bytes32 id, string memory noPlate,
     string[] memory services, string[] memory subservices, string memory comment, uint timeStamp)
        public verified(dealerId) {
        require(subservices.length <= services.length,"Number of subservices does not match service length");
        if(getCarIndex(id,noPlate) < 0){
            userCars[id].push(noPlate);
        }
        records[noPlate].push(RecordInternal(dealerId,services,subservices,comment,timeStamp));
        if(getIndexOfUser(id) == uint(-1)){
            activeUsers.push(id);
        }
    }

    function getRecords(string memory noPlate) public view returns (RecordInternal[] memory) {
        return records[noPlate];
    }

}
