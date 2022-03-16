//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "hardhat/console.sol";

contract CertifiedFoodSupplyChain {
    using SafeMath for uint256;

    event CheckPointCreated(uint256 checkpoint);

    /**
      * @param creator the creator of the checkpoint.
      * @param itemId item id of the object that the checkpoint refers to 
      * @param prevCheckpoints checkpoints before this checkpoint within the supplychain 
    */

    struct Checkpoint {
        address creator;
        uint256 itemId;
        uint256[] prevCheckpoints;
    }

    


}