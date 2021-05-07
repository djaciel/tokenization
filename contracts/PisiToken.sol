pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract PISIToken is ERC20 {
    constructor(uint256 initialSupply) public ERC20("Pisi Token", "PISI") {
        _mint(msg.sender, initialSupply);
    }
}
