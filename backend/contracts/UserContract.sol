pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./ServiceHandler.sol";

contract UserContract is ServiceHandler {

    struct RecordInternal {
        uint8[] services;
        uint8[][] subservices;
        string comment;
    }

    //------------------------------------------------------------_Records_---------------------------------------------

    mapping(bytes32 => RecordInternal[]) private userRecords;

    function insertRecord(bytes32 dealerId, bytes32 id, uint8[] memory services, uint8[][] memory subservices, string memory comment) public verified(dealerId){
        require(subservices.length <= services.length,"Number of subservices does not match service length");
        userRecords[id].push(RecordInternal(services,subservices,comment));
    }

    function getRecords(bytes32 dealerId, bytes32 id) public view verified(dealerId) returns (RecordInternal[] memory){
        return userRecords[id];
    }

}
