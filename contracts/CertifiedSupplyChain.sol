//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import 'hardhat/console.sol';

contract CertifiedSupplyChain {
  event CheckPointCreated(uint256 checkpoint);

  address[] public administrators;
  struct Checkpoint {
    address creator;
    uint256 itemId;
    uint256[] prevCheckpoints;
  }

  mapping(uint256 => Checkpoint) public checkpoints;
  uint256 public totalCheckpoints;
  mapping(uint256 => uint256) public lastCheckpoints;

  constructor(address[] memory _addresses) {
    administrators = _addresses;
    administrators.push(msg.sender);
    totalCheckpoints = 0;
  }

  function viewAdministrators() public view returns (address[] memory) {
    return administrators;
  }

  function isAdministrator(address _admin) public view returns (bool) {
    for (uint256 i = 0; i < administrators.length; i++) {
      if (administrators[i] == _admin) {
        return true;
      }
    }
    return false;
  }

  function newCheckpoint(uint256 _itemId, uint256[] memory _prevCheckpoints)
    public
    returns (uint256)
  {
    require(
      isAdministrator(msg.sender),
      'Only administrator can create a checkpoint'
    );
    for (uint256 i = 0; i < _prevCheckpoints.length; i++) {
      require(
        isLastCheckpoint(_prevCheckpoints[i]),
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

    checkpoints[totalCheckpoints] = Checkpoint(
      msg.sender,
      _itemId,
      _prevCheckpoints
    );
    uint256 checkpoint = totalCheckpoints;
    totalCheckpoints += 1;
    lastCheckpoints[_itemId] = checkpoint;
    emit CheckPointCreated(checkpoint);
    return checkpoint;
  }

  function isLastCheckpoint(uint256 _checkpoint) public view returns (bool) {
    return lastCheckpoints[checkpoints[_checkpoint].itemId] == _checkpoint;
  }

  function getPrevCheckpoints(uint256 _checkpoint)
    public
    view
    returns (uint256[] memory)
  {
    return checkpoints[_checkpoint].prevCheckpoints;
  }

  function getCheckpointCreator(uint256 _checkpoint)
    public
    view
    returns (address)
  {
    return checkpoints[_checkpoint].creator;
  }

  function getCheckpointItemId(uint256 _checkpoint)
    public
    view
    returns (uint256)
  {
    return checkpoints[_checkpoint].itemId;
  }

  function getCheckpointData(uint256 _checkpoint)
    public
    view
    returns (uint256, uint256, uint256[] memory)
  {
    Checkpoint c = checkpoints[_checkpoint];
    return (c.itemId, c.creator, c.prevCheckpoints);
  }

  function getLastCheckpointItemId(uint256 _itemId)
    public
    view
    returns (uint256)
  {
    return lastCheckpoints[_itemId];
  }

  function getLastCheckpointItemId(uint256 _itemId)
    public
    view
    returns (uint256)
  {
    return lastCheckpoints[_itemId];
  }
}
