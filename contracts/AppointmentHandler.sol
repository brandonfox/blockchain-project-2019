pragma solidity ^0.5.11;
pragma experimental ABIEncoderV2;

import "./UserContract.sol";

contract AppointmentHandler is UserContract {

    struct Appointment{
        bytes32 userId;
        bytes32 dealerId;
        string carPlate;
        int time; //Milliseconds
    }

    mapping(bytes32 => Appointment[]) private dealerAppointmentHistory;
    mapping(bytes32 => Appointment[]) private activeAppointments;
    mapping(bytes32 => Appointment) private userAppointment;

    function isSameAppointment(Appointment memory a, Appointment storage o) internal view returns (bool) {
        return a.userId == o.userId && a.dealerId == o.dealerId && encode(a.carPlate) == encode(o.carPlate) && a.time == o.time;
    }

    function getIndexOfAppointment(Appointment memory appointment) internal verified(appointment.dealerId) view returns(uint){
        for(uint i = 0; i < activeAppointments[appointment.dealerId].length; i++){
            if(isSameAppointment(appointment,activeAppointments[appointment.dealerId][i])){
                return i;
            }
        }
        return uint(-1);
    }

    function getIndexOfUserAppointment(bytes32 userId) internal view returns(uint) {
        require(userAppointment[userId].userId != 0,"User does not have an appointment");
        Appointment storage currentAp = userAppointment[userId];
        for(uint i = 0; i < activeAppointments[currentAp.dealerId].length; i++){
            if(activeAppointments[currentAp.dealerId][i].userId == userId){
                return i;
            }
        }
        return uint(-1);
    }

    function createAppointment(Appointment memory appointment) public verified(appointment.dealerId) {
        bytes32 userId = appointment.userId;
        if(userAppointment[userId].userId != 0){
            uint aIndex = getIndexOfUserAppointment(appointment.userId);
            Appointment memory currentAp = userAppointment[appointment.userId];
            delete activeAppointments[currentAp.dealerId][aIndex];
            activeAppointments[appointment.dealerId].push(appointment);
        }
        else{
            activeAppointments[appointment.dealerId].push(appointment);
        }
        userAppointment[userId] = appointment;
    }

    function completeAppointment(Appointment memory appointment) public verified(appointment.dealerId) {
        uint aIndex = getIndexOfAppointment(appointment);
        require(aIndex < uint(-1),"That appointment does not exist");
        //TODO Change time to completed time (Need date time library or smth)
        dealerAppointmentHistory[appointment.dealerId].push(appointment);
        cancelAppointment(appointment);
    }

    function cancelAppointment(Appointment memory appointment) public verified(appointment.dealerId) {
        uint aIndex = getIndexOfAppointment(appointment);
        require(aIndex < uint(-1),"That appointment does not exist");
        removeAppointment(appointment.dealerId,aIndex);
        userAppointment[appointment.userId] = Appointment(0,0,"",0);
    }

    function removeAppointment(bytes32 dealerId, uint index) internal verified(dealerId) {
        for(uint i = index + 1; i < activeAppointments[dealerId].length; i++){
            activeAppointments[dealerId][i-1] = activeAppointments[dealerId][i];
        }
        activeAppointments[dealerId].length--;
    }

    function getAppointmentHistory(bytes32 dealerId) public view verified(dealerId) returns (Appointment[] memory){
        return dealerAppointmentHistory[dealerId];
    }

    function getPendingAppointments(bytes32 dealerId) public view verified(dealerId) returns (Appointment[] memory){
        return activeAppointments[dealerId];
    }

    function getUserAppointment(bytes32 userId) public view returns (Appointment memory) {
        return userAppointment[userId];
    }
}