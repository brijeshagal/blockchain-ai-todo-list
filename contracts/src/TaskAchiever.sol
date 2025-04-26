// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TaskAchiever is ERC20 {
    error Unauthorised();
    address taskVerifierContract;

    constructor(address _taskVerifierContract) ERC20("TaskAchiever", "ACHVR") {
        taskVerifierContract = _taskVerifierContract;
    }

    modifier onlyTaskVerifier() {
        if (msg.sender != taskVerifierContract) {
            revert Unauthorised();
        }
        _;
    }

    function mint(address to, uint256 amount) external onlyTaskVerifier {
        _mint(to, amount);
    }
}
