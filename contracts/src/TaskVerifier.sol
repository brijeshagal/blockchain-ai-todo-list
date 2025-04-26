// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TaskVerifier {
    struct Task {
        bytes32 hash;
        bool completed;
    }

    mapping(address => Task[]) private tasks;

    event TaskAdded(address user, bytes32 taskHash);
    event TaskCompleted(address user, uint taskIndex);

    function addTask(bytes32 taskHash) public {
        tasks[msg.sender].push(Task(taskHash, false));
        emit TaskAdded(msg.sender, taskHash);
    }

    function completeTask(uint taskIndex) public {
        require(taskIndex < tasks[msg.sender].length, "Invalid index");
        tasks[msg.sender][taskIndex].completed = true;
        emit TaskCompleted(msg.sender, taskIndex);
    }

    function getTasks() public view returns (Task[] memory) {
        return tasks[msg.sender];
    }
}
