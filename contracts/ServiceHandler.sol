pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./DealerContract.sol";

contract ServiceHandler is DealerContract {

    function encode(string memory str) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(str));
    }

    uint8 noOfServices;
    uint8 totalNoServices = 254;

    modifier serviceExists(string memory serviceName){
        require(containsService(serviceName),"That service does not exist");
        _;
    }

    modifier serviceNotExists(string memory serviceName){
        require(!containsService(serviceName),"That service already exists");
        _;
    }

    modifier servicesNotFull{
        require(noOfServices <= totalNoServices,"There are the maximum number of services");
        _;
    }

    mapping(uint8 => string) private services;

    function getIndexOfService(string memory serviceName) internal view returns (uint8) {
        bytes32 service = encode(serviceName);
        for(uint8 i = 0; i < totalNoServices; i++){
            if(bytes(services[i]).length > 0 && encode(services[i]) == service){
                return i;
            }
        }
        return 255;
    }

    function containsService(string memory serviceName) internal view returns (bool){
        return getIndexOfService(serviceName) < totalNoServices;
    }

    function addService(string memory serviceName) public ownerOnly serviceNotExists(serviceName) servicesNotFull {
        //Returns true if service was successfully added
        //False if service already exists
        for(uint8 i = 0; i < totalNoServices; i++){
            if(bytes(services[i]).length <= 0){
                services[i] = serviceName;
                noOfServices++;
                return;
            }
        }
    }

    function editServiceName(string memory oldName, string memory newName) public ownerOnly serviceExists(oldName) {
        services[getIndexOfService(oldName)] = newName;
    }

    function deleteService(string memory serviceName) public ownerOnly serviceExists(serviceName) {
        uint8 serviceIndex = getIndexOfService(serviceName);
        services[serviceIndex] = "";
        delete subServices[serviceName];
        noOfServices--;
    }

    function getServices() public view returns (string[] memory) {
        string[] memory existingServices = new string[](noOfServices);
        uint8 serviceIndex = 0;
        for(uint8 i = 0; i < totalNoServices; i++){
            if(bytes(services[i]).length > 0){
                existingServices[serviceIndex++] = services[i];
            }
        }
        return existingServices;
    }

    //-----------------------------_Subservices_----------------------------

    mapping(string => string[]) private subServices;

    modifier subServiceExists(string memory serviceName, string memory subServiceName){
        require(containsSubService(serviceName,subServiceName),"That subservice doesnt exist in this context");
        _;
    }
    modifier subServiceNotExists(string memory serviceName, string memory subServiceName){
        require(!containsSubService(serviceName,subServiceName),"That subservice already exists");
        _;
    }

    modifier subservicesNotFull(string memory serviceName){
        require(subServices[serviceName].length < 255,"Maximum subservice amount reached");
        _;
    }

    function getIndexOfSubService(string memory serviceName, string memory subServiceName) internal view returns (uint) {
        for(uint8 i = 0; i < subServices[serviceName].length; i++){
            if(encode(subServices[serviceName][i]) == encode(subServiceName)){
                return i;
            }
        }
        return 255;
    }

    function containsSubService(string memory serviceName, string memory subServiceName) internal view returns (bool) {
        return getIndexOfSubService(serviceName,subServiceName) < 255;
    }

    function addSubService(string memory serviceName, string memory subServiceName)
     public subservicesNotFull(serviceName) subServiceNotExists(serviceName,subServiceName) ownerOnly {
        //Returns true if service does not already exist
        subServices[serviceName].push(subServiceName);
    }

    function editSubServiceName(string memory serviceName, string memory oldName, string memory newName)
     public subServiceExists(serviceName,oldName) ownerOnly {
        subServices[serviceName][getIndexOfSubService(serviceName,oldName)] = newName;
    }

    function deleteSubService(string memory serviceName, string memory subServiceName)
     public ownerOnly subServiceExists(serviceName,subServiceName) {
        uint index = getIndexOfSubService(serviceName,subServiceName);
        uint lastIndex = subServices[serviceName].length - 1;
        subServices[serviceName][index] = subServices[serviceName][lastIndex];
        delete subServices[serviceName][lastIndex];
    }

    function getSubServices(string memory serviceName) public view returns (string[] memory) {
        return subServices[serviceName];
    }
}
