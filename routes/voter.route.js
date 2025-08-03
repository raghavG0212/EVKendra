const express = require("express");
const {
  signup,
  login,
  voteExecutor,
  getVoter,
  updateVoter,
  getAll,
  countVoters,
  countVotersPerMonth,
} = require("../controllers/voter.controller");
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.post('/cast-vote',voteExecutor);
router.get('/get-voter',getVoter);
router.put('/update-voter/:id',updateVoter)
router.get('/getAll',getAll);
router.get('/count-voter',countVoters);
router.get("/voters-per-month",countVotersPerMonth);

module.exports=router;