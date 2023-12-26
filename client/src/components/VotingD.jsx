// src/VotingDapp.js
import React, { useState, useEffect } from "react";
import getWeb3 from "../getWeb";
import VotingContract from "../contracts/Voting.json";


const VotingDapp = () => {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [votingContract, setVotingContract] = useState(null);
  const [candidateCount, setCandidateCount] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [voterAddress, setVoterAddress] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();
        const accounts = await web3Instance.eth.getAccounts();
        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = VotingContract.networks[networkId];
        const contract = new web3Instance.eth.Contract(
          VotingContract.abi,
          deployedNetwork && deployedNetwork.address
        );

        setWeb3(web3Instance);
        setAccounts(accounts);
        setVotingContract(contract);

        const count = await contract.methods.getCandidateCount().call();
        setCandidateCount(count);

        const candidates = [];
        for (let i = 1; i <= count; i++) {
          const candidate = await contract.methods.candidates(i).call();
          candidates.push(candidate);
        }
        setCandidates(candidates);
      } catch (error) {
        console.error("Error initializing web3:", error);
      }
    };

    init();
  }, []);

  const handleAddVoter = async () => {
    try {
      await votingContract.methods.addVoter(voterAddress).send({ from: accounts[0] });
      setSuccessMessage("Voter added successfully");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Error adding voter:", error);
      setErrorMessage("Error adding voter. Please check the console for details.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  const handleAddCandidate = async () => {
    try {
      const candidateName = prompt("Enter candidate name:");
      await votingContract.methods.addCandidate(candidateName).send({ from: accounts[0] });
      setSuccessMessage("Candidate added successfully");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Error adding candidate:", error);
      setErrorMessage("Error adding candidate. Please check the console for details.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  const handleVote = async (candidateId) => {
    try {
      await votingContract.methods.vote(candidateId).send({ from: accounts[0] });
      setSuccessMessage("Vote successful");
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      console.error("Error voting:", error);
      setErrorMessage("Error voting. Please check the console for details.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  return (
    <div className="container">
    <div className="inside">
      <h1>Voting DApp</h1>
      <p>Account: {accounts[0]}</p>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div>
        <h2>Candidates</h2>
        <ul>
          {candidates.map((candidate, index) => (
            <li key={index}>
              {candidate.name} - Votes: {candidate.voteCount}{" "}
              <button onClick={() => handleVote(index + 1)}>Vote</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Admin Panel</h2>
        <label>
          Add Voter Address:
          <input
            type="text"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
          />
        </label>
        <div className="button">
          <button className="btn" onClick={handleAddVoter}>Add Voter</button>
          <button className="btn" onClick={handleAddCandidate}>Add Candidate</button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default VotingDapp;
