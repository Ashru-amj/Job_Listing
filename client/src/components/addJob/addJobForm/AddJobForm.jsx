import React from "react";
import styles from "./AddJobForm.module.css";
import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AddJobForm(props) {
  const [showInternshipDuration, setShowInternshipDuration] = useState(false);
  const [editingJob, setEditingJob] = useState();
  const companyNameRef = useRef();
  const logoRef = useRef();
  const positionRef = useRef();
  const salaryRef = useRef();
  const jobTypeRef = useRef();
  const remoteRef = useRef();
  const noOfEmployeeRef = useRef();
  const locationRef = useRef();
  const descriptionRef = useRef();
  const aboutCompanyRef = useRef();
  const skillsRef = useRef();
  const internshipDurationRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParameters = new URLSearchParams(window.location.search);
    const editingJobId = queryParameters.get("id");
    if (editingJobId) {
      axios
        .get(process.env.REACT_APP_BASE_URL + "/api/jobs/" + editingJobId)
        .then((res) => {
          setEditingJob(res.data);
          jobTypeRef.current.value = res.data.jobType;
          remoteRef.current.value = res.data.workingMode;
          noOfEmployeeRef.current.value = res.data.noOfEmployees;
        })
        .catch(() => {
          console.log("Something went wrong fetching job data");
        });
    }
  }, []);

  const addOrEditJob = (e) => {
    e.preventDefault();
    const userData = JSON.parse(localStorage.getItem("data"));
    if (userData) {
      if (!editingJob) {
        axios
          .post(
            process.env.REACT_APP_BASE_URL + "/api/jobs/",
            {
              companyName: companyNameRef.current.value,
              position: positionRef.current.value,
              monthlySalary: salaryRef.current.value,
              jobType: jobTypeRef.current.value,
              internshipDuration: internshipDurationRef.current
                ? internshipDurationRef.current.value
                : "",
              workingMode: remoteRef.current.value,
              jobDescription: descriptionRef.current.value,
              aboutCompany: aboutCompanyRef.current.value,
              skills: skillsRef.current.value,
              noOfEmployees: noOfEmployeeRef.current.value,
              logo: logoRef.current.value,
              location: locationRef.current.value,
            },
            {
              headers: {
                token: userData.jwtToken,
              },
            }
          )
          .then((res) => {
            switch (res.data.status) {
              case 201:
                toast.success("Job Added Successfully");
                break;
              case 401:
                toast.warning("Please login first!");
                break;
              case 403:
                toast.warning("Error! Complete data not provided");
                break;
              default:
                toast.error("Something went wrong!");
            }
            navigate("/");
          })
          .catch((res) => toast.error("Something went wrong!"));
      } else {
        axios
          .put(
            process.env.REACT_APP_BASE_URL + "/api/jobs/" + editingJob._id,
            {
              companyName: companyNameRef.current.value,
              position: positionRef.current.value,
              monthlySalary: salaryRef.current.value,
              jobType: jobTypeRef.current.value,
              internshipDuration: internshipDurationRef.current
                ? internshipDurationRef.current.value
                : "",
              workingMode: remoteRef.current.value,
              jobDescription: descriptionRef.current.value,
              aboutCompany: aboutCompanyRef.current.value,
              skills: skillsRef.current.value,
              noOfEmployees: noOfEmployeeRef.current.value,
              logo: logoRef.current.value,
              location: locationRef.current.value,
            },
            {
              headers: {
                token: userData.jwtToken,
              },
            }
          )
          .then((res) => {
            switch (res.data.status) {
              case 200:
                toast.success("Job Updated Successfully");
                break;
              case 401:
                toast.warning("Please login first!");
                break;
              case 403:
                toast.warning("Error! Complete data not provided");
                break;
              default:
                toast.error("Something went wrong!");
            }
            navigate("/");
            console.log(res);
          })
          .catch((err) => toast.error("Something went wrong!"));
      }
    }
  };
  return (
    <div className={styles.addJobFormWrapper}>
      <h1 className={styles.jobHeading}>Add job description</h1>
      <form className={styles.addJobForm} onSubmit={(e) => addOrEditJob(e)}>
        <div className={styles.addJobFormRow}>
          <label htmlFor="companyName" className={styles.inputLabel}>
            Company Name
          </label>
          <input
            defaultValue={editingJob ? editingJob.companyName : ""}
            ref={companyNameRef}
            className={styles.addJobFormInput}
            id="companyName"
            type="text"
            placeholder="Enter your company name here"
            required
          />
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="logoURL" className={styles.inputLabel}>
            Add logo URL
          </label>
          <input
            defaultValue={editingJob ? editingJob.logo : ""}
            ref={logoRef}
            className={styles.addJobFormInput}
            id="logoURL"
            type="url"
            placeholder="Enter the link"
            required
          />
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="jobPosition" className={styles.inputLabel}>
            Job Position
          </label>
          <input
            defaultValue={editingJob ? editingJob.position : ""}
            ref={positionRef}
            className={styles.addJobFormInput}
            id="jobPosition"
            type="text"
            placeholder="Enter Job Position"
            required
          />
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="monthlySalary" className={styles.inputLabel}>
            Monthly Salary
          </label>
          <input
            defaultValue={editingJob ? editingJob.monthlySalary : ""}
            ref={salaryRef}
            className={styles.addJobFormInput}
            id="monthlySalary"
            type="number"
            placeholder="Enter amount in rupees"
            required
          />
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="jobType" className={styles.inputLabel}>
            Job Type
          </label>
          <select
            ref={jobTypeRef}
            required
            id="jobType"
            className={styles.inputSelect}
            onChange={(e) => {
              e.currentTarget.value === "Internship"
                ? setShowInternshipDuration(true)
                : setShowInternshipDuration(false);
            }}
          >
            <option value="">Select</option>
            <option value="Internship">Internship</option>
            <option value="Fulltime">Fulltime</option>
          </select>
        </div>
        {showInternshipDuration && (
          <div className={styles.addJobFormRow}>
            <label htmlFor="internshipDuration" className={styles.inputLabel}>
              Internship Duration
            </label>
            <input
              defaultValue={editingJob ? editingJob.internshipDuration : ""}
              ref={internshipDurationRef}
              className={styles.addJobFormInput}
              id="internshipDuration"
              type="text"
              placeholder="Enter internship duration"
              required
            />
          </div>
        )}
        <div className={styles.addJobFormRow}>
          <label htmlFor="remoteOffice" className={styles.inputLabel}>
            Remote/Office
          </label>
          <select
            ref={remoteRef}
            required
            id="remoteOffice"
            className={styles.inputSelect}
          >
            <option value="">Select</option>
            <option value="Remote">Remote</option>
            <option value="Office">Office</option>
          </select>
        </div>

        <div className={styles.addJobFormRow}>
          <label htmlFor="noOfEmployees" className={styles.inputLabel}>
            Number of Employees
          </label>
          <select
            ref={noOfEmployeeRef}
            required
            id="noOfEmployees"
            className={styles.inputSelect}
          >
            <option value="">Select</option>
            <option value="1-10">1-10</option>
            <option value="11-20">11-20</option>
            <option value="20-50">20-50</option>
            <option value="50+">50+</option>
          </select>
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="location" className={styles.inputLabel}>
            Location
          </label>
          <input
            defaultValue={editingJob ? editingJob.location : ""}
            ref={locationRef}
            className={styles.addJobFormInput}
            id="location"
            type="text"
            placeholder="Enter Location"
          />
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="JobDescription" className={styles.inputLabel}>
            Job Description
          </label>
          <textarea
            defaultValue={editingJob ? editingJob.jobDescription : ""}
            ref={descriptionRef}
            className={styles.addJobFormInput}
            id="JobDescription"
            type="text"
            placeholder="Type the job description"
            required
          />
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="aboutCompany" className={styles.inputLabel}>
            About Company
          </label>
          <textarea
            defaultValue={editingJob ? editingJob.aboutCompany : ""}
            ref={aboutCompanyRef}
            className={styles.addJobFormInput}
            id="aboutCompany"
            type="text"
            placeholder="Type about your company"
            required
          />
        </div>
        <div className={styles.addJobFormRow}>
          <label htmlFor="skills" className={styles.inputLabel}>
            Skills Required
          </label>
          <input
            defaultValue={editingJob ? editingJob.skills : ""}
            ref={skillsRef}
            className={styles.addJobFormInput}
            id="skills"
            type="text"
            placeholder="Enter the must have skills (seperated by comma)"
            required
          />
        </div>
        <div className={styles.buttonsRow}>
          <button
            onClick={() => {
              toast.warning("Job Add/Edit Canceled.");
              navigate("/");
            }}
            className={styles.cancelButton}
            type="reset"
          >
            Cancel
          </button>
          <button className={styles.submitButton} type="submit">
            + Add Job
          </button>
        </div>
      </form>
    </div>
  );
}
