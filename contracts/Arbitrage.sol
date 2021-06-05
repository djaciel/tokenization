pragma solidity =0.6.6;

import "./PancakeLibrary.sol";
import "./interfaces/IPancakeRouter01.sol";
import "./interfaces/IPancakeRouter02.sol";
import "./interfaces/IPancakePair.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IERC20.sol";
import "./interfaces/IPancakeCallee.sol";
import "./interfaces/IWETH.sol";

contract Arbitrage is IPancakeCallee {
    address wbnb = 0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd;
    address myAddress = 0x97c14E4e7ECEc5106b315ed4c7cA1983AfFc11b3;

    address factory;
    address routerAdd;
    IPancakeRouter02 router;

    uint256 constant deadline = 1 days;

    constructor() public {
        factory = 0x6725F303b657a9451d8BA641348b6761A6CC7a17;
        routerAdd = 0x3bc677674df90A9e5D741f28f6CA303357D0E4Ec;
        router = IPancakeRouter02(routerAdd);
    }

    function startArbitrage() external {
        // se obtiene el pair address de (wbnb/token x) del factory al cual le pedire prestado
        address pairAddress =
            IPancakeFactory(factory).getPair(
                0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd,
                0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee
            );
        require(pairAddress != address(0), "This pool does not exist");

        // pido prestado al factory
        IPancakePair(pairAddress).swap(1, 0, address(this), bytes("not empty"));
    }

    function pancakeCall(
        address sender,
        uint256 amount0,
        uint256 amount1,
        bytes calldata data
    ) external override {
        address[] memory path = new address[](2);
        uint256 amountToken;
        uint256 amountETH;
        {
            // scope for token{0,1}, avoids stack too deep errors
            address token0 = IPancakePair(msg.sender).token0();
            address token1 = IPancakePair(msg.sender).token1();
            assert(
                msg.sender == PancakeLibrary.pairFor(factory, token0, token1)
            ); // ensure that msg.sender is actually a V2 pair
            assert(amount0 == 0 || amount1 == 0); // this strategy is unidirectional
            path[0] = amount0 == 0 ? token0 : token1;
            path[1] = amount0 == 0 ? token1 : token0;
            amountETH = token0 == wbnb ? amount0 : amount1;
            amountToken = token0 == wbnb ? amount1 : amount0;
        }

        assert(path[0] == wbnb || path[1] == wbnb); // this strategy only works with a V2 WETH pair
        IERC20 tokenAdd0 = IERC20(path[0] == wbnb ? path[0] : path[1]);
        IERC20 tokenAdd1 = IERC20(path[0] == wbnb ? path[1] : path[0]);

        if (amountToken > 0) {
            uint256 amountRequired =
                PancakeLibrary.getAmountsIn(factory, amountToken, path)[0];
            tokenAdd1.approve(address(router), amountToken);

            uint256 amountReceived =
                router.swapExactTokensForETH(
                    amountToken,
                    amountRequired,
                    path,
                    address(this),
                    deadline
                )[1];

            assert(amountReceived > amountRequired); // fail if we didn't get enough ETH back to repay our flash loan
            assert(tokenAdd1.transfer(msg.sender, amountRequired)); // return WETH to V2 pair
            assert(
                tokenAdd1.transfer(myAddress, amountReceived - amountRequired)
            ); // keep the rest! (ETH)
        } else {
            uint256 amountRequired =
                PancakeLibrary.getAmountsIn(factory, amountETH, path)[0];
            tokenAdd0.approve(address(router), amountToken);

            uint256 amountReceived =
                router.swapExactETHForTokens{value: amountETH}(
                    amountRequired,
                    path,
                    address(this), //msg.sender,
                    deadline
                )[1];

            assert(amountReceived > amountRequired); // fail if we didn't get enough tokens back to repay our flash loan
            assert(tokenAdd0.transfer(msg.sender, amountRequired)); // return tokens to V2 pair
            assert(
                tokenAdd0.transfer(myAddress, amountReceived - amountRequired)
            ); // keep the rest! (tokens)
        }
    }
}
