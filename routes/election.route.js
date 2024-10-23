const express = require("express");
const {
  createElection,
  deleteElection,
  declareResult,
  getElections,
  editElection,
} = require("../controllers/election.controller");
const {
  createCandidate,
  editCandidate,
  getCandidate,
  deleteCandidate,
  getAllCandidates,
} = require("../controllers/candidate.controller");
const router = express.Router();

router.post("/create-election", createElection);
router.put("/edit-election/:id",editElection)
router.delete("/delete-election/:id", deleteElection);
router.put('/declare-result/:id',declareResult);
router.get('/getAll',getElections);
router.post("/:id/candidates/create-candidate", createCandidate);
router.put("/:id/candidates/edit-candidate/:cid", editCandidate);
router.get('/:id/candidates/get-candidate/:cid',getCandidate);
router.delete("/:id/candidates/delete-candidate/:cid", deleteCandidate);
router.get("/:id/candidates/getAll", getAllCandidates);
module.exports = router;
