import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  elections: {}, 
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
  },
});
export const selectElectionById = (state, electionID) =>
  state.election.elections[electionID];

export const { setDeclareElection } = electionSlice.actions;
export default electionSlice.reducer;
