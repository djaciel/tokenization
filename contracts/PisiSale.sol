pragma solidity ^0.8.3;

import "./Crowsale.sol";

contract PisiSale is Crowdsale {
    constructor(
        uint256 rate, // rate in TKNbits
        address payable wallet,
        IERC20 token
    ) public Crowdsale(rate, wallet, token) {}
}
