pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract BlockChainProject{
    
    struct Record {
        uint32 services;
        string comment;
    }
    
    address owner;
    string[] services;
    
    mapping(bytes32 => Record[]) private userRecords;
    
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
    
    mapping(bytes32 => Record[]) idRecordMap;
    mapping(address => bool) verifiedDealers;
    
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
    
    function addService(string memory serviceName) public payable ownerOnly {
        services.push(serviceName);
    }
    
    function verifyAddress(address adr) public payable ownerOnly{
        verifiedDealers[adr] = true;
    }
    
    function getServices() public view returns (string[] memory) {
        return services;
    }

}
