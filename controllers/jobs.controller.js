const Job = require("../models/jobs");
const geoCoder = require("../utils/geocoder");

// Get all Jobs => /api/v1/jobs
exports.getJobs = async (req, res, next) => {
  const jobs = await Job.find();
  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
};

// Create a new job => /api/v1/jobs
exports.newJob = async (req, res, next) => {
  const job = await Job.create(req.body);
  res.status(200).json({
    success: true,
    message: "Job Created",
    data: job,
  });
};

// update job => /api/v1/jobs/:id
exports.updateJob = async (req, res) => {
  const { id } = req.params;
  const body = req.body;

  let job = await Job.findById(id);

  if (!job) {
    res.status(404).json({
      success: false,
      message: "Job Not Found.",
    });
  }

  job = await Job.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Job is updated.",
    data: job,
  });
};

// Search jobs with radius => /api/v1/jobs/:zipcode/:distance
exports.getJobsInRadius = async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // gettint latitude and longitude from geocoder with zipcode
  const loc = await geoCoder.geocode(zipcode);
  const latitude = loc[0].latitude;
  const longitude = loc[0].longitude;
  const radius = distance / 3963;

  const jobs = await Job.find({
    location: {
      $geoWithin: { $centerSphere: [[longitude, latitude], radius] },
    },
  });

  res.status(200).json({
    success: true,
    results: jobs.length,
    data: jobs,
  });
};
