import React from "react";
import styles from "./SearchSection.module.css";

import { useNavigate } from "react-router-dom";

function Skill(props) {
  return (
    <div className={styles.skillBlock}>
      <span className={styles.skillName}>{props.currentSkill}</span>
      <span
        onClick={() => {
          props.skills.splice(props.skills.indexOf(props.currentSkill), 1);
          props.setSkills([...props.skills]);
        }}
        className={styles.closeButton}
      >
        X
      </span>
    </div>
  );
}

export default function SearchSection(props) {
  const navigate = useNavigate();
  return (
    <>
      <div className={styles.searchSection}>
        <div className={styles.searchBoxWrapper}>
          <input
            onChange={(e) => {
              props.setSearchBy(e.currentTarget.value);
            }}
            className={styles.searchInput}
            type="text"
            placeholder="Type any job title"
          ></input>
        </div>

        <div className={styles.skillsSelectorWrapper}>
          <div
            className={styles.skillsSelectorInnterWrapper}
            style={props.isLoggedIn ? { width: "80%" } : { width: "100%" }}
          >
            <div className={styles.skillsLeftWrapper}>
              <div className={styles.skillsSelector}>
                <select
                  className={styles.selectSkills}
                  name="skills"
                  disabled={!props.allSkills.length}
                  onChange={(item) => {
                    if (
                      !props.skills.includes(item.currentTarget.value) &&
                      item.currentTarget.value !== ""
                    ) {
                      props.setSkills([
                        ...props.skills,
                        item.currentTarget.value,
                      ]);
                    }
                  }}
                >
                  <option value="">Skills</option>
                  {props.allSkills.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.skillsList}>
                {props.skills.map((item) => (
                  <Skill
                    skills={props.skills}
                    key={item}
                    currentSkill={item}
                    setSkills={props.setSkills}
                  />
                ))}
              </div>
            </div>

            {props.skills.length > 0 && (
              <span
                className={styles.clearSkills}
                style={
                  props.isLoggedIn
                    ? { width: "90%", justifySelf: "flex-end!important" }
                    : {}
                }
              >
                <span onClick={() => props.setSkills([])}>Clear</span>
              </span>
            )}
          </div>

          {props.isLoggedIn && (
            <div className={styles.addJobBtnWrapper}>
              <button
                onClick={() => navigate("/addjob")}
                className={styles.addJobButton}
              >
                +Add Job
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
