import express from "express";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';  // Import fileURLToPath function
import { dirname } from 'path';  
import connectToDatabase from "./db/db.js";
import User from "../server/models/user.js";
import Job from "../server/models/job.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import cors from "cors";
import path from "path";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());


// Get the directory name using dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use the updated __dirname here
app.use(express.static(path.join(__dirname,"..","client","build")));

// Health check API
app.get("/health", (req, res) => {
  res.send("Everything is working fine!");
});


app.use((req, res, next) => {
  const err = new Error("Page Not found");
  err.status = 404;
  next(err);
});



// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  try {
    const token = req.headers.token || req.headers.authorization;

    if (!token) {
      console.log("Token not provided");
      return res.status(401).json({ message: "Token not provided" });
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in isAuthenticated middleware:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};



// Authenticate route
app.get("/authenticate", isAuthenticated, (req, res) => {
  res.send({ status: 202, message: "user authenticated" });
});

// Register route
app.post("/register", async (req, res, next) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name) {
      return res.send({ error: 'Name is required' });
    }
    if (!email) {
      return res.send({ error: 'Email is required' });
    }
    if (!mobile) {
      return res.send({ error: 'Mobile is required' });
    }
    if (!password) {
      return res.send({ error: 'Password is required' });
    }

    // Check if user with the provided email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.json({
        status: 403,
        message: "User already exists with this Email",
      });
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      email,
      mobile,
      password: encryptedPassword,
    });

    // Generate JWT token
    const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "5h",
    });

    res.send({
      status: 201,
      message: "User created successfully",
      name: newUser.name,
      jwtToken,
    });
  } catch (error) {
    console.error(error);
    // Call next with the error to pass it to the error handling middleware
    next(new Error("Something went wrong!"));
  }
});

// Login route
app.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // ... (Validation checks)

    const user = await User.findOne({ email });
    if (user) {
      let passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        // Generate JWT token 
        const jwtToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
          expiresIn: "5h",
        });
        return res.send({
          status: 200,
          message: "User logged in successfully",
          name: user.name,
          jwtToken,
        });
      }
    }
    res.send({ status: 401, message: "Incorrect credentials" });
  } catch (error) {
    console.error(error);
    // Call next with the error to pass it to the error handling middleware
    next(new Error("Something went wrong!"));
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error handling middleware:", err);
  res.status(500).json({ status: 500, message: "Internal Server Error" });
});

// api to login user
app.post("/api/jobs", isAuthenticated, async (req, res, next) => {
  const {
    companyName,
    position,
    monthlySalary,
    jobType,
    internshipDuration,
    workingMode,
    jobDescription,
    aboutCompany,
    skills,
    noOfEmployees,
    logo,
    location,
  } = req.body;
  try {
    if (
      !companyName ||
      !position ||
      !monthlySalary ||
      !jobType ||
      !workingMode ||
      !jobDescription ||
      !aboutCompany ||
      !noOfEmployees ||
      !skills ||
      (workingMode == "office" && !location) ||
      (jobType == "internship" && !internshipDuration)
    ) {
      const err = new Error("All required fileds are not provided!");
      err.status = 403;
      next(err);
    }

    await Job.create({
      companyName,
      position,
      monthlySalary: +monthlySalary,
      jobType,
      internshipDuration,
      workingMode,
      jobDescription,
      aboutCompany,
      skills: skills.split(",").map((s) => s.trim()),
      noOfEmployees,
      logo,
      location,
      createdOn: new Date(),
    });

    return res.json({ status: 201, message: "Job added successfully" });
  } catch {
    const err = new Error("Error creating new job");
    err.status = 500;
    next(err);
  }
});


// api to get all jobs or with filter
// Route to get jobs with optional filtering based on skills
app.get("/api/jobs", async (req, res, next) => {
  try {
    // Extract the 'filterBySkills' parameter from the query string
    const { filterBySkills } = req.query;
    // Declare a variable to store the retrieved jobs
    let jobs;
    // Use the Job model to find jobs in the database
    jobs = await Job.find(
      // If 'filterBySkills' is provided, filter jobs based on skills
      filterBySkills
        ? { skills: { $in: filterBySkills.map((s) => s.trim()) } }
        // If no filter is provided, retrieve all jobs
        : {},
      // Specify the fields to be included in the result
      {
        position: 1,
        noOfEmployees: 1,
        monthlySalary: 1,
        location: 1,  // Corrected typo 'locatio' to 'location'
        jobType: 1,
        workingMode: 1,
        logo: 1,
        skills: 1,
        _id: 1,
      }
    );

    // Send the retrieved jobs as a JSON response
    res.json(jobs);
  } catch (error) {
    // If an error occurs, handle it by passing it to the error handling middleware
    const err = new Error("Error fetching jobs");
    err.status = 500;
    next(err);
  }
});

// api to get detailed description of a job
app.get("/api/jobs/:id", async (req, res, next) => {
  try {
    const jobID = req.params;
    const job = await Job.findById(jobID.id);
    res.json(job);
  } catch {
    const err = new Error("Error Fetching the job");
    err.status = 500;
    next(err);
  }
});



// api to edit a job post
app.put("/api/jobs/:id", isAuthenticated, async (req, res, next) => {
  const { id } = req.params;
  const {
    companyName,
    position,
    monthlySalary,
    jobType,
    internshipDuration,
    workingMode,
    jobDescription,
    aboutCompany,
    skills,
    noOfEmployees,
    logo,
    location,
  } = req.body;
  try {
    if (
      !companyName ||
      !position ||
      !monthlySalary ||
      !jobType ||
      !workingMode ||
      !jobDescription ||
      !aboutCompany ||
      !noOfEmployees ||
      !skills ||
      (workingMode == "office" && !location) ||
      (jobType == "internship" && !internshipDuration)
    ) {
      const err = new Error("All required fileds are not provided!");
      err.status = 403;
      next(err);
    }

    await Job.findByIdAndUpdate(id, {
      companyName,
      position,
      monthlySalary: +monthlySalary,
      jobType,
      internshipDuration,
      workingMode,
      jobDescription,
      aboutCompany,
      skills: skills.split(",").map((s) => s.trim()),
      noOfEmployees,
      logo,
      location,
    });

    return res.json({ status: 200, message: "Job updated successfully" });
  } catch {
    const err = new Error("Error updating the job");
    err.status = 500;
    next(err);
  }
});



// Database connection
connectToDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
