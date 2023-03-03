const express = require("express");
const router = express.Router();

// importing Jobs controllers
const {
  getJobs,
  newJob,
  getJobsInRadius,
  updateJob,
  deleteJob,
  getJob,
  jobStats,
} = require("../controllers/jobs.controller");

router.route("/jobs/:id/:slug").get(getJob);
router.route("/jobs/:zipcode/:distance").get(getJobsInRadius);
router.route("/jobs/:id").put(updateJob).delete(deleteJob);
router.route("/stats/:topic").get(jobStats);
router.route("/jobs").get(getJobs);
router.route("/jobs").post(newJob);

module.exports = router;
