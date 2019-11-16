pragma solidity ^0.5.11;

contract Ownable {
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    modifier ownerOnly{
        require(msg.sender == owner,"You are not the owner");
        _;
    }

    function getHash(string memory id) public pure returns (bytes32){
        return sha256(abi.encodePacked(id));
    }

    function transferOwner(address newOwner) external ownerOnly{
        owner = newOwner;
    }

}
