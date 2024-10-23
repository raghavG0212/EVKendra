const express = require("express");
const  {updateAdmin,createAdmin,adminLogin,getAllAdmins,deleteAdmin} = require("../controllers/admin.contoller");
const router = express.Router();

router.put("/update-admin/:id", updateAdmin);
router.post("/create-admin", createAdmin);
router.post("/admin-login",adminLogin);
router.get("/getAdmins",getAllAdmins);
router.delete("/delete-admin/:id",deleteAdmin);

module.exports = router;
