const Job = require("../models/jobs");
// Get all Jobs => /api/v1/jobs

exports.getJobs = (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "This route will display all jobs in the future.",
  });
};

// Create a new job => /api/v1/job
exports.newJob = async (req, res, next) => {
  const job = await Job.create(req.body);
  res.status(200).json({
    success: true,
    message: "Job Created",
    data: job,
  });
};
