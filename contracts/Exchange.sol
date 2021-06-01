pragma solidity 0.8.3;

import "./IUniswapV2Router02.sol";

contract Exchange {
    address internal constant PANCAKESWAP_ROUTER_ADDRESS =
        0xD99D1c33F9fC3444f8101754aBC46c52416550D1;

    IUniswapV2Router02 public pancakeswapRouter;
    address private busdContract = 0x8301F2213c0eeD49a7E28Ae4c3e91722919B8B47;

    constructor() {
        pancakeswapRouter = IUniswapV2Router02(PANCAKESWAP_ROUTER_ADDRESS);
    }

    function convertEthToBusd(uint256 busdAmount) public payable {
        uint256 deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
        pancakeswapRouter.swapETHForExactTokens{value: msg.value}(
            busdAmount,
            getPathForETHtoBUSD(),
            address(this),
            deadline
        );

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    function convertEthToBusd2(uint256 busdMinAmount) public payable {
        uint256 deadline = block.timestamp + 15; // using 'now' for convenience, for mainnet pass deadline from frontend!
        pancakeswapRouter.swapExactETHForTokens{value: msg.value}(
            busdMinAmount,
            getPathForETHtoBUSD(),
            msg.sender,
            deadline
        );

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    function getEstimatedETHforBUSD(uint256 busdAmount)
        public
        view
        returns (uint256[] memory)
    {
        return
            pancakeswapRouter.getAmountsIn(busdAmount, getPathForETHtoBUSD());
    }

    function getPathForETHtoBUSD() private view returns (address[] memory) {
        address[] memory path = new address[](2);
        path[0] = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
        path[1] = busdContract;

        return path;
    }

    // important to receive ETH
    receive() external payable {}
}
