pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import ./ownable.sol;

contract DealerContract is Ownable {
    
    mapping(bytes32 => bool) verifiedDealers;
    mapping(bytes32 => bytes32) private dealerEmployees;


    modifier verified(bytes32 dealerId) {
        require(verifiedDealers[dealerId],You must be a verified dealer to do this);
        _;
    }

    struct DealerInfo{
        string dealerName;
    }

    mapping(bytes32 => DealerInfo) private dealerInfoMap;
    bytes32[] dealerApplications;
    
    function dealerApplication(DealerInfo memory info, bytes32 id) public payable{
        dealerInfoMap[id] = info;
        dealerApplications.push(id);
    }
    
    function getAllDealerApplications() public view ownerOnly returns (bytes32[] memory){
        return dealerApplications;
    }

    function verifyAddress(bytes32 adr) public payable ownerOnly{
        verifiedDealers[adr] = true;
    }

    function isVerified(bytes32 adr) public view returns (bool) {
        return verifiedDealers[adr] || verifiedDealers[dealerEmployees[adr]];
    }
    
    function addDealerEmployee(bytes32 dealerId ,bytes32 adr) public payable verified(dealerId) {
        dealerEmployees[adr] = dealerId;
    }

}
