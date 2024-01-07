import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
    },
  position:{
    type: String,
    required: true
    },
  monthlySalary:{
    type: Number,
    required: true
    },
  jobType:{
    type: String,
    required: true,
    enum:['Full-time','Part-time','Intern','Travel']
    },
  internshipDuration: String,
  workingMode:{
    type: String,
    required: true
    },
  jobDescription:{
    type: String, 
    required: true
    },
  aboutCompany:{
    type: String,
    required: true
    },
  skills:{
    type: Array,
    required: true
    },
  noOfEmployees:{
    type: String,
    required: true
    },
  logo: String,
  location: String,
  createdOn:{
    type: Date,
    required: true
  },
},{timestamps:true})


const Job = mongoose.model('Job', jobSchema);
export default Job;