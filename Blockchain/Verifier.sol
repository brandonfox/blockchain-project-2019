pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract Verifier {

    constructor() public {
        owner = msg.sender;
    }
    
    address owner;
    
    mapping(bytes32 => bool) verifiedDealers;

    modifier ownerOnly{
        require(msg.sender == owner,You are not the owner);
        _;
    }

    modifier verified(bytes32 dealerId) {
        require(verifiedDealers[dealerId],You must be a verified dealer to do this);
        _;
    }
    
    function transferOwner(address newOwner) external payable ownerOnly{
        owner = newOwner;
    }

    function verifyAddress(bytes32 adr) public payable ownerOnly{
        verifiedDealers[adr] = true;
    }

    function isVerified(bytes32 adr) public view returns (bool) {
        return verifiedDealers[adr];
    }
}
