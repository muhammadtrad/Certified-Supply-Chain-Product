//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
// finish addCheckpoint function
// allow user to view the checkpoint data based on the product hash

contract CertifiedProduct {
    address[] public administrators;
    struct Checkpoint {
        uint id;
        struct[] productData;
        bool isDefected;
        uint dateTime;
    }

    constructor(address[] memory administrators) {
        administrators = administrators;
    }

    function viewAdministrators() public view returns (address[] memory) {
        return admin;
    }

    function addCheckpoint(bytes memory data, bool _isDefected) internal returns(bool) {

    }
}
