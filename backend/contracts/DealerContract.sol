pragma solidity ^0.5.11;
import "./Ownable.sol";

contract DealerContract is Ownable {

    struct DealerInfo{
        string addr;
        string dealerName;
        string tel;
        string bestProd;
        string promotion;
        string services;
        
    }
    mapping(bytes32 => DealerInfo) public dealerInfoMap;
    bytes32[] public dealerList; // For enumerate key to mapping above.
    
    bytes32[] public dealerApplicationsId;
    

    mapping(bytes32 => bool) verifiedDealers;
    mapping(bytes32 => bytes32[]) private _dealerToEmployees;
    mapping(bytes32 => bytes32) private _employeeToDealer;


    modifier verified(bytes32 dealerId) {
        require(isVerified(dealerId),"You must be a verified dealer to do this");
        _;
    }

    modifier dealershipOwner(bytes32 dealerId){
        require(verifiedDealers[dealerId],"You must be a dealership owner to do this");
        _;
    }

    
    

    //Function for dealer to create new application
    function createDealerApplication( string memory _addr,
        string memory _dealerName,
        string memory _tel,
        string memory _bestProd,
        string memory _promotion,
        string memory _services, bytes32 _id) public{
        require(!verifiedDealers[_id],"That address is already registered");
        dealerInfoMap[_id] = DealerInfo(_addr, _dealerName, _tel, _bestProd, _promotion, _services);
        if (getApplicationIndex(_id) == -1) {
        dealerApplicationsId.push(_id);
            
        }
    }

   

    function getDealerInfo(bytes32 id) public view returns(
    string memory addr,
    string memory dealerName,
        string memory tel,
        string memory bestProd,
        string memory promotion,
        string memory services){
        DealerInfo memory information = dealerInfoMap[id];
        addr = information.addr;
        dealerName = information.dealerName;
        tel = information.tel;
        bestProd = information.bestProd;
        promotion = information.promotion;
        services = information.services;
    }

    //Transfer dealership owner to another id
    function transferDealershipOwner(bytes32 dealershipId, bytes32 otherId) public dealershipOwner(dealershipId){
        verifiedDealers[otherId] = true;
        verifiedDealers[dealershipId] = false;
        _employeeToDealer[otherId] = 0;
        _dealerToEmployees[otherId] = _dealerToEmployees[dealershipId];
        delete _dealerToEmployees[dealershipId];
        for(uint i = 0; i < _dealerToEmployees[otherId].length; i++){
            _employeeToDealer[_dealerToEmployees[otherId][i]] = otherId;
        }
    }

    function getApplicationIndex(bytes32 id) internal view returns (int) {
        for(uint i = 0; i < dealerApplicationsId.length; i++){
            if(dealerApplicationsId[i] == id){
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
        delete dealerApplicationsId[uint(i)];
    }

    //Function to see if a dealer is verified or works for a dealership
    function isVerified(bytes32 adr) public view returns (bool) {
        return verifiedDealers[adr] || _employeeToDealer[adr] != 0;
    }

    //Add employee to dealership who will have access to verified() functions
    function addDealerEmployee(bytes32 dealerId, bytes32 adr) public dealershipOwner(dealerId) {
        require(_employeeToDealer[adr] != 0,"That employee already works there");
        _dealerToEmployees[dealerId].push(adr);
        _employeeToDealer[adr] = dealerId;
    }

}
