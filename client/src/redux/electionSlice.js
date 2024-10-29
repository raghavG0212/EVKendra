import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  elections: {},
  electionList: [],
};

const electionSlice = createSlice({
  name: "election",
  initialState,
  reducers: {
    setDeclareElection: (state, action) => {
      const { electionID, declared } = action.payload;
      if (!state.elections[electionID]) {
        state.elections[electionID] = {};
      }
      state.elections[electionID].declared = declared;
    },
    setElections: (state, action) => {
      state.electionList = action.payload;
    },
    deleteElection: (state, action) => {
      state.electionList = state.electionList.filter(
        (election) => election.id !== action.payload
      );
    },
  },
});

export const {
  setDeclareElection,
  setElections,
  deleteElection,
} = electionSlice.actions;

export const selectElectionById = (state, electionID) =>
  state.election.elections[electionID];

// export const selectElectionByIdFromList = (state, electionID) => {
//   return state.election.electionList.find(
//     (election) => election._id === electionID
//   );
// };

export const selectElectionList = (state) => state.election.electionList;

export default electionSlice.reducer;
