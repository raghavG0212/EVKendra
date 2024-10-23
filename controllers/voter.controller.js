const VoterModel = require("../models/voter.model");
const ElectionModel = require("../models/election.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

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

const generateVoterID = () => {
  return (
    "IND" +
    Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, "0")
  );
};

const signup = async (req, res) => {
  try {
    const { name, dob, phoneNo, aadharNo, password, nationality } = req.body;
    const age = calculateAge(dob);
    if (age < 18) {
      return res
        .status(400)
        .json({ message: "Voter should be at least 18 years old" });
    }
    if (nationality !== "Indian") {
      return res.status(400).json({ message: "Nationality must be Indian" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password should have 8 or more letters" });
    }
    if (aadharNo.length !== 12) {
      return res.status(400).json({ message: "Invalid Aadhar No" });
    }
    if (!/^\d{10}$/.test(phoneNo)) {
      return res.status(400).json({ message: "Invalid Phone No" });
    }
    const existingVoter = await VoterModel.findOne({ aadharNo });
    if (existingVoter) {
      return res.status(400).json({ message: "Voter already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const voterID = generateVoterID();
    const newVoter = new VoterModel({
      name,
      dob,
      phoneNo,
      aadharNo,
      voterID,
      password: hashedPassword,
      nationality,
    });
    await newVoter.save();
    res.status(201).json({ message: "Voter ID created successfully", voterID });
  } catch (err) {
    res.status(500).json({ message: "server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    const voter = await VoterModel.findOne({
      $or: [{ aadharNo: identifier }, { voterID: identifier }],
    });

    if (!voter) {
      return res.status(400).json({ message: "Voter not registered." });
    }

    const isPasswordValid = await bcrypt.compare(password, voter.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Wrong password." });
    }

    const token = jwt.sign(
      { aadharNo: voter.aadharNo },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: voter.name,
        aadharNo: voter.aadharNo,
        voterID: voter.voterID,
        dob: voter.dob,
        phoneNo: voter.phoneNo,
        voteStatus: voter.voteStatus,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const voteExecutor = async (req, res) => {
  const { voterID, eid, cid } = req.body;
  try {
    const voter = await VoterModel.findOne({ voterID });
    if (!voter) {
      return res.status(400).json({ message: "Voter ID not found" });
    }
    const election = await ElectionModel.findById(eid);
    if (!election) {
      return res.status(400).json({ message: "Election does not exist" });
    }
    if(new Date()<election.startDate){
      return res.status(400).json({message:"Election not started yet."});
    }
    if(new Date()>election.endDate){
      return res.status(400).json({message:"Election has already ended."});
    }
    const candidate = election.candidates.id(cid);
    if (!candidate) {
      return res.status(400).json({ message: "Candidate does not exist" });
    }
    const hasVoted = voter.voteStatus.some(
      (vote) => vote.election.toString() === eid
    );
    if (hasVoted) {
      return res
        .status(400)
        .json({ message: "You have already voted in this election." });
    }
    candidate.votes += 1;
    await election.save();
    voter.voteStatus.push({
      election: eid,
      voted: true,
      votedTo: {
        name: candidate.name,
        partyName: candidate.partyName,
        partyLogo: candidate.partyLogo,
      },
    });
    await voter.save();
    res.status(200).json({
      message: `You successfully voted ${candidate.name}`,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getVoter = async (req, res) => {
  const {voterID, eid} = req.query;
  try {
    const voter = await VoterModel.findOne({voterID});

    if (!voter) {
      return res.status(400).json({ message: "Voter not found" });
    }
    const election = await ElectionModel.findById(eid);
    if(!election){
      return res.status(400).json({message:"Elecion not found"});
    }
    const voteStatusForEid = voter.voteStatus.find(
      (status) => status.election.toString() === eid
    );
    if (!voteStatusForEid) {
      return res
        .status(404)
        .json({ message: "No voting record found for this election." });
    }
    res.status(200).json(voteStatusForEid.votedTo);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const countVoters = async (req, res) => {
  try {
    const voterCount = await VoterModel.countDocuments();
    res.status(200).json({ count: voterCount });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const countVotersPerMonth = async (req, res) => {
  try {
    const result = await VoterModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          count: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { signup, login, voteExecutor, getVoter, countVoters ,countVotersPerMonth};


// dummy data 
// {
//     "name" :"raghav",
//     "dob" : "2002-02-12",
//     "phoneNo" :1234567890,
//     "aadharNo" :"123456789020",
//     "password" :"12345678",
//     "nationality" :"Indian"
// }