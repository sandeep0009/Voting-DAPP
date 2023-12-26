// contracts/Voting.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }

    mapping(address => bool) public hasVoted;
    mapping(address => bool) public isVoter;
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;

    event Voted(address indexed voter, uint256 indexed candidateId);

    modifier onlyVoter() {
        require(isVoter[msg.sender], "Not a registered voter");
        _;
    }

    function addVoter(address _voter) public {
        require(!isVoter[_voter], "Already a registered voter");
        isVoter[_voter] = true;
    }

    function addCandidate(string memory _name) public {
        candidateCount++;
        candidates[candidateCount] = Candidate(_name, 0);
    }

    function vote(uint256 _candidateId) public onlyVoter {
        require(!hasVoted[msg.sender], "Already voted");
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate");
        
        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = true;
        
        emit Voted(msg.sender, _candidateId);
    }

    function getCandidateCount() public view returns (uint256) {
        return candidateCount;
    }
}
