pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import ./Verifier.sol;

contract ServiceHandler is Verifier {
    
    function encode(string memory str) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(str));
    }

    uint8 noOfServices;

    modifier serviceExists(string memory serviceName){
        require(containsService(serviceName),That service does not exist);
        _;
    }

    modifier servicesNotFull{
        require(noOfServices < 32,There are the maximum number of services);
        _;
    }

    mapping(uint8 => string) private services;

    function getIndexOfService(string memory serviceName) internal view returns (uint8) {
        bytes32 service = encode(serviceName);
        for(uint8 i = 0; i < 32; i++){
            if(bytes(services[i]).length > 0 && encode(services[i]) == service){
                return i;
            }
        }
        return 32;
    }
    
    function containsService(string memory serviceName) internal view returns (bool){
        return getIndexOfService(serviceName) < 32;
    }

    function addService(string memory serviceName) public payable ownerOnly serviceExists(serviceName) servicesNotFull {
        //Returns true if service was successfully added
        //False if service already exists
        for(uint8 i = 0; i < 32; i++){
            if(bytes(services[i]).length <= 0){
                services[i] = serviceName;
                noOfServices++;
            }
        }
    }

    function editServiceName(string memory oldName, string memory newName) public payable ownerOnly serviceExists(oldName) {
        services[getIndexOfService(oldName)] = newName;
    }

    function deleteService(string memory serviceName) public payable ownerOnly serviceExists(serviceName) {
        services[getIndexOfService(serviceName)] = ;
        noOfServices--;
    }

    function getServices() public view returns (string[] memory) {
        string[] memory existingServices = new string[](noOfServices);
        uint8 serviceIndex = 0;
        for(uint8 i = 0; i < 32; i++){
            if(bytes(services[i]).length > 0){
                existingServices[serviceIndex++] = services[i];
            }
        }
        return existingServices;
    }

    //-----------------------------_Subservices_----------------------------

    mapping(uint8 => string[]) private subServices;

    modifier subServiceExists(uint8 serviceId, string memory serviceName){
        require(containsSubService(serviceId,serviceName),That subservice doesnt exist in this context);
        _;
    }

    modifier subservicesNotFull(uint8 serviceId){
        require(subServices[serviceId].length < 255,Maximum subservice amount reached);
        _;
    }

    function getIndexOfSubService(uint8 serviceId, string memory serviceName) internal view returns (uint) {
        for(uint8 i = 0; i < subServices[serviceId].length; i++){
            if(encode(subServices[serviceId][i]) == encode(serviceName)){
                return i;
            }
        }
        return 255;
    }

    function containsSubService(uint8 serviceId, string memory serviceName) internal view returns (bool) {
        return getIndexOfSubService(serviceId,serviceName) < 255;
    }

    function addSubService(uint8 serviceId, string memory newService) public payable subservicesNotFull(serviceId) subServiceExists(serviceId,newService) ownerOnly {
        //Returns true if service does not already exist
        subServices[serviceId].push(newService);
    }

    function editSubServiceName(uint8 serviceId, string memory oldName, string memory newName) public payable subServiceExists(serviceId,oldName) ownerOnly {
        subServices[serviceId][getIndexOfSubService(serviceId,oldName)] = newName;
    }

    function deleteSubService(uint8 serviceId, string memory serviceName) public payable ownerOnly subServiceExists(serviceId,serviceName) {
        delete subServices[serviceId][getIndexOfSubService(serviceId,serviceName)];
    }

    function getSubService(uint8 serviceId) public view returns (string[] memory) {
        return subServices[serviceId];
    }
}
