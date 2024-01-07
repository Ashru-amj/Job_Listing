import React from "react";
import styles from "./Job.module.css";
import Header from "../common/header/Header";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import config from "../../config";
import calenderIcon from "./images/calenderIcon.svg";
import moneyIcon from "./images/moneyIcon.svg";
import loadingGif from "./../common/loading.svg";

export default function Job() {
  const { id } = useParams();
  const [job, setJob] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("data"));
    if (localData) {
      axios
        .get(config.REACT_APP_BASE_URL + "/authenticate", {
          headers: {
            token: localData.jwtToken,
          },
        })
        .then((res) => {
          if (res.data.status == 202) {
            setIsLoggedIn(true);
            setUserData(localData);
          }
        });
    }
  }, []);

  useEffect(() => {
    axios
      .get(config.REACT_APP_BASE_URL + "/api/jobs/" + id)
      .then((res) => {
        setJob(res.data);
        console.log(res.data);
      })
      .catch(() => {
        console.log("Something went wrong fetching job data");
      });
  }, []);

  return (
    <div className={styles.main}>
      <Header isLoggedIn={isLoggedIn} userData={userData} />
      <div className={styles.middleContainer}>
        <div className={styles.headingBlock}>
          {job.position} {job.workingMode} job/internship at {job.companyName}{" "}
        </div>
      </div>
      {job.length !== 0 ? (
        <div className={styles.jobDescriptionWrapper}>
          <div className="postedOnWrapper">
            {Math.floor(
              (new Date() - new Date(job.createdOn)) / (1000 * 60 * 60 * 24 * 7)
            )}
            w ago . {job.jobType}
          </div>
          <div className={styles.positionHeadingWrapper}>
            <div className={styles.postionHeadingInnerWrapper}>
              <h1 className={styles.positionHeading}>{job.position}</h1>
              <div className={styles.jobLocation}>{job.location} | India</div>
            </div>
            <div className={styles.buttonWrapper}>
              <button onClick={() => navigate(-1)} className={styles.backButton}>Back</button>
              {isLoggedIn && (
                <button onClick={() => {navigate(`/addjob?id=${job._id}`)}} className={styles.editButton}>Edit Job</button>
                )}
            </div>
          </div>
          <div className={styles.jobAttributesWrapper}>
            <div className={styles.jobAttributeWrapper}>
              <div className={styles.attributeHeading}>
                <img
                  alt="stipend icon"
                  src={moneyIcon}
                  className={styles.attributeIcon}
                />
                Stipend
              </div>
              <div className={styles.stipend}>Rs {job.monthlySalary}/month</div>
            </div>
            { job.internshipDuration &&
              <div className={styles.jobAttributeWrapper}>
                <div className={styles.attributeHeading}>
                  <img
                    alt="duration icon"
                    src={calenderIcon}
                    className={styles.attributeIcon}
                    />
                  Duration
                </div>
                <div className={styles.internshipDuration}> {job.internshipDuration}</div>
              </div>
            }
          </div>

          <div className={styles.descriptionHeading}>About Company</div>
          <div className={styles.descriptionParagraph}>{job.aboutCompany}</div>

          <div className={styles.descriptionHeading}>
            About the job/internship
          </div>
          <div className={styles.descriptionParagraph}>
            {job.jobDescription}
          </div>

          <div className={styles.descriptionHeading}>Skill(s) required</div>
          <div className={styles.skillsBlock}>
            {job.skills &&
              job.skills.map((skill) => (
                <span key={skill} className={styles.skill}>
                  {skill}
                </span>
              ))}
          </div>
        </div>
      ) : (
        <img
          style={{ width: "200px", marginTop: "100px" }}
          src={loadingGif}
          alt="Loading Animation!!"
        />
      )}
    </div>
  );
}
