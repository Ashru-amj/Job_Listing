import React from "react";
import styles from "./JobCard.module.css";
import { useNavigate } from "react-router-dom";
import logot from "../jobCard/download.jpeg"
import peopleIcon from "./images/people.svg";
import flagIcon from "./images/flag.svg";
import rupeeIcon from "./images/rupee.svg";

export default function JobCard(props) {
  const navigate = useNavigate();

  return (
    <div className={styles.jobsCard}>
      <div className={styles.jobCardLeftWrapper}>
        <div className={styles.companyLogoWrapper}>
        {props.job && props.job.logo && (
            <img
              className={styles.companyLogo}
              // src={props.job.logo}
              src={logot}
              alt="company logo"
            />
          )}
          
        </div>
        <div className={styles.jobDetailsWrapper}>
          <p className={styles.jobPosition}>{props.job.position}</p>
          <div className={styles.locationSalaryWrapper}>
            {props.job.noOfEmployees && (
              <span className={styles.detailWithIcon}>
                <img src={peopleIcon} alt="people icon" />
                <span className={styles.jobDetailText}>
                  {props.job.noOfEmployees}
                </span>
              </span>
            )}
            {props.job.monthlySalary && (
              <span className={styles.detailWithIcon}>
                <img src={rupeeIcon} alt="rupee icon" />
                <span className={styles.jobDetailText}>
                  {props.job.monthlySalary}
                </span>
              </span>
            )}
            {props.job.location && (
              <span className={styles.detailWithIcon}>
                <img src={flagIcon} style={{ width: "35%" }} alt="flag icon" />
                <span className={styles.jobDetailText}>
                  {props.job.location}
                </span>
              </span>
            )}
          </div>
          <div className={styles.locatioModeWrapper}>
            <span className={styles.textDetail}>{props.job.workingMode}</span>
            <span className={styles.textDetail}>{props.job.jobType}</span>
          </div>
        </div>
      </div>

      <div className={styles.jobCardRightWrapper}>
        <div className={styles.skillsWrapper}>
          {props.job.skills.map((skill) => (
            <span key={skill} className={styles.skillBlock}>
              {skill}
            </span>
          ))}
        </div>
        <div className={styles.editDetailsButtons}>
          {props.isLoggedIn && (
            <button
              onClick={() => navigate(`/addjob?id=${props.job._id}`)}
              className={styles.editJobBtn}
            >
              Edit job
            </button>
          )}
          <button
            onClick={() => navigate(`/job/${props.job._id}`)}
            className={styles.viewDetailBtn}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
  