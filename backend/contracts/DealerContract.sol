pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./Ownable.sol";

contract DealerContract is Ownable {

    struct DealerInfo{
        string dealerName;
        string addr;
        string location;
        string phoneNo;
        string[] availableServices;
        string[][] availableSubServices;
    }

    mapping(bytes32 => bool) verifiedDealers;
    mapping(bytes32 => bytes32[]) private dealerToEmployees;
    mapping(bytes32 => bytes32) private employeeToDealer;


    modifier verified(bytes32 dealerId) {
        require(isVerified(dealerId),"You must be a verified dealer to do this");
        _;
    }

    modifier dealershipOwner(bytes32 dealerId){
        require(verifiedDealers[dealerId],"You must be a dealership owner to do this");
        _;
    }

    mapping(bytes32 => DealerInfo) private dealerInfoMap;
    bytes32[] dealerApplications;

    //Function for dealer to create new application
    function createDealerApplication(DealerInfo memory info, bytes32 id) public{
        require(!verifiedDealers[id],"That address is already registered");
        dealerInfoMap[id] = info;
        if(getApplicationIndex(id) == -1){
            dealerApplications.push(id);
        }
    }

    function editDealerInfo(DealerInfo memory info, bytes32 id) public dealershipOwner(id){
        dealerInfoMap[id] = info;
    }

    function getDealerInfo(bytes32 id) public view returns(DealerInfo memory){
        return dealerInfoMap[id];
    }

    //Transfer dealership owner to another id
    function transferDealershipOwner(bytes32 dealershipId, bytes32 otherId) public dealershipOwner(dealershipId){
        verifiedDealers[otherId] = true;
        verifiedDealers[dealershipId] = false;
        employeeToDealer[otherId] = 0;
        dealerToEmployees[otherId] = dealerToEmployees[dealershipId];
        delete dealerToEmployees[dealershipId];
        for(uint i = 0; i < dealerToEmployees[otherId].length; i++){
            employeeToDealer[dealerToEmployees[otherId][i]] = otherId;
        }
    }

    //Get all current dealer applications
    function getAllDealerApplications() public view ownerOnly returns (bytes32[] memory){
        return dealerApplications;
    }

    function getApplicationIndex(bytes32 id) internal view returns (int) {
        for(uint i = 0; i < dealerApplications.length; i++){
            if(dealerApplications[i] == id){
                return int(i);
            }
        }
        return -1;
    }

    //Approve a dealer application. Rejected if no application exists
    function approveApplication(bytes32 adr) public ownerOnly{
        int i = getApplicationIndex(adr);
        require(i >= 0,"No application exists for that id");
        verifiedDealers[adr] = true;
        delete dealerApplications[uint(i)];
    }

    //Function to see if a dealer is verified or works for a dealership
    function isVerified(bytes32 adr) public view returns (bool) {
        return verifiedDealers[adr] || employeeToDealer[adr] != 0;
    }

    //Add employee to dealership who will have access to verified() functions
    function addDealerEmployee(bytes32 dealerId, bytes32 adr) public dealershipOwner(dealerId) {
        require(employeeToDealer[adr] != 0,"That employee already works there");
        dealerToEmployees[dealerId].push(adr);
        employeeToDealer[adr] = dealerId;
    }

}
