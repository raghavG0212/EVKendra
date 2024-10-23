const ElectionModel = require("../models/election.model");

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const createCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    const { name, dob, nationality, partyName, partyLogo } = req.body;
    const election = await ElectionModel.findById(id);
    if (!election) {
      res.status(400).json({ message: "Election does not exists" });
    }
    const age = calculateAge(dob);
    if (age < 25) {
      return res.status(400).json({ message: "Age should be atleast 25" });
    }
    if (nationality != "Indian") {
      return res.status(400).json({ message: "Candidate must be Indian" });
    }
    const existingCandidate = await ElectionModel.findOne({
      _id: id,
      candidates: {
        $elemMatch: {
          name: name,
          partyName: partyName,
          dob: dob,
        },
      },
    });
    if (existingCandidate) {
      return res.status(400).json({ message: "Candidate already exists" });
    }
    election.candidates.push({ name, dob, nationality, partyName, partyLogo });
    await election.save();
    res.status(200).json({ message: "Candidate added to the list" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getCandidate = async (req, res) => {
  const { id, cid } = req.params;
  try {
    const election = await ElectionModel.findById(id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    const candidate = election.candidates.id(cid);

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    res.status(200).json(candidate);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const editCandidate = async (req, res) => {
  const { id, cid } = req.params; 
  const { name, partyName, partyLogo } = req.body;
  try {
    const election = await ElectionModel.findById(id);

    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    const candidate = election.candidates.id(cid);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    candidate.name = name || candidate.name;
    candidate.partyName = partyName || candidate.partyName;
    candidate.partyLogo = partyLogo || candidate.partyLogo;
    await election.save();
    res.status(200).json({
      message: "Details updated successfully",
      candidate,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating details", error: err.message });
  }
};


const deleteCandidate = async (req, res) => {
  const { id,cid } = req.params;

  try {
    const election = await ElectionModel.findById(id);
    if(!election){
      res.status(400).json({message:"Election not found"});
    }
    const candidate = election.candidates.id(cid);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const totalVotes = election.candidates.reduce((sum, c) => sum + c.votes, 0);
    if (totalVotes > 0 && candidate.votes >= totalVotes / 2) {
      return res.status(400).json({
        message: "Cannot delete candidate with 50% or more of total votes",
      });
    }
    election.candidates.pull({ _id: cid });
    await election.save();
    res.status(200).json({ message: "Candidate deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting candidate", error: err.message });
  }
};


const getAllCandidates = async (req, res) => {
  const { id } = req.params; 
  try {
    const election = await ElectionModel.findById(id);
    if (!election) {
      return res.status(404).json({ message: "Election not found" });
    }
    res.status(200).json(election.candidates);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createCandidate,
  editCandidate,
  getCandidate,
  deleteCandidate,
  getAllCandidates,
};
