const ElectionModel = require("../models/election.model");

const createElection = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    if (startDate >= endDate) {
      return res
        .status(400)
        .json({ message: "Election cannot start before or on end time" });
    }
    const existingElection = await ElectionModel.findOne({ name });
    if (existingElection) {
      return res
        .status(400)
        .json({ message: "Election already exists with same name." });
    }
    const newElection = new ElectionModel({
      name,
      startDate,
      endDate,
    });
    await newElection.save();
    res.status(200).json({ message: "Election created successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const declareResult = async (req, res) => {
  const { id } = req.params;
  try {
    const election = await ElectionModel.findById(id);
    if (!election) {
      return res.status(404).json({ message: "Election does not exist" });
    }
    const today = new Date();
    if (election.startDate > today) {
      return res.status(400).json({ message: "Election not started yet" });
    }
    if (election.endDate > today) {
      return res.status(400).json({ message: "Election not ended yet" });
    }
    if (election.result.winner.length > 0) {
      return res.status(400).json({ message: "Result already declared." });
    }
    const totalVotes = election.candidates.reduce(
      (acc, candidate) => acc + candidate.votes,
      0
    );
    if (totalVotes === 0) {
      return res
        .status(400)
        .json({ message: "No votes casted in the election" });
    }
    let winner = election.candidates[0];
    election.candidates.forEach((candidate) => {
      if (candidate.votes > winner.votes) {
        winner = candidate;
      }
    });
    const majority = winner.votes > totalVotes / 2;
    election.result = {
      winner: {
        name: winner.name,
        partyName: winner.partyName,
        partyLogo: winner.partyLogo,
      },
      majority,
    };
    await election.save();
    res.status(200).json({
      message: `Result Declared ! ${winner.name} won ${
        majority ? "with majority" : ""
      }`,
      result: election.result,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const editElection = async (req, res) => {
  try {
    const existingElection = await ElectionModel.findById(req.params.id);
    if (!existingElection) {
      return res.status(400).json({ message: "Election not found" });
    }
    const sameElection = await ElectionModel.findOne({ name: req.body.name });
    if (sameElection && String(sameElection._id) !== String(req.params.id)) {
      return res.status(400).json({ message: "Election already exists" });
    }
    const startDate = req.body.startDate || existingElection.startDate;
    const endDate = req.body.endDate || existingElection.endDate;
    if (new Date(startDate) >= new Date(endDate)) {
      return res
        .status(400)
        .json({ message: "Election cannot start before or on the end time" });
    }
    if(new Date()> new Date(endDate)){
       return res
         .status(400)
         .json({ message: "Minimum 1 day window required after editing" });
    }
    if (new Date() <= new Date(startDate)) {
      existingElection.startDate = startDate;
    }
    existingElection.name = req.body.name || existingElection.name;
    existingElection.endDate = endDate;

    await existingElection.save();
    res
      .status(200)
      .json({
        message: "Details updated successfully",
        election: existingElection,
      });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteElection = async (req, res) => {
  try {
    const existingElection = await ElectionModel.findById(req.params.id);
    if (!existingElection) {
      return res.status(404).json({ message: "Election doesn't exists." });
    }
    const today = new Date();
    if (
      existingElection.endDate > today &&
      existingElection.startDate < today
    ) {
      return res.status(400).json({ message: "Election not ended yet" });
    }
    await ElectionModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Election deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getElections = async (req, res) => {
  try {
    const elections = await ElectionModel.find();
    res.status(200).json(elections);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
module.exports = {
  createElection,
  editElection,
  deleteElection,
  getElections,
  declareResult,
};
