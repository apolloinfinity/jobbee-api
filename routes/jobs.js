const express = require("express");
const router = express.Router();

// importing Jobs controllers
const {
  getJobs,
  newJob,
  getJobsInRadius,
} = require("../controllers/jobs.controller");

router.route("/jobs").get(getJobs);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/jobs").post(newJob);

module.exports = router;
