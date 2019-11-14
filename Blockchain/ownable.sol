pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract Ownable {

    constructor() public {
        owner = msg.sender;
    }
    
    address owner;
    
    modifier ownerOnly{
        require(msg.sender == owner,You are not the owner);
        _;
    }
    
    function transferOwner(address newOwner) external payable ownerOnly{
        owner = newOwner;
    }
    
}
