const mongoose = require("mongoose");

const electionGetterSchema = new mongoose.Schema(
  {
    election: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    voted: {
      type: Boolean,
      default: false,
    },
    votedTo: {
      name: {
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
    },
  },
  { timestamps: true }
);

const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    phoneNo: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isInteger,
        message: "Phone number must be an integer",
      },
    },
    aadharNo: {
      type: String,
      required: true,
    },
    voterID: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    nationality: {
      type: String,
      required: true,
    },
    voteStatus: [electionGetterSchema],
  },
  { timestamps: true }
);

const VoterModel = mongoose.model("Voter", voterSchema);

module.exports = VoterModel;
