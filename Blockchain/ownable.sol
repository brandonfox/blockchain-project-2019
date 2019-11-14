pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

contract Ownable {

    constructor() public {
        owner = msg.sender;
    }

    address owner;

    modifier ownerOnly{
        require(msg.sender == owner,"You are not the owner");
        _;
    }
    
    function getHash(string memory id) public pure returns (bytes32){
        return sha256(abi.encodePacked(id));
    }

    function transferOwner(address newOwner) external payable ownerOnly{
        owner = newOwner;
    }

}
