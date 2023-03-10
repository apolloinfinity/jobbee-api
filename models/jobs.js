const mongoose = require("mongoose");
const validator = require("validator");
const slugify = require("slugify");
const geoCoder = require("../utils/geocoder");

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
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dSphere",
    },
    formattedAddress: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  company: {
    type: String,
    require: [true, "Please add company name."],
  },
  industry: {
    type: [String],
    require: [true, "Please enter industry for this job."],
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
    required: [true, "Please add job type."],
    enum: {
      values: ["Permanent", "Temporary", "Internship"],
      message: "Please select correct option job type",
    },
  },
  minEducation: {
    type: String,
    required: [true, "Please add minumum education for this job."],
    enum: {
      values: ["None", "Bachelors", "Masters", "PhD"],
      message: "Please select correct options for Education",
    },
  },
  positions: {
    type: Number,
    default: 1,
  },
  experience: {
    type: String,
    required: [true, "Please enter experience required for this job."],
    enum: {
      values: [
        "No Experience",
        "1 Year - 2 years",
        "2 Years - 5 years",
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

// setting up location
jobSchema.pre("save", async function (next) {
  const loc = await geoCoder.geocode(this.address);
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode,
  };

  next();
});

module.exports = mongoose.model("Job", jobSchema);
