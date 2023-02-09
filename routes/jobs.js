const express = require("express");
const router = express.Router();

// importing Jobs controllers
const { getJobs } = require("../controllers/jobs.controller");

router.route("/jobs").get(getJobs);

module.exports = router;
