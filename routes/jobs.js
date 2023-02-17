const express = require("express");
const router = express.Router();

// importing Jobs controllers
const { getJobs, newJob } = require("../controllers/jobs.controller");

router.route("/jobs").get(getJobs);
router.route("/jobs").post(newJob);

module.exports = router;
