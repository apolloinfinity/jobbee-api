const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");

const jobSchema = mongoose.Schema({
  title: {
    type: String,
    require: [true, "Please enter job title"],
    trim: true,
    maxlength: [100, "Job title cannot exceed 100 characters."],
  },
  slug: String,
  description: {
    type: String,
    required: [true, "Please enter a Job description"],
    maxlength: [1000, "Job description cannot exceed 1000 characters"],
  },
  email: {
    type: String,
    validate: [validator.isEmail, "Please add a valid email address"],
  },
  address: {
    type: String,
    required: [true, "Please add an address."],
  },
  company: {
    type: String,
    require: [true, "Please add company name."],
  },
  industry: {
    type: [String],
    require: true,
    enum: {
      values: [
        "Business",
        "Information Technology",
        "Banking",
        "Education/Training",
        "Communication",
        "Others",
      ],
      message: "Please select correct options for industry.",
    },
  },
  jobType: {
    type: String,
    required: true,
    enum: {
      values: ["Permanent", "Temporary", "Internship"],
      message: "Please select correct option job type",
    },
  },
  minEducation: {
    type: String,
    required: true,
    enum: {
      values: ["Bachelors", "Masters", "PhD"],
      message: "Please select correct options for Education",
    },
  },
  positions: {
    type: Number,
    default: 1,
  },
  experience: {
    type: String,
    required: true,
    enum: {
      values: [
        "No Experience",
        "1 Year - 2 years",
        "2 Year - 5 years",
        "5 Years+ ",
      ],
      message: "Please select correction options for Experience.",
    },
  },
  salary: {
    type: Number,
    required: [true, "Please enter expected salary for this job."],
  },
  postingDate: {
    type: Date,
    default: Date.now,
  },
  lastDate: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 7),
  },
  applicantsApplied: {
    type: [Object],
    select: false,
  },
});

// Creating job slug before saving
jobSchema.pre("save", function (next) {
  // creating slug before saving to DB
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Job", jobSchema);
