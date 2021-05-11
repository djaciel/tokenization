pragma solidity ^0.8.3;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Kyc is Ownable {
    mapping(address => bool) allowed;

    function setKyc(address _addr) public onlyOwner {
        allowed[_addr] = true;
    }

    function setRevoked(address _addr) public onlyOwner {
        allowed[_addr] = false;
    }

    function kycCompleted(address _addr) public view returns (bool) {
        return allowed[_addr];
    }
}
