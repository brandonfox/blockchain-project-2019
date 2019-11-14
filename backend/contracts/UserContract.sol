pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./ServiceHandler.sol";

contract UserContract is ServiceHandler {

    struct RecordInternal {
        uint32 services;
        uint[] subservices;
        string comment;
    }
    struct RecordExternal {
        string[] services;
        string[][] subservices;
        string comment;
    }

    //------------------------------------------------------------_Records_---------------------------------------------

    mapping(bytes32 => RecordInternal[]) private userRecords;

    function insertRecord(bytes32 dealerId, bytes32 id, RecordInternal memory record) public verified(dealerId){
        userRecords[id].push(record);
    }

    function getRecords(bytes32 dealerId, bytes32 id) public view verified(dealerId) returns (RecordInternal[] memory){
        return userRecords[id];
    }

}
