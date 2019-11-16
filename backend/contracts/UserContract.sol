pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./ServiceHandler.sol";

contract UserContract is ServiceHandler {

    struct RecordInternal {
        string[] services;
        string[][] subservices;
        string comment;
    }
    struct UserInfo {
        bytes32 id;
        string firstName;
        string lastName;
        string adr;
        string phNo;
        string email;
    }
    struct CarInfo{
        uint8 id;
        string brand;
        string model;
    }

    //------------------------------------------------------------_Records_---------------------------------------------

    mapping(bytes32 => RecordInternal[]) private userRecords;
    mapping(bytes32 => UserInfo) private userInfoRecords;
    mapping(bytes32 => CarInfo[]) private userCars;
    
    //TODO Verify users somehow
    modifier userExists(bytes32 userId){
        require(userInfoRecords[userId].id == userId);
        _;
    }
    
    function editUserInfo(bytes32 userId, UserInfo memory info) public userExists(userId) {
        userInfoRecords[userId] = info;
    }
    
    function getUserInfo(bytes32 userId) public view returns(UserInfo memory) {
        return userInfoRecords[userId];
    }
    
    function getCars(bytes32 userId) public view returns(CarInfo[] memory){
        return userCars[userId];
    }

    function insertRecord(bytes32 dealerId, bytes32 id, string[] memory services, string[][] memory subservices, string memory comment) public verified(dealerId){
        require(subservices.length <= services.length,"Number of subservices does not match service length");
        userRecords[id].push(RecordInternal(services,subservices,comment));
    }

    function getRecords(bytes32 dealerId, bytes32 id) public view verified(dealerId) returns (RecordInternal[] memory){
        return userRecords[id];
    }

}
