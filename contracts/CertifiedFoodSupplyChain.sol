//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import 'hardhat/console.sol';

contract CertifiedFoodSupplyChain {
  event CheckPointCreated(uint checkpoint);

  mapping(address => bool) public administrators;
  struct Checkpoint {
    address creator;
    uint itemId;
    uint[] prevCheckpoints;
  }

  mapping(uint => Checkpoint) public checkpoints;
  uint public totalCheckpoints;
  mapping(uint => uint) public lastCheckpoints;

  constructor(address[] memory _addresses) {
    for (uint i = 0; i < _addresses.length; i++) {
      administrators[_addresses[i]] = true;
    }
    administrators[msg.sender] = true;
  }

  function newCheckpoint(uint _itemId, uint[] memory _prevCheckpoints)
    public
    returns (uint)
  {
    require(administrators[msg.sender], 'Only administrator can create a checkpoint');
    for (uint i = 0; i < _prevCheckpoints.length; i++) {
      require(
        isLastCheckpoint(_prevCheckpoints[i]),
        'Only append to last checkpoint'
      );
    }
    bool repeatInstance = false;
    for (uint i = 0; i < _prevCheckpoints.length; i++) {
      repeatInstance = true;
      break;
    }
    if (!repeatInstance) {
      require(lastCheckpoints[_itemId] == 0, 'Instance not valid');
    }

    checkpoints[totalCheckpoints] = Checkpoint(
      msg.sender,
      _itemId,
      _prevCheckpoints
    );
    uint checkpoint = totalCheckpoints;
    totalCheckpoints += 1;
    lastCheckpoints[_itemId] = checkpoint;
    emit CheckPointCreated(checkpoint);
    return checkpoint;
  }

  function isLastCheckpoint(uint _checkpoint) public view returns (bool) {
    return lastCheckpoints[checkpoints[_checkpoint].itemId] == _checkpoint;
  }

  function getPrevCheckpoints(uint _checkpoint)
    public
    view
    returns (uint[] memory)
  {
    return checkpoints[_checkpoint].prevCheckpoints;
  }
}
