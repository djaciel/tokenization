pragma solidity 0.8.3;

import "./IUniswapV2Router02.sol";

contract FlashLoan {
    IUniswapV2Router02 public router_a;
    IUniswapV2Router02 public router_b;

    uint256 private founds = 10000000000000000; //0.01 bnb

    address internal constant PANCAKESWAP_ROUTER_ADDRESS =
        0xD99D1c33F9fC3444f8101754aBC46c52416550D1;

    IUniswapV2Router02 public pancakeswapRouter;

    event maxMinEthToken2Evt(
        uint256 min_amount_a,
        address indexed token_a,
        address indexed token_b,
        uint256 deadline
    );

    constructor() {
        pancakeswapRouter = IUniswapV2Router02(PANCAKESWAP_ROUTER_ADDRESS);
    }

    function maxMinEthToken2(
        uint256 min_amount_a,
        address token_a,
        address token_b,
        uint256 deadline
    ) public payable {
        emit maxMinEthToken2Evt(min_amount_a, token_a, token_b, deadline);
        pancakeswapRouter.swapExactETHForTokens{value: msg.value}(
            min_amount_a,
            getPathForPair(token_a, token_b),
            msg.sender,
            deadline
        );

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    function maxMinEthToken(
        address router_addr_a,
        uint256 min_amount_a,
        address router_addr_b,
        uint256 min_amount_b,
        address token_a,
        address token_b,
        uint256 deadline
    ) public payable {
        router_a = IUniswapV2Router02(router_addr_a);
        router_b = IUniswapV2Router02(router_addr_b);

        router_a.swapExactETHForTokens{value: msg.value}(
            min_amount_a,
            getPathForPair(token_a, token_b),
            msg.sender,
            deadline
        );

        // refund leftover ETH to user
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "refund failed");
    }

    function getPathForPair(address token_a, address token_b)
        private
        view
        returns (address[] memory)
    {
        address[] memory path = new address[](2);
        path[0] = token_a;
        path[1] = token_b;

        return path;
    }
}
