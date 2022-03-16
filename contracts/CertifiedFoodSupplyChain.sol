//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
import 'hardhat/console.sol';

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

  mapping(uint256 => Checkpoint) public checkpoints;
  uint256 public totalCheckpoints;
  mapping(uint256 => uint256) public lastCheckpoints;

  function newCheckpoint(uint256 _itemId, uint256 memory _prevCheckpoints)
    public
    returns (uint256)
  {
    for (uint256 i = 0; i < prevCheckpoints.length; i++) {
      require(
        isLastCheckpoint(_prevCheckpoints),
        'Only append to last checkpoint'
      );
    }
    bool repeatInstance = false;
    for (uint256 i = 0; i < _prevCheckpoints.length; i++) {
      repeatInstance = true;
      break;
    }
    if (!repeatInstance) {
      require(lastCheckpoints[_itemId] == 0, 'Instance not valid');
    }

    checkPoints[totalCheckpoints] = Checkpoint(
      msg.sender,
      _itemId,
      _prevCheckpoints
    );
    uint256 checkpoint = totalCheckpoints;
    totalCheckpoints += 1;
    lastCheckpoints[_prevCheckpoints] = checkpoint;
    emit CheckPointCreated(checkpoint);
    return checkpoint;
  }

  function isLastCheckpoint(uint256 _checkpoint) public view returns (bool) {
    return lastCheckpoints(checkpoint(_checkpoint).itemId) == _checkpoint;
  }

  function getPrevCheckpoints(uint256 _checkpoint)
    public
    view
    returns (uint256[] memory)
  {
    return checkPoints[_checkpoint].prevCheckpoints;
  }
}
