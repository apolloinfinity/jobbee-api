const Job = require("../models/jobs");

const ErrorHandler = require("../utils/errorHandler");
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

// get a single job with id and slug => /api/v1/jobs/:id/:slug
exports.getJob = async (req, res) => {
  let job = await Job.find({
    $and: [{ _id: req.params.id }, { slug: req.params.slug }],
  });
  if (!job || job.length === 0) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  res.status(200).json({
    success: true,
    data: job,
  });
};

// update job => /api/v1/jobs/:id
exports.updateJob = async (req, res, next) => {
  const body = req.body;

  let job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ErrorHandler("Job not found", 404));
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

// delete a job => /api/v1/job/:id
exports.deleteJob = async (req, res) => {
  let job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job not found.",
    });
  }

  job = await Job.findByIdAndDelete(id);
  res.status(200).json({
    success: true,
    message: "Job has been deleted.",
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

// Get stats about a topic(job) = /api/v1/stats/:topic
exports.jobStats = async (req, res) => {
  const stats = await Job.aggregate([
    {
      $match: { $text: { $search: '"' + req.params.topic + '"' } },
    },
    {
      $group: {
        _id: { $toUpper: "$experience" },
        totalJobs: { $sum: 1 },
        avgPositions: { $avg: "$positions" },
        avgSalary: { $avg: "$salary" },
        minSalary: { $min: "$salary" },
        maxSalary: { $max: "$salary" },
      },
    },
  ]);

  if (stats.length === 0) {
    return res.status(400).json({
      success: false,
      message: `No stats founf for - ${req.params.topic}`,
    });
  }

  res.status(200).json({
    success: true,
    data: stats,
  });
};
