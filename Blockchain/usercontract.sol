pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import ./servicehandler.sol;

contract UserContract is ServiceHandler {
    
    struct RecordInternal {
        uint32 services;
        uint256[] subservices;
        string comment;
    }
    struct RecordExternal {
        string[] services;
        string[][] subservices;
        string comment;
    }

    function getId(string memory id) public pure returns (bytes32){
        return sha256(abi.encodePacked(id));
    }

    //------------------------------------------------------------_Records_---------------------------------------------

    mapping(bytes32 => RecordInternal[]) private userRecords;

    function insertRecord(bytes32 dealerId, bytes32 id, RecordInternal memory record) public payable verified(dealerId){
        userRecords[id].push(record);
    }

    function getRecords(bytes32 dealerId, bytes32 id) public view verified(dealerId) returns (RecordInternal[] memory){
        return userRecords[id];
    }
    
}
