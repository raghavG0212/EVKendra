import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  elections: {},
};

const voterSlice = createSlice({
  name: "voter",
  initialState,
  reducers: {
    setVoteStatus: (state, action) => {
      const { electionID, voted } = action.payload;
      if (!state.elections[electionID]) {
        state.elections[electionID] = {};
      }
      state.elections[electionID].voted = voted;
    },
    setMultipleVoteStatus: (state, action) => {
      action.payload.forEach((vote) => {
        const electionID = vote.election;
        if (!state.elections[electionID]) {
          state.elections[electionID] = {};
        }
        state.elections[electionID].voted = vote.voted;
      });
    },
    clearVoteStatus: (state) => {
      state.elections = {};
    },
  },
});

export const selectElectionById = (state, electionID) =>
  state.voter.elections[electionID];

export const { setVoteStatus , clearVoteStatus , setMultipleVoteStatus} = voterSlice.actions;
export default voterSlice.reducer;
