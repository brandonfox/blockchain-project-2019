pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract BlockChainProject{
    
    struct Record {
        uint32 services;
        string comment;
    }
    
    address owner;
    
    //---------------------------------_Services_------------------------------------
    
    uint8 noOfServices;
    
    mapping(uint8 => string) private services;
    
    function containsService(string memory serviceName) internal view returns (bool){
        bytes32 service = keccak256(abi.encodePacked(serviceName));
        for(uint8 i = 0; i < 32; i++){
            if(bytes(services[i]).length > 0 && keccak256(abi.encodePacked(services[i])) == service){
                return true;
            }
        }
        return false;
    }
    
    function addService(string memory serviceName) public payable ownerOnly returns (bool) {
        //Returns true if service was successfully added
        //False if service already exists
        if(noOfServices >= 32 || containsService(serviceName)){
            return false;
        }
        else{
            for(uint8 i = 0; i < 32; i++){
                if(bytes(services[i]).length <= 0){
                    services[i] = serviceName;
                    noOfServices++;
                    return true;
                }
            }
        }
        return false;
    }
    
    function deleteService(string memory serviceName) public payable ownerOnly returns (bool) {
        bytes32 service = keccak256(abi.encodePacked(serviceName));
        if(containsService(serviceName)){
            for(uint8 i = 0; i < 32; i++){
                if(keccak256(abi.encodePacked(services[i])) == service){
                    services[i] = "";
                    noOfServices--;
                    return true;
                }
            }
        }
        return false;
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
    
    mapping(uint32 => string[]) private subServices;
    
    function addSubService(uint8 serviceId, string memory newService) public payable ownerOnly returns (bool){
        //Returns true if service does not already exist
        bytes32 service = keccak256(abi.encodePacked(newService));
        for(uint i = 0; i < subServices[serviceId].length; i++){
            if(keccak256(abi.encodePacked(subServices[serviceId][i])) == service){
                return false;
            }
        }
        subServices[serviceId].push(newService);
        return true;
    }
    
    function getSubService(uint8 serviceId) public view returns (string[] memory) {
        return subServices[serviceId];
    }
    
    //---------------------------------------------------------_End-Services_---------------------------------------------------
    
    mapping(bytes32 => Record[]) private userRecords;
    mapping(address => bool) private verifiedDealers;
    
    constructor() public {
        owner = msg.sender;
    }
        
    modifier ownerOnly{
        require(msg.sender == owner);
        _;
    }
    modifier verified {
        require(verifiedDealers[msg.sender]);
        _;
    }
    
    function getId(string memory id) public pure returns (bytes32){
        return sha256(abi.encodePacked(id));
    }
    
    function insertRecord(bytes32 id, uint32 servicesDone, string memory comment) public payable verified{
        userRecords[id].push(Record(servicesDone,comment));
    }
    
    function getRecords(bytes32 id) public view verified returns (Record[] memory){
        return userRecords[id];
    }
    
    function transferOwner(address newOwner) external payable ownerOnly{
        owner = newOwner;
    }

    function verifyAddress(address adr) public payable ownerOnly{
        verifiedDealers[adr] = true;
    }
    

}
