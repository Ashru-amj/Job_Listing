import React from "react";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import userImg from "./user-image.png";

export default function Header(props) {
  const navigate = useNavigate();

  return (
    <div className={styles.headerBlock}>
      <h2>Jobfinder</h2>
      <div className={styles.navItemsWrapper}>
        {!props.isLoggedIn ? (
          <>
            <button
              onClick={() => {
                navigate("/login");
              }}
              className={styles.loginButton}
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/register");
              }}
              className={styles.registerButton}
            >
              Register
            </button>
          </>
        ) : (
          <>
            <span
              className={styles.logoutButton}
              onClick={() => {
                localStorage.removeItem("data");
                navigate(0);
              }}
            >
              Logout
            </span>
            <span className={styles.userName}>Hello {props.userData.name}</span>
            <img className={styles.userImage} src={userImg} alt="use icon" />
          </>
        )}
      </div>
    </div>
  );
}
