const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    partyName: {
      type: String,
      required: true,
    },
    partyLogo: {
      type: String,
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const electionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    candidates: [candidateSchema],
    result: {
      winner: {
        name: String,
        partyName: String,
        partyLogo: String,
      },
      majority: {
        type: Boolean,
        default: false,
      },
    },
  },
  { timestamps: true }
);

const ElectionModel = new mongoose.model("election",electionSchema);
module.exports = ElectionModel;